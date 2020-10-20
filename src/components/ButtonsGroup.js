import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback, TouchableOpacity } from 'react-native';

export const ButtonsGroup = props => {
  const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex);

  const commonStyle = (index, currentRow, itemsInRow) => {
    const buttonWidth = props.buttonWidth && { flex: 0, width: props.buttonWidth };
    const buttonHeight = props.buttonHeight && { height: props.buttonHeight };
    const marginBottom = props.rows > 1 && currentRow < props.rows && { marginBottom: 7 };
    const elevation = { elevation: props.style?.elevation || 2 };
    const marginRight = { marginRight: index + 1 !== currentRow * itemsInRow ? 10 : 0 };
    return { ...buttonWidth, ...buttonHeight, ...marginBottom, ...elevation, ...marginRight }
  }

  const bgColorStyle = index => {
    return {
      backgroundColor: selectedIndex == index
        ? props.selectedColor || '#2566d4'
        : 'white'
    }
  }

  const fontStyle = index => {
    return {
      fontSize: props.style?.fontSize || 14,
      color: selectedIndex == index
        ? props.selectedTextColor || 'white'
        : props.style?.color || 'black'
    }
  }

  const onPress = (index) => {
    if (props.toggle && selectedIndex === index) {
      setSelectedIndex(null);
      props.onPress && props.onPress(null);
    } else {
      setSelectedIndex(index);
      props.onPress && props.onPress(index);
    }
  }

  const TouchOpacity = (index, title, currentRow, itemsInRow) => {
    return (
      <TouchableOpacity key={index} activeOpacity={0.5}
        style={[s.inner, s.touchable, commonStyle(index, currentRow, itemsInRow), bgColorStyle(index)]}
        onPress={() => onPress(index)}
      >
        <Text style={fontStyle(index)}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }

  const TouchNativeFeedback = (index, title, currentRow, itemsInRow) => {
    return (
      <View
        key={index}
        style={[s.wrapper, commonStyle(index, currentRow, itemsInRow)]}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple('dark', true)}
          onPress={() => onPress(index)}
        >
          <View style={[s.inner, bgColorStyle(index)]}>
            <Text style={fontStyle(index)}>
              {title}
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  const renderButtons = () => {
    const rows = props.rows || 1;
    const itemsInRow = props.buttons.length / rows;
    let startAt = 0;
    let endAt = itemsInRow - 1;
    let rowButtons = [];

    for (let row = 1; row <= rows; row++) {
      rowButtons.push(
        <View key={row} style={s.buttonsBox}>
          {props.buttons.map((title, index) => {
            if (index >= startAt && index <= endAt) {
              startAt = startAt + 1;
              return (
                props.buttonStyle === 'TouchableOpacity'
                  ? TouchOpacity(index, title, row, itemsInRow)
                  : TouchNativeFeedback(index, title, row, itemsInRow)
              )
            }
          })}
        </View>
      )
      endAt = endAt * itemsInRow - 1;
    }

    return rowButtons;
  }
  
  return (
    <View
      style={[{ ...props.style }]}
      pointerEvents={props.disabled === true ? 'none' : 'auto'}
    >
      {renderButtons()}
    </View>
  )
}

const s = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: 38,
    backgroundColor: 'transparent',
    borderRadius: 18,
  },
  inner: {
    flex: 1,
    height: 38,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    elevation: 2
  },
  buttonsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})