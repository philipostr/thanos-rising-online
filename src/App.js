import './App.css';

import { useState, useEffect, useRef } from 'react';

import { database } from './firebase'
import { ref, off, onValue } from 'firebase/database'

import { LobbyContextApp, GameEventContextApp } from './gameContexts';
import StartScreen from './Screens/StartScreen';
import GameScreen from './Screens/GameScreen';

function App() {
    const [lobby, setLobby] = useState('')
    const [gameEvent, setGameEvent] = useState('')
    const gameEventRef = useRef(null)

    // When lobby changes, update the gameEventRef accordingly
    useEffect(() => {
        if (lobby === '') {
            if (gameEventRef.current) {
                off(gameEventRef.current)
                gameEventRef.current = null
            }
        } else {
            gameEventRef.current = ref(database, '/games/' + lobby + '/gameEvent')
            onValue(gameEventRef.current, (snapshot) => {
                setGameEvent(snapshot.val())
            })
        }
    }, [lobby])

    return (
        <GameEventContextApp.Provider value={gameEvent}>
            <LobbyContextApp.Provider value={[lobby, setLobby]}>
                <div id='app'>
                    {lobby === '' ? <StartScreen /> : <GameScreen />}
                </div>
            </LobbyContextApp.Provider>
        </GameEventContextApp.Provider>

    );
}

export default App;
