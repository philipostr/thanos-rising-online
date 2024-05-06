import './StartScreen.css'

import { useState } from 'react'

import { database, createNewLobby } from 'firebaseConfig'
import { get, ref } from 'firebase/database'

import { roles } from 'gameContexts'
import { shuffleArray } from 'util'

const StartScreen = ({ setLobby }) => {
    const [lobbyInput, setLobbyInput] = useState('')

    const createLobby = async () => {
        let newLobbyID = 0

        while (newLobbyID === 0) {
            // Random server ID between [10000, 99999]
            newLobbyID = Math.floor(Math.random() * 90000) + 10000
            let snapshot = await get(ref(database, "games/" + newLobbyID))
            if (snapshot.exists()) {
                newLobbyID = 0
            }
        }

        // If this is changed, update the lobby info schema in App.js accordingly
        setLobby({
            lobbyID: newLobbyID,
            player: 1,
            isCreator: true,
            roles: shuffleArray(roles)
        })
        createNewLobby(newLobbyID)
    }
    const joinLobby = async () => {
        console.log(lobbyInput);
    }

    return (
        <div id='startScreen'>
            <h1>Thanos Rising</h1>
            <input id='lobbyID' type='text' placeholder='Lobby ID' onChange={e => setLobbyInput(e.target.value)} />
            <button id='joinBtn' onClick={e => joinLobby()}>Join lobby</button>
            <br />
            <button id='createBtn' onClick={e => createLobby()}>Create lobby</button>
        </div>
    )
}

export default StartScreen
