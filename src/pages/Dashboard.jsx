import { useContext, useMemo } from "react";
import { EventContext } from "../contexts/EventContext";

function Dashboard() {
  const { events } = useContext(EventContext);
  const now = new Date();

  // ---------- HELPERS ----------
  const startOfWeek = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    return new Date(date.setDate(diff));
  };

  const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

  const hoursBetween = (start, end) => (new Date(end) - new Date(start)) / (1000 * 60 * 60);

  // ---------- FILTERS ----------
  const thisWeek = useMemo(() => {
    const start = startOfWeek(now);
    return events.filter((e) => new Date(e.start) >= start);
    // eslint-disable-next-line
  }, [events]);

  const thisMonth = useMemo(() => {
    const start = startOfMonth(now);
    return events.filter((e) => new Date(e.start) >= start);
    // eslint-disable-next-line
  }, [events]);

  const todayEvents = useMemo(() => {
    const today = now.toDateString();
    return events.filter(
      (e) => new Date(e.start).toDateString() === today
    );
    // eslint-disable-next-line
  }, [events]);

  // ---------- METRICS ----------
  const hoursToday = useMemo(() => {
    return todayEvents.reduce(
      (sum, e) => sum + hoursBetween(e.start, e.end),
      0
    );
  }, [todayEvents]);

  const hoursWeek = useMemo(() => {
    return thisWeek.reduce(
      (sum, e) => sum + hoursBetween(e.start, e.end),
      0
    );
  }, [thisWeek]);

  // ---------- CATEGORY BREAKDOWN ----------
  const categoryStats = useMemo(() => {
    const map = {};
    for (const e of events) {
      const key = e.resource || "Other";
      map[key] = (map[key] || 0) + hoursBetween(e.start, e.end);
    }
    return map;
  }, [events]);

  const mostCommonCategory = useMemo(() => {
    let max = ["None", 0];
    for (const [k, v] of Object.entries(categoryStats)) {
      if (v > max[1]) max = [k, v];
    }
    return max[0];
  }, [categoryStats]);

  // ---------- PRODUCTIVITY ----------
  const dayStats = useMemo(() => {
    const map = {};
    for (const e of events) {
      const day = new Date(e.start).toLocaleDateString("en-US", { weekday: "long" });
      map[day] = (map[day] || 0) + 1;
    }
    return map;
  }, [events]);

  const mostProductiveDay = useMemo(() => {
    let max = ["None", 0];
    for (const [k, v] of Object.entries(dayStats)) if (v > max[1]) max = [k, v];
    return max[0];
  }, [dayStats]);

  // ---------- COMPLETION ----------
  const completed = events.filter((e) => e.completed).length;
  const total = events.length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : (completed / total) * 100;

  const completionColor =
    completionRate > 75
      ? "success"
      : completionRate > 40
      ? "warning"
      : "danger";

  // ---------- UI ----------
  return (
    <div className="container py-3">
      <h1 className="text-primary text-center mb-4">Dashboard</h1>
      <div className="row g-3">

        {/* WEEK EVENTS */}
        <div className="col-md-3">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h6>Events this week</h6>
              <h3>{thisWeek.length}</h3>
            </div>
          </div>
        </div>

        {/* MONTH EVENTS */}
        <div className="col-md-3">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h6>Events this month</h6>
              <h3>{thisMonth.length}</h3>
            </div>
          </div>
        </div>

        {/* HOURS TODAY */}
        <div className="col-md-3">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h6>Hours today</h6>
              <h3>{hoursToday.toFixed(1)}h</h3>
            </div>
          </div>
        </div>

        {/* HOURS WEEK */}
        <div className="col-md-3">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h6>Hours this week</h6>
              <h3>{hoursWeek.toFixed(1)}h</h3>
            </div>
          </div>
        </div>

        {/* MOST COMMON CATEGORY */}
        <div className="col-md-4">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h6>Most common category</h6>
              <h4>{mostCommonCategory}</h4>
            </div>
          </div>
        </div>

        {/* MOST PRODUCTIVE DAY */}
        <div className="col-md-4">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h6>Most productive day</h6>
              <h4>{mostProductiveDay}</h4>
            </div>
          </div>
        </div>

        {/* COMPLETION */}
        <div className="col-md-4">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h6>Completion rate</h6>

              <h3>
                {completed}/{total}
              </h3>

              <div className="progress">
                <div
                  className={`progress-bar bg-${completionColor}`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>

              <small className="text-muted">
                Pending: {pending}
              </small>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;