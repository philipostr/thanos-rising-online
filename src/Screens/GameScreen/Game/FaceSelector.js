import './FaceSelector.css'

import { useRef, useReducer } from 'react'

import { shuffleArray } from 'util'

/*
    Available arguments:
        - `game`: GameObject. Contains an up-to-date game object from the RTDB.
        - `maxSelect`: Int. The maximum total number of selections.
        - `activatedBy`: Int. ID of asset card that activated this selector.

        - `returner`: Function. WILL BE SET AUTOMATICALLY IN ACTIVATOR FUNCTION. Resolves the selection promise.
*/
const FaceSelector = ({ args }) => {
    /* eslint-disable */
    const faceSelectionNumber = useRef(0)
    const [faceSelection, faceSelectionDispatch] = useReducer((state, action) => {
        state[action.target] = !state[action.target]
        console.log(state)
        return state
    }, Array(args.game.turn.faces.length).fill(false))
    /* eslint-enable */

    /* Currently using random faces for simplicity. Will be replaced with actual user selection later. */
    const _faceSelection = Array(args.game.turn.faces.length).fill(false)
    const randFaces = shuffleArray([...Array(args.game.turn.faces.length).keys()])
    for (let i = 0; i < args.maxSelect; i++) {
        _faceSelection[randFaces[i]] = true
    }

    const faceSelectionList = []
    for (let i = 0; i < _faceSelection.length; i++) {
        if (_faceSelection[i]) {
            faceSelectionList.push(i)
        }
    }
    args.returner(faceSelectionList)

    return (
        <></>
    )
}

export default FaceSelector
