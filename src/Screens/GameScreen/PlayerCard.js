import './PlayerCard.css'

import { useState, useRef, useEffect, useContext, memo } from 'react'

import { get, ref, set, onValue } from 'firebase/database'
import { database, getLobbyRef } from 'firebaseConfig'

import { LobbyContextApp } from 'gameContexts'

const PlayerCard = ({playerID}) => {
    const lobby = useContext(LobbyContextApp)
    const isCurrentPlayer = useRef(lobby.player === playerID)
    const playerCardDiv = useRef(null)
    const [playerName, setPlayerName] = useState('')
    const nameChange = useRef(false)

    // On component mount, appropriately link state `playerName` with the database
    useEffect(() => {
        if (isCurrentPlayer.current) {
            get(ref(database, getLobbyRef(lobby.lobbyID) + "/players/" + playerID)).then((snapshot) => {
                if (snapshot.val().userID !== '') {
                    setPlayerName(snapshot.val().name)
                    playerCardDiv.current.style.opacity = '1'
                } else {
                    setPlayerName('')
                    playerCardDiv.current.style.opacity = '0'
                }
            })
        } else {
            onValue(ref(database, getLobbyRef(lobby.lobbyID) + "/players/" + playerID), (snapshot) => {
                if (snapshot.val().userID !== '') {
                    setPlayerName(snapshot.val().name)
                    playerCardDiv.current.style.opacity = '1'
                } else {
                    setPlayerName('')
                    playerCardDiv.current.style.opacity = '0'
                }
            })
        }
    }, [lobby, playerID])

    const newNameSubmit = async () => {
        if (nameChange.current) {
            set(ref(database, getLobbyRef(lobby.lobbyID) + '/players/' + lobby.player + '/name'), playerName)
            nameChange.current = false
        }
    }

    return (
        <div className='playerCard' ref={playerCardDiv}>
            {isCurrentPlayer.current ?
                <input className='playerNameText' type='text'
                    value={playerName} onChange={e => {nameChange.current = true; setPlayerName(e.target.value)}}
                    onBlur={e => newNameSubmit()}
                />
            :
                <p className='playerNameText'>
                    {playerName}
                </p>
            }
        </div>
    )
}

export default memo(PlayerCard)
