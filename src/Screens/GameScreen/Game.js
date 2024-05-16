import './Game.css'

import { useContext, useRef, useEffect } from 'react'

import { getLobbyRef, getGameObject } from 'firebaseConfig'

import { PlayerIDContextGameScreen, FinalGameDataContextGame, LobbyContextApp } from 'gameContexts'

const Game = ({ gameState }) => {
    const playerID = useContext(PlayerIDContextGameScreen)
    const [lobby] = useContext(LobbyContextApp)
    // Is used for a context. Please update src/gameContexts.js
    // documentation accordingly
    const finalGameData = useRef(null)

    // On component mount, initialize the finalGameData object and listeners
    useEffect(() => {
        let finalGameDataObject = {
            lobbyID: lobby,
            lobbyRefString: getLobbyRef(lobby),
            playerID: playerID
        }

        getGameObject(lobby).then((game) => {
            if (!game) return
            finalGameDataObject.roles = {
                1: game.players[1].role,
                2: game.players[2].role,
                3: game.players[3].role,
                4: game.players[4].role
            }
        })

        finalGameData.current = finalGameDataObject
    }, [lobby, playerID])

    return (
        <FinalGameDataContextGame.Provider value={finalGameData.current}>
           <div id='game'>
                { gameState === 2 &&
                    <p>
                        This is the game!
                    </p>
                }
            </div>
        </FinalGameDataContextGame.Provider>
        
    )
}

export default Game
