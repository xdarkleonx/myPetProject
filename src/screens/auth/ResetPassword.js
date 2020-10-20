import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Button } from '../../components/Button';
import { connect } from 'react-redux';
import { clearWarn, setLoading, sendResetMail } from '../../store/actions/authActions';
import { strings } from '../../utils/localization';

const ResetPassword = props => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    return () => props.clearWarn();
  }, [])

  const sendToMail = () => {
    const emailExist = email.trim().length;
    if (emailExist) {
      props.setLoading();
      props.sendResetMail(email, props.navigation);
    }
  }

  // console.log('->', newUser)

  return (
    <ScrollView contentContainerStyle={s.main}>
      <View style={s.header}>
        <TouchableOpacity
          style={s.backButton}
          activeOpacity={0.5}
          onPress={() => props.navigation.goBack()}
        >
          <Image
            style={s.arrowIcon}
            resizeMode="contain"
            source={require('../../assets/img/common/left-arrow.png')}
          />
        </TouchableOpacity>
        <Text style={s.title}>{strings.recoverPassword}</Text>
      </View>
      <View style={s.fieldsBox}>
        <Text style={s.inputTitle}>{strings.emailTitle}<Text style={s.red}>*</Text></Text>
        <TextInput
          disableFullscreenUI
          style={s.textInput}
          maxLength={40}
          placeholder={strings.registerEmailPh}
          returnKeyType='next'
          value={email}
          onChangeText={(text) => setEmail(text.replace(/\s/g, ''))}
        />

      </View>
      <Text style={s.remind}>{strings.needCheckMail}</Text>
      {props.resetWarn &&
        <Text style={s.warn}>{props.resetWarn.slice(props.resetWarn.indexOf(' '))}</Text>
      }
      <View style={s.registerWrapper}>
        <Button
          disabled={props.isLoading}
          style={s.button}
          title={strings.sendInstructions}
          activeOpacity={0.9}
          icon={props.isLoading ? <ActivityIndicator color='white' /> : null}
          onPress={() => sendToMail()}
        />
      </View>
    </ScrollView>
  )
}

export default connect(
  (state) => ({
    resetWarn: state.auth.resetWarn,
    isLoading: state.auth.isLoading
  }),
  {
    clearWarn,
    setLoading,
    sendResetMail
  }
)(ResetPassword);

const s = StyleSheet.create({
  main: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    width: 11,
    height: 17,
  },
  backButton: {
    width: 40,
    position: 'absolute',
    left: 10,
    paddingRight: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  red: {
    color: 'red',
  },
  fieldsBox: {
    marginTop: 30,
    marginHorizontal: 10
  },
  inputTitle: {
    marginTop: 5,
    marginLeft: 5,
  },
  textInput: {
    color: '#4f6488',
    borderColor: '#e1e3e6',
    borderBottomWidth: 1,
    height: 38,
    paddingVertical: 0,
  },
  registerWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    color: 'white',
    backgroundColor: '#2566d4',
    marginTop: 20
  },
  warn: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20
  },
  remind: {
    color: 'orange',
    textAlign: 'center',
    marginTop: 20
  }
})