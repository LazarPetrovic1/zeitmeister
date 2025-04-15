import { createContext } from "react";
import useAlerts from "../hooks/useAlerts";

export const AlertContext = createContext();

export function AlertProvider({ children }) {
  const { alerts, addAlert, removeAlert, removeAllAlerts } = useAlerts();
  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, removeAllAlerts }}>{children}</AlertContext.Provider>
  )
}