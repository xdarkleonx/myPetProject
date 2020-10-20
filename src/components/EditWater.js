import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from './Button';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { WheelPicker } from '@delightfulstudio/react-native-wheel-picker-android'
import { connect } from 'react-redux';
import { hideFoodModal, updateWater } from '../store/actions/foodActions';
import { strings } from '../utils/localization';

const EditWater = props => {
  const [amount, setAmount] = useState(props.waterInfo.prevAmount);

  const date = props.waterInfo.date;
  const mealKey = props.waterInfo.mealKey;
  const prevAmount = props.waterInfo.prevAmount;
  const wheelData = Array.from(Array(100), (_, m) => `${(m + 1) * 5}`);
  const selectedPosition = (prevAmount / 5) - 1;

  return (
    <View style={s.main}>
      <Text style={s.title}>{strings.changeWaterAmount}</Text>
      <Text style={s.text}>
        {strings.formatString(strings.settedWaterFs, prevAmount)}
      </Text>
      <WheelPicker
        style={s.wheelPicker}
        isCurved
        isAtmospheric
        isCyclic
        selectedItemTextColor='black'
        selectedItemPosition={selectedPosition}
        data={wheelData}
        onItemSelected={event => setAmount(parseInt(event.data))}
      />
      <Button
        style={s.button}
        title={strings.formatString(strings.changeAmountFs, amount)}
        icon={<IconFA name="check" color="darkseagreen" size={13} />}
        onPress={() => {
          if (props.waterInfo.prevAmount !== amount) {
            props.updateWater({ date, mealKey, amount });
          } else {
            props.hideFoodModal();
          }
        }}
      />
    </View>
  )
};

export default connect(
  state => ({
    waterInfo: state.food.waterInfo
  }),
  { hideFoodModal, updateWater }
)(EditWater);

const s = StyleSheet.create({
  main: {
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 3,
    padding: 20,
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
    width: 200
  },
  wheelPicker: {
    width: 150,
    height: 145,
    marginVertical: 10,
  }
});
