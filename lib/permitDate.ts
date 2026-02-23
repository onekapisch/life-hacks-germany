export function subtractMonthsClamped(date: Date, months: number): Date {
  const wholeMonths = Math.trunc(months);
  const totalMonths = date.getUTCFullYear() * 12 + date.getUTCMonth() - wholeMonths;
  const nextYear = Math.floor(totalMonths / 12);
  const nextMonth = ((totalMonths % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(Date.UTC(nextYear, nextMonth + 1, 0)).getUTCDate();
  const nextDay = Math.min(date.getUTCDate(), lastDayOfTargetMonth);

  const next = new Date(date);
  next.setUTCFullYear(nextYear, nextMonth, nextDay);
  return next;
}
