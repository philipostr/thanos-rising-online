import './CardSelector.css'

import { useRef, useReducer, useEffect } from 'react'

import { assetCards } from 'AssetInfo'
import { isDamaged } from 'util'

// Available arguments:
//   - `game`: GameObject. Contains an up-to-date game object from the RTDB.
//   - `diceAssign`: Boolean. Whether to be selecting to assign dice values. No other named variables
//                   will be taken into consideration, as this is an entire functionally-specific usecase.
//   - `sectors`: Array[int]. What sectors should be included in the options.
//   - `villains`: Boolean. Whether villains should be included in the options.
//   - `heroes`: Boolean. Whether heroes should be included in the options.
//   - `damaged`: Boolean. Whether to only include cards that have been damaged. Implies `undamaged=false`.
//   - `undamaged`: Boolean. Whether to only include cards that have not been damaged. Implies `damaged=false`
//   - `players`: Boolean. Whether ALL players' hands should be included in the options. Implies `heroes=true`.
//   - `maxSelect`: Int. The maximum total number of selections.
//   - `reSelect`: Boolean. Whether cards can be selected multiple times or once each.
//   - `activatedBy`: Int. ID of asset card that activated this selector.
//
//   - `returner`: Function. WILL BE SET AUTOMATICALLY IN ACTIVATOR FUNCTION. Resolves the selection promise.
const CardSelector = ({ args }) => {
    const sectionNames = useRef([])
    const sectionCards = useRef([])
    const cardSelectionList = useRef([])
    // eslint-disable-next-line
    const [cardSelection, dispatchCardSelection] = useReducer((state, action) => {
        if (action.type === 'increment') {
            if (state[action.card] === undefined) state[action.card] = 0
            state[action.card]++
        } else if (action.type === 'decrement') {
            state[action.card]--
        }

        return state
    }, {})

    useEffect(() => {
        if (args.diceAssign) console.log('Not yet implemented.')

        if (args.sectors) {
            for (let sector of args.sectors) {
                const sectorCards = args.game.table.sectors[sector]
                if (!sectorCards) continue

                let cards = []
                for (let i of Object.keys(sectorCards)) {
                    let card = sectorCards[i]
                    if (args.damaged && !isDamaged(args.game, card)) continue
                    if (args.undamaged && isDamaged(args.game, card)) continue

                    if (assetCards[card].type === 'villain' && args.villains) {
                        cards.push(card)
                    } else if (assetCards[card].type !== 'villain' && args.heroes) {
                        cards.push(card)
                    }
                }
                if (cards.length !== 0) {
                    sectionNames.current.push(`Sector ${sector}`)
                    sectionCards.current.push(cards)
                }
            }
        }

        if (args.players) {
            for (let p = 1; p <= args.game.players.playerNum; p++) {
                let cards = []
                let playerCards = args.game.players[p].cards

                if (playerCards && playerCards.length !== 0) {
                    if (args.damaged) {
                        for (let card of playerCards) {
                            if (isDamaged(args.game, card)) {
                                cards.push(card)
                            }
                        }
                    } else if (args.undamaged) {
                        for (let card of playerCards) {
                            if (!isDamaged(args.game, card)) {
                                cards.push(card)
                            }
                        }
                    } else {
                        cards = playerCards
                    }
                }
                if (cards.length !== 0) {
                    sectionNames.current.push(args.game.players[p].name)
                    sectionCards.current.push(cards)
                }
            }
        }

        /* Currently using random cards for simplicity. Will be replaced with actual user selection later. */
        for (let s = 0; s < args.maxSelect; s++) {
            let sectionInd = Math.floor((Math.random()*sectionCards.current.length))
            let cardInd = Math.floor((Math.random()*sectionCards.current[sectionInd].length))
            let card = sectionCards.current[sectionInd][cardInd]
            if (!args.reSelect && cardSelectionList.current.includes(card)) {
                s--
                continue
            }

            dispatchCardSelection({type: 'increment', indices: [sectionInd, cardInd]})
            cardSelectionList.current.push(card)
        }

        args.returner(cardSelectionList.current)
    }, [args])

    return (
        <></>
    )
}

export default CardSelector
