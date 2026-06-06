import { useContext, useState } from "react";
import { EventContext } from "../../contexts/EventContext";
import Modal from "../Modal";
import List from "../List";
import { generateUrgencyCsv, generateUrgencyJson, generateUrgencyMarkdown, generateUrgencyPdf } from "../../utils";

/**
 * 
 * @TODO
 * 1. Fix *CONTEXT* ({ urgentImportant, notUrgentImportant, urgentNotImportant, notUrgentNotImportant, undetermined }) with ".length"
**/

function UrgencyReportModal({ show, onSave, onClose, title }) {
  const [format, setFormat] = useState(() => "csv");
  const { urgencyRequests, extrapolateForRemoval } = useContext(EventContext);
  const { urgentImportant, notUrgentImportant, urgentNotImportant, notUrgentNotImportant, undetermined } = urgencyRequests
  const removeUselessData = () => {
    const ids = notUrgentNotImportant.map(x => x.id)
    extrapolateForRemoval(ids);
  }
  const generateDocument = () => {
    if (format.toLowerCase() === "csv") generateUrgencyCsv(urgencyRequests)
    else if (format.toLowerCase() === "md") generateUrgencyMarkdown(urgencyRequests)
    else if (format.toLowerCase() === "json") generateUrgencyJson(urgencyRequests)
    else if (format.toLowerCase() === "pdf") generateUrgencyPdf(urgencyRequests)
    else return;
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
        <div>
          <p className="mt-3">Generate report</p>
          <div className="my-2 d-flex">
            <button style={{ flex: 2 }} onClick={generateDocument} className="btn btn-primary">
              <i className="fa-solid fa-book pe-2" /> Generate {format.toUpperCase()}
            </button>
            <select style={{ flex: 1 }} name="format" value={format} onChange={(e) => setFormat(() => e.target.value)} className="form-select" aria-label="Generate report">
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="md">MD</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>
      </section>
    </Modal>
  )
}

export default UrgencyReportModal 