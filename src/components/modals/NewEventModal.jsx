import { useState } from "react";
import { evtdate } from "../../utils"
import Modal from "../Modal"

function NewEventModal({
  onClose, show, onSave,
  title, setTitle, mainbtn,
  allDay, setAllDay,
  typeOfEvent, setTypeofEvent,
  startDateTime, setStartDateTime,
  endDateTime, setEndDateTime,
  description, setDescription
}) {
  const [recurrence, setRecurrence] = useState(() => "");
  const save = () => {
    if (allDay) setRecurrence(() => "");
    onSave(recurrence);
  }
  return (
    <Modal
      title="New Event"
      onClose={onClose}
      show={show}
      onSave={save}
      mainbtn={mainbtn}
    >
      <section>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="e.g. Jim's birthday"
            onChange={e => setTitle(() => e.target.value)}
            value={title}
          />
        </div>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            value={allDay}
            defaultChecked={allDay}
            id="allDay"
            onChange={() => setAllDay((prev) => !prev)}
          />
          <label className="form-check-label" htmlFor="allDay">
            All/multi-day event
          </label>
        </div>
        <h6 className="pt-1 pb-2">Duration:</h6>
        <div className="form-control">
          <article className="gap-3 pb-3 d-flex justify-content-between align-items-baseline'">
            <div>
              <label htmlFor="startDateTime">From</label>
              <input
                onChange={e => setStartDateTime(() => e.target.value)}
                value={evtdate(startDateTime)}
                name="startDateTime"
                id="startDateTime"
                type="datetime-local"
                style={{ maxWidth: "210px" }}
              />
            </div>
            <div>
              <label htmlFor="endDateTime">End date</label>
              <input
                onChange={e => setEndDateTime(() => e.target.value)}
                value={evtdate(endDateTime)}
                name="endDateTime"
                id="endDateTime"
                type="datetime-local"
                style={{ maxWidth: "210px" }}
              />
            </div>
          </article>
        </div>
        <div className="mt-4 mb-2">
          <label htmlFor="typeOfEvent" className="form-label">Type of event:</label>
          <select name="typeOfEvent" value={typeOfEvent} onChange={(e) => setTypeofEvent(() => e.target.value)} className="form-select" aria-label="Type of calendar event">
            <option disabled value="">-- Select type of commitment --</option>
            <option value="Work">Work</option>
            <option value="Holiday">Holiday</option>
            <option value="Free Time">Free Time</option>
            <option value="Paid-time off">Paid-time off</option>
            <option value="Conference">Conference</option>
            <option value="Transit">Transit</option>
            <option value="Cultural events">Cultural events</option>
            <option value="Self-improvement">Self-improvement</option>
            <option value="Physical workout">Physical workout</option>
            <option value="Hobbies">Hobbies</option>
            <option value="Studying/learning">Studying/learning</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <h6 className="mt-4 pb-1">Additional comments:</h6>
        <div className="mt-3 form-floating">
          <textarea
            type="text"
            style={{ resize: "vertical", minHeight: "100px" }}
            className="form-control"
            id="description"
            onChange={e => setDescription(() => e.target.value)}
            value={description}
          />
          <label htmlFor="description">Enter description <i>(optional)</i></label>
        </div>
        {!allDay && (
          <div className="my-2">
            <h4 className="text-info py-2"><i className="fa-solid fa-repeat pe-2" />Recurrence options <i>(repeat action)</i></h4>
            <div className="btn-group" role="group" aria-label="Recurrence options">
              <input type="radio" className="btn-check" name="recurrence" id="daily-end" onClick={() => setRecurrence(() => "daily")} autoComplete="off" />
              <label style={{ fontSize: "12px" }} className="btn btn-outline-primary" htmlFor="daily-end">Daily until end date</label>

              <input type="radio" className="btn-check" name="recurrence" id="week" onClick={() => setRecurrence(() => "weekly")} autoComplete="off" />
              <label style={{ fontSize: "12px" }} className="btn btn-outline-primary" htmlFor="week">Daily until end of week</label>

              <input type="radio" className="btn-check" name="recurrence" onClick={() => setRecurrence(() => "workweek")} id="work-week" autoComplete="off" />
              <label style={{ fontSize: "9px" }} className="btn btn-outline-primary" htmlFor="work-week">Daily until Friday</label>

              <input type="radio" className="btn-check" name="recurrence" id="month" onClick={() => setRecurrence(() => "monthly")} autoComplete="off" />
              <label style={{ fontSize: "10px" }} className="btn btn-outline-primary" htmlFor="month">Daily until end of month</label>

              <input type="radio" className="btn-check" name="recurrence" id="work-month" onClick={() => setRecurrence(() => "workmonth")} autoComplete="off" />
              <label style={{ fontSize: "12px" }} className="btn btn-outline-primary" htmlFor="work-month">Work days until end of month</label>
            </div>
          </div>
        )}
      </section>
    </Modal>
  )
}

export default NewEventModal