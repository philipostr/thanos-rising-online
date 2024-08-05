import { syncSetGameObject } from 'firebaseConfig'
import { shuffleArray } from 'util'

export const AbilityEvent = Object.freeze({
    VILLAIN: 0, PRE_ROLL: 1, POST_ROLL: 2, POST_DAMAGE: 3
})

/* This is the static information about every asset card in the game. It includes the simple values
   of `name`, `maxHP`, `cost` (how many tokens to damage/recruit), `type` (card's affiliation/team),
   `abilityEvent` (when the ability is available), `text` (description of the ability),
   `icon` (url of the image to be used in-game).
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
        text: 'If activated by Thanos, add 1 damage to all combat and tech heroes in this sector.',
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
                        await syncSetGameObject(args.lobbyID, game, `cards/${c}/health`, game.cards[c].health-1)
                    }
                }
            }
            console.log('General Outrider (red blue) ability activated')
        }
    },
    {
        name: 'General Outrider',
        maxHP: 2,
        cost: {combat: 0, tech: 2, mystic: 0, cosmic: 2},
        type: 'villain',
        abilityEvent: AbilityEvent.VILLAIN,
        text: 'If activated by Thanos, add 1 damage to all tech and cosmic heroes in this sector.',
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
                if (assetCards[c].type === 'blue' || assetCards[c].type === 'purple') {
                    if (game.cards[c].health > 0) {
                        await syncSetGameObject(args.lobbyID, game, `cards/${c}/health`, game.cards[c].health-1)
                    }
                }
            }
            console.log('General Outrider (blue purple) ability activated')
        }
    },
    {
        name: 'General Outrider',
        maxHP: 2,
        cost: {combat: 0, tech: 2, mystic: 2, cosmic: 0},
        type: 'villain',
        abilityEvent: AbilityEvent.VILLAIN,
        text: 'If activated by Thanos, add 1 damage to all tech and mystic heroes in this sector.',
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
                if (assetCards[c].type === 'blue' || assetCards[c].type === 'green') {
                    if (game.cards[c].health > 0) {
                        await syncSetGameObject(args.lobbyID, game, `cards/${c}/health`, game.cards[c].health-1)
                    }
                }
            }
            console.log('General Outrider (blue green) ability activated')
        }
    },
    {
        name: 'General Outrider',
        maxHP: 2,
        cost: {combat: 2, tech: 0, mystic: 0, cosmic: 2},
        type: 'villain',
        abilityEvent: AbilityEvent.VILLAIN,
        text: 'If activated by Thanos, add 1 damage to all combat and cosmic heroes in this sector.',
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
                if (assetCards[c].type === 'red' || assetCards[c].type === 'purple') {
                    if (game.cards[c].health > 0) {
                        await syncSetGameObject(args.lobbyID, game, `cards/${c}/health`, game.cards[c].health-1)
                    }
                }
            }
            console.log('General Outrider (red purple) ability activated')
        }
    },
    {
        name: 'General Outrider',
        maxHP: 2,
        cost: {combat: 2, tech: 0, mystic: 2, cosmic: 0},
        type: 'villain',
        abilityEvent: AbilityEvent.VILLAIN,
        text: 'If activated by Thanos, add 1 damage to all combat and mystic heroes in this sector.',
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
                if (assetCards[c].type === 'red' || assetCards[c].type === 'green') {
                    if (game.cards[c].health > 0) {
                        await syncSetGameObject(args.lobbyID, game, `cards/${c}/health`, game.cards[c].health-1)
                    }
                }
            }
            console.log('General Outrider (red green) ability activated')
        }
    },
    {
        name: 'General Outrider',
        maxHP: 2,
        cost: {combat: 0, tech: 0, mystic: 2, cosmic: 2},
        type: 'villain',
        abilityEvent: AbilityEvent.VILLAIN,
        text: 'If activated by Thanos, add 1 damage to all mystic and cosmic heroes in this sector.',
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
                if (assetCards[c].type === 'green' || assetCards[c].type === 'purple') {
                    if (game.cards[c].health > 0) {
                        await syncSetGameObject(args.lobbyID, game, `cards/${c}/health`, game.cards[c].health-1)
                    }
                }
            }
            console.log('General Outrider (green purple) ability activated')
        }
    },
    {
        name: 'Cull Obsidian',
        maxHP: 3,
        cost: {combat: 2, tech: 0, mystic: 2, cosmic: 0},
        type: 'villain',
        abilityEvent: AbilityEvent.VILLAIN,
        text: 'If activated by Thanos, add 1 damage to 2 random heroes in each team.',
        icon: 'unset',
        checkValid: (game, args) => {
            return true
        },
        activate: async (game, args) => {
            for (let p = 1; p <= game.players.playerNum; p++) {
                let pCards = game.players[p].cards
                if (!pCards) continue
                if (pCards.length === 1) {
                    await syncSetGameObject(args.lobbyID, game, `cards/${pCards[0]}/health`, game.cards[pCards[0]].health-1)
                } else {
                    let randPCards = shuffleArray(pCards)
                    if (game.cards[randPCards[0]].health > 0) {
                        await syncSetGameObject(args.lobbyID, game, `cards/${randPCards[0]}/health`, game.cards[randPCards[0]].health-1)
                    }
                    if (game.cards[randPCards[1]].health > 0) {
                        await syncSetGameObject(args.lobbyID, game, `cards/${randPCards[1]}/health`, game.cards[randPCards[1]].health-1)
                    }
                }
            }
            console.log('Cull ability activated')
        }
    },
    {
        name: 'Proxima Midnight',
        maxHP: 3,
        cost: {combat: 2, tech: 0, mystic: 0, cosmic: 2},
        type: 'villain',
        abilityEvent: AbilityEvent.VILLAIN,
        text: 'If activated by Thanos, add 1 damage to all heroes in the active team.',
        icon: 'unset',
        checkValid: (game, args) => {
            return true
        },
        activate: async (game, args) => {
            let pCards = game.players[game.currentPlayer].cards
            for (let c of pCards) {
                if (game.cards[c].health > 0) {
                    await syncSetGameObject(args.lobbyID, game, `cards/${c}/health`, game.cards[c].health-1)
                }
            }
            console.log('Proxima ability activated')
        }
    },
    {
        name: 'Ebony Maw',
        maxHP: 3,
        cost: {combat: 0, tech: 1, mystic: 1, cosmic: 1},
        type: 'villain',
        abilityEvent: AbilityEvent.VILLAIN,
        text: 'If activated by Thanos, reroll the infinity stone die.',
        icon: 'unset',
        checkValid: (game, args) => {
            return true
        },
        activate: async (game, args) => {
            await args.rollStoneDie(game)
            console.log('Maw ability activated')
        }
    },
    {
        name: 'Corvus Glaive',
        maxHP: 3,
        cost: {combat: 2, tech: 2, mystic: 0, cosmic: 0},
        type: 'villain',
        abilityEvent: AbilityEvent.VILLAIN,
        text: 'If activated by Thanos, add 1 damage to all heroes in the clockwise sector.',
        icon: 'unset',
        checkValid: (game, args) => {
            return true
        },
        activate: async (game, args) => {
            let cwSector = (args.sector === 3 ? 0 : args.sector+1)
            let targets = game.table.sectors[cwSector]
            if (game.table.playerSector === cwSector) {
                targets.push(...game.players[game.currentPlayer].cards)
            }

            for (let c of targets) {
                if (assetCards[c].type !== 'villain') {
                    if (game.cards[c].health > 0) {
                        await syncSetGameObject(args.lobbyID, game, `cards/${c}/health`, game.cards[c].health-1)
                    }
                }
            }
            
            console.log('Corvus ability activated')
        }
    },
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},

    /* TEST ASSETS */
    {
        type: 'red'
    },
    {
        type: 'blue'
    },
    {
        type: 'green'
    },
    {
        type: 'purple'
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
