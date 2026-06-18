export const WORKDAY_TIMEZONE = 'Europe/Copenhagen';

export function zonedParts(date, timeZone = WORKDAY_TIMEZONE) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = Number(part.value);
    return acc;
  }, {});
  return parts;
}

export function timezoneOffsetMinutes(date, timeZone = WORKDAY_TIMEZONE) {
  const parts = zonedParts(date, timeZone);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return Math.round((asUtc - date.getTime()) / 60000);
}

export function zonedTimeToDate(year, month, day, hour, minute, timeZone = WORKDAY_TIMEZONE) {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const offset = timezoneOffsetMinutes(utcGuess, timeZone);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0) - offset * 60000);
}

export function workdayEndTime(date = new Date(), timeZone = WORKDAY_TIMEZONE) {
  const today = zonedParts(date, timeZone);
  let end = zonedTimeToDate(today.year, today.month, today.day, 19, 0, timeZone);
  if (date >= end) {
    const tomorrow = zonedParts(new Date(end.getTime() + 24 * 60 * 60 * 1000), timeZone);
    end = zonedTimeToDate(tomorrow.year, tomorrow.month, tomorrow.day, 19, 0, timeZone);
  }
  return end;
}

export function workdayPermissions({ coreSettings = {}, profile = {}, workdayPrivacy = {}, notificationPrefs = {} } = {}) {
  return {
    gps: Boolean(coreSettings.gps && workdayPrivacy.gps && workdayPrivacy.audience !== 'none'),
    logbook: Boolean(coreSettings.logbook && profile.logbook && workdayPrivacy.logbook),
    notifications: Boolean(workdayPrivacy.notifications && (notificationPrefs.office || notificationPrefs.rules || notificationPrefs.chat)),
    audience: workdayPrivacy.audience,
    showSpeed: Boolean(workdayPrivacy.showSpeed),
    showVehicle: Boolean(workdayPrivacy.showVehicle),
    showStatus: Boolean(workdayPrivacy.showStatus),
  };
}

export function logbookStats(logEntries = []) {
  const places = new Set(logEntries.map(entry => entry.place).filter(Boolean));
  return {
    total: logEntries.length,
    places: places.size,
    images: logEntries.filter(entry => entry.image).length,
    auto: logEntries.filter(entry => entry.source === 'auto').length,
    favorites: logEntries.filter(entry => entry.favorite).length,
  };
}

export function currentLogbookPlace({ employee = {}, profile = {}, location = {} } = {}) {
  const place = location.sharing
    ? employee.location || 'Aktuel GPS-position'
    : employee.location || profile.department || 'Min lokation';
  return location.sharing ? `Min lokation · ${place}` : place;
}

export function logbookSuggestions({
  logbookAutomation = {},
  employee = {},
  profile = {},
  location = {},
  activePickup = null,
  employees = [],
  vehicles = [],
  pickupStatusLabel = status => status || 'Status',
} = {}) {
  if (!logbookAutomation.smartLogbook) return [];
  const suggestions = [];
  if (logbookAutomation.autoPlace) {
    suggestions.push({
      kind: 'current-location',
      title: 'Gem aktuel lokation',
      place: location.sharing ? (employee.location || 'Live-position') : (employee.location || profile.department || 'Dagens sted'),
      note: location.sharing
        ? `Live GPS var aktiv med cirka ${location.speed || 0} km/t og ${location.points || 0} punkter.`
        : `Forslag fra din profil: ${employee.status || 'arbejdsdag på vejen'}.`,
    });
  }
  if (logbookAutomation.autoPickup && activePickup) {
    const helper = employees.find(employeeItem => employeeItem.id === activePickup.employeeId);
    suggestions.push({
      kind: 'pickup-task',
      title: 'Gem afhentningsopgave',
      place: helper.location || 'Afhentning',
      note: `${pickupStatusLabel(activePickup.status)}: ${activePickup.note || 'Kollegahjælp'}${helper ? ` for ${helper.name}` : ''}.`,
    });
  }
  if (logbookAutomation.autoStops && location.sharing && location.speed < 6 && location.points > 0) {
    suggestions.push({
      kind: 'pause-stop',
      title: 'Gem pause eller stop',
      place: employee.location || 'Pause på ruten',
      note: `Du har holdt stille ved ${employee.location || 'ruten'}. God kandidat til en privat pause-note.`,
    });
  }
  if (logbookAutomation.autoVehicle) {
    const vehicle = vehicles.find(item => item.unit === profile.truck || item.driverId === employee.id);
    suggestions.push({
      kind: 'vehicle-day',
      title: 'Gem dagens køretøj',
      place: employee.location || profile.department || 'På tur',
      note: `${vehicle.unit || profile.truck || 'Køretøj'} · ${vehicle.status || employee.status || 'klar til arbejde'}.`,
    });
  }
  if (logbookAutomation.autoMilestones) {
    suggestions.push({
      kind: 'milestone',
      title: 'Gem milepæl',
      place: employee.location || 'Dagens rute',
      note: `Dagens lille note: ${employee.status || 'en tur der er værd at huske'}.`,
    });
  }
  return suggestions;
}

export function draftId(kind, place) {
  return `${kind}-${String(place || 'sted').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-')}`;
}

export function draftFromSuggestion(suggestion, now = new Date()) {
  return {
    id: draftId(suggestion.kind, suggestion.place),
    ...suggestion,
    date: 'I dag',
    category: suggestion.kind === 'pause-stop' ? 'Pause' : suggestion.kind === 'pickup-task' ? 'Afhentning' : suggestion.kind === 'vehicle-day' ? 'Køretøj' : 'Automatik',
    status: 'draft',
    createdAt: now.toISOString(),
  };
}

globalThis.XpressIntraWorkdayLogbook = {
  WORKDAY_TIMEZONE,
  zonedParts,
  timezoneOffsetMinutes,
  zonedTimeToDate,
  workdayEndTime,
  workdayPermissions,
  logbookStats,
  currentLogbookPlace,
  logbookSuggestions,
  draftId,
  draftFromSuggestion,
};
