import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { DatePicker } from '@delightfulstudio/react-native-wheel-picker-android'
import { Button } from './Button';
import { getShortTime, stringToDate } from '../utils/dateTimeFormat';
import { setAlarm, deleteAlarm } from '../utils/calendarEvents';
import { hideFoodModal, updateMealTime } from '../store/actions/foodActions';
import { hideTrainModal, updateWorkoutTime } from '../store/actions/trainActions';
import { strings } from '../utils/localization';
import 'moment/locale/en-gb';

const EditTime = props => {
  const [time, setTime] = useState();
  const [title, setTitle] = useState();
  const [isMeal, setIsMeal] = useState();
  const [alarmId, setAlarmId] = useState();
  const [date, setDate] = useState();
  const [prevTime, setPrevTime] = useState();
  const [type, setType] = useState();
  const [mealKey, setMealKey] = useState();
  const [alarmTitle, setAlarmTitle] = useState();
  const [alarmDescription, setAlarmDescription] = useState();

  useEffect(() => {

    const path = 'foodTimeInfo';
    setIsMeal(true);
    setTitle(strings.changeMealTime);

    setTime(getShortTime(Date.now()));
    setAlarmId(props[path].alarmId);
    setDate(props[path].date);
    setPrevTime(props[path].prevTime);
    setType(props[path].type);
    setMealKey(props[path].mealKey);

    switch (props[path].type) {
      case 'food':
        setAlarmTitle(strings.mealTIme);
        setAlarmDescription(strings.mealTimeText);
        break;
      case 'water':
        setAlarmTitle(strings.waterTime);
        setAlarmDescription(strings.waterTimeText);
        break;
    }
  }, [])

  const createAlarm = (hours, minutes) => {
    const params = { type, date, time }
    setAlarm({
      title: alarmTitle,
      description: alarmDescription,
      startDate: stringToDate(date, hours, minutes),
    }).then(id => {
      params.alarmId = id;
      params.mealKey = mealKey;
      props.updateMealTime(params);
    })
  }

  const removeAlarm = () => {
    const params = { type, date, time: null }
    params.mealKey = mealKey;
    deleteAlarm(alarmId).then(() => {
      props.updateMealTime(params)
    })
  }

  const changeTime = async () => {
    const hours = parseInt(time.substring(0, 2));
    const minutes = parseInt(time.substring(3, 5));

    if (prevTime !== time) {
      alarmId
        ? deleteAlarm(alarmId).then(() => createAlarm(hours, minutes))
        : createAlarm(hours, minutes);
    }
    else {
      props.hideFoodModal()
    }
  }

  return (
    <View style={s.main}>
      <Text style={s.title}>{title}</Text>
      <Text style={s.text}>
        {prevTime
          ? strings.formatString(strings.settedTimeFs, prevTime)
          : strings.notSettedTime}
      </Text>
      <DatePicker
        indicatorColor='#9da1a7'
        styles={datePicker}
        mode='time'
        onDateChange={(date) => setTime(getShortTime(date))}
      />
      <View style={s.row}>
        {prevTime &&
          <Button
            style={s.buttonMargin}
            title={strings.deleteTime}
            icon={<IconFA name="times" color="red" size={13} />}
            onPress={() => removeAlarm()}
          />
        }
        <Button
          style={s.button}
          title={strings.formatString(strings.changeFs, time)}
          icon={<IconFA name="check" color="darkseagreen" size={13} />}
          onPress={() => changeTime()}
        />
      </View>
    </View>
  )
};

export default connect(
  state => ({
    foodTimeInfo: state.food.timeInfo,
  }),
  {
    updateMealTime,
    hideFoodModal,
  }
)(EditTime);

const s = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    elevation: 3,
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    color: '#9da1a7',
    textAlign: 'center',
    marginTop: 10
  },
  button: {
    width: 160
  },
  buttonMargin: {
    width: 160,
    marginRight: 10
  },
  row: {
    flexDirection: 'row'
  }
});

const datePicker = {
  picker: {
    marginVertical: 10,
  },
  hours: {
    width: 80
  },
  minutes: {
    width: 80
  },
}

