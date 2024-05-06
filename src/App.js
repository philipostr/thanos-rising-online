import './App.css';

import { useState, useEffect, useRef } from 'react';

import { database } from 'firebaseConfig'
import { ref, off, onValue } from 'firebase/database'

import { LobbyContextApp, GameEventContextApp } from './gameContexts';
import StartScreen from './Screens/StartScreen';
import GameScreen from './Screens/GameScreen';

function App() {
    const [gameEvent, setGameEvent] = useState('')
    const gameEventRef = useRef(null)
    // Information about the current lobby. This is set in StartScreen
    // and unset in the GameScreen. It looks like this:
    // {
    //     lobbyID, player, isCreator
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
            gameEventRef.current = ref(database, 'games/' + lobby.lobbyID + '/gameEvent')
            onValue(gameEventRef.current, (snapshot) => {
                setGameEvent(snapshot.val())
            })
        }
    }, [lobby])

    return (
        <GameEventContextApp.Provider value={gameEvent}>
            <LobbyContextApp.Provider value={lobby}>
                <div id='app'>
                    {!lobby ? <StartScreen setLobby={setLobby} /> : <GameScreen />}
                </div>
            </LobbyContextApp.Provider>
        </GameEventContextApp.Provider>

    );
}

export default App;
