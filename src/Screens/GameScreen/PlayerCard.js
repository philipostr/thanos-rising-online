import './PlayerCard.css'

import { useState, useRef, useEffect, useContext, memo } from 'react'

import { get, ref, set, onValue } from 'firebase/database'
import { database, getLobbyRef, removeFromLobby } from 'firebaseConfig'

import { LobbyContextApp, PlayerIDContextGameScreen } from 'gameContexts'

const PlayerCard = ({ cardPlayerID }) => {
    const [lobby] = useContext(LobbyContextApp)
    const playerID = useContext(PlayerIDContextGameScreen)
    const playerCardDiv = useRef(null)
    const [playerName, setPlayerName] = useState('')
    const nameChange = useRef(false)

    // On playerID change, appropriately link state `playerName` with the database
    useEffect(() => {
        if (cardPlayerID === playerID) {
            // Only fetch name once in case of rejoining
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
            // Continuously check for changes in the other players' names
            let unsubscribe = onValue(ref(database, getLobbyRef(lobby) + "/players/" + cardPlayerID), (snapshot) => {
                if (!snapshot.exists()) return
                if (snapshot.val().userID !== '') {
                    setPlayerName(snapshot.val().name)
                    playerCardDiv.current.style.opacity = '1'
                } else {
                    setPlayerName('')
                    playerCardDiv.current.style.opacity = '0'
                }
            })
            return unsubscribe
        }
    }, [lobby, playerID, cardPlayerID])

    const newNameSubmit = async () => {
        if (nameChange.current) {
            set(ref(database, getLobbyRef(lobby) + '/players/' + playerID + '/name'), playerName)
            nameChange.current = false
        }
    }

    const playerNameHandleChange = (newName) => {
        if (newName.length <= 20) {
            nameChange.current = true
            setPlayerName(newName)
        }
    }

    return (
        <div className='playerCard' ref={playerCardDiv}>
            {cardPlayerID === playerID ?
                <input className='playerNameText' name='playerNameText' type='text'
                    value={playerName} onChange={e => playerNameHandleChange(e.target.value)}
                    onBlur={e => newNameSubmit()} onKeyDown={e => {if (e.key === 'Enter') e.target.blur()}}
                />
            :
                <p className='playerNameText'>
                    {playerName}
                </p>
            }
            {playerID === 1 && cardPlayerID !== 1 &&
                <button id='kickButton' onClick={e => removeFromLobby(lobby, cardPlayerID)}>Kick</button>
            }
        </div>
    )
}

export default memo(PlayerCard)
