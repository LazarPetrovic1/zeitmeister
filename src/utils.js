import moment from "moment";

// EVENT INTERFACE
//
// {
//   allDay?: boolean | undefined;
//   title?: React.ReactNode | undefined;
//   start?: Date | undefined;
//   end?: Date | undefined;
//   resource?: any;
// }

export const evtdate = (date) => moment(date).format("yyyy-MM-DD hh:mm")
export const intro = `Welcome to TimeTracker - Zeitmeister, your ultimate companion for mastering the art of time management!
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
];

const getFormattedDate = (date) => date.toISOString();
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
    case 0:
      return { txt: "Urgent and important", color: "rgb(255, 0, 0)" }
    case 1:
      return { txt: "Not urgent, but important", color: "rgb(0, 0, 255)" }
    case 2:
      return { txt: "Urgent, but not important", color: "rgb(255, 255, 0)" }
    case 3:
      return { txt: "Neither urgent nor important", color: "rgb(100, 100, 100)" }
    default:
      return { txt: "Priority inconclusive", color: "rgb(150, 150, 150)" }
  }
}