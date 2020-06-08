import moment from "moment-timezone";
const defaultTimezone = "America/New_York";

export function formatEventDate(date) {
  const dateFormat = "MMMM Do, YYYY [on a] dddd";
  return moment.tz(new Date(date), defaultTimezone).format(dateFormat);
}

export function formatEventTimes(startTimeDate, endTimeDate) {
  const timeFormat = "h:mma";
  const startTime = moment
    .tz(new Date(startTimeDate), defaultTimezone)
    .format(timeFormat);
  const endTime = moment
    .tz(new Date(endTimeDate), defaultTimezone)
    .format(timeFormat);
  return {
    startTime,
    endTime
  };
  // console.log(startTime, endTime)
}

// formatEventTimes("2019-06-25T12:00:00.000Z", "2019-06-25T14:00:00.000Z")
