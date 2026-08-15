/**
 * Classic life-path arithmetic: every digit of the birth date is summed and the
 * total is reduced to a single digit, with 11 and 22 kept as master numbers.
 * Nothing here is predictive — the numbers are used only to pick which of the
 * prepared interpretation texts a visitor sees.
 */

export const MASTER_NUMBERS = [11, 22] as const;

/** Reduces a number to 1-9, stopping early on the master numbers 11 and 22. */
export function reduce(value: number): number {
  let current = Math.abs(Math.trunc(value));
  while (current > 9 && current !== 11 && current !== 22) {
    current = String(current)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return current;
}

/** Accepts "YYYY-MM-DD" or "DD.MM.YYYY" and returns 0 when the date is unusable. */
export function lifePath(birth: string | undefined): number {
  if (!birth) return 0;
  const digits = birth.replace(/\D/g, "");
  if (digits.length !== 8) return 0;
  const sum = digits.split("").reduce((total, digit) => total + Number(digit), 0);
  return reduce(sum);
}

/** Day-of-birth number: the personality digit, reduced the same way. */
export function birthdayNumber(birth: string | undefined): number {
  if (!birth) return 0;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birth);
  if (iso) return reduce(Number(iso[3]));
  const dotted = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(birth);
  if (dotted) return reduce(Number(dotted[1]));
  return 0;
}

/** "1994-03-07" -> "7 марта 1994". Returns the input untouched if unparsable. */
const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export function formatBirth(birth: string | undefined): string {
  if (!birth) return "";
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birth);
  if (!iso) return birth;
  const month = MONTHS[Number(iso[2]) - 1];
  if (!month) return birth;
  return `${Number(iso[3])} ${month} ${iso[1]}`;
}
