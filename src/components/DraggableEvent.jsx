import { Rnd } from "react-rnd";
import EventDetailsModal from "./modals/EventDetailsModal";
import { useContext, useEffect, useState } from "react";
import { floorDivide, getResourceColour, modulate } from "../utils";
import { AlertContext } from "../contexts/AlertContext";
import { EventContext } from "../contexts/EventContext";
import { useDebouncedCallback } from "use-debounce";

const DraggableEvent = ({ event, dimensions }) => {
  // The dimensions variable are the DOMRects from the quadrants being passed
  const { updateEvent } = useContext(EventContext);
  const { addAlert } = useContext(AlertContext);
  const [newEvent, setNewEvent] = useState(() => event);
  const { color, background } = getResourceColour(newEvent.resource)
  const [show, setShow] = useState(() => false);
  const [style, setStyle] = useState(() => {
    const x = event?.position?.x || floorDivide(newEvent.id) * 50 + (modulate(newEvent.id) * 50);
    const y = event?.position?.y || floorDivide(newEvent.id) * 50;
    return { width: 50, height: 50, x, y }
  });
  const effect = useDebouncedCallback(() => {
    if (dimensions) {
      const assignment = Object.keys(dimensions).map((dim, index) => ({ index, value: dim, dims: dimensions[dim] }));
      const exact = assignment.find(as => style.x >= as.dims.left && style.x <= as.dims.right && style.y >= as.dims.top && style.y <= as.dims.bottom);
      const prio = { index: exact?.index || 4, value: exact?.value || "nonAligned" };
      const pos = { x: style.x, y: style.y }
      updateEvent(event.id, { ...event, priority: prio, position: pos });
      setNewEvent((prev) => ({ ...prev, priority: prio, position: pos }));
    }
  }, 300);
  useEffect(() => {
    effect();
    // eslint-disable-next-line
  }, [dimensions, event.position, event.prio]);
  const [isDragging, setIsDragging] = useState(() => false);
  const handleDragStart = () => setIsDragging(() => true);
  const handleDragStop = (_, d) => {
    const assignment = Object.keys(dimensions).map((dim, index) => ({ index, value: dim, dims: dimensions[dim] }))
    const exact = assignment.find(as => d.x >= as.dims.left && d.x <= as.dims.right && d.y >= as.dims.top && d.y <= as.dims.bottom) || { index: 4, value: "nonAligned" };
    setNewEvent((prev) => ({ ...prev, priority: { index: exact.index, value: exact.value }, position: { x: d.x, y: d.y } }))
    updateEvent(newEvent.id, { ...newEvent, priority: { index: exact.index, value: exact.value }, position: { x: d.x, y: d.y } });
    setStyle((prevStyle) => ({ ...prevStyle, x: d.x, y: d.y }));
    setIsDragging(() => false);
    addAlert({ msg: "Event successfully updated.", msgType: "info" });
  }
  return (
    <>
      <Rnd
        style={{ zIndex: 10, resize: "none" }}
        size={{ width: style.width, height: style.height }}
        position={{ x: style.x, y: style.y }}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        enableResizing={false}
      >
        <button
          id={`draggable-event-${newEvent.id}`}
          style={{ maxHeight: "fit-content", zIndex: 20, color, background }}
          className="btn position-relative"
          onDoubleClick={() => !isDragging && setShow(() => true)}
          title="Open event details"
        ><i className="fa-solid fa-link" /></button>
      </Rnd>
      <EventDetailsModal
        evDetails={newEvent}
        onClose={() => setShow(() => false)}
        onSave={() => setShow(() => false)}
        show={show}
      />
    </>
  );
};

export default DraggableEvent;