import './App.css';

import { useState } from 'react';

import { LobbyContextApp } from './gameContexts';
import StartScreen from './Screens/StartScreen';
import GameScreen from './Screens/GameScreen';

function App() {
    const [lobby, setLobby] = useState('')

    return (
        <LobbyContextApp.Provider value={[lobby, setLobby]}>
            <div id='app'>
                {lobby === '' ? <StartScreen /> : <GameScreen /> }
                <button onClick={() => setLobby(' ')}>Press me</button>
            </div>
        </LobbyContextApp.Provider>
    );
}

export default App;
