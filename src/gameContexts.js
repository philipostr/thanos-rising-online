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


/* =========================================
   ======== Game-Related Constants ========= 
   ========================================= */
export const roles = ['red', 'blue', 'green', 'purple']
