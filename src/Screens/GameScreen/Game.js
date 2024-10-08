import './Game.css'

import { useContext, useRef, useState, useEffect, useCallback } from 'react'

import { onValue, ref, child } from 'firebase/database'
import { database, getLobbyRef, getGameObject, syncSetGameObject } from 'firebaseConfig'

import { PlayerIDContextGameScreen, FinalGameDataContextGame, LobbyContextApp, stoneColours, bonusTokens } from 'gameContexts'
import { randFromArray } from 'util'
// REMOVE AFTER TESTING
// eslint-disable-next-line no-unused-vars
import { assetCards, AbilityEvent, getValidInSector, checkValid, activate, changeCardHealth } from 'AssetInfo'
import useWaitableState from 'hooks/useWaitableState'

import useCallableComponentActivator from 'hooks/useCallableComponentActivator'
import SectorSelector from './Game/SectorSelector'
import CardSelector from 'Screens/GameScreen/Game/CardSelector'
import DiceSelector from 'Screens/GameScreen/Game/DiceSelector'
import FaceChanger from 'Screens/GameScreen/Game/FaceChanger'
import FaceSelector from 'Screens/GameScreen/Game/FaceSelector'
import StoneViewer from 'Screens/GameScreen/Game/StoneViewer'
import TokenSelector from 'Screens/GameScreen/Game/TokenSelector'

const dataListener = (finalGameData, path, action) => {
    return onValue(child(finalGameData.current.lobbyRef, path), (snapshot) => {
        if (!snapshot.exists()) return
        let val = snapshot.val()
        action(val)
    })
}

const drawToken = async (lobbyID, game) => {
    await syncSetGameObject(lobbyID, game, 'tokens', [...game.tokens, randFromArray(bonusTokens)])
}

const Game = () => {
    const playerID = useContext(PlayerIDContextGameScreen)
    const [lobby] = useContext(LobbyContextApp)
    const [isMyTurn, setIsMyTurn] = useState(false)
    // Steps/phases of a player's turn. Used by subcomponents to know
    // when and how to act differently
    const [, setStep] = useState(0)
    // For activating and using the SectorSelector component
    const [sectorSelectorArgs, activateSectorSelector] = useCallableComponentActivator()
    // For activating and using the CardSelector component
    const [cardSelectorArgs, activateCardSelector] = useCallableComponentActivator()
    // For activating and using the DiceSelector component
    const [diceSelectorArgs, activateDiceSelector] = useCallableComponentActivator()
    // For activating and using the FaceChanger component
    const [faceChangerArgs, activateFaceChanger] = useCallableComponentActivator()
    // For activating and using the FaceSelector component
    const [faceSelectorArgs, activateFaceSelector] = useCallableComponentActivator()
    // For activating and using the StoneViewer component
    const [stoneViewerArgs, activateStoneViewer] = useCallableComponentActivator()
    // For activating and using the TokenSelector component
    const [tokenSelectorArgs, activateTokenSelector] = useCallableComponentActivator()

    // Is used for context FinalGameDataContextGame
    const finalGameData = useRef(null)

    /* Is updated by listeners, and are used by both steps AND subcomponents */
    // REMOVE AFTER TESTING
    // eslint-disable-next-line no-unused-vars
    const [, setPlayerSector, playerSectorVal, playerSectorWait] = useWaitableState(0)
    const [, setInfinityStones, infinityStonesVal, ] = useWaitableState(null)
    const [, setThanos, thanosVal, ] = useWaitableState(1)
    const [, setSector1, , ] = useWaitableState(null)
    const [, setSector2, , ] = useWaitableState(null)
    const [, setSector3, , ] = useWaitableState(null)

    const rollStoneDie = useCallback(async (game) => {
        let stone = randFromArray(stoneColours)
        let stoneAchieved = false
        // If rolled infinity stone has already been achieved
        if (infinityStonesVal.current[stone] >= 5) {
            stoneAchieved = true
            console.log('Activate infinity stone effect for the round')
        }
        await syncSetGameObject(lobby, game, `table/infinityStones/${stone}`, infinityStonesVal.current[stone] + 1)

        return [stone, stoneAchieved]
    }, [infinityStonesVal, lobby])

    // `diceToRoll` is an array of which dice in `game.turn.face` to roll/reroll.
    // Do not be deceived and use `game.turn.dice`.
    const rollPowerDice = useCallback(async (game, diceToRoll) => {
        const faces = game.turn.faces

        for (let die of diceToRoll) {
            const possibleFaces = ['combat', 'tech', 'mystic', 'cosmic']
            switch (faces[die].colour) {
                case 'red':
                    possibleFaces.push('combat', 'combat2')
                    break;
                case 'blue':
                    possibleFaces.push('tech', 'tech2')
                    break;
                case 'green':
                    possibleFaces.push('mystic', 'mystic2')
                    break;
                case 'purple':
                    possibleFaces.push('cosmic', 'cosmic2')
                    break;
                default:
                    break;
            }
            // To not roll the same face
            const currFacePos = possibleFaces.indexOf(faces[die].face)
            if (currFacePos !== -1) possibleFaces.splice(currFacePos, 1)
            faces[die].face = randFromArray(possibleFaces)
        }
        
        await syncSetGameObject(lobby, game, 'turn/faces', faces)
    }, [lobby])

    // On component mount, initialize the finalGameData object and listeners
    useEffect(() => {
        /* Initialize finalGameData. Update src/gameContext.js accordingly */
        let finalGameDataObject = {
            lobbyID: lobby,
            lobbyRef: ref(database, getLobbyRef(lobby)),
            playerID: playerID
        }

        getGameObject(lobby).then((game) => {
            if (!game) return

            finalGameDataObject.roles = {}
            for (let p = 1; p <= game.players.playerNum; p++) {
                finalGameDataObject.roles[p] = game.players[p].role
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

            // Used to hold all possible arguments that card activations may need.
            // Also includes the `id` of the card being called, but is set by
            // `activate` and `checkValid` automatically. Also must include `sector`
            // if applicable, which is the sector in which the card being activated
            // is currently in
            const args = {
                lobbyID: finalGameData.current.lobbyID,
                rollStoneDie: rollStoneDie,
                rollPowerDice: rollPowerDice,
                activateCardSelector: activateCardSelector,
                activateDiceSelector: activateDiceSelector,
                activateFaceChanger: activateFaceChanger,
                activateFaceSelector: activateFaceSelector,
                activateStoneViewer: activateStoneViewer,
                activateTokenSelector: activateTokenSelector,
                drawToken: drawToken,
            }

            // Set/reset game.turn object, which holds turn specific info
            syncSetGameObject(lobby, game, 'turn', {
                dice: {
                    red: 0, blue: 0, green: 0, purple: 0
                },
                faces: [],
                values: {
                    red: 0, blue: 0, green: 0, purple: 0
                },
                damageDealt: 0
            })

            /* Step 1 */
            setStep(1)
            let step1_sector = await activateSectorSelector()
            await syncSetGameObject(lobby, game, 'table/playerSector', step1_sector)
            console.log('Received the new player sector value')

            /* Step 2 */
            setStep(2)
            const [step2_stone, step2_stoneAchieved] = await rollStoneDie(game)
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
                await syncSetGameObject(lobby, game, 'table/thanos', step3_thanos)
                console.log('Turned Thanos CCW')
            } else if (step3_action <= 3) {
                // Turn Thanos CW
                if (++step3_thanos === 4) step3_thanos = 1
                await syncSetGameObject(lobby, game, 'table/thanos', step3_thanos)
                console.log('Turned Thanos CW')
            } else if (step3_action === 5) {
                [step3_stone, step3_stoneAchieved] = await rollStoneDie(game)
                console.log(`Increased counter for ${step3_stone} stone. Was ${step3_stoneAchieved ? '' : 'not'} activated`)
            }
            // End of rolling Thanos die
            // Start of activating villain abilities
            if (step3_action === 4) {
                // Activate villain abilities of every sector
                for (let s = 1; s <= 3; s++) {
                    args.sector = s
                    let validVillains = getValidInSector(game, AbilityEvent.VILLAIN, args)
                    for (let v of validVillains) {
                        await activate(v, game, args)
                    }
                }
                console.log('Activated villain abilities in every sector')
            } else {
                // Activate villain abilities only in Thanos's sector
                args.sector = game.table.thanos
                let validVillains = getValidInSector(game, AbilityEvent.VILLAIN, args)
                for (let v of validVillains) {
                    await activate(v, game, args)
                }
                console.log('Activated villain abilities in current sector')
            }
            // End of activating villain abilities
            // Start of damaging heroes in current sector
            let step3_attackedCards = [...game.table.sectors[game.table.thanos]]
            if (game.table.playerSector === game.table.thanos) {
                step3_attackedCards.push(game.players[game.currentPlayer].cards)
            }
            for (let c of step3_attackedCards) {
                    if (assetCards[c].type !== 'villain') {
                        await changeCardHealth(lobby, game, c, -1)
                    }
            }
            console.log('Thanos attacked all heroes in his sector')
            // End of damaging heroes in current sector

            /* End of turn cleanup */
            
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }; anon()}, [isMyTurn])

    return (
        <FinalGameDataContextGame.Provider value={finalGameData.current}>
           <div id='game'>
                <p>
                    This is the game!
                </p>
                {sectorSelectorArgs &&
                    <SectorSelector args={sectorSelectorArgs} />
                }
                {cardSelectorArgs && 
                    <CardSelector args={cardSelectorArgs} />
                }
                {diceSelectorArgs &&
                    <DiceSelector args={diceSelectorArgs} />
                }
                {faceChangerArgs &&
                    <FaceChanger args={faceChangerArgs} />
                }
                {faceSelectorArgs &&
                    <FaceSelector args={faceSelectorArgs} />
                }
                {stoneViewerArgs &&
                    <StoneViewer args={stoneViewerArgs} />
                }
                {tokenSelectorArgs &&
                    <TokenSelector args={tokenSelectorArgs} />
                }
            </div>
        </FinalGameDataContextGame.Provider>
    )
}

export default Game
