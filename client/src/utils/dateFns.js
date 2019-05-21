const format = require("date-fns/format");

export function formatEventDate(date) {
  return format(new Date(date), "MMMM MM, YYYY [on a] dddd");
}

export function formatEventTimes(startTimeDate, endTimeDate) {
  const startTime = format(new Date(startTimeDate), "h:mma");
  const endTime = format(new Date(endTimeDate), "h:mma");
  // console.log(startTime, endTime)
}

// formatEventTimes("2019-06-25T12:00:00.000Z", "2019-06-25T14:00:00.000Z")
