import { TouchableOpacity } from 'react-native';

export const menu = {
  position: 'absolute',
  right: 0,
  //paddingVertical: 8,
}

export const menuIcon = {
  width: 20,
  height: 5,
}

export const arrowDown = {
  marginLeft: 5,
  alignSelf: 'center'
}

export const triggerText = {
  fontSize: 22,
  fontWeight: 'bold'
}

export const menuTriggerStyles = {
  triggerWrapper: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingLeft: 8,
  },
  TriggerTouchableComponent: TouchableOpacity,
  triggerTouchable: {
    activeOpacity: 0.5,
  },
};

export const menuOptionsStyles = {
  optionsContainer: {
    width: 'auto',
  },
  optionWrapper: {
    margin: 5,
    padding: 7,
  },
  optionTouchable: {
    activeOpacity: 70,
  }
};

export const menuHeadOptionsStyles = {
  optionsContainer: {
    width: 'auto',
  },
  optionText: {
    fontSize: 15,
  },
  optionWrapper: {
    margin: 5,
    padding: 7,
  },
  optionTouchable: {
    activeOpacity: 70,
  }
};

// export const menuHeadTriggerStyles = {
//   triggerWrapper: {
//      flexDirection: 'row',
//      paddingVertical: 8,
//      paddingLeft: 8
//   },
//   TriggerTouchableComponent: TouchableOpacity,
//   triggerTouchable: {
//      activeOpacity: 0.5,
//   },
// };