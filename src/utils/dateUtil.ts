/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(duration)

import { format } from 'date-fns';

const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
const DATE_FORMAT = 'yyyy-MM-dd ';

// Format Rule: https://date-fns.org/v2.28.0/docs/format
const FORMATTERS = {
  normal: DATE_FORMAT,
  datetime: DATE_TIME_FORMAT,
  datetimeWithoutSec: 'yyyy-MM-dd HH:mm',
  monthOnly: 'MM-dd',
  hourOnly: 'HH:mm',
};

const dayjsParseDate = (date: dayjs.Dayjs | undefined) => {
  if (!date) return;
  if (date instanceof Date) return date;

  return dayjs(date).toDate();
};

export function formatDate(
  date: dayjs.Dayjs | undefined = undefined,
  formatter: string | ((f: typeof FORMATTERS) => string) = FORMATTERS.normal,
): string {
  if (typeof formatter === 'function') formatter = formatter(FORMATTERS);
  const parsedDate = dayjsParseDate(date);
  return parsedDate ? format(parsedDate, formatter) : '';
}

export function formatToDateTime(
  date: dayjs.Dayjs | undefined = undefined,
  formatter: string | ((f: typeof FORMATTERS) => string) = FORMATTERS.datetime,
) {
  // if (date == '0001-01-01T00:00:00Z') date = '';
  return formatDate(date, formatter);
}

export function formatToDateTimeBy12HWithLocale(
  date: dayjs.Dayjs | undefined = undefined,
  locale: string,
) {
  // Moment format style: https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format
  // 中文： 2022-05-29 下午 3:44:52
  // En: 2022-05-29 03:44:52 PM
  const formatter = locale === 'zh_CN' ? 'YYYY-MM-DD A h:mm:ss' : 'YYYY-MM-DD hh:mm:ss A';
  return dayjs(date).format(formatter);
}

/**
 * UTC时间转换
 * @returns {string}
 * @param datetime UTC时间
 * @param dateSeprator 日期拼接符
 * @param timeSeprator 时间拼接符
 * @Eexample dateFormat("2021-09-03T22:42:05.659+00:00", "/", ":")
 *           dateFormat("2021-09-03T22:42:05.659+00:00")
 */
export function transTimestamp(datetime: any, dateSeprator = '-', timeSeprator = ':') {
  if (datetime === '0001-01-01T00:00:00Z') {
    return '';
  } else {
    const date = new Date(datetime)
    const year = `${date.getUTCFullYear()}`
    let month = `${date.getUTCMonth() + 1}`
    let day = `${date.getUTCDate()}`
    let hour = `${date.getUTCHours()}`
    let minute = `${date.getUTCMinutes()}`
    let second = `${date.getUTCSeconds()}`

    if (month.length === 1) {
      month = `0${month}`
    }
    if (day.length === 1) {
      day = `0${day}`
    }
    if (day.length === 1) {
      day = `0${day}`
    }
    if (hour.length === 1) {
      hour = `0${hour}`
    }
    if (minute.length === 1) {
      minute = `0${minute}`
    }
    if (second.length === 1) {
      second = `0${second}`
    }
    return `${year}${dateSeprator}${month}${dateSeprator}${day} ${hour}${timeSeprator}${minute}${timeSeprator}${second}`
  }
}

export function getDuration(start: any, end: any) {
  let millisecond = dayjs(end).diff(dayjs(start))
  return dayjs.duration(millisecond)
}


export function formatDateToLocale(datetime: any){
  return dayjs(datetime).tz(dayjs.tz.guess())
}

export const formatToDate = formatDate;
export const dateUtil = dayjs;
