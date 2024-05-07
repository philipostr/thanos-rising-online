import './StartScreen.css'

import { useState } from 'react'

import { database, createNewLobby, joinLobby, getLobbyRef } from 'firebaseConfig'
import { get, ref } from 'firebase/database'

import { roles } from 'gameContexts'
import { shuffleArray } from 'util'

const StartScreen = ({ setLobby }) => {
    const [lobbyInput, setLobbyInput] = useState('')

    const createLobbySubmit = async () => {
        let newLobbyID = 0

        while (newLobbyID === 0) {
            // Random server ID between [10000, 99999]
            newLobbyID = Math.floor(Math.random() * 90000) + 10000
            let snapshot = await get(ref(database, getLobbyRef(newLobbyID)))
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
    const joinLobbySubmit = async () => {
        if (lobbyInput === '') {
            return
        }

        let validLobby = false

        await get(ref(database, getLobbyRef(lobbyInput))).then((snapshot) => {
            if (snapshot.exists()) {
                validLobby = true
            }
        })

        if (validLobby) {
            let player = await joinLobby(lobbyInput)
            if (player !== -1) {
                setLobby({
                    lobbyID: lobbyInput,
                    player: player,
                    isCreator: false
                })
            }
        } else {
            console.log("TODO: handle errors");
        }
    }

    return (
        <div id='startScreen'>
            <h1>Thanos Rising</h1>
            <input id='lobbyID' type='text' placeholder='Lobby ID' onChange={e => setLobbyInput(e.target.value)} />
            <button id='joinBtn' onClick={e => joinLobbySubmit()}>Join lobby</button>
            <br />
            <button id='createBtn' onClick={e => createLobbySubmit()}>Create lobby</button>
        </div>
    )
}

export default StartScreen
