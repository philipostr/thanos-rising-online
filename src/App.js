import './App.css'

import { useState, useEffect, useRef } from 'react'

import { database, getLobbyRef } from 'firebaseConfig'
import { ref, off, onValue } from 'firebase/database'

import { LobbyContextApp, GameEventContextApp, ErrorMessageContextApp } from 'gameContexts'
import ErrorCard from 'ErrorCard'
import StartScreen from 'Screens/StartScreen'
import GameScreen from 'Screens/GameScreen'

function App() {
    const [gameEvent, setGameEvent] = useState('')
    const gameEventRef = useRef(null)
    const [errMessage, setErrMessage] = useState('')
    // Used to reset the timer for ErrorCard to disappear when there
    // is a new error
    const numErrMessage = useRef(0)
    // Information about the current lobby. This is set in StartScreen
    // and unset in the GameScreen. It looks like this:
    // {
    //     lobbyID, player, isCreator, roles (iff isCreator)
    // }
    const [lobby, setLobby] = useState(null)

    // When lobby changes, update the gameEventRef accordingly
    useEffect(() => {
        if (!lobby) {
            if (gameEventRef.current) {
                off(gameEventRef.current)
                gameEventRef.current = null
            }
        } else {
            gameEventRef.current = ref(database, getLobbyRef(lobby.lobbyID) + '/gameEvent')
            onValue(gameEventRef.current, (snapshot) => {
                setGameEvent(snapshot.val())
            })
        }
    }, [lobby])

    // Remove ErrorCard after 5 seconds since the newest error message
    useEffect(() => {
        numErrMessage.current++
        setTimeout(() => {
            numErrMessage.current--
            if (numErrMessage.current === 0) {
                setErrMessage('')
            }
        }, 5000);
    }, [errMessage])

    return (
        <ErrorMessageContextApp.Provider value={setErrMessage}>
            <GameEventContextApp.Provider value={gameEvent}>
                <LobbyContextApp.Provider value={lobby}>
                    <div id='app'>
                        {!lobby ? <StartScreen setLobby={setLobby} /> : <GameScreen />}
                        <ErrorCard errMessage={errMessage} />
                    </div>
                </LobbyContextApp.Provider>
            </GameEventContextApp.Provider>
        </ErrorMessageContextApp.Provider>
    );
}

export default App;
