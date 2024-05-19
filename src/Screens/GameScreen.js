import './GameScreen.css'

import { useState, useContext, useEffect, memo } from 'react'

import { ref, onValue } from 'firebase/database'
import { database, userID, getLobbyRef } from 'firebaseConfig'

import { LobbyContextApp, PlayerIDContextGameScreen, ErrorMessageContextApp } from 'gameContexts'
import WaitScreen from './GameScreen/WaitScreen'
import Game from './GameScreen/Game'

const GameScreen = ({ initialPlayerID }) => {
    const [gameState, setGameState] = useState(0)
    const [playerID, setPlayerID] = useState(initialPlayerID)
    const [lobby, setLobby] = useContext(LobbyContextApp)
    const setErrMessage = useContext(ErrorMessageContextApp)

    // On playerID changed, listen to other players leaving and adjust accordingly (or player was kicked)
    useEffect(() => {
        const unsubscribe = onValue(ref(database, `${getLobbyRef(lobby)}/players`), (snapshot) => {
            if (snapshot.exists()) {
                if (snapshot.val()[playerID].userID !== userID) {
                    for (let i = playerID; i > 0; i--) {
                        if (snapshot.val()[i].userID === userID) {
                            setPlayerID(i)
                            break
                        }
                    }
                    // Player's userID was not found, so they were kicked
                    setLobby('')
                    setErrMessage('You were kicked by the creator.')
                }
            } else {
                // This is if the lobby is deleted by the creator
                setLobby('')
                if (playerID !== 1) {
                    // Creator obviously knows that they deleted the lobby, so this is not needed
                    setErrMessage('Creator has deleted the lobby.')
                }
            }
        })

        return unsubscribe
    }, [playerID, lobby, setLobby, setErrMessage])

    // On component mount, attach listener for the state of the game
    useEffect(() => {
        const unsubscribe = onValue(ref(database, `${getLobbyRef(lobby)}/state`), (snapshot) => {
            if (!snapshot.exists()) return
            setGameState(snapshot.val())
        })

        return unsubscribe
    }, [setGameState, lobby])

    return (
        <PlayerIDContextGameScreen.Provider value={playerID}>
            <div id='gameScreen'>
                {gameState <= 1 && <WaitScreen starting={gameState === 1} />}
                {gameState === 2 && <Game />}
            </div>
        </PlayerIDContextGameScreen.Provider>
    )
}

export default memo(GameScreen)
