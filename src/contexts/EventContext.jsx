import { createContext } from "react";
import useEvents from "../hooks/useEvents";

export const EventContext = createContext();

export function EventProvider({ children }) {
  const evt = useEvents();
  return ( <EventContext.Provider value={evt}>{children}</EventContext.Provider>)
}