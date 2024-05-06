import { createContext } from "react";

/* =========================================
   ============ Provided in App ============ 
   ========================================= */
// Information about the current lobby
export const LobbyContextApp = createContext()
// Turn-based events to be read instead of many individual listeners to data
export const GameEventContextApp = createContext()


/* =========================================
   ======== Game-Related Constants ========= 
   ========================================= */
export const roles = ['red', 'blue', 'green', 'purple']
