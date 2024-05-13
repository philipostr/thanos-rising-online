import './WaitScreen.css'

import { useContext, memo } from 'react'

import { removeFromLobby, deleteLobby } from 'firebaseConfig'

import { LobbyContextApp, PlayerIDContextGameScreen } from 'gameContexts'
import PlayerCard from 'Screens/GameScreen/PlayerCard'

const WaitScreen = ({ startGame }) => {
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

    return (
        <div id='waitScreen'>
            <p>Lobby ID: <span id='lobbyID'>{lobby}</span></p>
            <div id='playerCards'>
                <PlayerCard cardPlayerID={1}></PlayerCard>
                <PlayerCard cardPlayerID={2}></PlayerCard>
                <PlayerCard cardPlayerID={3}></PlayerCard>
                <PlayerCard cardPlayerID={4}></PlayerCard>
            </div>
            {playerID === 1 &&
                <>
                    <button onClick={e => startGame()}>Start Game</button>
                    <button onClick={e => _deleteLobby()}>Delete Lobby</button>
                </>
            }
            <button onClick={e => leaveLobby()}>Leave Lobby</button>
        </div>
    )
}

export default memo(WaitScreen)
