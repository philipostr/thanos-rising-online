import './Game.css'

import { useContext, useRef, useState, useEffect } from 'react'

import { onValue, ref, child } from 'firebase/database'
import { database, getLobbyRef, getGameObject } from 'firebaseConfig'

import { PlayerIDContextGameScreen, FinalGameDataContextGame, LobbyContextApp } from 'gameContexts'

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
    const [step, setStep] = useState(0)
    // Is used for context FinalGameDataContextGame
    const finalGameData = useRef(null)

    /* Is updated by listeners, and are used by both steps AND subcomponents.
       These states should be accompanied by a useEffect, and value ref that
       is updated in the effect, and a resolve ref that is called in the
       effect to resolve any promise waiting for a change in value */
    const [playerSector, setPlayerSector] = useState(0)
    const playerSectorVal = useRef(0)
    const playerSectorResolve = useRef(null)
    useEffect(() => {
        playerSectorVal.current = playerSector
        if (playerSectorResolve.current) playerSectorResolve.current()
    }, [playerSector])

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
            })
        ]

        // On component unmount, unsubscribe every listener
        return () => {for (let u of unsubscribers) u()}
    }, [lobby, playerID])

    // On isMyTurn changes to true, proceed with the current player's turn
    useEffect(() => { async function anon() {
        if (isMyTurn) {
            /* Step 1 */
            setStep(1)
            await new Promise((resolve) => playerSectorResolve.current = resolve)
            console.log('Received the new player sector value.');
        }
    }; anon()}, [isMyTurn])

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
