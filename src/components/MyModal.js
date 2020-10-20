import React from 'react';
import { StyleSheet, View, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';

const MyModal = props => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={props.modalVisible}
      onRequestClose={() => props.onRequestClose && props.onRequestClose()}
    >
      <ScrollView contentContainerStyle={s.main}>
        <TouchableWithoutFeedback
          onPress={() => props.onRequestClose && props.onRequestClose()}
        >
          <View style={s.darkFill}>
            <View onStartShouldSetResponder={() => true}>
              {props.children}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Modal>
  )
}

export default MyModal;

const s = StyleSheet.create({
  main: {
    flexGrow: 1
  },
  darkFill: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center'
  },
});