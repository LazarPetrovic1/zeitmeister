import { useMemo, useState } from "react";
import Modal from "../Modal";

export const multiEventAddRegex = new RegExp(
  `^\\[\\s*` + // Start of the string, opening square bracket, and optional whitespace
  `(\\{[^}]*\\}(,\\s*\\{[^}]*\\})*)?` + // Zero or more objects with any keys and values, separated by commas
  `\\s*\\]` + // Optional whitespace and closing square bracket
  `$`, // End of the string
  "g"
);

function MultiAddModal({ title, onClose, show, onSave, mainbtn, lslen }) {
  const placeholder = `There are currently ${lslen} events, so the next id is ${lslen}.
Remove these sentences and add as many events as necessary, while following JSON rules. 
[
  {
    id: ${lslen},
    title: string,
    allDay: boolean,
    start: Date,
    end: Date,
    resource: type of event (exactly as in the dropdown)
    description: multi-line string
  }
]`;
  const [newItems, setNewItems] = useState(() => placeholder);
  const isSyntaxFollowed = useMemo(() => multiEventAddRegex.test(newItems), [newItems]);
  const save = (e) => {
    e.preventDefault()
    const actualItems = JSON.parse(newItems);
    onSave(actualItems);
    setNewItems(() => placeholder);
    onClose();
  }
  return (
    <Modal
      title={title}
      onClose={onClose}
      show={show}
      onSave={save}
      mainbtn={mainbtn}
    >
      <form onSubmit={(e) => save(e)}>
        <div className="input-group has-validation">
          <div className={`form-floating is-${isSyntaxFollowed ? "valid" : "invalid"}`}>
            <textarea
              value={newItems}
              onChange={e => setNewItems(() => e.target.value)}
              className="form-control"
              placeholder={placeholder}
              id="newItems"
              style={{ minHeight: "300px" }}
            />
            <label htmlFor="newItems">Add new items in JSON format</label>
          </div>
          {isSyntaxFollowed ? (
            <div className="valid-feedback">
              Valid JSON syntax
            </div>
          ) : (
            <div className="invalid-feedback">
              Invalid JSON syntax
            </div>
          )}
        </div>
      </form>
    </Modal>
  )
}

export default MultiAddModal