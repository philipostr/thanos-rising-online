import './DiceSelector.css'

import { useRef, useReducer, useEffect } from 'react'

import { shuffleArray } from 'util'

/*
    Available arguments:
        - `red`: Int. Number of red dice available.
        - `blue`: Int. Number of blue dice available.
        - `green`: Int. Number of green dice available.
        - `purple`: Int. Number of purple dice available.
        - `maxSelect`: Int. The maximum total number of selections.
        - `activatedBy`: Int. ID of asset card that activated this selector.

        - `returner`: Function. WILL BE SET AUTOMATICALLY IN ACTIVATOR FUNCTION. Resolves the selection promise.
*/
const DiceSelector = ({ args }) => {
    const availableDice = useRef([])
    const diceSelectionAmounts = useRef({red: 0, blue: 0, green: 0, purple: 0})
    // eslint-disable-next-line
    const [diceSelection, dispatchDiceSelection] = useReducer((state, action) => {
        if (action.type === 'select') {
            state[action.die] = true
        } else if (action.type === 'deselect') {
            state[action.die] = false
        } else if (action.type === 'init') {
            state.fill(false, 0, action.size)
        }

        return state
    }, [])

    useEffect(() => {
        
        if (args.red) {
            for (let i = 0; i < args.red; i++) {
                availableDice.current.push('red')
            }
        }
        if (args.blue) {
            for (let i = 0; i < args.blue; i++) {
                availableDice.current.push('blue')
            }
        }
        if (args.green) {
            for (let i = 0; i < args.green; i++) {
                availableDice.current.push('green')
            }
        }
        if (args.purple) {
            for (let i = 0; i < args.purple; i++) {
                availableDice.current.push('purple')
            }
        }
        dispatchDiceSelection({type: 'init', size: availableDice.current.length})

        /* Currently using random dice for simplicity. Will be replaced with actual user selection later. */
        const randDice = shuffleArray(availableDice.current)
        for (let i = 0; i < args.maxSelect; i++) {
            diceSelectionAmounts.current[randDice[0]]++
        }

        args.returner(diceSelectionAmounts.current)
    }, [args])

    return (
        <></>
    )
}

export default DiceSelector
