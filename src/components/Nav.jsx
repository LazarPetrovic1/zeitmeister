import { Link, useLocation }  from "react-router-dom";

function Nav() {
  const { pathname } = useLocation()
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Zeitmeister
          <span style={{ fontSize: '0.7rem' }}>&nbsp;v{process.env.REACT_APP_VERSION}</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className={`nav-link ${pathname === "/" ? "active" : ""}`} aria-current="page" to="/"><i className="fa-solid fa-house-chimney pe-2" />Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${pathname === "/calendar" ? "active" : ""}`} to="/calendar"><i className="fa-solid fa-calendar-week pe-2" />Calendar</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${pathname === "/about" ? "active" : ""}`} to="/about"><i className="fa-solid fa-circle-info pe-2" />About</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${pathname === "/patch-notes" ? "active" : ""}`} to="/patch-notes"><i className="fa-solid fa-code-merge pe-2" />Patches</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${pathname === "/urgency" ? "active" : ""}`} to="/urgency"><i className="fa-solid fa-triangle-exclamation pe-2" />Urgency</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav