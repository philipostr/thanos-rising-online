import './StoneViewer.css'

import { useState } from 'react'

import { stoneColours } from 'gameContexts'
import { shuffleArray } from 'util'

/*
    Available arguments:
        - `game`: GameObject. Contains an up-to-date game object from the RTDB.
        - `selectable`: Boolean. Whether the stones are selectable or not.
        - `includeZero`: Boolean. Whether to include stones that have 0 counter.
        - `activatedBy`: Int. ID of asset card that activated this selector.

        - `returner`: Function. WILL BE SET AUTOMATICALLY IN ACTIVATOR FUNCTION. Resolves the selection promise.
*/
const StoneViewer = ({ args }) => {
    // eslint-disable-next-line no-unused-vars
    const [selection, setSelection] = useState('')

    /* Currently using random stones for simplicity. Will be replaced with actual user selection later. */
    const stones = shuffleArray(stoneColours)
    let found = false
    for (let stone of stones) {
        if (args.game.table.infinityStones[stone] > 0) {
            args.returner(stone)
            found = true
        }
    }
    if (!found) {
        args.returner('')
    }

    return (
        <></>
    )
}

export default StoneViewer
