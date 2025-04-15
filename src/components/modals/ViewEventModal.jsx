import { evtdate, getDuration } from "../../utils";
import Modal from "../Modal";
import ResourceText from "../ResourceText";

function ViewEventModal({ title, onClose, onSave, show, mainbtn, evDetails, removeRelatedEvents }) {
  const isRecurring = evDetails?.description.includes("(This is a repeating event)");
  
  return (
    <Modal
      title={title}
      onClose={onClose}
      onSave={onSave}
      show={show}
      mainbtn={mainbtn}
    >
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