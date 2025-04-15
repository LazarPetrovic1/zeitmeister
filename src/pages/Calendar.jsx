import { Calendar as Cal, Views, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import { useCallback, useContext, useMemo, useState } from 'react';
import { MultiAddModal, MultihandlerEvent, NewEventModal, Spinner, ViewEventModal } from '../components';
import {
  combineDateAndTime,
  dailyUntilEndDate,
  dailyUntilEndOfMonth,
  dailyUntilEndOfWeek,
  dailyUntilFriday,
  parseISODate,
  stepToSlots,
  workDaysUntilEndOfMonth
} from '../utils';
import useEventListener from '../hooks/useEventListener';
import { AlertContext } from '../contexts/AlertContext';
import { EventContext } from '../contexts/EventContext';
let allViews = Object.keys(Views).map((k) => Views[k])
/**
 * 
 * @TODO
 * - The page is stable for now.
 * 
 * @DONE Add repeat task/event with exact start & end dates for every next day of the week (starting today)
 * @DONE Add repeat task/event with exact start & end dates for every next day of the work week (starting today, Mon - Fri)
 * @DONE Add repeat task/event with exact start & end dates for every next day of the month (starting today)
 * @DONE Add repeat task/event with exact start & end dates for every next work day of the month (starting today, Mon - Fri)
 * @DONE Add remove all events button
 * 1. Add remove repeated task
 * 
 */
function Calendar() {
  const { addAlert } = useContext(AlertContext);
  const { events, saveEvent, removeEvent, saveManyEvents, clearEvents, removeRecurrent } = useContext(EventContext);
  const [view, setView] = useState(() => Views.MONTH);
  const [date, setDate] = useState(() => new Date());
  const [showNewModal, setShowNewModal] = useState(() => false);
  const [showEvDetailsModal, setShowEvDetailsModal] = useState(() => false);
  const [title, setTitle] = useState(() => "");
  const [allDay, setAllDay] = useState(() => false);
  const [startDateTime, setStartDateTime] = useState(() => "")
  const [endDateTime, setEndDateTime] = useState(() => "")
  const [typeOfEvent, setTypeofEvent] = useState(() => "")
  const [description, setDescription] = useState(() => "")
  const [evDetails, setEvDetails] = useState(() => null);
  const [showMultiModal, setShowMultiModal] = useState(() => false);
  const [timetable, setTimetable] = useState(() => stepToSlots[5])
  const presentableEvents = useMemo(() => events && Array.isArray(events) ? events.map(evt => ({ ...evt, start: parseISODate(evt.start), end: parseISODate(evt.end) })) : [], [events]);
  const localizer = momentLocalizer(moment);
  const handleKeyPress = (event) => (event.key === 'p' && event.ctrlKey) ? setShowMultiModal(() => true) : null;
  const isLoading = !events || !Array.isArray(events);
  console.log("ISLOADING", isLoading);
  useEventListener('keydown', handleKeyPress)
  const handleSelectEvent = useCallback((event) => {
    setEvDetails(() => event);
    setShowEvDetailsModal(() => true)
  }, [])
  const handleSelectSlot = useCallback((dates) => {
    const { start, end } = dates;
    const [s, e] = [new Date(start), new Date(end)]
    setStartDateTime(() => s)
    setEndDateTime(() => e)
    setAllDay(() => s.getDate() < e.getDate())
    setShowNewModal(() => true)
  }, [])
  const addMultiple = (newItems) => { if (newItems.length < 1) return; for (const item of newItems) { saveEvent(item); addAlert({ msg: "Event successfully added.", msgType: "success" }); } }
  const submitEvent = useCallback((recurrence) => {
    if (!title || !startDateTime || !endDateTime || !typeOfEvent) return;
    const fn = recurrence === "weekly" ? dailyUntilEndOfWeek :
      recurrence === "workweek" ? dailyUntilFriday :
      recurrence === "monthly" ? dailyUntilEndOfMonth :
      recurrence === "workmonth" ? workDaysUntilEndOfMonth : null;
    if (recurrence === "daily") {
      const startDates = dailyUntilEndDate(new Date(startDateTime), new Date(endDateTime));
      let len = events.length;
      const newEvents = startDates.map((sd, i) => ({
        id: len + i,
        title, allDay, start: new Date(sd),
        end: new Date(combineDateAndTime({ start: new Date(sd), end: new Date(endDateTime) })),
        resource: typeOfEvent || "Other",
        description: `${description}
        (This is a repeating event)`
      }))
      saveManyEvents(newEvents);
      addAlert({ msg: "Event series successfully added.", msgType: "primary" })
    }
    if (recurrence && fn) {
      const startDates = fn(new Date(startDateTime));
      let len = events.length;
      const newEvents = startDates.map((sd, i) => {
        const end = new Date(combineDateAndTime({ start: new Date(sd), end: new Date(endDateTime) }));
        return {
          id: len + i, end,
          title, allDay,
          start: new Date(sd),
          resource: typeOfEvent || "Other",
          description: `${description}
          (This is a repeating event)`
        }
      })
      saveManyEvents(newEvents);
      addAlert({ msg: "Event series successfully added.", msgType: "primary" })
    }
    if (!recurrence) {
      const id = events.length
      const event = {
        id,
        title,
        allDay,
        start: new Date(startDateTime),
        end: new Date(endDateTime),
        resource: typeOfEvent || "Other",
        description: `${description}\n(This is a repeating event)`
      };
      // OVER HERE
      saveEvent(event);
      addAlert({ msg: "Event successfully added.", msgType: "success" })
    }
    setTitle(() => "")
    setAllDay(() => false)
    setStartDateTime(() => "")
    setEndDateTime(() => "")
    setTypeofEvent(() => "")
    setDescription(() => "")
    setShowNewModal(() => false)
    // eslint-disable-next-line
  }, [allDay, description, endDateTime, events.length, saveEvent, saveManyEvents, startDateTime, title, typeOfEvent])
  const removeRelatedEvents = (id) => {
    const ev = events.find(x => x.id === id);
    setShowEvDetailsModal(() => false)
    setEvDetails(() => null);
    removeRecurrent(ev.recId);
    addAlert({ msg: "Event series successfully removed.", msgType: "warning" });
  }
  return isLoading ? <Spinner /> : (
    <div className='pb-4'>
      <div className="my-2 d-flex gap-2 justify-content-between">
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="pe-2 fa-solid fa-timeline" /> Slot distribution
          </button>
          <ul className="dropdown-menu dropdown-menu-dark text-center">
            <li>
              <input
                type="range"
                min={0}
                max={stepToSlots.length - 1}
                value={timetable.value}
                onChange={e => setTimetable(() => stepToSlots[parseInt(e.target.value)])}
              />
              <div style={{ fontSize: "10px" }} className="text-center">
                <i>{timetable.step} min &times; {timetable.timeslots} timeslots</i>
              </div>
            </li>
          </ul>
        </div>
        <div>
          {events.length > 0 && (
            <button onClick={() => { clearEvents(); addAlert({ msg: "Events successfully cleared.", msgType: "success" }); }} className="btn btn-danger">
              <i className="fa-solid fa-trash-alt pe-2" />Clear events
            </button>
          )}
          <button onClick={() => setShowNewModal(() => true)} className="btn btn-primary">
            <i className="fa-solid fa-calendar-week pe-2" />New Event
          </button>
          {view === 'agenda' && (
            <button onClick={() => window.print()} className="btn btn-info">
              <i className="fa-solid fa-print pe-2" />Print
            </button>
          )}
        </div>
      </div>
      <Cal
        dayLayoutAlgorithm={"no-overlap"}
        selectable showMultiDayTimes popup
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={presentableEvents}
        style={{ height: 550 }}
        view={view}
        date={date}
        step={timetable.step}
        timeslots={timetable.timeslots}
        views={allViews}
        onNavigate={(date) => setDate(() => new Date(date))}
        onView={(view) => setView(() => view)}
        components={{ event: MultihandlerEvent }}
        getNow={() => new Date()}
      />
      <NewEventModal
        onClose={() => setShowNewModal(() => false)}
        show={showNewModal}
        onSave={submitEvent}
        title={title}
        setTitle={setTitle}
        allDay={allDay}
        setAllDay={setAllDay}
        typeOfEvent={typeOfEvent}
        setTypeofEvent={setTypeofEvent}
        startDateTime={startDateTime}
        setStartDateTime={setStartDateTime}
        endDateTime={endDateTime}
        setEndDateTime={setEndDateTime}
        description={description}
        setDescription={setDescription}
        mainbtn={null}
      />
      <ViewEventModal
        title={evDetails?.title}
        onClose={() => setShowEvDetailsModal(() => false)}
        onSave={() => { setShowEvDetailsModal(() => false); removeEvent(evDetails?.id); addAlert({ msg: "Event successfully removed.", msgType: "secondary" }); }}
        show={showEvDetailsModal}
        mainbtn={{ mainbtntext: "Remove event", mainbtntype: "danger", mainbtnicon: "trash-alt" }}
        evDetails={evDetails}
        removeRelatedEvents={removeRelatedEvents}
      />
      <MultiAddModal
        show={showMultiModal}
        onClose={() => setShowMultiModal(() => false)}
        onSave={addMultiple}
        lslen={events.length}
        mainbtn={{ mainbtntext: "Save changes", mainbtntype: "primary", mainbtnicon: "floppy-disk" }}
        title="Add multiple events feature (DEV ONLY)"
      />
    </div>
  )
}

export default Calendar;