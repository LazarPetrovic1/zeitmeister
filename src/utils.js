import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const evtdate = (date) => moment(date).format("yyyy-MM-DD hh:mm")
export const intro = `Welcome to TimeTracker - Zeitmeister, your ultimate companion for mastering
the art of time management!
As the saying goes, "time is money," and every minute counts.

Our app empowers you to:
1. track your time with precision,
2. generate detailed reports, and
3. gain valuable insights into your daily activities.

By optimizing your time, you can:
1. boost productivity,
2. reduce stress, and
3. achieve more in less time.

With TimeTracker - Zeitmeister, take control of your schedule and unlock your full potential.
`
export const CALC_HEIGHT_MINUS = 64;
export const EVENTS_NAME = "calendarEvents";
export const getResourceColour = (type) => {
  // #0d6efd Work
  // #6c757d Holiday
  // #000000 Other
  // #ffc107 Conference
  // #dc3545 Transit
  // #495057 Hobbies
  // #198754 Free Time
  // #343a40 Cultural events
  // #f8f9fa Physical workout
  // #11cff0 Paid-time off
  // #212529 Self-improvement
  // #ffffff Studying/learning
  switch (type) {
    case "Work": return { background: "#0d6efd", color: "#fff" }
    case "Holiday": return { background: "#6c757d", color: "#fff" }
    case "Other": return { background: "#000000", color: "#fff" }
    case "Conference": return { background: "#ffc107", color: "#000" }
    case "Transit": return { background: "#dc3545", color: "#fff" }
    case "Hobbies": return { background: "#495057", color: "#fff" }
    case "Free Time": return { background: "#198754", color: "#fff" }
    case "Cultural events": return { background: "#343a40", color: "#fff" }
    case "Physical workout": return { background: "#f8f9fa", color: "#000" }
    case "Paid-time off": return { background: "#11cff0", color: "#000" }
    case "Self-improvement": return { background: "#212529", color: "#fff" }
    case "Studying/learning": return { background: "#ffffff", color: "#000" }
    default: return { background: "auto", color: "auto" };
  }
}
export function getDuration(startDate, endDate) {
  // Parse the start and end dates
  const startTime = moment(new Date(startDate));
  const endTime = moment(new Date(endDate));
  // Calculate the difference
  const duration = moment.duration(endTime.diff(startTime));
  // Extract the individual units
  const years = duration.years();
  const months = duration.months();
  const weeks = Math.floor(duration.asWeeks()) - (years * 52) - (months * 4.345); // 4.345 is the average number of weeks in a month
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  // Format the output
  let output = "The event lasts for ";
  if (years > 0) output += `${years} year${years > 1 ? 's' : ''}, `;
  if (months > 0) output += `${months} month${months > 1 ? 's' : ''}, `;
  if (weeks > 0) output += `${weeks} week${weeks > 1 ? 's' : ''}, `;
  if (days > 0) output += `${days} day${days > 1 ? 's' : ''}, `;
  if (hours > 0) output += `${hours} hour${hours > 1 ? 's' : ''}, `;
  if (minutes > 0) output += `${minutes} minute${minutes > 1 ? 's' : ''}`;
  if (!years && !months && !weeks && !days && !hours && !minutes)
    output += "an indeterminate amount of time"
  // Remove the trailing comma and space if present
  output = output.replace(/, $/, '');
  return `${output}.`;
}
export const PALETTE_COMMANDS = [
  {
    name: "About",
    description: "Go to /about page",
    route: "/about"
  },
  {
    name: "Homepage",
    description: "Go to / page",
    route: "/"
  },
  {
    name: "Calendar",
    description: "Go to /calendar page",
    route: "/calendar"
  },
  {
    name: "Patches",
    description: "Go to /patch-notes page",
    route: "/patch-notes"
  },
  {
    name: "Results",
    description: "Go to /results page",
    route: "/results"
  },
];

const getFormattedDate = (date) => date.toISOString();
export function parseISODate(isoString) {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid ISO date string');
  }

  return date;
}

export function combineDateAndTime(dates) {
  const start = new Date(dates.start), end = new Date(dates.end)
  // Extract the date parts from the first date
  const year = start.getFullYear();
  const month = start.getMonth();
  const day = start.getDate();

  // Extract the time parts from the second date
  const hours = end.getHours();
  const minutes = end.getMinutes();
  const seconds = end.getSeconds();
  const milliseconds = end.getMilliseconds();

  // Create a new Date object with the combined values
  const combinedDate = new Date(year, month, day, hours, minutes, seconds, milliseconds);
  return combinedDate;
}

export function dailyUntilEndDate(startDate, endDate) {
  let dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(getFormattedDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates.map(d => new Date(d));
}

export function dailyUntilEndOfWeek(startDate) {
  let dates = [];
  let currentDate = new Date(startDate);

  // Continue adding dates until the end of the week (Saturday)
  while (currentDate.getDay() !== 6) { // 6 represents Saturday
    dates.push(getFormattedDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Add the last day (Saturday) if it hasn't been added yet
  if (currentDate.getDay() === 6) { dates.push(getFormattedDate(currentDate)); }
  return dates.map(d => new Date(d));
}

export function dailyUntilFriday(startDate) {
  let dates = [];
  let currentDate = new Date(startDate);
  while (currentDate.getDay() !== 6) { // 5 represents Friday
    dates.push(getFormattedDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates.filter(d => new Date(d).getDay() !== 0 && new Date(d).getDay() !== 6).map(d => new Date(d));
}

export function dailyUntilEndOfMonth(startDate) {
  let dates = [];
  let currentDate = new Date(startDate);
  let lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  while (currentDate <= lastDayOfMonth) {
    dates.push(getFormattedDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  dates.push(currentDate)
  return dates.map(d => new Date(d));
}

export function workDaysUntilEndOfMonth(startDate) {
  let dates = [];
  let currentDate = new Date(startDate);
  let lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  while (currentDate <= lastDayOfMonth) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Exclude Sunday (0) and Saturday (6)
      dates.push(getFormattedDate(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates.map(d => new Date(d));
}

export const stepToSlots = [
  { step: 5, timeslots: 6, value: 0 },
  { step: 10, timeslots: 3, value: 1 },
  { step: 15, timeslots: 2, value: 2 },
  { step: 15, timeslots: 3, value: 3 },
  { step: 20, timeslots: 3, value: 4 },
  { step: 30, timeslots: 2, value: 5 },
  { step: 45, timeslots: 3, value: 6 },
  { step: 60, timeslots: 2, value: 7 }
];

export const getPriority = (lv) => {
  switch (lv) {
    case 0: return { txt: "Urgent and important", color: "rgb(255, 0, 0)" }
    case 1: return { txt: "Not urgent, but important", color: "rgb(85, 73, 255)" }
    case 2: return { txt: "Urgent, but not important", color: "rgb(255, 255, 0)" }
    case 3: return { txt: "Neither urgent nor important", color: "rgb(100, 100, 100)" }
    default: return { txt: "Priority inconclusive", color: "rgb(150, 150, 150)" }
  }
}
export const getPrioColours = (lv) => {
  switch (lv) {
    case 0: return { color: "white", background: "rgb(255, 0, 0)" }
    case 1: return { color: "white", background: "rgb(0, 0, 255)" }
    case 2: return { color: "black", background: "rgb(255, 255, 0)" }
    case 3: return { color: "white", background: "rgb(100, 100, 100)" }
    default: return { color: "black", background: "rgb(150, 150, 150)" }
  }
}
export function floorDivide(numerator, denominator = 10) {
  if (denominator === 0) throw new Error('Denominator cannot be zero');
  return Math.floor(numerator / denominator);
}

export const modulate = (index, denominator = 10) => index % denominator;

export const checkClientRect = (item1, rect2) => {
  if (!item1 || !rect2) return;
  const rect1 = item1.getBoundingClientRect();
  if (
    rect1.x === rect2.x &&
    rect1.y === rect2.y &&
    rect1.width === rect2.width &&
    rect1.height === rect2.height &&
    rect1.top === rect2.top &&
    rect1.bottom === rect2.bottom &&
    rect1.left === rect2.left &&
    rect1.right === rect2.right
  ) return true;
  return false;
}

export const getAbsolutePosition = (relativePosition, priority, dimensions) => {
  if (!relativePosition) return null;
  const rect = dimensions?.[priority?.value];
  if (!rect) return null;
  return {
    x: rect.left + rect.width * relativePosition.x,
    y: rect.top + rect.height * relativePosition.y
  };
};

export const generateUrgencyCsv = (urgencyRequests) => {
  const {
    urgentImportant = [],
    notUrgentImportant = [],
    urgentNotImportant = [],
    notUrgentNotImportant = [],
    undetermined = []
  } = urgencyRequests;
  const rows = [];
  rows.push(["Category", "Id", "Title", "Description", "Start", "End"]);
  const appendEvents = (category, events) => {
    for (const evt of events) {
      rows.push([
        category,
        evt.id ?? "",
        evt.title ?? evt.name ?? "",
        evt.description ?? "",
        evt.start ? new Date(evt.start).toLocaleString() : "",
        evt.end ? new Date(evt.end).toLocaleString() : ""
      ]);
    }
  };

  appendEvents("Urgent & Important", urgentImportant);
  appendEvents("Important Not Urgent", notUrgentImportant);
  appendEvents("Urgent Not Important", urgentNotImportant);
  appendEvents("Not Urgent Not Important", notUrgentNotImportant);
  appendEvents("Undetermined", undetermined);

  const csv = rows.map(row => row.map(value =>`"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = url;
  link.download = `urgency-report-${timestamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateUrgencyMarkdown = (urgencyRequests) => {
  const {
    urgentImportant = [],
    notUrgentImportant = [],
    urgentNotImportant = [],
    notUrgentNotImportant = [],
    undetermined = []
  } = urgencyRequests;

  const formatRow = (evt) => [
    evt.id ?? "",
    evt.title ?? evt.name ?? "",
    evt.description ?? "",
    evt.start ? new Date(evt.start).toLocaleString() : "",
    evt.end ? new Date(evt.end).toLocaleString() : ""
  ];

  const buildTable = (title, events) => {
    let md = `## ${title}\n\n`;
    md += `| ID | Title | Description | Start | End |\n`;
    md += `|----|-------|-------------|-------|-----|\n`;

    for (const evt of events) {
      const row = formatRow(evt)
        .map(v => String(v).replace(/\|/g, "\\|"));
      md += `| ${row.join(" | ")} |\n`;
    }

    md += `\n`;
    return md;
  };

  let markdown = `# Urgency Report\n\nGenerated: ${new Date().toLocaleString()}\n\n`;

  markdown += buildTable("Urgent & Important", urgentImportant);
  markdown += buildTable("Important Not Urgent", notUrgentImportant);
  markdown += buildTable("Urgent Not Important", urgentNotImportant);
  markdown += buildTable("Not Urgent Not Important", notUrgentNotImportant);
  markdown += buildTable("Undetermined", undetermined);

  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  link.href = url;
  link.download = `urgency-report-${timestamp}.md`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateUrgencyJson = (urgencyRequests) => {
  const {
    urgentImportant = [],
    notUrgentImportant = [],
    urgentNotImportant = [],
    notUrgentNotImportant = [],
    undetermined = []
  } = urgencyRequests;

  const exportData = {
    generatedAt: new Date().toISOString(),
    categories: {
      urgentImportant,
      notUrgentImportant,
      urgentNotImportant,
      notUrgentNotImportant,
      undetermined
    },
    summary: {
      total:
        urgentImportant.length +
        notUrgentImportant.length +
        urgentNotImportant.length +
        notUrgentNotImportant.length +
        undetermined.length
    }
  };

  const json = JSON.stringify(exportData, null, 2);

  const blob = new Blob([json], {
    type: "application/json;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  link.href = url;
  link.download = `urgency-report-${timestamp}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateUrgencyPdf = (urgencyRequests) => {
  const {
    urgentImportant = [],
    notUrgentImportant = [],
    urgentNotImportant = [],
    notUrgentNotImportant = [],
    undetermined = []
  } = urgencyRequests;

  const rows = [];

  const appendEvents = (category, events) => {
    for (const evt of events) {
      rows.push([
        category,
        evt.id ?? "",
        evt.title ?? evt.name ?? "",
        evt.start
          ? new Date(evt.start).toLocaleString()
          : "",
        evt.end
          ? new Date(evt.end).toLocaleString()
          : "",
        evt.completed ? "Yes" : "No"
      ]);
    }
  };

  appendEvents("Urgent & Important", urgentImportant);
  appendEvents("Important Not Urgent", notUrgentImportant);
  appendEvents("Urgent Not Important", urgentNotImportant);
  appendEvents("Not Urgent Not Important", notUrgentNotImportant);
  appendEvents("Undetermined", undetermined);

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Eisenhower Matrix Report", 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  autoTable(doc, {
    startY: 35,
    head: [["Category", "Id", "Title", "Start", "End", "Completed"]],
    body: rows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [33, 37, 41] }
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  doc.save(`urgency-report-${timestamp}.pdf`);
};