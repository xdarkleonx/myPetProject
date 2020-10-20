import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import debounce from 'lodash/debounce';

export const Button = props => {
  const [isChecked, setChecked] = useState(props.checked);

  const onPress = () => {
    props.toggle && setChecked(!isChecked);
    props.onPress && props.onPress();
  }

  const onPressDebounced = debounce(() => {
    props.toggle && setChecked(!isChecked);
    props.onPress && props.onPress();
  }, props.debounce || 250)

  return (
    <TouchableOpacity
      disabled={props.disabled}
      activeOpacity={props.activeOpacity || 0.5}
      style={[
        styles.touchable,
        props.style,
        isChecked && { backgroundColor: '#2566d4' }
      ]}
      onPress={props.debounce === false ? onPress : onPressDebounced}
    >
      {props.icon}
      {props.title &&
        <Text style={[
          styles.text,
          props.style?.color && { color: props.style.color },
          isChecked && { color: 'white' }
        ]}>
          {props.title}
        </Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touchable: {
    //  flex: 1,
    height: 38,
    borderRadius: 18,
    paddingHorizontal: 10,
    backgroundColor: '#e6eaf0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 13,
    paddingHorizontal: 5,
    paddingVertical: 10,
    color: '#4f6488'
  },
})
