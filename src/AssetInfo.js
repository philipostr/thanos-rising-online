import { syncSetGameObject } from 'firebaseConfig'
import { shuffleArray, isDamaged } from 'util'

export const AbilityEvent = Object.freeze({
    VILLAIN: 0, PRE_ROLL: 1, MID_ROLL: 2, POST_ROLL: 3, POST_DAMAGE: 4
})

/* This is the static information about every asset card in the game. It includes the simple values
   of `name`, `maxHP`, `cost` (how many values to damage/recruit), `type` (card's affiliation/team),
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
                    await changeCardHealth(args.lobbyID, game, c, -1)
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
                    await changeCardHealth(args.lobbyID, game, c, -1)
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
                    await changeCardHealth(args.lobbyID, game, c, -1)
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
                    await changeCardHealth(args.lobbyID, game, c, -1)
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
                    await changeCardHealth(args.lobbyID, game, c, -1)
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
                    await changeCardHealth(args.lobbyID, game, c, -1)
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
                    await changeCardHealth(args.lobbyID, game, pCards[0], -1)
                } else {
                    let randPCards = shuffleArray(pCards)
                    await changeCardHealth(args.lobbyID, game, randPCards[0], -1)
                    await changeCardHealth(args.lobbyID, game, randPCards[1], -1)
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
                await changeCardHealth(args.lobbyID, game, c, -1)
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
                    await changeCardHealth(args.lobbyID, game, c, -1)
                }
            }
            
            console.log('Corvus ability activated')
        }
    },
    {
        name: 'Black Widow',
        maxHP: 4,
        cost: {combat: 4, tech: 0, mystic: 0, cosmic: 0},
        type: 'red',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'For 2 combat value, draw a bonus token and remove 1 damage from any hero.',
        icon: 'unset',
        checkValid: (game, args) => {
            if (game.turn.values.combat < 2) return false
            for (let c = 0; c < assetCards.length; c++) {
                if (assetCards[c].type !== 'villain' && isDamaged(game, c)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            await args.drawToken(args.lobbyID, game)
            let selection = await args.activateCardSelector({
                game: game, sectors: [1,2,3], heroes: true, players: true, damaged: true, maxSelect: 1,
                activatedBy: args.id
            })

            if (selection.length === 1) {
                await changeCardHealth(args.lobbyID, game, selection[0], 1)
            }
            
            console.log('Black Widow ability activated')
        }
    },
    {
        name: 'Mantis',
        maxHP: 4,
        cost: {combat: 0, tech: 0, mystic: 2, cosmic: 1},
        type: 'green',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'For 1 mystic value, remove 2 damage from a single hero.',
        icon: 'unset',
        checkValid: (game, args) => {
            if (game.turn.values.mystic < 1) return false
            for (let c = 0; c < assetCards.length; c++) {
                if (assetCards[c].type !== 'villain' && isDamaged(game, c)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateCardSelector({
                game: game, sectors: [1,2,3], heroes: true, players: true, damaged: true, maxSelect: 1,
                activatedBy: args.id
            })

            if (selection.length === 1) {
                await changeCardHealth(args.lobbyID, game, selection[0], 2)
            }

            console.log('Mantis ability activated')
        }
    },
    {
        name: 'Loki',
        maxHP: 5,
        cost: {combat: 0, tech: 0, mystic: 3, cosmic: 2},
        type: 'green',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'Roll an extra green or purple die.',
        icon: 'unset',
        checkValid: (game, args) => {
            return true
        },
        activate: async (game, args) => {
            let selection = await args.activateDiceSelector({
                green: 1, purple: 1, maxSelect: 1, activatedBy: args.id
            })

            const currDice = game.turn.dice
            currDice.red += selection.red
            currDice.blue += selection.blue
            currDice.green += selection.green
            currDice.purple += selection.purple
            await syncSetGameObject(args.lobbyID, game, `turn/dice`, currDice)

            console.log('Loki ability activated')
        }
    },
    {
        name: 'Bucky Barnes',
        maxHP: 5,
        cost: {combat: 5, tech: 0, mystic: 0, cosmic: 0},
        type: 'red',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'If a tech hero is on the team, roll an extra blue die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c of game.players[game.currentPlayer].cards) {
                if (assetCards[c].type === 'blue') return true
            }

            return false
        },
        activate: async (game, args) => {
            await syncSetGameObject(args.lobbyID, game, `turn/dice/blue`, game.turn.dice.blue+1)

            console.log('Bucky ability activated')
        }
    },
    {
        name: 'Hulk',
        maxHP: 7,
        cost: {combat: 7, tech: 0, mystic: 0, cosmic: 0},
        type: 'red',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'Roll an extra red die for every 2 missing health from Hulk.',
        icon: 'unset',
        checkValid: (game, args) => {
            return true
        },
        activate: async (game, args) => {
            await syncSetGameObject(args.lobbyID, game, `turn/dice/red`, game.turn.dice.red + Math.floor((7-game.cards[14].health)/2))

            console.log('Hulk ability activated')
        }
    },
    {
        name: 'Rocket',
        maxHP: 4,
        cost: {combat: 2, tech: 1, mystic: 0, cosmic: 1},
        type: 'purple',
        abilityEvent: AbilityEvent.MID_ROLL,
        text: 'Change 1 tech or cosmic face to any other face of the same die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let face of game.turn.faces) {
                if (['tech', 'tech2', 'cosmic', 'cosmic2'].includes(face.face)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let newFaces = await args.activateFaceChanger({
                game: game, filter: (face) => { return ['tech', 'tech2', 'cosmic', 'cosmic2'].includes(face.face) },
                maxSelect: 1, activatedBy: args.id
            })

            await syncSetGameObject(args.lobbyID, game, 'turn/faces', newFaces)

            console.log('Rocket ability activated')
        }
    },
    {
        name: 'Wong',
        maxHP: 4,
        cost: {combat: 0, tech: 0, mystic: 2, cosmic: 0},
        type: 'green',
        abilityEvent: AbilityEvent.MID_ROLL,
        text: 'Reroll 1 die before assigning begins.',
        icon: 'unset',
        checkValid: (game, args) => {
            return true
        },
        activate: async (game, args) => {
            const selection = await args.activateFaceSelector({
                game: game, maxSelect: 1, activatedBy: args.id
            })
            await args.rollPowerDice(game, selection)

            console.log('Wong ability activated')
        }
    },
    {
        name: 'Dr. Strange',
        maxHP: 6,
        cost: {combat: 3, tech: 0, mystic: 2, cosmic: 0},
        type: 'green',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'If another mystic hero is on the team, roll an extra green or purple die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c of game.players[game.currentPlayer].cards) {
                if (c !== args.id && assetCards[c].type === 'green') return true
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateDiceSelector({
                green: 1, purple: 1, maxSelect: 1, activatedBy: args.id
            })

            const currDice = game.turn.dice
            currDice.red += selection.red
            currDice.blue += selection.blue
            currDice.green += selection.green
            currDice.purple += selection.purple
            await syncSetGameObject(args.lobbyID, game, `turn/dice`, currDice)

            console.log('Dr. Strange ability activated')
        }
    },
    {
        name: 'Captain America',
        maxHP: 6,
        cost: {combat: 6, tech: 0, mystic: 0, cosmic: 0},
        type: 'red',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'If another combat hero is on the team, roll an extra red or blue die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c of game.players[game.currentPlayer].cards) {
                if (c !== args.id && assetCards[c].type === 'red') return true
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateDiceSelector({
                red: 1, blue: 1, maxSelect: 1, activatedBy: args.id
            })

            const currDice = game.turn.dice
            currDice.red += selection.red
            currDice.blue += selection.blue
            currDice.green += selection.green
            currDice.purple += selection.purple
            await syncSetGameObject(args.lobbyID, game, `turn/dice`, currDice)

            console.log('Captain America ability activated')
        }
    },
    {
        name: 'Black Panther',
        maxHP: 6,
        cost: {combat: 2, tech: 1, mystic: 1, cosmic: 0},
        type: 'blue',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'If another tech hero is on the team, roll an extra blue or green die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c of game.players[game.currentPlayer].cards) {
                if (c !== args.id && assetCards[c].type === 'blue') return true
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateDiceSelector({
                blue: 1, green: 1, maxSelect: 1, activatedBy: args.id
            })

            const currDice = game.turn.dice
            currDice.red += selection.red
            currDice.blue += selection.blue
            currDice.green += selection.green
            currDice.purple += selection.purple
            await syncSetGameObject(args.lobbyID, game, `turn/dice`, currDice)

            console.log('Black Panther ability activated')
        }
    },
    {
        name: 'Gamora',
        maxHP: 6,
        cost: {combat: 3, tech: 0, mystic: 0, cosmic: 2},
        type: 'purple',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'If another cosmic hero is on the team, roll an extra red or purple die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c of game.players[game.currentPlayer].cards) {
                if (c !== args.id && assetCards[c].type === 'purple') return true
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateDiceSelector({
                red: 1, purple: 1, maxSelect: 1, activatedBy: args.id
            })

            const currDice = game.turn.dice
            currDice.red += selection.red
            currDice.blue += selection.blue
            currDice.green += selection.green
            currDice.purple += selection.purple
            await syncSetGameObject(args.lobbyID, game, `turn/dice`, currDice)

            console.log('Dr. Strange ability activated')
        }
    },
    {
        name: 'Groot',
        maxHP: 4,
        cost: {combat: 0, tech: 0, mystic: 1, cosmic: 2},
        type: 'purple',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'For 1 cosmic value, remove 2 damage from a single hero.',
        icon: 'unset',
        checkValid: (game, args) => {
            if (game.turn.values.cosmic < 1) return false
            for (let c = 0; c < assetCards.length; c++) {
                if (assetCards[c].type !== 'villain' && isDamaged(game, c)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateCardSelector({
                game: game, sectors: [1,2,3], heroes: true, players: true, damaged: true, maxSelect: 1,
                activatedBy: args.id
            })

            if (selection.length === 1) {
                await changeCardHealth(args.lobbyID, game, selection[0], 2)
            }

            console.log('Groot ability activated')
        }
    },
    {
        name: 'Star-Lord',
        maxHP: 5,
        cost: {combat: 2, tech: 0, mystic: 1, cosmic: 2},
        type: 'purple',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'If a mystic hero is on the team, roll an extra green die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c of game.players[game.currentPlayer].cards) {
                if (assetCards[c].type === 'green') return true
            }

            return false
        },
        activate: async (game, args) => {
            await syncSetGameObject(args.lobbyID, game, `turn/dice/green`, game.turn.dice.green+1)

            console.log('Star-Lord ability activated')
        }
    },
    {
        name: 'Iron Man',
        maxHP: 5,
        cost: {combat: 2, tech: 3, mystic: 0, cosmic: 0},
        type: 'blue',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'For 2 tech value, remove an infinity stone counter.',
        icon: 'unset',
        checkValid: (game, args) => {
            if (game.turn.values.tech < 2) return false
            for (let c = 0; c < assetCards.length; c++) {
                if (assetCards[c].type !== 'villain' && isDamaged(game, c)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateStoneViewer({
                game: game, selectable: true, includeZero: false, activatedBy: args.id
            })

            if (selection !== '') {
                await syncSetGameObject(args.lobbyID, game, `table/infinityStones/${selection}`, game.table.infinityStones[selection]-1)
            }

            console.log('Iron Man ability activated')
        }
    },
    {
        name: 'Iron Spider',
        maxHP: 4,
        cost: {combat: 3, tech: 1, mystic: 0, cosmic: 0},
        type: 'blue',
        abilityEvent: AbilityEvent.POST_DAMAGE,
        text: 'Remove 1 damage from any hero for every damage dealt to a villain this turn.',
        icon: 'unset',
        checkValid: (game, args) => {
            if (game.turn.damageDealt === 0) return false
            for (let c = 0; c < assetCards.length; c++) {
                if (assetCards[c].type !== 'villain' && isDamaged(game, c)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateCardSelector({
                game: game, sectors: [1,2,3], heroes: true, players: true, damaged: true, maxSelect: game.turn.damageDealt,
                activatedBy: args.id
            })

            for (let card of selection) {
                await changeCardHealth(args.lobbyID, game, card, 1)
            }

            console.log('Iron Spider ability activated')
        }
    },
    {
        name: 'Hulkbuster',
        maxHP: 5,
        cost: {combat: 3, tech: 2, mystic: 0, cosmic: 0},
        type: 'blue',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'Roll an extra red or blue die.',
        icon: 'unset',
        checkValid: (game, args) => {
            return true
        },
        activate: async (game, args) => {
            let selection = await args.activateDiceSelector({
                red: 1, blue: 1, maxSelect: 1, activatedBy: args.id
            })

            const currDice = game.turn.dice
            currDice.red += selection.red
            currDice.blue += selection.blue
            currDice.green += selection.green
            currDice.purple += selection.purple
            await syncSetGameObject(args.lobbyID, game, `turn/dice`, currDice)

            console.log('Hulkbuster ability activated')
        }
    },
    {
        name: 'War Machine',
        maxHP: 4,
        cost: {combat: 3, tech: 2, mystic: 0, cosmic: 0},
        type: 'blue',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'If a combat hero is on the team, roll an extra red die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c of game.players[game.currentPlayer].cards) {
                if (assetCards[c].type === 'red') return true
            }

            return false
        },
        activate: async (game, args) => {
            await syncSetGameObject(args.lobbyID, game, `turn/dice/red`, game.turn.dice.red+1)

            console.log('War machine ability activated')
        }
    },
    {
        name: 'Shuri',
        maxHP: 4,
        cost: {combat: 2, tech: 1, mystic: 0, cosmic: 0},
        type: 'blue',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'For 1 tech value, choose 1 of 2 bonus tokens.',
        icon: 'unset',
        checkValid: (game, args) => {
            if (game.turn.values.tech < 1) return false

            return true
        },
        activate: async (game, args) => {
            let selection = await args.activateTokenSelector({
                amount: 2, maxSelect: 1, activatedBy: args.id
            })

            if (selection.length === 1) {
                syncSetGameObject(args.lobbyID, game, 'tokens', [...game.tokens, selection[0]])
            }

            console.log('Shuri ability activated')
        }
    },
    {
        name: 'Okoye',
        maxHP: 4,
        cost: {combat: 1, tech: 1, mystic: 1, cosmic: 0},
        type: 'red',
        abilityEvent: AbilityEvent.MID_ROLL,
        text: 'Change 1 combat face to any other face of the same die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let face of game.turn.faces) {
                if (['combat', 'combat2'].includes(face.face)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let newFaces = await args.activateFaceChanger({
                game: game, filter: (face) => { return ['combat', 'combat2'].includes(face.face) },
                maxSelect: 1, activatedBy: args.id
            })

            await syncSetGameObject(args.lobbyID, game, 'turn/faces', newFaces)

            console.log('Okoye ability activated')
        }
    },
    {
        name: 'Hawkeye',
        maxHP: 4,
        cost: {combat: 3, tech: 0, mystic: 0, cosmic: 0},
        type: 'red',
        abilityEvent: AbilityEvent.MID_ROLL,
        text: 'Reroll 1 die before assigning begins.',
        icon: 'unset',
        checkValid: (game, args) => {
            return true
        },
        activate: async (game, args) => {
            const selection = await args.activateFaceSelector({
                game: game, maxSelect: 1, activatedBy: args.id
            })
            await args.rollPowerDice(game, selection)

            console.log('Hawkeye ability activated')
        }
    },
    {
        name: 'Thor',
        maxHP: 5,
        cost: {combat: 2, tech: 0, mystic: 2, cosmic: 1},
        type: 'green',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'If a cosmic hero is on the team, roll an extra purple die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c of game.players[game.currentPlayer].cards) {
                if (assetCards[c].type === 'purple') return true
            }

            return false
        },
        activate: async (game, args) => {
            await syncSetGameObject(args.lobbyID, game, `turn/dice/purple`, game.turn.dice.purple+1)

            console.log('Thor ability activated')
        }
    },
    {
        name: 'The Collector',
        maxHP: 4,
        cost: {combat: 2, tech: 0, mystic: 2, cosmic: 0},
        type: 'purple',
        abilityEvent: AbilityEvent.MID_ROLL,
        text: 'Change 1 mystic or cosmic face to any other face of the same die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let face of game.turn.faces) {
                if (['mystic', 'mystic2', 'cosmic', 'cosmic2'].includes(face.face)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let newFaces = await args.activateFaceChanger({
                game: game, filter: (face) => { return ['mystic', 'mystic2', 'cosmic', 'cosmic2'].includes(face.face) },
                maxSelect: 1, activatedBy: args.id
            })

            await syncSetGameObject(args.lobbyID, game, 'turn/faces', newFaces)

            console.log('The collector ability activated')
        }
    },
    {
        name: 'Quinjet',
        maxHP: 4,
        cost: {combat: 3, tech: 1, mystic: 0, cosmic: 0},
        type: 'red',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'Once per turn, remove 1 damage from a single hero.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c = 0; c < assetCards.length; c++) {
                if (assetCards[c].type !== 'villain' && isDamaged(game, c)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateCardSelector({
                game: game, sectors: [1,2,3], heroes: true, players: true, damaged: true, maxSelect: 1,
                activatedBy: args.id
            })

            if (selection.length === 1) {
                await changeCardHealth(args.lobbyID, game, selection[0], 1)
            }

            console.log('Quinjet ability activated')
        }
    },
    {
        name: 'Vision',
        maxHP: 4,
        cost: {combat: 0, tech: 2, mystic: 2, cosmic: 0},
        type: 'green',
        abilityEvent: AbilityEvent.MID_ROLL,
        text: 'Change 1 tech or mystic face to any other face of the same die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let face of game.turn.faces) {
                if (['tech', 'tech2', 'mystic', 'mystic2'].includes(face.face)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let newFaces = await args.activateFaceChanger({
                game: game, filter: (face) => { return ['tech', 'tech2', 'mystic', 'mystic2'].includes(face.face) },
                maxSelect: 1, activatedBy: args.id
            })

            await syncSetGameObject(args.lobbyID, game, 'turn/faces', newFaces)

            console.log('Vision ability activated')
        }
    },
    {
        name: 'Friday',
        maxHP: 4,
        cost: {combat: 0, tech: 2, mystic: 0, cosmic: 0},
        type: 'blue',
        abilityEvent: AbilityEvent.MID_ROLL,
        text: 'Change 1 tech face to any other face of the same die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let face of game.turn.faces) {
                if (['tech', 'tech2'].includes(face.face)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let newFaces = await args.activateFaceChanger({
                game: game, filter: (face) => { return ['tech', 'tech2'].includes(face.face) },
                maxSelect: 1, activatedBy: args.id
            })

            await syncSetGameObject(args.lobbyID, game, 'turn/faces', newFaces)

            console.log('Friday ability activated')
        }
    },
    {
        name: 'Drax',
        maxHP: 5,
        cost: {combat: 4, tech: 0, mystic: 0, cosmic: 1},
        type: 'purple',
        abilityEvent: AbilityEvent.PRE_ROLL,
        text: 'If a villain is in the deployed sector, roll an extra red die.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c of game.table.sectors[game.table.playerSector]) {
                if (assetCards[c].type === 'villain') return true
            }

            return false
        },
        activate: async (game, args) => {
            await syncSetGameObject(args.lobbyID, game, `turn/dice/red`, game.turn.dice.red+1)

            console.log('Drax ability activated')
        }
    },
    {
        name: 'Royal Talon Fighter',
        maxHP: 4,
        cost: {combat: 1, tech: 2, mystic: 0, cosmic: 0},
        type: 'blue',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'Once per turn, remove 1 damage from a single hero.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c = 0; c < assetCards.length; c++) {
                if (assetCards[c].type !== 'villain' && isDamaged(game, c)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateCardSelector({
                game: game, sectors: [1,2,3], heroes: true, players: true, damaged: true, maxSelect: 1,
                activatedBy: args.id
            })

            if (selection.length === 1) {
                await changeCardHealth(args.lobbyID, game, selection[0], 1)
            }

            console.log('Royal talon fighter ability activated')
        }
    },
    {
        name: 'Falcon',
        maxHP: 4,
        cost: {combat: 3, tech: 1, mystic: 0, cosmic: 0},
        type: 'blue',
        abilityEvent: AbilityEvent.POST_DAMAGE,
        text: 'If damage was dealt to a villain this turn, draw a bonus token.',
        icon: 'unset',
        checkValid: (game, args) => {
            if (game.turn.damageDealt === 0) return false
            
            return true
        },
        activate: async (game, args) => {
            await args.drawToken(args.lobbyID, game)

            console.log('Falcon ability activated')
        }
    },
    {
        name: 'Statesman',
        maxHP: 4,
        cost: {combat: 0, tech: 1, mystic: 2, cosmic: 0},
        type: 'green',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'Once per turn, remove 1 damage from a single hero.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c = 0; c < assetCards.length; c++) {
                if (assetCards[c].type !== 'villain' && isDamaged(game, c)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateCardSelector({
                game: game, sectors: [1,2,3], heroes: true, players: true, damaged: true, maxSelect: 1,
                activatedBy: args.id
            })

            if (selection.length === 1) {
                await changeCardHealth(args.lobbyID, game, selection[0], 1)
            }

            console.log('Statesman ability activated')
        }
    },
    {
        name: 'Guardians\' Ship',
        maxHP: 4,
        cost: {combat: 0, tech: 1, mystic: 0, cosmic: 2},
        type: 'purple',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'Once per turn, remove 1 damage from a single hero.',
        icon: 'unset',
        checkValid: (game, args) => {
            for (let c = 0; c < assetCards.length; c++) {
                if (assetCards[c].type !== 'villain' && isDamaged(game, c)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateCardSelector({
                game: game, sectors: [1,2,3], heroes: true, players: true, damaged: true, maxSelect: 1,
                activatedBy: args.id
            })

            if (selection.length === 1) {
                await changeCardHealth(args.lobbyID, game, selection[0], 1)
            }

            console.log('Guardians\' ship ability activated')
        }
    },
    {
        name: 'Heimdall',
        maxHP: 4,
        cost: {combat: 2, tech: 0, mystic: 2, cosmic: 1},
        type: 'green',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'For 2 mystic value, add 1 damage to an undamaged villain.',
        icon: 'unset',
        checkValid: (game, args) => {
            if (game.turn.values.mystic < 2) return false
            for (let c = 0; c < assetCards.length; c++) {
                if (assetCards[c].type === 'villain' && !game.absent.values.contains(c) && !isDamaged(game, c)) {
                    return true
                }
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateCardSelector({
                game: game, sectors: [1,2,3], villains: true, undamaged: true, maxSelect: 1, activatedBy: args.id
            })

            if (selection.length === 1) {
                await changeCardHealth(args.lobbyID, game, selection[0], -1)
            }

            console.log('Heimdall ability activated')
        }
    },
    {
        name: 'Nebula',
        maxHP: 4,
        cost: {combat: 1, tech: 1, mystic: 0, cosmic: 2},
        type: 'purple',
        abilityEvent: AbilityEvent.POST_ROLL,
        text: 'For adding 1 damage to Nebula, remove an infinity stone counter.',
        icon: 'unset',
        checkValid: (game, args) => {
            if (game.cards[args.id].health === 0) return false
            for (let counter of Object.values(game.table.infinityStones)) {
                if (counter > 0) return true
            }

            return false
        },
        activate: async (game, args) => {
            let selection = await args.activateStoneViewer({
                game: game, selectable: true, includeZero: false, activatedBy: args.id
            })

            if (selection !== '') {
                await changeCardHealth(args.lobbyID, game, args.id, -1)
                await syncSetGameObject(args.lobbyID, game, `table/infinityStones/${selection}`, game.table.infinityStones[selection]-1)
            }

            console.log('Nebula ability activated')
        }
    },

    /* TEST ASSETS */
    {
        type: 'red',
        maxHP: 3
    },
    {
        type: 'blue',
        maxHP: 3
    },
    {
        type: 'green',
        maxHP: 3
    },
    {
        type: 'purple',
        maxHP: 3
    }
]

const changeCardHealth = async (lobbyID, game, card, healthChange) => {
    let newHealth = game.cards[card].health + healthChange
    if (newHealth > assetCards[card].maxHP) {
        newHealth = assetCards[card].maxHP
    } else if (newHealth < 0) {
        newHealth = 0
    }
    await syncSetGameObject(lobbyID, game, `cards/${card}/health`, newHealth)

    if (healthChange < 0 && assetCards[card].type === 'villain') {
        await syncSetGameObject(lobbyID, game, 'turn/damageDealt', -healthChange)
    }
}

const getValidInList = (game, event, args, list) => {
    let validCards = []

    for (let c of list) {
        if (assetCards[c].abilityEvent === event && checkValid(c, game, args)) {
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

export const checkValid = (card, game, args) => {
    return assetCards[card].checkValid(game, {...args, id: card})
}

export const activate = async (card, game, args) => {
    await assetCards[card].activate(game, {...args, id: card})
}
