import { useEffect, useState } from "react";
import { useLocalStorage } from "./useStorage";
import { EVENTS_NAME } from '../utils'

const initStateUrgency = {
  urgentImportant: [],
  notUrgentImportant: [],
  urgentNotImportant: [],
  notUrgentNotImportant: [],
  undetermined: []
}

function useEvents(key = EVENTS_NAME) {
  const [events, setEvents] = useState(() => {
    if (localStorage.getItem("calendarEvents"))
      return JSON.parse(localStorage.getItem("calendarEvents"));
    return [];
  });
  const [urgencyRequests, setUrgencyRequests] = useState(() => {
    if (localStorage.getItem(`${key}Urgency`))
      return JSON.parse(localStorage.getItem(`${key}Urgency`));
    return initStateUrgency;
  });
  const [lsUrgencyRequests, setLsUrgencyRequests] = useState(`${key}Urgency`, initStateUrgency);
  const [lsEvents, setLsEvents, removelsEvents] = useLocalStorage(key, []);
  useEffect(() => {
    if (events.length !== lsEvents.length) setEvents(() => lsEvents)
    if (urgencyRequests.length !== lsUrgencyRequests.length) setUrgencyRequests(() => lsUrgencyRequests);
  }, [events.length, lsEvents.length, lsEvents, urgencyRequests, lsUrgencyRequests])
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
    const nurgImps = events.filter(evt => evt?.priority?.index === 1);
    const urgNimps = events.filter(evt => evt?.priority?.index === 2);
    const nurgNimps = events.filter(evt => evt?.priority?.index === 3);
    const nonAligned = events.filter(evt => !evt?.priority || !evt?.priority?.index != null || evt?.priority?.index === 4);
    setUrgencyRequests(() => ({
      urgentImportant: urgImps,
      notUrgentImportant: nurgImps,
      urgentNotImportant: urgNimps,
      notUrgentNotImportant: nurgNimps,
      undetermined: nonAligned
    }));
    setLsUrgencyRequests(() => ({
      urgentImportant: urgImps,
      notUrgentImportant: nurgImps,
      urgentNotImportant: urgNimps,
      notUrgentNotImportant: nurgNimps,
      undetermined: nonAligned
    }));
  }
  const extrapolateForRemoval = (evtIds) => {
    const filter = obj => !evtIds.includes(obj.id)
    setUrgencyRequests((prev) => ({ ...prev, notUrgentNotImportant: [] }));
    setEvents(prev => prev.filter(filter))
    setLsEvents(prev => prev.filter(filter))
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
    urgencyRequests,
    lsUrgencyRequests,
    extrapolateForRemoval
  }
}

export default useEvents;