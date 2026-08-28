// Booking/availability window: today through the next 6 days (7 days total).
// Dates are compared as "YYYY-MM-DD" strings (UTC-based, matching the frontend's
// `new Date().toISOString().split("T")[0]` convention already used for the date picker).
const WINDOW_DAYS = 7;

const toDateStr = (date) => date.toISOString().split("T")[0];

const getBookingWindow = () => {
  const today = new Date();
  const max = new Date();
  max.setDate(today.getDate() + WINDOW_DAYS - 1);
  return { todayStr: toDateStr(today), maxDateStr: toDateStr(max) };
};

const isWithinBookingWindow = (dateStr) => {
  const { todayStr, maxDateStr } = getBookingWindow();
  return dateStr >= todayStr && dateStr <= maxDateStr;
};

const parseTimeOnDate = (dateStr, hhmm) => {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const parseSlotStart = (dateStr, timeRange) => {
  const [startTime] = timeRange.split(" - ");
  return parseTimeOnDate(dateStr, startTime);
};

const parseSlotRange = (dateStr, timeRange) => {
  const [startTime, endTime] = timeRange.split(" - ");
  return { start: parseTimeOnDate(dateStr, startTime), end: parseTimeOnDate(dateStr, endTime) };
};

// Only meaningful for today's date - any other date within the window is always "future"
const isSlotInFuture = (dateStr, timeRange) => {
  const { todayStr } = getBookingWindow();
  if (dateStr !== todayStr) return true;
  return parseSlotStart(dateStr, timeRange).getTime() > Date.now();
};

// Video call join window: opens shortly before the slot starts, stays open a bit
// past the slot's end to allow for late joins/reconnects.
const JOIN_WINDOW_BEFORE_MS = 10 * 60 * 1000;
const JOIN_WINDOW_AFTER_MS = 15 * 60 * 1000;

const isWithinJoinWindow = (dateStr, timeRange) => {
  const { start, end } = parseSlotRange(dateStr, timeRange);
  const now = Date.now();
  return now >= start.getTime() - JOIN_WINDOW_BEFORE_MS && now <= end.getTime() + JOIN_WINDOW_AFTER_MS;
};

module.exports = {
  getBookingWindow,
  isWithinBookingWindow,
  isSlotInFuture,
  isWithinJoinWindow,
  parseSlotRange,
  JOIN_WINDOW_BEFORE_MS,
  JOIN_WINDOW_AFTER_MS,
};
