import { useContext } from "react";
import { EventContext } from "../../contexts/EventContext";
import Modal from "../Modal";
import List from "../List";

/**
 * 
 * @TODO
 * 1. Fix *CONTEXT* ({ urgentImportant, notUrgentImportant, urgentNotImportant, notUrgentNotImportant, undetermined }) with ".length"
**/

function UrgencyReportModal({ show, onSave, onClose, title }) {
  const { urgencyRequests, extrapolateForRemoval } = useContext(EventContext);
  const { urgentImportant, notUrgentImportant, urgentNotImportant, notUrgentNotImportant, undetermined } = urgencyRequests
  const removeUselessData = () => {
    const ids = notUrgentNotImportant.map(x => x.id)
    extrapolateForRemoval(ids);
  }
  return (
    <Modal show={show} onSave={onSave} onClose={onClose} title={title}>
      <section>
        <div className="p-3 border rounded">
          <h3 className="text-danger">The following events are to be taken care of immediately, without hesitation:</h3>
          <List level={0} items={urgentImportant} failText="Nothing else here. Great job!" />
        </div>
        <div className="my-2">
          <h4 className="text-primary">The following events can be planned and adjusted for accordingly:</h4>
          <List level={1} items={notUrgentImportant} failText="Nothing else here. Great job!" />
        </div>
        <div className="my-2">
          <h4 className="text-warning">The following events can be rescheduled to a different point in time:</h4>
          <List level={2} items={urgentNotImportant} failText="Nothing else here. Great job!" />
        </div>
        <div className="my-2 p-2 border rounded">
          <h5 className="text-secondary">The following events can be completely ignored</h5>
          <List level={3} items={notUrgentNotImportant} failText="Nothing else here. Great job!" />
          <button disabled={notUrgentNotImportant?.length < 1} onClick={removeUselessData} className="btn btn-danger w-100 mt-3">
            <i className="fa-solid fa-link-slash pe-2" />
            Safely delete ignored tasks
          </button>
        </div>
        <div className="my-2">
          <h4 className="text-light">These events are unknown, and neither are their urgency or importance.</h4>
          <List level={4} items={undetermined} failText="Nothing else here. Great job!" />
        </div>
      </section>
    </Modal>
  )
}

export default UrgencyReportModal 