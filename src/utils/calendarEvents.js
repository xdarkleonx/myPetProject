import RNCalendarEvents from 'react-native-calendar-events';

const saveEvent = async (data, calendarId) => {
  return RNCalendarEvents.saveEvent(data.title, {
    calendarId: calendarId,
    startDate: data.startDate,
    endDate: data.startDate,
    description: data.description,
    alarms: [{ date: 5 }]
  }).then(id => {
    //console.log('Added to calendar:', calendarId, ', date:', data.startDate)
    return id;
  });
}

const saveCalendarAndEvent = async (data) => {
  return RNCalendarEvents.saveCalendar({
    title: 'sportbook',
    color: '#1777e6',
    name: 'Sportbook',
    accessLevel: 'owner',
    ownerAccount: 'sportbook',
    source: {
      name: 'Sportbook schedule',
      type: 'sportbook',
      isLocalAccount: true
    },
  }).then(id => {
    return saveEvent(data, id);
  });
}

const checkCalendarAndSaveEvent = async (data) => {
  return RNCalendarEvents.findCalendars().then(calendars => {
    //console.log('Existing calendars:', calendars);
    const sportbook = calendars.find(c => c.title === 'sportbook');
    if (sportbook) {
      //console.log('Not create new calendar')
      return saveEvent(data, sportbook.id);
    } else {
      //console.log('Save new calendar')
      return saveCalendarAndEvent(data);
    }
  });
}

export const setAlarm = async (data) => {
  return RNCalendarEvents.authorizationStatus().then(autStatus => {
    if (autStatus === 'denied' || autStatus === 'undetermined') {
      RNCalendarEvents.authorizeEventStore().then(status => {
        if (status !== 'denied' || status !== 'undetermined') {
          return checkCalendarAndSaveEvent(data);
          //console.log('First authoriztion')
        }
      });
    } else {
      return checkCalendarAndSaveEvent(data);
      //console.log('Authorized')
    }
  })
}

export const deleteAlarm = async (id) => {
  return RNCalendarEvents.removeEvent(id)
}


