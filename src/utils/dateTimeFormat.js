import { strings } from './localization';

export const getLongDate = (timestamp) => {
  const weekdays = [
    strings.sun,
    strings.mon,
    strings.tue,
    strings.wed,
    strings.thu,
    strings.fri,
    strings.sat
  ];
  const months = [
    strings.jan,
    strings.feb,
    strings.mar,
    strings.apr,
    strings.may,
    strings.june,
    strings.july,
    strings.aug,
    strings.sept,
    strings.oct,
    strings.nov,
    strings.dec
  ];
  const date = new Date(timestamp);
  return `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

export const getShortDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`
}

export const getShortTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  return `${hours}:${minutes}`
}

export const stringToDate = (stringDate, hours = 0, minutes = 0) => {
  const year = parseInt(stringDate.substring(6, 10));
  const month = parseInt(stringDate.substring(3, 5)) - 1;
  const day = parseInt(stringDate.substring(0, 2));

  return new Date(year, month, day, hours, minutes);
}