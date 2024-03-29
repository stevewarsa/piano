// noinspection JSUnusedGlobalSymbols

import {
  format,
  subDays,
  differenceInCalendarDays,
  differenceInMinutes,
  toDate,
  parse,
  isBefore,
  isAfter,
  addDays,
  isPast,
  addMonths,
  addYears,
  endOfDay,
  isEqual,
  isValid,
  parseISO
} from "date-fns";

export class DateUtils {
  static readonly DATE_FORMAT = "MM/dd/yyyy";
  static readonly DATE_FORMAT_CALENDAR = "MM/dd/yyyy";

  /**
   * Checks if date1 is before date2
   *
   * @static
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @returns {boolean}
   *
   * @memberOf DateUtils
   */
  static isBefore(date1: Date | string, date2: Date | string): boolean {
    return isBefore(DateUtils.handleStringOrDate(date1), DateUtils.handleStringOrDate(date2));
  }

  /**
   * Checks if date1 is after date2
   *
   * @static
   * @param {Date | string} date1
   * @param {Date | string} date2
   * @returns {boolean}
   *
   * @memberOf DateUtils
   */
  static isAfter(date1: Date | string, date2: Date | string): boolean {
    return isAfter(DateUtils.handleStringOrDate(date1), DateUtils.handleStringOrDate(date2));
  }

  /**
   * Checks if date is in the past
   *
   * @static
   * @param {Date} date
   * @returns {boolean}
   *
   * @memberOf DateUtils
   */
  static isDateInPast(date: Date | string): boolean {
    return isPast(DateUtils.handleStringOrDate(date));
  }

  static addDays(date: Date | string, numberOfDays: number): Date {
    return addDays(DateUtils.handleStringOrDate(date), numberOfDays);
  }

  static subtractDays(date: Date | string, numberOfDays: number): Date {
    return subDays(DateUtils.handleStringOrDate(date), numberOfDays);
  }

  static daysInBetween(date1: Date | string, date2: Date | string): number {
    return differenceInCalendarDays(DateUtils.handleStringOrDate(date1), DateUtils.handleStringOrDate(date2));
  }

  static minutesInBetween(date1: Date, date2: Date): number {
    console.log("DateUtils.minutesInBetween - calculating difference in minutes between: date1=" + date1 + ", date2=" + date2);
    const diffInMinutes = differenceInMinutes(date1, date2);
    console.log("DateUtils.minutesInBetween - difference is " + diffInMinutes);
    return diffInMinutes;
  }

  static addMonths(date: Date | string, numberOfMonths: number): Date {
    return addMonths(DateUtils.handleStringOrDate(date), numberOfMonths);
  }

  static addYears(date: Date | string, numberOfYears: number): Date {
    return addYears(DateUtils.handleStringOrDate(date), numberOfYears);
  }
  static equals(date1: Date | string, date2: Date | string): boolean {
    return isEqual(DateUtils.handleStringOrDate(date1), DateUtils.handleStringOrDate(date2));
  }
  /**
   * Formats a date as per the given format
   *
   * @param {Date} date or string or milliseconds from epoch
   * @param {string} [formatStr] defaults to "MM/DD/YYYY"
   * @returns {string} formatted date
   */
  static formatDate(date: Date | string | number, formatStr?: string): string {
    let localFormat = formatStr || DateUtils.DATE_FORMAT;
    const dt = DateUtils.handleStringOrDate(date);
    return dt && isValid(dt) ? format(dt, localFormat) : "";
  }

  static formatISODate(date: string, formatStr?: string): string {
    let localFormat = formatStr || DateUtils.DATE_FORMAT;
    const dt = parseISO(date);
    return dt && isValid(dt) ? format(dt, localFormat) : "";
  }
  /**
   * Formats a date as per the given format
   *
   * @param {Date} date or string or milliseconds from epoch
   * @param {string} [formatStr] defaults to "MM/DD/YYYY"
   * @returns {string} formatted date
   */
  static formatDateTime(date: Date | string | number, formatStr?: string): string {
    let localFormat = formatStr || DateUtils.DATE_FORMAT;
    const dt = DateUtils.handleStringOrDate(date, false);
    return dt && isValid(dt) ? format(dt, localFormat) : "";
  }

  /**
   *
   * Parses a string as per the given format
   * @param {string} value
   * @param {string} [formatStr] defaults to "MM/DD/YYYY"
   * @returns {Date}
   */
  static parseDate(value: string, formatStr = DateUtils.DATE_FORMAT): Date | undefined {
    if (value) {
      return parse(value, formatStr, new Date());
    }
    return undefined;
  }

  static isMissing(date: Date): boolean {
    return typeof date === "undefined" || date === null;
  }

  /**
   * handles parsing of date if given date is a string.
   * Always returns the same timestamp (23:59:59) for all valid dates,
   * so that any comparison is done based on the date part alone
   *
   * @private
   * @static
   * @param {(Date | string | number)} date
   * @returns {(Date | undefined)}
   * @memberof DateUtils
   */
  private static handleStringOrDate(date: Date | string | number, eod: boolean=true): Date | undefined {
    if (typeof date === "string") {
      const dt = DateUtils.parseDate(date);
      if (typeof dt === "undefined") {
        return undefined;
      } else {
        return eod ? endOfDay(dt) : dt;
      }
    }
    return eod ? endOfDay(toDate(date)) : toDate(date);
  }
}
