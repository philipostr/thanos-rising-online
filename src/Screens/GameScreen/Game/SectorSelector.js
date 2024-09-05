import './SectorSelector.css'

import { randFromArray } from 'util'

/*
    Available arguments:
        - `returner`: Function. WILL BE SET AUTOMATICALLY IN ACTIVATOR FUNCTION. Resolves the selection promise.
*/
const SectorSelector = ({ args }) => {
    /* Currently using random faces for simplicity. Will be replaced with actual user selection later. */
    args.returner(randFromArray([1,2,3]))

    return (
        <></>
    )
}

export default SectorSelector
