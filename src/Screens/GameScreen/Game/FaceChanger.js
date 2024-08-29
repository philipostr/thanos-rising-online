import './FaceChanger.css'

import { useRef, useReducer } from 'react'

/*
    Available arguments:
        - `game`: GameObject. Contains an up-to-date game object from the RTDB.
        - `filter`: Function. Filters through only the faces that make this function return true.
        - `maxSelect`: Int. The maximum total number of selections.
        - `activatedBy`: Int. ID of asset card that activated this selector.

        - `returner`: Function. WILL BE SET AUTOMATICALLY IN ACTIVATOR FUNCTION. Resolves the selection promise.
*/
const FaceChanger = ({ args }) => {
    /* eslint-disable */
    const numChanges = useRef(0)
    const originalFaces = useRef(args.game.turn.faces.filter(args.filter))
    // To not lose the faces that didn't pass `args.filter` when returning the faces array
    const otherFaces = useRef(args.game.turn.faces.filter((f) => !args.filter(f)))
    const [faces, dispatchFaces] = useReducer((state, action) => {
        if (action.type === 'change') {
            state[action.target].face = action.newFace
        } else if (action.type === 'reset') {
            state[action.target].face = args.game.turn.faces[action.target].face
        }

        return state
    }, [...originalFaces.current])
    /* eslint-enable */

    /* Currently using random dice for simplicity. Will be replaced with actual user selection later. */
    const _faces = [...originalFaces.current]
    for (let i = 0; i < args.maxSelect; i++) {
        const target = Math.floor(Math.random() * _faces.length)
        _faces[target].face = 'changed'
    }

    args.returner([..._faces, ...otherFaces.current])

    return (
        <></>
    )
}

export default FaceChanger
