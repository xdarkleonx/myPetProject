import { getShortDate, getLongDate } from '../../utils/dateTimeFormat';

const today = Date.now();

const initState = {
  timestamp: today,
  shortDate: getShortDate(today),
  longDate: getLongDate(today),
};

const mainReducer = (state = initState, action) => {
  switch (action.type) {
    case 'CHANGE_DATE':
      console.log({ ...action, shortDate: getShortDate(action.timestamp) });
      return {
        ...state,
        timestamp: action.timestamp,
        shortDate: getShortDate(action.timestamp),
        longDate: getLongDate(action.timestamp)
      }

    default:
      return state;
  }
}

export default mainReducer;