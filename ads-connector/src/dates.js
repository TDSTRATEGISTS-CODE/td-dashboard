// Date helpers. Amazon reports use each profile's own timezone, so "today" is per profile.

export function todayIn(timeZone, now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function addDays(isoDate, n) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// Splits [start, end] into consecutive chunks of at most maxDays.
export function chunkRange(start, end, maxDays) {
  const out = [];
  for (let s = start; s <= end; s = addDays(s, maxDays)) {
    const e = addDays(s, maxDays - 1);
    out.push([s, e < end ? e : end]);
  }
  return out;
}
