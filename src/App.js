import './App.css'

import { useState, useEffect, useRef } from 'react'

import { LobbyContextApp, ErrorMessageContextApp } from 'gameContexts'
import ErrorCard from 'ErrorCard'
import StartScreen from 'Screens/StartScreen'
import GameScreen from 'Screens/GameScreen'

function App() {
    const [errMessage, setErrMessage] = useState('')
    // Used to reset the timer for ErrorCard to disappear when there
    // is a new error
    const numErrMessage = useRef(0)
    const [lobby, setLobby] = useState('')
    const initialPlayerID = useRef()

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

    const _setLobby = (newLobby, newInitialPlayerID) => {
        setLobby(newLobby)
        initialPlayerID.current = newInitialPlayerID
    }

    return (
        <ErrorMessageContextApp.Provider value={setErrMessage}>
                <LobbyContextApp.Provider value={[lobby, setLobby]}>
                    <div id='app'>
                        {lobby === '' ? <StartScreen setLobby={_setLobby} /> : <GameScreen initialPlayerID={initialPlayerID.current} />}
                        <ErrorCard errMessage={errMessage} />
                    </div>
                </LobbyContextApp.Provider>
        </ErrorMessageContextApp.Provider>
    );
}

export default App;
