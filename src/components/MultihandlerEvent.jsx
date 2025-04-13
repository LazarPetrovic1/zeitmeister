import moment from "moment";
import { getResourceColour } from "../utils";

function MultihandlerEvent({ event }) {
  const { background, color } = getResourceColour(event.resource)
  const [startTime, endTime] = [moment(event.start).format("h:mma"), moment(event.end).format("h:mma")]
  let className = "rbc-event"
  if (event.allDay) className += " rbc-event-allday"
  
  return (
    // <div className={`rbc-event ${event.allDay ? "rbc-event-allday" : ""} ${resource}`}>
    //   <div className={`rbc-event-label ${resource}`}>{startTime} - {endTime}</div>
    //   <div className={`rbc-event-content ${resource}`} title={event.title}>{event.title}</div>
    // </div>
    <div
      role="button"
      tabIndex={0}
      title={`${startTime} - ${endTime}: ${event.title}`}
      className={className}
      style={{ top: 0, height: "100%", width: "100%", left: 0, background, color }}
      // style={{ top: "4.16667%", height: "20.8333%", width: "100%", left: "0%" }}
    >
      <div className={`rbc-event-label`} style={{ fontSize: "10px" }}>{startTime} - {endTime}</div>
      <div className={`rbc-event-content`} style={{ fontSize: "12px" }} title={event.title}>{event.title} <i>({event.resource})</i></div>
    </div>
  )
}

export default MultihandlerEvent