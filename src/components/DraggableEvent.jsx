import { Rnd } from "react-rnd";
import EventDetailsModal from "./modals/EventDetailsModal";
import { useState } from "react";
import { getResourceColour } from "../utils";
import useEvents from "../hooks/useEvents";

const DraggableEvent = ({ event, dimensions }) => {
  // The dimensions variable are the DOMRects from the quadrants being passed
  const { updateEvent } = useEvents();
  const [newEvent, setNewEvent] = useState(() => event);
  const { color, background } = getResourceColour(newEvent.resource)
  const [show, setShow] = useState(false);
  const [style, setStyle] = useState(() => {
    const x = event?.position?.x || newEvent.id * 50;
    const y = event?.position?.y || 20;
    return { width: 50, height: 50, x, y }
  });
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart = () => setIsDragging(() => true);
  const handleDragStop = (_, d) => {
    const assignment = Object.keys(dimensions).map((dim, index) => ({ index, value: dim, dims: dimensions[dim] }))
    const exact = assignment.find(as => d.x >= as.dims.left && d.x <= as.dims.right && d.y >= as.dims.top && d.y <= as.dims.bottom);
    if (exact) {
      setNewEvent((prev) => ({ ...prev, priority: { index: exact.index, value: exact.value }, position: { x: d.x, y: d.y } }))
      updateEvent(newEvent.id, { ...newEvent, priority: { index: exact.index, value: exact.value }, position: { x: d.x, y: d.y } });
    }
    setStyle((prevStyle) => ({ ...prevStyle, x: d.x, y: d.y }));
    setIsDragging(() => false);
  }

  return (
    <>
      <Rnd
        style={{ zIndex: 10 }}
        size={{ width: style.width, height: style.height }}
        position={{ x: style.x, y: style.y }}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
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
        onClose={() => setShow(false)}
        onSave={() => setShow(false)}
        show={show}
      />
    </>
  );
};

export default DraggableEvent;