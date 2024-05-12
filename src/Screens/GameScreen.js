import './GameScreen.css'

import { useState, useContext, useEffect, memo } from 'react'

import { ref, onValue } from 'firebase/database'
import { database, userID, getLobbyRef } from 'firebaseConfig'

import { LobbyContextApp, PlayerIDContextGameScreen } from 'gameContexts'
import WaitScreen from './GameScreen/WaitScreen'

const GameScreen = ({ initialPlayerID }) => {
    const [started, setStarted] = useState(false)
    const [playerID, setPlayerID] = useState(initialPlayerID)
    const [lobby] = useContext(LobbyContextApp)

    // On mount, listen to other players leaving and adjust accordingly
    useEffect(() => {
        onValue(ref(database, getLobbyRef(lobby) + '/players'), (snapshot) => {
            if (snapshot.exists() && snapshot.val()[playerID].userID !== userID) {
                for (let i = playerID; i >= 0; i--) {
                    if (snapshot.val()[i].userID === userID) {
                        setPlayerID(i)
                        break
                    }
                }
            }
        })
    }, [playerID, lobby])

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
