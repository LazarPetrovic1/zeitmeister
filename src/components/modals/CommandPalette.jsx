import { useMemo, useState } from "react";
import { PALETTE_COMMANDS } from "../../utils";
import { useNavigate } from "react-router-dom";
import useEventListener from "../../hooks/useEventListener";

const positioning = {
  position: "fixed",
  top: "10rem",
  left: "7.5%",
  height: "fit-content",
  width: "85%",
  zIndex: 10,
  background: "#212529"
}

function CommandPalette({ description, show, onClose }) {
  const navigate = useNavigate();
  const [cmd, setCmd] = useState(() => "");
  const commands = useMemo(() => PALETTE_COMMANDS, []);
  const filter = (x) => x.name.includes(cmd) || x.description.includes(cmd);
  const closeOnEscapeDown = (e) => (e.charCode || e.keyCode) === 27 && onClose();
  useEventListener("keydown", closeOnEscapeDown, document)
  if (!show) return null;
  return (
    <div style={positioning}>
      <div className="input-group">
        <input
          type="search"
          className="form-control"
          placeholder="Search for commands..."
          aria-label="Search for commands..."
          value={cmd}
          onChange={e => setCmd(e.target.value)}
        />
      </div>
      {cmd.length > 0 && (
        <article>
          {commands.filter(filter).map((cmd, i) => {
            const action = () => { navigate(cmd.route); onClose(); }
            return (
              <div key={i} role="button" onClick={action}>
                <hr className="my-1" />
                <span className="badge">{cmd.name}</span>&nbsp;
                <small><i>{cmd.description}</i></small>
              </div>
            )
          })}
        </article>
      )}
      <div className="d-flex justify-content-between" style={{ background: "rgba(33, 37, 41, 0.25)" }}>
        <i role="button" style={{ fontSize: "10px" }} className="text-danger" onClick={onClose}>Kill Session</i>
        <i style={{ fontSize: "10px" }}>{description} - developer-only feature</i>
      </div>
    </div>
  )
}

export default CommandPalette