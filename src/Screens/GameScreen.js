import './GameScreen.css'

import { useState, memo } from 'react'

import WaitScreen from './GameScreen/WaitScreen'

const GameScreen = () => {
    const [started, setStarted] = useState(false)

    return (
        <div id='gameScreen'>
            { !started ? <WaitScreen startGame={() => setStarted(true)} /> :
                <p>
                    here is the game
                </p>
            }
        </div>
    )
}

export default memo(GameScreen)
