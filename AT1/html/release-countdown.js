const RELEASE_TIME_ZONE = "America/Los_Angeles";
const FRIDAY = 5;

const countdownParts = {
  days: document.getElementById("countdown-days"),
  hours: document.getElementById("countdown-hours"),
  minutes: document.getElementById("countdown-minutes"),
  seconds: document.getElementById("countdown-seconds"),
};
const countdownDate = document.getElementById("countdown-date");

const getDateParts = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(date);

  return parts.reduce((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
};

const getZonedMidnight = (year, month, day, timeZone) => {
  const targetTime = Date.UTC(year, month - 1, day);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  });
  let timestamp = targetTime;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parts = formatter.formatToParts(new Date(timestamp)).reduce((result, part) => {
      result[part.type] = part.value;
      return result;
    }, {});
    const representedTime = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    timestamp += targetTime - representedTime;
  }

  return new Date(timestamp);
};

const getNextRelease = () => {
  const now = new Date();
  const localParts = getDateParts(now, RELEASE_TIME_ZONE);
  const weekdayNumber = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    .indexOf(localParts.weekday);
  const daysUntilFriday = (FRIDAY - weekdayNumber + 7) % 7 || 7;
  const targetCalendarDate = new Date(Date.UTC(
    Number(localParts.year),
    Number(localParts.month) - 1,
    Number(localParts.day) + daysUntilFriday,
  ));

  return getZonedMidnight(
    targetCalendarDate.getUTCFullYear(),
    targetCalendarDate.getUTCMonth() + 1,
    targetCalendarDate.getUTCDate(),
    RELEASE_TIME_ZONE,
  );
};

const formatCountdown = (value) => String(value).padStart(2, "0");
const formatReleaseDate = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

let nextRelease = getNextRelease();
countdownDate.textContent = `Next release: ${formatReleaseDate.format(nextRelease)} (your local time).`;

const updateCountdown = () => {
  let remaining = nextRelease.getTime() - Date.now();
  if (remaining <= 0) {
    nextRelease = getNextRelease();
    countdownDate.textContent = `Next release: ${formatReleaseDate.format(nextRelease)} (your local time).`;
    remaining = nextRelease.getTime() - Date.now();
  }

  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  countdownParts.days.textContent = formatCountdown(Math.floor(totalSeconds / 86400));
  countdownParts.hours.textContent = formatCountdown(Math.floor((totalSeconds % 86400) / 3600));
  countdownParts.minutes.textContent = formatCountdown(Math.floor((totalSeconds % 3600) / 60));
  countdownParts.seconds.textContent = formatCountdown(totalSeconds % 60);
};

updateCountdown();
window.setInterval(updateCountdown, 1000);
