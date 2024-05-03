import { createContext } from "react";

/* Provided in App */
// ID of the current game lobby
export const LobbyContextApp = createContext()
// Turn-based events to be read instead of many individual listeners to data
export const GameEventContextApp = createContext()
