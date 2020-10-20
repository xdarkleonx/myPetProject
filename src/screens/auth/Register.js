import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput } from 'react-native';
import { TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Button } from '../../components/Button';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';
import { days, months, years, sex } from '../../utils/constants';
import { connect } from 'react-redux';
import { signUp, clearWarn, setLoading } from '../../store/actions/authActions';
import { alert } from '../../utils/alertWrapper';
import { strings } from '../../utils/localization';

const Register = props => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [birthDay, setBirthDay] = useState();
  const [birthMonth, setBirthMonth] = useState();
  const [birthYear, setBirthYear] = useState();

  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const redStar = <Text style={s.red}> *</Text>;
  const arrowDown = <Icon style={s.arrowDown} name="angle-down" color="#9da1a7" size={18} />;

  const newUser = {
    birthday: Date.parse(new Date(birthYear, birthMonth, birthDay)) || '',
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender
  }

  useEffect(() => {
    return () => props.clearWarn();
  }, [])

  const tryRegister = newUser => {
    const completedFields = Object.values(newUser).reduce((total, value) => {
      const valueExist = String(value).trim()?.length;
      const valueNotUndefined = String(value) !== 'undefined';
      if (valueExist && valueNotUndefined)
        return total = total + 1;
      return total;
    }, 0);

    // console.log(newUser)
    if (completedFields === 7) {
      props.setLoading();
      props.signUp(newUser);
    } else {
      alert(strings.requireFieldsHasRedStar, strings.requireFields);
    }
  }

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
        <Text style={s.title}>{strings.fastRegister}</Text>
      </View>
      <View style={s.fieldsBox}>
        <Text style={s.inputTitle}>{strings.firstName}{redStar}</Text>
        <TextInput
          disableFullscreenUI
          style={s.textInput}
          maxLength={40}
          placeholder={strings.firstNamePh}
          returnKeyType='next'
          value={firstName}
          onChangeText={text => setFirstName(text.replace(/\s/g, ''))}
          onSubmitEditing={() => lastNameRef.current.focus()}
        />
        <Text style={s.inputTitle}>{strings.lastName}{redStar}</Text>
        <TextInput
          ref={lastNameRef}
          disableFullscreenUI
          style={s.textInput}
          maxLength={40}
          placeholder={strings.lastNamePh}
          returnKeyType='next'
          value={lastName}
          onChangeText={text => setLastName(text.replace(/\s/g, ''))}
          onSubmitEditing={() => emailRef.current.focus()}
        />
        <Text style={s.inputTitle}>{strings.email}{redStar}</Text>
        <TextInput
          ref={emailRef}
          disableFullscreenUI
          style={s.textInput}
          maxLength={50}
          placeholder={strings.emailPh}
          keyboardType='email-address'
          returnKeyType='next'
          value={email}
          onChangeText={text => setEmail(text.replace(/\s/g, ''))}
          onSubmitEditing={() => passwordRef.current.focus()}
        />
        <Text style={s.inputTitle}>{strings.password}{redStar}</Text>
        <TextInput
          ref={passwordRef}
          disableFullscreenUI
          style={s.textInput}
          maxLength={40}
          selectionColor='#a6c3fe'
          placeholder={strings.passwordPh}
          // secureTextEntry={true}
          returnKeyType='next'
          value={password}
          onChangeText={text => setPassword(text.replace(/\s/g, ''))}
          onSubmitEditing={() => phoneRef.current.focus()}
        />
        <Text style={s.inputTitle}>{strings.phoneTitle}{redStar}</Text>
        <TextInput
          ref={phoneRef}
          disableFullscreenUI
          style={s.textInput}
          maxLength={15}
          placeholder={strings.phonePh}
          keyboardType='phone-pad'
          returnKeyType='next'
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text.replace(/\s/g, ''))}
        />
        <Text style={s.inputTitle}>{strings.birthday}{redStar}</Text>
        <View style={s.birthdayBox}>
          <RNPickerSelect
            style={picker}
            useNativeAndroidPickerStyle={false}
            Icon={() => arrowDown}
            placeholder={{ label: strings.day, color: '#a9a9a9' }}
            items={days}
            onValueChange={value => setBirthDay(value)}
          />
          <RNPickerSelect
            style={picker}
            useNativeAndroidPickerStyle={false}
            Icon={() => arrowDown}
            placeholder={{ label: strings.month, color: '#a9a9a9' }}
            items={months}
            onValueChange={value => setBirthMonth(value)}
          />
          <RNPickerSelect
            style={picker}
            useNativeAndroidPickerStyle={false}
            Icon={() => arrowDown}
            placeholder={{ label: strings.year, color: '#a9a9a9' }}
            items={years}
            onValueChange={value => setBirthYear(value)}
          />
        </View>
        <Text style={s.inputTitle}>{strings.gender}{redStar}</Text>
        <RNPickerSelect
          style={picker}
          useNativeAndroidPickerStyle={false}
          Icon={() => arrowDown}
          placeholder={{ label: strings.genderPh, color: '#a9a9a9' }}
          items={sex}
          onValueChange={value => setGender(value)}
        />
      </View>
      {props.signUpWarn &&
        <Text style={s.warn}>
          {props.signUpWarn.slice(props.signUpWarn.indexOf(' '))}
        </Text>
      }
      <View style={s.registerWrapper}>
        <Button
          disabled={props.isLoading}
          style={s.button}
          title={strings.registerAndEnter}
          activeOpacity={0.9}
          icon={props.isLoading ? <ActivityIndicator color='white' /> : null}
          onPress={() => tryRegister(newUser)}
        />
      </View>
    </ScrollView>
  )
}

export default connect(
  (state) => ({
    signUpWarn: state.auth.signUpWarn,
    isLoading: state.auth.isLoading
  }),
  {
    signUp,
    clearWarn,
    setLoading
  }
)(Register);

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
    marginTop: 15,
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
  arrowDown: {
    marginLeft: 5,
    alignSelf: 'center'
  },
  birthdayBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  registerBox: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
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
  }
})

const picker = {
  inputAndroidContainer: {
    minWidth: '30%'
  },
  inputAndroid: {
    height: 38,
    fontSize: 14,
    borderBottomWidth: 1,
    borderColor: '#e1e3e6',
    color: '#4f6488',
  },
  iconContainer: {
    top: 8,
    right: 5,
  },
  placeholder: {
    color: '#a9a9a9'
  }
}