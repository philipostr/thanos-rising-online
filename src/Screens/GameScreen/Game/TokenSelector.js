import './TokenSelector.css'

import { useRef, useReducer } from 'react'

import { bonusTokens } from 'gameContexts'
import { randFromArray, shuffleArray } from 'util'

/*
    Available arguments:
        - `amount`: Int. How many tokens to create and show.
        - `maxSelect`: Int. The maximum total number of selections.
        - `activatedBy`: Int. ID of asset card that activated this selector.

        - `returner`: Function. WILL BE SET AUTOMATICALLY IN ACTIVATOR FUNCTION. Resolves the selection promise.
*/
const TokenSelector = ({ args }) => {
    const tokens = useRef(Array(args.amount).map(() => randFromArray(bonusTokens)))
    // eslint-disable-next-line
    const [selection, dispatchSelection] = useReducer((state, action) => {
        state[action.target] = !state[action.target]

        return state
    }, Array(args.amount).fill(false))

    /* Currently using random tokens for simplicity. Will be replaced with actual user selection later. */
    const randTokens = shuffleArray(tokens.current)
    const _selection = []
    for (let i = 0; i < args.maxSelect; i++) {
        _selection.push(randTokens[i])
    }
    args.returner(_selection)

    return (
        <></>
    )
}

export default TokenSelector
