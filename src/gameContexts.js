import { createContext } from "react"

/* =========================================
   ============ Provided in App ============ 
   ========================================= */
// Information about the current lobby
// Data shape provided in src/App.js for state `lobby`
export const LobbyContextApp = createContext()
// Turn-based events to be read instead of many individual listeners to data
// string
export const GameEventContextApp = createContext()
// Used to signal ErrorCard of a new message
// string
export const ErrorMessageContextApp = createContext()


/* =========================================
   ======== Game-Related Constants ========= 
   ========================================= */
export const roles = ['red', 'blue', 'green', 'purple']
