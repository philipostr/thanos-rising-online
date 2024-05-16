import { createContext } from "react"

/* =========================================
   ============ Provided in App ============ 
   ========================================= */
// The ID of the current lobby, and a function to set it
// [string, function(string)]
export const LobbyContextApp = createContext()
// Used to signal ErrorCard of a new message
// function(string)
export const ErrorMessageContextApp = createContext()


/* =========================================
   ======== Provided in GameScreen ========= 
   ========================================= */
// The ID of the player (not the user. These are different values)
// int
export const PlayerIDContextGameScreen = createContext()


/* =========================================
   =========== Provided in Game ============ 
   ========================================= */
// Overall information about a game and a lobby that will no longer be changed
// in the duration of the game. Consider this a constant, and it will never
// cause rerenders.
// {lobbyID: int, lobbyRefString: string, playerID: int, roles: {1:string, 2:string, 3:string, 4:string}}
export const FinalGameDataContextGame = createContext()


/* =========================================
   ======== Game-Related Constants ========= 
   ========================================= */
export const roles = ['red', 'blue', 'green', 'purple']
