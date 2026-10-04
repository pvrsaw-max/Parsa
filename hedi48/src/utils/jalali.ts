/**
 * Precision Jalali (Shamsi) Calendar & Persian Formatting Utilities
 */

export interface JalaliDate {
  jy: number; // Jalali year (e.g. 1405)
  jm: number; // Jalali month (1 - 12)
  jd: number; // Jalali day (1 - 31)
}

// Convert numbers 0-9 to Persian digits
export function toPersianDigits(n: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}

// Gregorian to Jalali conversion algorithm
export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy: number;
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return { jy, jm, jd };
}

// Jalali to Gregorian conversion algorithm
export function jalaliToGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
  let gy: number;
  if (jy > 979) {
    gy = 1600;
    jy -= 979;
  } else {
    gy = 621;
  }
  let days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 0; gm < 13; gm++) {
    const v = sal_a[gm];
    if (gd <= v) break;
    gd -= v;
  }
  return { gy, gm, gd };
}

export const PERSIAN_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const PERSIAN_WEEKDAY_NAMES = [
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
  'شنبه',
];

// Returns full formatted Persian date string e.g. "شنبه، ۱۲ آبان ۱۴۰۵"
export function formatJalaliDate(date: Date = new Date()): string {
  const j = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const weekdayName = PERSIAN_WEEKDAY_NAMES[date.getDay()];
  const monthName = PERSIAN_MONTH_NAMES[j.jm - 1];
  return `${weekdayName}، ${toPersianDigits(j.jd)} ${monthName} ${toPersianDigits(j.jy)}`;
}

// Returns short Persian date string e.g. "۱۲ آبان"
export function formatShortJalali(date: Date): string {
  const j = gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${toPersianDigits(j.jd)} ${PERSIAN_MONTH_NAMES[j.jm - 1]}`;
}

// Returns standard ISO date string "YYYY-MM-DD"
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Convert ISO string "YYYY-MM-DD" to formatted Persian date
export function isoToJalaliString(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const gy = parseInt(parts[0], 10);
  const gm = parseInt(parts[1], 10);
  const gd = parseInt(parts[2], 10);
  const date = new Date(gy, gm - 1, gd);
  return formatJalaliDate(date);
}

// Convert minutes to Persian time format (e.g. "۲ ساعت و ۳۰ دقیقه" or "۴۵ دقیقه")
export function formatMinutesToPersian(minutes: number): string {
  if (minutes < 60) {
    return `${toPersianDigits(minutes)} دقیقه`;
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (remMinutes === 0) {
    return `${toPersianDigits(hours)} ساعت`;
  }
  return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(remMinutes)} دقیقه`;
}
