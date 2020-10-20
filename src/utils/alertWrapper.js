import { Alert } from 'react-native';

export const alert = (text, title, buttons, cancelable) => {
  const titleText = title || '';
  const mainText = text || '';
  const alertButtons = buttons || [];
  const isCancelable = { cancelable: cancelable ? cancelable : true };
  Alert.alert(titleText, mainText, alertButtons, isCancelable);
}
