import { useContext } from "react";
import Alert from './Alert'
import { AlertContext } from "../../contexts/AlertContext";

const maindel = {
  color: 'red',
  fontSize: '1.3rem',
  top: "0.1rem",
  right: "0.1rem",
  zIndex: 10000,
  cursor: 'crosshair',
}

function AlertContainer() {
  const { alerts, removeAllAlerts } = useContext(AlertContext);
  return alerts.length > 0 ? (
    <div className='alert-wrapper border p-1' id="alert-container">
      {alerts !== null && alerts?.length > 0 && alerts.map(alert => (<Alert alert={alert} key={alert.id} />))}
      <i
        onClick={() => removeAllAlerts()}
        className="position-absolute allevents fas fa-times"
        style={maindel}
        title="Remove all alerts"
      />
    </div>
  ) : null;
}

export default AlertContainer;