import { useState } from "react";

function useAlerts() {
  const [alerts, setAlerts] = useState(() => []);
  const addAlert = (a) => {
    const id = crypto.randomUUID();
    const wrap = document.getElementById("alert-container")
    const alert = { ...a, id };
    setAlerts((prev) => [...prev, alert]);
    if (wrap) wrap.scrollTo({ behavior: 'smooth', top: wrap.offsetHeight });
  };
  const removeAlert = (id) => setAlerts((prev) => prev.filter(al => al.id !== id));
  const removeAllAlerts = () => setAlerts(() => [])
  return { alerts, addAlert, removeAlert, removeAllAlerts };
}

export default useAlerts;