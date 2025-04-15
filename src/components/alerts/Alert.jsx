import { useContext } from "react";
import { AlertContext } from '../../contexts/AlertContext'

function Alert({ alert }) {
  const { removeAlert } = useContext(AlertContext)
  const { msg, msgType, id } = alert;
  return (
    <div
      className={`alert alert-${msgType} fade show d-flex alertitem m-0 p-1`}
      role="alert"
      title="Click to dismiss"
      key={id}
      style={{ pointerEvents: "all", justifyContent: "space-between", alignItems: "center", cursor: "pointer", maxWidth: '180px', fontSize: '12px' }}
      onClick={() => removeAlert(id)}
    > {msg}</div>
  )
}

export default Alert