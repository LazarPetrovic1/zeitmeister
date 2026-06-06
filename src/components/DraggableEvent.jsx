import { Rnd } from "react-rnd";
import EventDetailsModal from "./modals/EventDetailsModal";
import { useContext, useEffect, useState } from "react";
import { getAbsolutePosition, getResourceColour } from "../utils";
import { AlertContext } from "../contexts/AlertContext";
import { EventContext } from "../contexts/EventContext";
import { useDebouncedCallback } from "use-debounce";

const DraggableEvent = ({ event, dimensions }) => {
  // The dimensions variable are the DOMRects from the quadrants being passed
  const { updateEvent, events } = useContext(EventContext);
  const { addAlert } = useContext(AlertContext);
  const { color, background } = getResourceColour(event.resource)
  const [show, setShow] = useState(() => false);
  const [style, setStyle] = useState(() => ({
    width: 50,
    height: 50,
    x: event.position?.x ?? 0,
    y: event.position?.y ?? 0
  }));
  useEffect(() => {
    if (Number.isFinite(event.position?.x) && Number.isFinite(event.position?.y))
      setStyle(prev => ({ ...prev, x: event.position.x, y: event.position.y }));
  }, [event.position?.x, event.position?.y]);
  useEffect(() => {
    if (!dimensions || !event.relativePosition || !event.priority) return;
    const pos = getAbsolutePosition(event.relativePosition, event.priority, dimensions);
    if (!pos) return;
    setStyle(prev => ({ ...prev, x: pos.x, y: pos.y }));
  }, [dimensions, event.relativePosition, event.priority]);
  const effect = useDebouncedCallback(() => {
    if (dimensions) {
      const assignment = Object.keys(dimensions).map((dim, index) => ({ index, value: dim, dims: dimensions[dim] }));
      const exact = assignment.find(as => style.x >= as.dims.left && style.x <= as.dims.right && style.y >= as.dims.top && style.y <= as.dims.bottom);
      const prio = { index: exact?.index ?? 4, value: exact?.value ?? "nonAligned" };
      const pos = { x: style.x, y: style.y }
      updateEvent(event.id, { ...event, priority: prio, position: pos });
    }
  }, 300);
  useEffect(() => {
    effect();
    // eslint-disable-next-line
  }, [dimensions]);
  const [isDragging, setIsDragging] = useState(() => false);
  const handleDragStart = () => setIsDragging(() => true);
  const handleDragStop = (_, d) => {
    if (!dimensions || !d || !Number.isFinite(d.x) || !Number.isFinite(d.y)) { setIsDragging(false); return; }
    const assignment = Object.keys(dimensions).map((dim, index) => ({ index, value: dim, dims: dimensions[dim] }))
    const exact = assignment.find(as =>
      d.x >= as.dims.left &&
      d.x <= as.dims.right &&
      d.y >= as.dims.top &&
      d.y <= as.dims.bottom
    ) || {
      index: 4,
      value: "nonAligned",
      dims: {
        left: 0,
        top: 0,
        width: 50,
        height: 50
      }
    };

    console.log("ASSIGNMENT & stuff", { _,
      d, evt: events.find(e => e.id === event.id),
      assignment,
      dimensions,
      exact
    });

    if (!exact) {
      setStyle(prev => ({ ...prev, x: d.x, y: d.y }));
      setIsDragging(() => false);
      return;
    }
    const relX = (d.x - exact.dims.left) / exact.dims.width;
    const relY = (d.y - exact.dims.top) / exact.dims.height;
    const updatedEvent = {
      ...event,
      priority: { index: exact.index, value: exact.value },
      position: { x: d.x, y: d.y },
      relativePosition: { x: relX, y: relY }
    }
    updateEvent(event.id, updatedEvent);
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
        dragAxis="both"
        bounds="parent"
      >
        <button
          id={`draggable-event-${event.id}`}
          style={{ maxHeight: "fit-content", zIndex: 20, color, background }}
          className="btn position-relative"
          onDoubleClick={() => !isDragging && setShow(() => true)}
          title="Open event details"
        ><i className="fa-solid fa-link" /></button>
      </Rnd>
      <EventDetailsModal
        evDetails={event}
        onClose={() => setShow(() => false)}
        onSave={() => setShow(() => false)}
        show={show}
      />
    </>
  );
};

export default DraggableEvent;