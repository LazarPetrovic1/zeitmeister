import { useContext, useEffect, useState } from "react";
import { evtdate, getDuration } from "../../utils";
import Modal from "../Modal";
import ResourceText from "../ResourceText";
import { EventContext } from "../../contexts/EventContext";
import { AlertContext } from "../../contexts/AlertContext";

function ViewEventModal({ title, onClose, onSave, show, mainbtn, evDetails, removeRelatedEvents }) {
  console.log("EV DETAILS", evDetails);
  const isRecurring = evDetails?.description.includes("(This is a repeating event)");
  const { updateEvent } = useContext(EventContext);
  const { addAlert } = useContext(AlertContext);
  const [checked, setChecked] = useState(() => !!evDetails?.completed)
  useEffect(() => { setChecked(() => !!evDetails?.completed) }, [evDetails?.completed]);
  const completeEvt = () => {
    const next = !checked;
    setChecked(() => next);
    updateEvent(evDetails.id, { ...evDetails, completed: next, completedAt: next ? new Date() : null });
    addAlert({ msg: `Event ${next ? "completed" : "uncompleted"}.`, msgType: next ? "success" : "info" });
  };
  return (
    <Modal title={title} onClose={onClose} onSave={onSave} show={show} mainbtn={mainbtn}>
      <section>
        <div className="my-2">
          {evDetails?.start && evDetails?.end && (
            <div>
              <span className="d-inline-block pe-2">
                <i>From</i> <b>{evtdate(evDetails?.start).split(" ")[0]} @ {evtdate(evDetails?.start).split(" ")[1]}</b>
              </span>
              <span className="d-inline-block ps-2">
                <i>To</i> <b>{evtdate(evDetails?.end).split(" ")[0]} @ {evtdate(evDetails?.end).split(" ")[1]}</b>
              </span>
              <p className={evDetails?.allDay ? "text-primary" : "text-secondary"}><u>{evDetails?.allDay ? "All or multi-day event" : "Single-day event"}</u></p>
              <p className="text-info">{getDuration(evDetails?.start, evDetails?.end)}</p>
            </div>
          )}
        </div>
        <div className="my-2">
          <ResourceText resource={evDetails?.resource} />
        </div>
        <div>
          <input
            type="checkbox"
            name="completion"
            id="completion"
            autoComplete="off"
            checked={!!checked}
            onChange={completeEvt}
          />
          <label htmlFor="completion">{checked ? "Complete" : "Incomplete"}</label>
        </div>
        {isRecurring && (
          <div>
            <div className="text-danger mb-2"><u>This is a repeating event.</u></div>
            <button onClick={() => removeRelatedEvents(evDetails.id)} title="Remove all event occurrences" className="btn btn-danger">
              <i className="fa-solid fa-eraser pe-2" />Remove all event occurrences
            </button>
          </div>
        )}
      </section>
    </Modal>
  )
}

export default ViewEventModal;