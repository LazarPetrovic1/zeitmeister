import { CALC_HEIGHT_MINUS, checkClientRect } from "../utils";
import DraggableEvent from "../components/DraggableEvent";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MatrixInfoModal, Spinner } from "../components";
import { AlertContext } from "../contexts/AlertContext";
import { EventContext } from "../contexts/EventContext";

/**
 * @SQUARE_COLOURS (May add later if needed)
 * background: "rgba(255, 0, 0, 0.5)",
 * background: "rgba(0, 0, 255, 0.5)",
 * background: "rgba(255, 255, 0, 0.5)",
 * background: "rgba(128, 128, 128, 0.5)",
 * 
 */

const borderColor = "rgba(255, 255, 255, 0.25)"

const fullpage = {
  height: `calc(100vh - ${CALC_HEIGHT_MINUS}px)`,
  width: "100%",
  overflow: "hidden",
  position: "relative", // Ensure the container is positioned relative
  borderCollapse: "collapse",
  fontWeight: "bold"
};

const square = { letterSpacing: "2px", color: "rgba(255, 255, 255, 0.25)", userSelect: "none", height: "calc(50% + 2px)", width: "calc(50% + 2px)", position: "absolute", zIndex: 0 };
const urgimp = { flex: 1, top: 0, left: 0, borderRight: `4px groove ${borderColor}`, borderBottom: `4px groove ${borderColor}` };
const nurgimp = { flex: 1, top: 0, right: 0, borderLeft: `4px groove ${borderColor}`, borderBottom: `4px groove ${borderColor}` };
const urgnimp = { flex: 1, bottom: 0, left: 0, borderRight: `4px groove ${borderColor}`, borderTop: `4px groove ${borderColor}` };
const nurgnimp = { flex: 1, bottom: 0, right: 0, borderLeft: `4px groove ${borderColor}`, borderTop: `4px groove ${borderColor}` };
const center = { top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 500, borderRadius: "50%" }

function UIMatrix() {
  const { addAlert } = useContext(AlertContext)
  const { events, evaluateEvents } = useContext(EventContext);
  const [urgImp, nurgImp, urgNimp, nurgNimp] = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [dimensions, setDimensions] = useState(() => null);
  const [showInfo, setShowInfo] = useState(() => false);
  const isLoading = !events || !Array.isArray(events);
  // const isLoading = true;
  const sortEvents = useCallback(() => {
    urgImp.current.classList.add('urgImp');
    nurgImp.current.classList.add('nurgImp');
    urgNimp.current.classList.add('urgNimp');
    nurgNimp.current.classList.add('nurgNimp');
    addAlert({ msg: "Events successfully evaluated.", msgType: "success" });
    evaluateEvents();
    // eslint-disable-next=line
  }, []);
  useEffect(() => {
    if (urgImp.current && nurgImp.current && urgNimp.current && nurgNimp.current)
      setDimensions(() => ({
        urgImp: urgImp.current?.getBoundingClientRect(),
        nurgImp: nurgImp.current?.getBoundingClientRect(),
        urgNimp: urgNimp.current?.getBoundingClientRect(),
        nurgNimp: nurgNimp.current?.getBoundingClientRect(),
      }));
  }, [])
  useEffect(() => {
    const fullCondition = checkClientRect(urgImp.current, dimensions ? dimensions?.urgImp : null) &&
      checkClientRect(nurgImp.current, dimensions ? dimensions?.nurgImp : null) &&
      checkClientRect(urgNimp.current, dimensions ? dimensions?.urgNimp : null) &&
      checkClientRect(nurgNimp.current, dimensions ? dimensions?.nurgNimp : null);
      if (urgImp.current && nurgImp.current && urgNimp.current && nurgNimp.current) {
        if (fullCondition)
          setDimensions(() => ({
            urgImp: urgImp.current?.getBoundingClientRect(),
            nurgImp: nurgImp.current?.getBoundingClientRect(),
            urgNimp: urgNimp.current?.getBoundingClientRect(),
            nurgNimp: nurgNimp.current?.getBoundingClientRect(),
          }));
        }
      // eslint-disable-next-line
  }, [urgImp, nurgImp, urgNimp, nurgNimp, dimensions])
  return isLoading ? (
    <Spinner />
  ) : (
    <div style={fullpage} className="d-flex flex-wrap">
      {events.map((evt, i) => (<DraggableEvent dimensions={dimensions} event={evt} key={i} index={i} />))}
      <button onClick={() => setShowInfo(() => true)} className="btn position-absolute btn-dark" style={center}><i className="fa-solid fa-circle-info" /></button>
      <div ref={urgImp} className={`d-flex justify-content-end align-items-end p-0 pe-1 trans`} style={{ ...square, fontSize: "1.3rem", ...urgimp }}>Urgent and important</div>
      <div ref={nurgImp} className={`d-flex align-items-end p-0 ps-1 trans`} style={{ ...square, fontSize: "1.3rem", ...nurgimp }}>Important, but not urgent</div>
      <div ref={urgNimp} className={`d-flex justify-content-end align-items-end p-0 pe-1 trans`} style={{ ...square, fontSize: "1.3rem", ...urgnimp }}>Urgent, but not important</div>
      <div ref={nurgNimp} className={`d-flex align-items-end p-0 ps-1 trans`} style={{ ...square, fontSize: "1.3rem", ...nurgnimp }}>Neither urgent, nor important</div>
      <MatrixInfoModal evaluate={sortEvents} show={showInfo} onClose={() => setShowInfo(() => false)} onSave={() => setShowInfo(() => false)} title="Matrix Info" />
    </div>
  );
}

export default UIMatrix