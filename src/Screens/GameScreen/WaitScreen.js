import './WaitScreen.css'

import { useContext, memo } from 'react'

import { set, ref } from 'firebase/database'
import { database, removeFromLobby, deleteLobby, getLobbyRef, getGameObject } from 'firebaseConfig'

import { LobbyContextApp, PlayerIDContextGameScreen } from 'gameContexts'
import { assetCards, captains } from 'AssetInfo'
import PlayerCard from 'Screens/GameScreen/PlayerCard'
import { shuffleArray } from 'util'

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

        // After showing roles for 10 seconds, actually start the game
        setTimeout(async () => {
            const game = await getGameObject(lobby)
            const roleCaptains = {...captains}

            for (let i = 1; i <= 4; i++) {
                if (i <= game.players.playerNum) {
                    game.players[i].cards = [roleCaptains[game.players[i].role]]
                } else {
                    // Remove captains not used from the set of captains
                    delete roleCaptains[game.players[i].role]

                    // Remove unused players from the game
                    delete game.players[i]
                }
            }
            const captainsUsed = Object.values(roleCaptains)

            // Create deck to pick cards from
            let deck = []
            for (let c = 0; c < assetCards.length; c++) {
                if (!captainsUsed.includes(c)) {
                    deck.push(c)
                }
            }
            deck = shuffleArray(deck)

            // Populate card groups from the deck
            game.table.sectors = {1: deck.slice(0,3), 2: deck.slice(3,6), 3: deck.slice(6,9)}
            game.absent = deck.slice(9)

            game.state = 2
            set(ref(database, getLobbyRef(lobby)), game)
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
