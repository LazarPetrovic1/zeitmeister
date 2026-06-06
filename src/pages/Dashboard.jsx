import { useContext, useMemo } from "react";
import { EventContext } from "../contexts/EventContext";
import Plot from 'react-plotly.js'

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
    // eslint-disable-next-line
  }, [todayEvents]);

  const hoursWeek = useMemo(() => {
    return thisWeek.reduce(
      (sum, e) => sum + hoursBetween(e.start, e.end),
      0
    );
    // eslint-disable-next-line
  }, [thisWeek]);

  // ---------- CATEGORY BREAKDOWN ----------
  const categoryStats = useMemo(() => {
    const map = {};
    for (const e of events) {
      const key = e.resource || "Other";
      map[key] = (map[key] || 0) + hoursBetween(e.start, e.end);
    }
    return map;
    // eslint-disable-next-line
  }, [events]);

  const mostCommonCategory = useMemo(() => {
    let max = ["None", 0];
    for (const [k, v] of Object.entries(categoryStats)) {
      if (v > max[1]) max = [k, v];
    }
    return max[0];
    // eslint-disable-next-line
  }, [categoryStats]);

  // ---------- PRODUCTIVITY ----------
  const dayStats = useMemo(() => {
    const map = {};
    for (const e of events) {
      const day = new Date(e.start).toLocaleDateString("en-US", { weekday: "long" });
      map[day] = (map[day] || 0) + 1;
    }
    return map;
    // eslint-disable-next-line
  }, [events]);

  const mostProductiveDay = useMemo(() => {
    let max = ["None", 0];
    for (const [k, v] of Object.entries(dayStats)) if (v > max[1]) max = [k, v];
    return max[0];
    // eslint-disable-next-line
  }, [dayStats]);

  // ---------- COMPLETION ----------
  const completed = events.filter((e) => e.completed).length;
  const total = events.length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : (completed / total) * 100;
  const completionColor = completionRate > 75 ? "success" : completionRate > 40 ? "warning" : "danger";

  // ---------- CHART DATA ----------
  
  const categoryChart = useMemo(() => ({
    labels: Object.keys(categoryStats),
    values: Object.values(categoryStats)
  }), [categoryStats]);

  const weekdayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const productivityChart = useMemo(() => ({
    x: weekdayOrder,
    y: weekdayOrder.map(day => dayStats[day] || 0)
  }), [dayStats]);
  
  const completionChart = { labels: ["Completed", "Pending"], values: [completed, pending] };

  const eisenhowerStats = useMemo(() => {
    const result = {
      urgentImportant: { count: 0, hours: 0 },
      notUrgentImportant: { count: 0, hours: 0 },
      urgentNotImportant: { count: 0, hours: 0 },
      notUrgentNotImportant: { count: 0, hours: 0 },
      undetermined: { count: 0, hours: 0 }
    };

    for (const evt of events) {
      const duration = hoursBetween(evt.start, evt.end);
      switch (evt?.priority?.index) {
        case 0: {
          result.urgentImportant.count++;
          result.urgentImportant.hours += duration;
          break;
        }
        case 1: {
          result.notUrgentImportant.count++;
          result.notUrgentImportant.hours += duration;
          break;
        }
        case 2: {
          result.urgentNotImportant.count++;
          result.urgentNotImportant.hours += duration;
          break;
        }
        case 3: {
          result.notUrgentNotImportant.count++;
          result.notUrgentNotImportant.hours += duration;
          break;
        }
        default: {
          result.undetermined.count++;
          result.undetermined.hours += duration;
          break;
        }
      }
    }

    return result;
  }, [events]);

  const quadrantLabels = [
    "Urgent & Important",
    "Important Not Urgent",
    "Urgent Not Important",
    "Not Urgent Not Important",
    "Unassigned"
  ];

  const quadrantCounts = [
    eisenhowerStats.urgentImportant.count,
    eisenhowerStats.notUrgentImportant.count,
    eisenhowerStats.urgentNotImportant.count,
    eisenhowerStats.notUrgentNotImportant.count,
    eisenhowerStats.undetermined.count
  ];

  const productiveHours = eisenhowerStats.urgentImportant.hours + eisenhowerStats.notUrgentImportant.hours;
  const totalTrackedHours = Object.values(eisenhowerStats).reduce((sum, x) => sum + x.hours, 0);
  const productivityScore = totalTrackedHours === 0 ? 0 : (productiveHours / totalTrackedHours) * 100;

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
              <h3>{completed}/{total}</h3>
              <div className="progress">
                <div
                  className={`progress-bar bg-${completionColor}`}
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <small className="text-muted">Pending: {pending}</small>
            </div>
          </div>
        </div>

        {/* PRODUCTIVITY INFO */}
        <div className="card bg-dark text-white">
          <div className="card-body">
            <h6>Productivity Score</h6>
            <h2 className="text-success">{productivityScore.toFixed(0)}%</h2>
            <div className="progress">
              <div className="progress-bar bg-success" style={{ width: `${productivityScore}%` }} />
            </div>
            <small>Time spent on Important activities</small>
          </div>
        </div>

        <div className="row mt-4">

          {/* CATEGORY BREAKDOWN */}

          <div className="col-lg-6">
            <div className="card bg-dark text-white">
              <div className="card-body">
                <h5 className="mb-3">Time Breakdown by Category</h5>
                <Plot
                  data={[
                    {
                      type: "pie",
                      labels: categoryChart.labels,
                      values: categoryChart.values,
                      textinfo: "label+percent",
                      hole: 0.3
                    }
                  ]}
                  layout={{
                    autosize: true,
                    height: 400,
                    paper_bgcolor: "#212529",
                    plot_bgcolor: "#212529",
                    font: { color: "white" }
                  }}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* PRODUCTIVITY */}

          <div className="col-lg-6">
            <div className="card bg-dark text-white">
              <div className="card-body">
                <h5 className="mb-3">Events by Day of Week</h5>
                <Plot
                  data={[
                    {
                      type: "bar",
                      x: productivityChart.x,
                      y: productivityChart.y,
                      marker: { color: "#0d6efd" }
                    }
                  ]}
                  layout={{
                    autosize: true,
                    height: 400,
                    paper_bgcolor: "#212529",
                    plot_bgcolor: "#212529",
                    font: { color: "white" },
                    xaxis: { color: "white" },
                    yaxis: {
                      color: "white",
                      title: { text: "Events" }
                    }
                  }}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* COMPLETION CHART */}

          <div className="col-lg-6">
            <div className="card bg-dark text-white">
              <div className="card-body">
                <h5 className="mb-3">Events by Completion</h5>
                <Plot
                  data={[
                    {
                      type: "pie",
                      labels: completionChart.labels,
                      values: completionChart.values
                    }
                  ]}
                  layout={{
                    autosize: true,
                    height: 400,
                    paper_bgcolor: "#212529",
                    plot_bgcolor: "#212529",
                    font: { color: "white" }
                  }}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* EISENHOWER CHART */}

          <div className="col-lg-6">
            <div className="card bg-dark text-white">
              <div className="card-body">
                <h5 className="mb-3">Events by Urgency</h5>
                <Plot
                  data={[
                    {
                      x: quadrantLabels,
                      y: quadrantCounts,
                      type: "bar",
                      marker: {
                        color: [
                          "#dc3545",
                          "#198754",
                          "#ffc107",
                          "#6c757d",
                          "#0dcaf0"
                        ]
                      }
                    }
                  ]}
                  layout={{
                    title: {
                      text: "Events per Eisenhower Quadrant",
                      font: { color: "white" }
                    },
                    plot_bgcolor: "#212529",
                    paper_bgcolor: "#212529",
                    font: { color: "white" },
                    autosize: true
                  }}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;