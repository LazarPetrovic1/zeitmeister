import { evtdate, getPriority } from "../../utils";
import Modal from "../Modal";
import ResourceText from "../ResourceText";

function EventDetailsModal({ onClose, onSave, show, evDetails }) {
  const newStart = evtdate(evDetails?.start);
  const newEnd = evtdate(evDetails?.end);
  const { txt, color } = getPriority(evDetails?.priority?.index);
  return (
    <Modal title={evDetails?.title} onClose={onClose} onSave={onSave} show={show}>
      <section>
        <div className="my-2">
          <div>
            <span className="d-inline-block pe-2">
              <i>From</i> <b>{newStart}</b>
            </span>
            <span className="d-inline-block ps-2">
              <i>To</i> <b>{newEnd}</b>
            </span>
            <p className={evDetails?.allDay ? "text-warning" : "text-info"}>{evDetails?.allDay ? "All or multi-day event" : "Single-day event"}</p>
          </div>
        </div>
        <div className="my-2">
          <ResourceText resource={evDetails?.resource} />
        </div>

        <div className="my-2">
          <p style={{ color }}>{txt}</p>
        </div>

        {evDetails.recId && <div className="text-danger mb-2"><u>This is a repeating event.</u></div>}
      </section>
    </Modal> 
  )
}

export default EventDetailsModal;