import './Game.css'

import { useContext, useRef, useState, useEffect, useCallback } from 'react'

import { onValue, ref, child, set } from 'firebase/database'
import { database, getLobbyRef, getGameObject } from 'firebaseConfig'

import { PlayerIDContextGameScreen, FinalGameDataContextGame, LobbyContextApp, stoneColours } from 'gameContexts'
import { randFromArray } from 'util'
import { assetCards, AbilityEvent, getValidInSector } from 'AssetInfo'
import useWaitableState from 'hooks/useWaitableState'
import CardSelector from 'Screens/GameScreen/Game/CardSelector'

const dataListener = (finalGameData, path, action) => {
    return onValue(child(finalGameData.current.lobbyRef, path), (snapshot) => {
        if (!snapshot.exists()) return
        let val = snapshot.val()
        action(val)
    })
}

const Game = () => {
    const playerID = useContext(PlayerIDContextGameScreen)
    const [lobby] = useContext(LobbyContextApp)
    const [isMyTurn, setIsMyTurn] = useState(false)
    // Steps/phases of a player's turn. Used by subcomponents to know
    // when and how to act differently
    const [, setStep] = useState(0)
    // For activating and using the CardSelector component. When `null`,
    // CardSelector disappears. Otherwise, CardSelector appears and is
    // passed `cardSelectorArgs` as the `args` prop. To see available
    // arguments, refer to `CardSelector.js`
    const [cardSelectorArgs, setCardSelectorArgs] = useState(null)
    // Is used for context FinalGameDataContextGame
    const finalGameData = useRef(null)

    /* Is updated by listeners, and are used by both steps AND subcomponents */
    const [, setPlayerSector, playerSectorVal, playerSectorWait] = useWaitableState(0)
    const [, setInfinityStones, infinityStonesVal, ] = useWaitableState(null)
    const [, setThanos, thanosVal, ] = useWaitableState(1)
    const [, setSector1, , ] = useWaitableState(null)
    const [, setSector2, , ] = useWaitableState(null)
    const [, setSector3, , ] = useWaitableState(null)

    const rollStoneDie = useCallback(async (game={table: {infinityStones: {}}}) => {
        let stone = randFromArray(stoneColours)
        let stoneAchieved = false
        // If rolled infinity stone has already been achieved
        if (infinityStonesVal.current[stone] >= 5) {
            stoneAchieved = true
            console.log('Activate infinity stone effect for the round')
        }
        game.table.infinityStones[stone] = infinityStonesVal.current[stone] + 1
        await set(child(finalGameData.current.lobbyRef, `table/infinityStones/${stone}`),
            infinityStonesVal.current[stone] + 1
        )

        return [stone, stoneAchieved]
    }, [infinityStonesVal])

    // Called to activate and use the `CardSelector` component as a makeshift function
    // that returns a list of selected cards through resolving a promise
    const activateCardSelector = useCallback(async (args) => {
        const promise = new Promise((resolve) => args.returner = resolve)
        setCardSelectorArgs(args)
        const selection = await promise
        setCardSelectorArgs(null)
        return selection
    }, [])

    // On component mount, initialize the finalGameData object and listeners
    useEffect(() => {
        /* Initialize finalGameData. Update src/gameContext.js accordingly*/
        let finalGameDataObject = {
            lobbyID: lobby,
            lobbyRef: ref(database, getLobbyRef(lobby)),
            playerID: playerID
        }

        getGameObject(lobby).then((game) => {
            if (!game) return
            finalGameDataObject.roles = {
                1: game.players[1].role,
                2: game.players[2].role,
                3: game.players[3].role,
                4: game.players[4].role
            }
        })

        finalGameData.current = finalGameDataObject
        /* End of Initialize finalGameData */

        /* Attach listeners to RTDB */
        let unsubscribers = [
            dataListener(finalGameData, 'currentPlayer', (val) => {
                if (val === playerID) setIsMyTurn(true)
                else setIsMyTurn(false)
            }),
            dataListener(finalGameData, 'table/playerSector', (val) => {
                setPlayerSector(val)
            }),
            dataListener(finalGameData, 'table/infinityStones', (val) => {
                setInfinityStones(val)
            }),
            dataListener(finalGameData, 'table/thanos', (val) => {
                setThanos(val)
            }),
            dataListener(finalGameData, 'table/sectors/1', (val) => {
                setSector1(val)
            }),
            dataListener(finalGameData, 'table/sectors/2', (val) => {
                setSector2(val)
            }),
            dataListener(finalGameData, 'table/sectors/3', (val) => {
                setSector3(val)
            })
        ]

        // On component unmount, unsubscribe every listener
        return () => {for (let u of unsubscribers) u()}
    }, [lobby, playerID, setPlayerSector, setInfinityStones, setThanos, setSector1, setSector2, setSector3])

    // On isMyTurn changes to true, proceed with the current player's turn.
    // Dependency array contains many other values, all of which are stable.
    useEffect(() => { async function anon() {
        if (isMyTurn) {
            let game = await getGameObject(finalGameData.current.lobbyID)
            
            // Used to hold all possible arguments that card activations may need
            const args = {
                sector: 1, // sector of the card being activated. Must be set properly each time
                lobbyID: finalGameData.current.lobbyID,
                lobbyRef: finalGameData.current.lobbyRef,
                rollStoneDie: rollStoneDie,
                activateCardSelector: activateCardSelector,
            }

            /*for (let c of getValidInSector(game, AbilityEvent.VILLAIN, args)) {
                await assetCards[c].activate(game, args)
            }*/

            console.log(await activateCardSelector({
                game: game, sectors: [1,2,3], villains: true, heroes: true, maxSelect: 4
            }))

            // Just to ignore all actual steps while testing card abilities in isolation
            return

            /* Step 1 */
            setStep(1)
            await playerSectorWait()
            console.log('Received the new player sector value')

            /* Step 2 */
            setStep(2)
            const [step2_stone, step2_stoneAchieved] = await rollStoneDie()
            console.log(`Increased counter for ${step2_stone} stone. Was ${step2_stoneAchieved ? '' : 'not'} activated`)

            /* Step 3 */
            setStep(3)
            // Start of rolling Thanos die
            const step3_action = Math.floor(Math.random()*6)
            let step3_thanos = thanosVal.current
            let step3_stone, step3_stoneAchieved
            if (step3_action <= 1) {
                // Turn Thanos CCW
                if (--step3_thanos === 0) step3_thanos = 3
                await set(child(finalGameData.current.lobbyRef, 'table/thanos'), step3_thanos)
                console.log('Turned Thanos CCW')
            } else if (step3_action <= 3) {
                // Turn Thanos CW
                if (++step3_thanos === 4) step3_thanos = 1
                await set(child(finalGameData.current.lobbyRef, 'table/thanos'), step3_thanos)
                console.log('Turned Thanos CW')
            } else if (step3_action === 5) {
                [step3_stone, step3_stoneAchieved] = await rollStoneDie()
                console.log(`Increased counter for ${step3_stone} stone. Was ${step3_stoneAchieved ? '' : 'not'} activated`)
            }
            // End of rolling Thanos die
            // Start of activating villain abilities
            game = await getGameObject(finalGameData.current.lobbyID)
            if (step3_action === 4) {
                // Activate villain abilities of every sector
                for (let s = 1; s <= 3; s++) {
                    const args = {
                        sector: s,
                        lobbyRef: finalGameData.current.lobbyRef
                    }
                    let validAbilities = getValidInSector(game, AbilityEvent.VILLAIN, args)
                    for (let c of validAbilities) {
                        await assetCards[c].activate(game, args)
                    }
                }
                console.log('Activated villain abilities in every sector')
            } else {
                // Activate villain abilities only in Thanos's sector
                let validAbilities = getValidInSector(game, AbilityEvent.VILLAIN, args)
                for (let c of validAbilities) {
                    await assetCards[c].activate(game, args)
                }
                console.log('Activated villain abilities in current sector')
            }
            // End of activating villain abilities
            // Start of damaging heroes in current sector
            for (let c of [...game.table.sectors[step3_thanos],
                ...(playerSectorVal === step3_thanos ? game.players[playerID].cards : [])]) {
                    if (assetCards[c].type !== 'villain' && game.cards[c].health > 0) {
                        await set(child(finalGameData.current.lobbyRef, `cards/${c}/health`), --game.cards[c].health)
                    }
            }
            console.log('Thanos attacked all heroes in his sector')
            // End of damaging heroes in current sector

            /* End of turn cleanup */
            if (step2_stoneAchieved) {
                set(child(finalGameData.current.lobbyRef, `table/infinityStones/${step2_stone}`), 5)
            }
            if (step3_stoneAchieved && step3_stone !== step2_stone) {
                set(child(finalGameData.current.lobbyRef, `table/infinityStones/${step3_stone}`), 5)
            }
        }
    }; anon()}, [isMyTurn, playerID, playerSectorWait, rollStoneDie, thanosVal, playerSectorVal, activateCardSelector])

    return (
        <FinalGameDataContextGame.Provider value={finalGameData.current}>
           <div id='game'>
                <p>
                    This is the game!
                </p>
                {cardSelectorArgs && 
                    <CardSelector args={cardSelectorArgs}></CardSelector>
                }
            </div>
        </FinalGameDataContextGame.Provider>
    )
}

export default Game
