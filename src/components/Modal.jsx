import useEventListener from "../hooks/useEventListener";

function Modal({ title, children, show, onClose, style, onSave, mainbtn }) {
  mainbtn = mainbtn || { mainbtntext: "Save changes", mainbtntype: "success", mainbtnicon: "check" };
  const closeOnEscapeDown = (e) =>
    (e.charCode || e.keyCode) === 27 && onClose();
  useEventListener("keydown", closeOnEscapeDown, document)
  if (!show) return null;
  return (
    <div
      className="modal"
      style={{ display: show ? "block" : "none", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      tabIndex={-1}
      role="dialog"
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ ...style, maxHeight: "400px", overflowY: "auto" }} className="modal-content">
          <div className="modal-header justify-content-between align-items-center" style={{ backgroundColor: "#111", color: '#eee' }}>
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            >
              <span aria-hidden="true">
                <i className="fas fa-times text-danger" />
              </span>
            </button>
          </div>
          <div className="modal-body" style={{ backgroundColor: "#111" }}>
            {children}
          </div>
          <div className="modal-footer" style={{ backgroundColor: "#111" }}>
            <button
              type="button"
              className="btn btn-outline-warning"
              data-dismiss="modal"
              onClick={onClose}
            >
              <i className="fas fa-times pe-2" /> Close
            </button>
            <button onClick={onSave} type="button" className={`btn btn-outline-${mainbtn.mainbtntype}`}>
              <i className={`fas fa-${mainbtn.mainbtnicon} pe-2`} /> {mainbtn.mainbtntext}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal