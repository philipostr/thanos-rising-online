import { set, child } from 'firebase/database'

export const AbilityEvent = Object.freeze({
    VILLAIN: 0, PRE_ROLL: 1, POST_ROLL: 2, POST_DAMAGE: 3
})

/* This is the static information about every asset card in the game. It includes the simple values
   of `name`, `maxHP`, `cost` (how many tokens to damage/recruit), `type` (card's affiliation/team),
   `abilityEvent` (when the ability is available), `icon` (url of the image to be used in-game).
   As for the abilities, there are an additional 2 functional properties which, when the correct 
   ability event occurs, will be used to activate abilities properly:
    - `checkValid` must be called to check if the ability's conditions have been met. Returns true if
      valid, false otherwise.
    - `activate` can be called if `checkValid` returned true. Is async to await firebase's pure async
      APIs.
*/
export const assetCards = [
    {
        name: 'General Outrider',
        maxHP: 2,
        cost: {combat: 2, tech: 2, mystic: 0, cosmic: 0},
        type: 'villain',
        abilityEvent: AbilityEvent.VILLAIN,
        icon: 'unset',
        checkValid: (game, args) => {
            return true
        },
        activate: async (game, args) => {
            let sectorCards = game.table.sectors[args.sector]
            if (game.table.playerSector === args.sector) {
                sectorCards.push(...game.players[game.currentPlayer].cards)
            }

            for (let c of sectorCards) {
                if (assetCards[c].type === 'red' || assetCards[c].type === 'blue') {
                    if (game.cards[c].health > 0) {
                        await set(child(args.lobbyRef, `cards/${c}/health`), --game.cards[c].health)
                    }
                }
            }
            console.log('General Outrider (blue red) ability activated')
        }
    }
]

const getValidInList = (game, event, args, list) => {
    let validCards = []

    for (let c of list) {
        if (assetCards[c].abilityEvent === event && assetCards[c].checkValid(game, args)) {
            validCards.push(c)
        }
    }

    return validCards
}

export const getValidInHand = (game, event, args) => {
    return getValidInList(game, event, args, game.players[game.currentPlayer].cards)
}

export const getValidInSector = (game, event, args) => {
    return getValidInList(game, event, args, game.table.sectors[args.sector])
}
