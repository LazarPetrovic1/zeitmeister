import { intro } from "../utils";

function Welcome() {
  return (
    <div className="d-flex flex-column">
      <h2 className="text-center text-primary my-2 container">
        <span>Welcome to TimeTracker - Zeitmeister</span>
        <sub className="d-inline ms-1" style={{ fontSize: '0.7rem' }}>v{process.env.REACT_APP_VERSION}</sub>
      </h2>
      <h6 className="text-info text-center mt-3 mb-0" style={{ height: "calc(100vh - 129px)" }}>
        <pre className='text-break mb-0' style={{ fontFamily: "Montserrat, sans-serif", fontSize: "1rem", height: "100%" }}>{intro}</pre>
      </h6>
    </div>
  )
}

export default Welcome;