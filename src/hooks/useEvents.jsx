import { useCallback, useEffect, useMemo } from "react";
import { useLocalStorage } from "./useStorage";
import { EVENTS_NAME } from '../utils'

function useEvents(key = EVENTS_NAME) {
  const [events, setEvents, removeLsEvents] = useLocalStorage(EVENTS_NAME, []);
  const urgencyRequests = useMemo(() => {
    const grouped = {
      urgentImportant: [],
      notUrgentImportant: [],
      urgentNotImportant: [],
      notUrgentNotImportant: [],
      undetermined: []
    };
    for (const evt of events) {
      switch (evt?.priority?.index) {
        case 0: grouped.urgentImportant.push(evt); break;
        case 1: grouped.notUrgentImportant.push(evt); break;
        case 2: grouped.urgentNotImportant.push(evt); break;
        case 3: grouped.notUrgentNotImportant.push(evt); break;
        default: grouped.undetermined.push(evt); break;
      }
    }
    return grouped;
  }, [events]);
  useEffect(() => {
    localStorage.setItem(`${key}Urgency`, JSON.stringify(urgencyRequests));
  }, [key, urgencyRequests]);
  const saveEvent = useCallback((evt) => {
    const prepared = { ...evt, id: evt.id ?? crypto.randomUUID() };
    setEvents(prev => [...prev, prepared]);
  }, [setEvents]);
  const saveManyEvents = useCallback((evts) => {
    const recId = crypto.randomUUID();
    const prepared = evts.map(evt => ({ ...evt, id: evt.id ?? crypto.randomUUID(), recId }));
    setEvents(prev => [...prev, ...prepared]);
  }, [setEvents]);
  const removeEvent = useCallback((evtId) => { setEvents(prev => prev.filter(evt => evt.id !== evtId) ); }, [setEvents]);
  const removeRecurrent = useCallback((recId) => { setEvents(prev => prev.filter(evt => evt.recId !== recId) ); }, [setEvents]);
  const clearEvents = useCallback(() => { setEvents(() => []); }, [setEvents]);
  const updateEvent = useCallback((id, newEvent) => {
    console.log("UPDATE EVENT DATA", { id, newEvent });
    setEvents(prev => prev.map(evt => evt.id === id ? newEvent : evt ));
  }, [setEvents]);
  const updateRecurrent = useCallback((recId, newEvent) => {
    setEvents(prev => prev.map(evt => evt.recId === recId ? {
      ...newEvent, id: evt.id, recId: evt.recId, start: evt.start, end: evt.end
    } : evt));
  }, [setEvents]);

  const evaluateEvents = useCallback(() => { return urgencyRequests; }, [urgencyRequests]);
  const extrapolateForRemoval = useCallback((evtIds) => { setEvents(prev => prev.filter(evt => !evtIds.includes(evt.id)) ); }, [setEvents]);

  const removePastEvents = () => {
    const now = Date.now();
    setEvents(prev => prev.filter(ev => new Date(ev.end).getTime() >= now));
  };

  const removeCompletedEvents = () => setEvents(prev => prev.filter(ev => !ev.completed));

  return {
    events,
    setEvents,
    saveEvent,
    saveManyEvents,
    removeEvent,
    removeRecurrent,
    clearEvents,
    updateEvent,
    updateRecurrent,
    extrapolateForRemoval,
    evaluateEvents,
    urgencyRequests,
    removeLsEvents,
    removePastEvents,
    removeCompletedEvents
  };
}

export default useEvents;