import { checkClientRect } from "../utils";
import DraggableEvent from "../components/DraggableEvent";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MatrixInfoModal, Spinner } from "../components";
import { AlertContext } from "../contexts/AlertContext";
import { EventContext } from "../contexts/EventContext";
import { uimatrix } from ".";

function UIMatrix() {
  const { center, fullpage, nurgimp, nurgnimp, square, urgimp, urgnimp } = uimatrix
  const { addAlert } = useContext(AlertContext)
  const { events, evaluateEvents } = useContext(EventContext);
  const [urgImp, nurgImp, urgNimp, nurgNimp] = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [dimensions, setDimensions] = useState(() => null);
  const [showInfo, setShowInfo] = useState(() => false);
  const isLoading = !events || !Array.isArray(events);
  // const isLoading = true;
  const sortEvents = useCallback(() => {
    if (urgImp.current.classList.contains('urgImp')) urgImp.current.classList.remove('urgImp');
    if (nurgImp.current.classList.contains('nurgImp')) nurgImp.current.classList.remove('nurgImp');
    if (urgNimp.current.classList.contains('urgNimp')) urgNimp.current.classList.remove('urgNimp');
    if (nurgNimp.current.classList.contains('nurgNimp')) nurgNimp.current.classList.remove('nurgNimp');
    urgImp.current.classList.add('urgImp');
    nurgImp.current.classList.add('nurgImp');
    urgNimp.current.classList.add('urgNimp');
    nurgNimp.current.classList.add('nurgNimp');
    addAlert({ msg: "Events successfully evaluated.", msgType: "success" });
    evaluateEvents();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (urgImp.current && nurgImp.current && urgNimp.current && nurgNimp.current)
      setDimensions(() => ({
        urgImp: urgImp.current?.getBoundingClientRect(),
        nurgImp: nurgImp.current?.getBoundingClientRect(),
        urgNimp: urgNimp.current?.getBoundingClientRect(),
        nurgNimp: nurgNimp.current?.getBoundingClientRect(),
      }));
    // eslint-disable-next-line
  }, [window.innerHeight, window.innerWidth])
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