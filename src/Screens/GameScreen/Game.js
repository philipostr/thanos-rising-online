import './Game.css'

import { useContext, useRef, useState, useEffect, useCallback } from 'react'

import { onValue, ref, child, set } from 'firebase/database'
import { database, getLobbyRef, getGameObject } from 'firebaseConfig'

import { PlayerIDContextGameScreen, FinalGameDataContextGame, LobbyContextApp, stoneColours } from 'gameContexts'
import { randFromArray } from 'util'
import useWaitableState from 'hooks/useWaitableState'

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
    // Is used for context FinalGameDataContextGame
    const finalGameData = useRef(null)

    /* Is updated by listeners, and are used by both steps AND subcomponents */
    const [, setPlayerSector, , playerSectorWait] = useWaitableState(0)
    const [, setInfinityStones, infinityStonesVal, ] = useWaitableState(null)
    const [, setThanos, thanosVal, ] = useWaitableState(1)
    const [, setSector1, , ] = useWaitableState(null)
    const [, setSector2, , ] = useWaitableState(null)
    const [, setSector3, , ] = useWaitableState(null)

    const rollStoneDie = useCallback(async () => {
        let stone = randFromArray(stoneColours)
        let stoneAchieved = false
        // If rolled infinity stone has already been achieved
        if (infinityStonesVal.current[stone] >= 5) {
            stoneAchieved = true
            console.log('Activate infinity stone effect for the round')
        }
        await set(child(finalGameData.current.lobbyRef, `table/infinityStones/${stone}`),
            infinityStonesVal.current[stone] + 1
        )

        return [stone, stoneAchieved]
    }, [infinityStonesVal])

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
            const step3_action = Math.floor(Math.random()*6)
            let step3_thanos = thanosVal.current
            var step3_stone, step3_stoneAchieved
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
            } else if (step3_action === 4) {
                console.log('Activate villain abilities in other sectors')
            } else if (step3_action === 5) {
                [step3_stone, step3_stoneAchieved] = await rollStoneDie()
                console.log(`Increased counter for ${step3_stone} stone. Was ${step3_stoneAchieved ? '' : 'not'} activated`)
            }
            console.log('Activate villain abilities in current sector')

            /* End of turn cleanup */
            if (step2_stoneAchieved) {
                set(child(finalGameData.current.lobbyRef, `table/infinityStones/${step2_stone}`), 5)
            }
            if (step3_stoneAchieved && step3_stone !== step2_stone) {
                set(child(finalGameData.current.lobbyRef, `table/infinityStones/${step3_stone}`), 5)
            }
        }
    }; anon()}, [isMyTurn, playerSectorWait, rollStoneDie, thanosVal])

    return (
        <FinalGameDataContextGame.Provider value={finalGameData.current}>
           <div id='game'>
                <p>
                    This is the game!
                </p>
            </div>
        </FinalGameDataContextGame.Provider>
    )
}

export default Game
