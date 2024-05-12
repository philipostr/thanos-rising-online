import './WaitScreen.css'

import { useContext, memo } from 'react'

import { LobbyContextApp } from 'gameContexts'
import PlayerCard from 'Screens/GameScreen/PlayerCard'

const WaitScreen = ({ startGame }) => {
    const lobby = useContext(LobbyContextApp)

    return (
        <div id='waitScreen'>
            <p>Lobby ID: <span id='lobbyID'>{lobby.lobbyID}</span></p>
            <div id='playerCards'>
                <PlayerCard playerID={1}></PlayerCard>
                <PlayerCard playerID={2}></PlayerCard>
                <PlayerCard playerID={3}></PlayerCard>
                <PlayerCard playerID={4}></PlayerCard>
            </div>
            <button onClick={() => startGame()}>Start Game</button>
        </div>
    )
}

export default memo(WaitScreen)
