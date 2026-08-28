// Mirrors backend/src/utils/dateWindow.js's join-window logic (kept in sync manually -
// the actual enforcement happens server-side in the join-room socket handler; this is
// just so the "Join Call" button reflects the same window instead of always showing).
const JOIN_WINDOW_BEFORE_MS = 10 * 60 * 1000;
const JOIN_WINDOW_AFTER_MS = 15 * 60 * 1000;

const parseTimeOnDate = (dateStr, hhmm) => {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

const parseSlotRange = (dateStr, timeRange) => {
  const [startTime, endTime] = timeRange.split(" - ");
  return { start: parseTimeOnDate(dateStr, startTime), end: parseTimeOnDate(dateStr, endTime) };
};

export const isWithinJoinWindow = (dateStr, timeRange) => {
  const { start, end } = parseSlotRange(dateStr, timeRange);
  const now = Date.now();
  return now >= start.getTime() - JOIN_WINDOW_BEFORE_MS && now <= end.getTime() + JOIN_WINDOW_AFTER_MS;
};

// For messaging: "before" the window opens vs "after" it's closed
export const getJoinWindowState = (dateStr, timeRange) => {
  const { start, end } = parseSlotRange(dateStr, timeRange);
  const now = Date.now();
  if (now < start.getTime() - JOIN_WINDOW_BEFORE_MS) return "before";
  if (now > end.getTime() + JOIN_WINDOW_AFTER_MS) return "after";
  return "open";
};
