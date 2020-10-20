import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import IconM from 'react-native-vector-icons/MaterialIcons';
import { Button } from './Button';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { menu, menuTriggerStyles, menuOptionsStyles } from '../styles/menu';
import { connect } from 'react-redux';
import { showFoodModal, removeWater, setWaterInfo, setMealTimeInfo, acceptMeal } from '../store/actions/foodActions';
import { debounce } from 'lodash';
import { strings } from '../utils/localization';

const Water = props => {
  const time = props.time || '--:--';

  const openTimeModal = () => {
    const { mealKey, date, time, alarmId } = props;
    props.showFoodModal();
    props.setMealTimeInfo({
      type: 'water',
      prevTime: time,
      mealKey: mealKey,
      date: date,
      alarmId: alarmId
    })
  }

  const openWaterModal = () => {
    const { amount, date, mealKey } = props;
    props.showFoodModal();
    props.setWaterInfo({ amount, date, mealKey })
  }

  const setAccept = isAccepted => {
    const { date, mealKey } = props;
    props.acceptMeal({
      mealKey,
      type: 'water',
      accepted: isAccepted,
      date: date,
    })
  }

  const removeWater = () => {
    const { removeWater, waters, date, mealKey } = props;
    const waterCount = Object.keys(waters).length;
    removeWater(date, mealKey, waterCount);
  }

  return (
    <View style={s.main}>
      <View style={s.rowBox}>
        <Text style={s.title}>{props.mealName}</Text>
        <TouchableOpacity
          style={s.rowBox}
          disabled={props.accepted}
          onPress={openTimeModal}
        >
          <IconM name="access-time" color="#96a1ba" size={20} />
          <Text style={s.timeStyle}>{time}</Text>
        </TouchableOpacity>
        <Menu style={menu}>
          <MenuTrigger customStyles={menuTriggerStyles}>
            <Image
              style={s.menuIcon}
              source={require('../assets/img/common/menu-horiz.png')}
            />
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsStyles}>
            {props.accepted &&
              <MenuOption
                text={strings.menuDeclineMeal}
                onSelect={debounce(() => setAccept(false), 300)}
              />
            }
            <MenuOption
              text={strings.menuDeleteMeal}
              onSelect={debounce(removeWater, 300)}
            />
          </MenuOptions>
        </Menu>
      </View>
      <TouchableOpacity
        style={s.rowBox}
        disabled={props.accepted}
        onPress={openWaterModal}
      >
        <Image
          style={s.image}
          resizeMode="contain"
          source={require('../assets/img/food/water.jpg')}
        />
        <View style={{ justifyContent: 'center' }}>
          <Text style={s.blue}>{strings.water}</Text>
          <View style={s.count}>
            <Text style={s.round}>{strings.waterAbbrev}</Text>
            <Text style={s.value}>{strings.formatString(strings.amountFs, props.amount)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      {!props.accepted && (
        <Button
          title={strings.accept}
          style={s.button}
          icon={<IconFA name="check" color="darkseagreen" size={13} />}
          onPress={() => setAccept(true)}
        />
      )}
    </View>
  )

}

export default connect(
  state => ({
    date: state.main.shortDate,
    waters: state.firestore.data.waters,
  }),
  {
    showFoodModal,
    removeWater,
    setWaterInfo,
    setMealTimeInfo,
    acceptMeal
  }
)(Water);

const s = StyleSheet.create({
  main: {
    width: '100%',
    backgroundColor: 'white',
    elevation: 3,
    padding: 10,
    marginBottom: 10,
  },
  rowBox: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    height: 38,
    borderRadius: 18,
    backgroundColor: '#e6eaf0',
    marginTop: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 5,
  },
  menu: {
    position: 'absolute',
    right: 0,
    paddingVertical: 8,
  },
  menuIcon: {
    width: 20,
    height: 5,
  },
  timeStyle: {
    color: '#9da1a7',
    paddingLeft: 3,
  },
  image: {
    marginTop: 10,
    marginRight: 3,
    width: 38,
    height: 43
  },
  blue: {
    color: '#4f6488',
  },
  count: {
    flexDirection: 'row',
    marginTop: 5
  },
  round: {
    textAlign: 'center',
    backgroundColor: '#f0f0f1',
    color: '#4f6488',
    width: 18,
    height: 18,
    marginRight: 4,
    borderRadius: 9,
    fontSize: 13,
    lineHeight: 16,
  },
  value: {
    fontSize: 13,
  },
})