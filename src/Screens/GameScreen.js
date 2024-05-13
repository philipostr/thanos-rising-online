import './GameScreen.css'

import { useState, useContext, useEffect, memo } from 'react'

import { ref, onValue } from 'firebase/database'
import { database, userID, getLobbyRef } from 'firebaseConfig'

import { LobbyContextApp, PlayerIDContextGameScreen, ErrorMessageContextApp } from 'gameContexts'
import WaitScreen from './GameScreen/WaitScreen'

const GameScreen = ({ initialPlayerID }) => {
    const [started, setStarted] = useState(false)
    const [playerID, setPlayerID] = useState(initialPlayerID)
    const [lobby, setLobby] = useContext(LobbyContextApp)
    const setErrMessage = useContext(ErrorMessageContextApp)

    // On playerID changed, listen to other players leaving and adjust accordingly (or player was kicked)
    useEffect(() => {
        const unsubscribe = onValue(ref(database, getLobbyRef(lobby) + '/players'), (snapshot) => {
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

    return (
        <PlayerIDContextGameScreen.Provider value={playerID}>
            <div id='gameScreen'>
                { !started ? <WaitScreen startGame={() => setStarted(true)} /> :
                    <p>
                        here is the game
                    </p>
                }
            </div>
        </PlayerIDContextGameScreen.Provider>
        
    )
}

export default memo(GameScreen)
