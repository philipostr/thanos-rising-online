import './StartScreen.css'

import { useContext, useState } from 'react'

import { database, createNewLobby, joinLobby, getLobbyRef } from 'firebaseConfig'
import { get, ref } from 'firebase/database'

import { ErrorMessageContextApp } from 'gameContexts'

const StartScreen = ({ setLobby }) => {
    const [lobbyInput, setLobbyInput] = useState('')
    const setErrMessage = useContext(ErrorMessageContextApp)

    const createLobbySubmit = async () => {
        let newLobbyID = ''

        while (newLobbyID === '') {
            // Random server ID between [10000, 99999]
            newLobbyID = (Math.floor(Math.random() * 90000) + 10000).toString()
            let snapshot = await get(ref(database, getLobbyRef(newLobbyID)))
            if (snapshot.exists()) {
                newLobbyID = ''
            }
        }

        setLobby(newLobbyID, 1)
        createNewLobby(newLobbyID)
    }

    const joinLobbySubmit = async () => {
        if (lobbyInput === '') {
            setErrMessage('You must provide a lobby ID.')
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
                setLobby(lobbyInput, player)
            } else {
                setErrMessage('There is no more space in this lobby.')
            }
        } else {
            setErrMessage('This lobby ID does not exist.')
        }
    }

    return (
        <div id='startScreen'>
            <h1>Thanos Rising</h1>
            <input id='lobbyID' type='text' placeholder='Lobby ID' onChange={e => setLobbyInput(e.target.value)} />
            <button id='joinBtn' disabled={lobbyInput === '' ? true : false} onClick={e => joinLobbySubmit()}>Join lobby</button>
            <br />
            <button id='createBtn' onClick={e => createLobbySubmit()}>Create lobby</button>
        </div>
    )
}

export default StartScreen
