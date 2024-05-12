import './PlayerCard.css'

import { useState, useRef, useEffect, useContext, memo } from 'react'

import { get, ref, set, onValue } from 'firebase/database'
import { database, getLobbyRef } from 'firebaseConfig'

import { LobbyContextApp, PlayerIDContextGameScreen } from 'gameContexts'

const PlayerCard = ({ cardPlayerID }) => {
    const [lobby] = useContext(LobbyContextApp)
    const playerID = useContext(PlayerIDContextGameScreen)
    const isCurrentPlayer = useRef(cardPlayerID === playerID)
    const playerCardDiv = useRef(null)
    const [playerName, setPlayerName] = useState('')
    const nameChange = useRef(false)

    // On component mount, appropriately link state `playerName` with the database
    useEffect(() => {
        if (isCurrentPlayer.current) {
            get(ref(database, getLobbyRef(lobby) + "/players/" + cardPlayerID)).then((snapshot) => {
                if (snapshot.val().userID !== '') {
                    setPlayerName(snapshot.val().name)
                    playerCardDiv.current.style.opacity = '1'
                } else {
                    setPlayerName('')
                    playerCardDiv.current.style.opacity = '0'
                }
            })
        } else {
            onValue(ref(database, getLobbyRef(lobby) + "/players/" + cardPlayerID), (snapshot) => {
                if (snapshot.val().userID !== '') {
                    setPlayerName(snapshot.val().name)
                    playerCardDiv.current.style.opacity = '1'
                } else {
                    setPlayerName('')
                    playerCardDiv.current.style.opacity = '0'
                }
            })
        }
    }, [lobby, playerID, cardPlayerID])

    const newNameSubmit = async () => {
        if (nameChange.current) {
            set(ref(database, getLobbyRef(lobby) + '/players/' + playerID + '/name'), playerName)
            nameChange.current = false
        }
    }

    return (
        <div className='playerCard' ref={playerCardDiv}>
            {isCurrentPlayer.current ?
                <input className='playerNameText' name='playerNameText' type='text'
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
