import { useState } from "react";
import { getPrioColours } from "../utils"
import EventDetailsModal from "./modals/EventDetailsModal";

function ListItem({ item, level }) {
  const [show, setShow] = useState(() => false)
  const { color, background } = getPrioColours(level)
  return (
    <>
      <li onClick={() => setShow(() => true)} role="button" key={item?.id} style={{ color, background }} className="list-group-item">{item.title}</li>
      <EventDetailsModal
        evDetails={item}
        onClose={() => setShow(() => false)}
        onSave={() => setShow(() => false)}
        show={show}
      />
    </>
  )
}

function List({ items, level, failText }) {
  return (
    <ul className="list-group">
      {items && Array.isArray(items) && items.length > 0 ?
        items.map(item => <ListItem level={level} item={item} key={item.id} />
      ) : (
        <li className="list-group-item">{failText ? failText : "No items available"}</li>
      )}
    </ul>
  )
}

export default List