import { useEffect, useState } from "react";
import { useLocalStorage } from "./useStorage";
import { EVENTS_NAME } from '../utils'

function useEvents(key = EVENTS_NAME) {
  const [events, setEvents] = useState(() => {
    if (localStorage.getItem("calendarEvents"))
      return JSON.parse(localStorage.getItem("calendarEvents"));
    return [];
  });
  const [urgencyRequests, setUrgencyRequests] = useState(() => null);
  const [lsEvents, setLsEvents, removelsEvents] = useLocalStorage(key, "[]");
  useEffect(() => {
    if (events.length !== lsEvents.length) setEvents(() => lsEvents)
  }, [events.length, lsEvents.length, lsEvents])
  const saveEvent = (evt) => {
    setEvents(prev => [...prev, evt]);
    setLsEvents((prev) => [...prev, evt]);
  }
  const saveManyEvents = (evts) => {
    const recurrentId = crypto.randomUUID();
    const events = evts.map(evt => ({ ...evt, recId: recurrentId }))
    for (const evt of events) saveEvent(evt);
  }
  const removeEvent = (evtId) => {
    setEvents(prev => prev.filter(item => item.id !== evtId));
    setLsEvents(prev => prev.filter(item => item.id !== evtId));
  }
  const removeRecurrent = (recId) => {
    const filter = (evt) => evt.recId !== recId;
    setEvents(prev => prev.filter(filter));
    setLsEvents(prev => prev.filter(filter));
  }
  const clearEvents = () => {
    setEvents(() => []);
    setLsEvents(() => []);
  }
  const updateEvent = (id, newEvent) => {
    const mapper = (evt) => evt.id === id ? newEvent : evt
    setEvents(prev => prev.map(mapper));
    setLsEvents(prev => prev.map(mapper));
  }
  const updateRecurrent = (recId, newEvent) => {
    const mapper = (evt) => evt.recId === recId ? ({ ...newEvent, start: evt.start, end: evt.end }) : evt;
    setEvents(prev => prev.map(mapper));
    setLsEvents(prev => prev.map(mapper));
  }
  const evaluateEvents = () => {
    const urgImps = events.filter(evt => evt?.priority?.index === 0);
    const nurgImp = events.filter(evt => evt?.priority?.index === 1);
    const urgNimp = events.filter(evt => evt?.priority?.index === 2);
    const nurgNimp = events.filter(evt => evt?.priority?.index === 3);
    const nonAligned = events.filter(evt => !evt?.priority && !evt?.priority?.index != null);
    setUrgencyRequests(() => ({
      urgentImportant: urgImps,
      notUrgentImportant: nurgImp,
      urgentNotImportant: urgNimp,
      notUrgentNotImportant: nurgNimp,
      undetermined: nonAligned
    }))
  }
  return {
    events,
    setEvents,
    saveEvent,
    removeEvent,
    lsEvents,
    removelsEvents,
    saveManyEvents,
    clearEvents,
    removeRecurrent,
    updateEvent,
    updateRecurrent,
    evaluateEvents,
    urgencyRequests
  }
}

export default useEvents;