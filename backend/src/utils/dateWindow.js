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

const parseSlotStart = (dateStr, timeRange) => {
  const [startTime] = timeRange.split(" - ");
  const [hours, minutes] = startTime.split(":").map(Number);
  const slotDate = new Date(`${dateStr}T00:00:00`);
  slotDate.setHours(hours, minutes, 0, 0);
  return slotDate;
};

// Only meaningful for today's date - any other date within the window is always "future"
const isSlotInFuture = (dateStr, timeRange) => {
  const { todayStr } = getBookingWindow();
  if (dateStr !== todayStr) return true;
  return parseSlotStart(dateStr, timeRange).getTime() > Date.now();
};

module.exports = { getBookingWindow, isWithinBookingWindow, isSlotInFuture };
