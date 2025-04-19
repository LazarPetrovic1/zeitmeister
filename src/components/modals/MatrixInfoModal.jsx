import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { useDebouncedCallback } from "use-debounce";

function MatrixInfoModal({ onClose, onSave, show, title, evaluate }) {
  const navigate = useNavigate();
  const move = useDebouncedCallback(() => navigate("/results"), 3000);
  const fn = () => { evaluate(); onClose(); move(); }
  return (
    <Modal title={title} onClose={onClose} onSave={onSave} show={show}>
      <section>
        <span style={{ fontSize: "10px" }}>
          The Urgent Important Matrix, also known as the Eisenhower Matrix,
          is a tool for prioritizing tasks based on their urgency and importance.
        </span>
        <br />
        <span style={{ fontSize: "10px" }}>
          To view the event details, simply double-click it.
        </span>
        <p className="mt-2">
          It categorizes tasks into four quadrants:
            Urgent and Important,
            Important but Not Urgent,
            Urgent but Not Important, and
            Not Urgent and Not Important.
        </p>
        <p>Simply drag the existing events to wherever they fall on this matrix relative to your priorities.</p>
        <p>
          Once you have dragged the tasks to where you want them to be, simply click this button
        </p>
        <button onClick={fn} className="btn btn-primary w-100">
          <i className="fa-solid fa-share-nodes pe-2" />Evaluate
        </button>
      </section>
    </Modal> 
  )
}

export default MatrixInfoModal;