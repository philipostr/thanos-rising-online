import './StartScreen.css'

import { useState } from 'react'

import { database, createNewServer } from 'firebaseConfig'

import { get, ref } from 'firebase/database'

const StartScreen = () => {
    const [serverInput, setServerInput] = useState('')

    const createServer = async () => {
        let newServer = 0

        while (newServer === 0) {
            // Random server ID between [10000, 99999]
            newServer = Math.floor(Math.random() * 90000) + 10000
            let snapshot = await get(ref(database, "games/" + newServer))
            if (snapshot.exists()) {
                newServer = 0
            }
        }

        createNewServer(newServer)
    }
    const joinServer = async () => {
        console.log(serverInput);
    }

    return (
        <div id='startScreen'>
            <h1>Thanos Rising</h1>
            <input id='serverID' type='text' placeholder='Server ID' onChange={(e) => {setServerInput(e.target.value)}} />
            <button id='joinBtn' onClick={(e) => joinServer()}>Join server</button>
            <br />
            <button id='createBtn' onClick={(e) => createServer()}>Create server</button>
        </div>
    )
}

export default StartScreen
