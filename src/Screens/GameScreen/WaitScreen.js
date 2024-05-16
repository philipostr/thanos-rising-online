import './WaitScreen.css'

import { useContext, memo } from 'react'

import { set, ref } from 'firebase/database'
import { database, removeFromLobby, deleteLobby, getLobbyRef } from 'firebaseConfig'

import { LobbyContextApp, PlayerIDContextGameScreen } from 'gameContexts'
import PlayerCard from 'Screens/GameScreen/PlayerCard'

const WaitScreen = ({ starting }) => {
    const [lobby, setLobby] = useContext(LobbyContextApp)
    const playerID = useContext(PlayerIDContextGameScreen)

    const leaveLobby = async () => {
        await removeFromLobby(lobby, playerID)
        setLobby('')
    }

    const _deleteLobby = async () => {
        await deleteLobby(lobby)
        setLobby('')
    }

    const startGame = async () => {
        await set(ref(database, `${getLobbyRef(lobby)}/state`), 1)
        setTimeout(() => {
            set(ref(database, `${getLobbyRef(lobby)}/state`), 2)
        }, 10000);
    }

    return (
        <div id='waitScreen'>
            <p>Lobby ID: <span id='lobbyID'>{lobby}</span></p>
            <div id='playerCards'>
                <PlayerCard cardPlayerID={1} starting={starting}></PlayerCard>
                <PlayerCard cardPlayerID={2} starting={starting}></PlayerCard>
                <PlayerCard cardPlayerID={3} starting={starting}></PlayerCard>
                <PlayerCard cardPlayerID={4} starting={starting}></PlayerCard>
            </div>
            {!starting ?
                <>
                    {playerID === 1 &&
                        <>
                            <button onClick={e => startGame()}>Start Game</button>
                            <button onClick={e => _deleteLobby()}>Delete Lobby</button>
                        </>
                    }
                    <button onClick={e => leaveLobby()}>Leave Lobby</button>
                </>
            :
                <p id='gameStartingText'>Game starting soon...</p>
            }
        </div>
    )
}

export default memo(WaitScreen)
