// Test clock for development - allows overriding current time
// In production, this should always return actual time

let testTime: Date | null = null;

export function setTestTime(time: Date | null) {
  testTime = time;
}

export function getTestTime(): Date | null {
  return testTime;
}

export function getCurrentTime(): Date {
  return testTime || new Date();
}

// Helper to set time by hour and minute
export function setTestTimeByHourMinute(hour: number, minute: number = 0) {
  const now = new Date();
  now.setHours(hour, minute, 0, 0);
  setTestTime(now);
}
