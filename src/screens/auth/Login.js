import React, { useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Image, StatusBar } from 'react-native';
import { TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Button } from '../../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { signIn, clearWarn, setLoading, signInWithFacebook } from '../../store/actions/authActions';
import { strings } from '../../utils/localization';

const Login = props => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [authMethod, setAuthMethod] = useState('');
   const passwordRef = useRef();

   const goToRegister = () => {
      props.clearWarn();
      props.navigation.navigate('Register');
   }

   const tryLogin = () => {
      const emailExist = email.trim().length;
      const passwordExist = password.trim().length;
      if (emailExist && passwordExist) {
         setAuthMethod('email');
         props.setLoading();
         props.signIn({ email, password });
      }
   }

   const tryFBLogin = () => {
      setAuthMethod('fb');
      props.setLoading();
      props.signInWithFacebook();
   }

   return (
      <ScrollView contentContainerStyle={s.main}>
         <StatusBar barStyle='dark-content' backgroundColor='white' />
         <Image
            style={s.logo}
            resizeMode="contain"
            source={require('../../assets/img/common/logo.png')}
         />
         <Text style={s.welcomeText}>{strings.welcome}</Text>
         <Text style={s.subText}>{strings.tagline}</Text>
         <TextInput
            disableFullscreenUI
            style={s.textInput}
            maxLength={50}
            selectionColor='#a6c3fe'
            returnKeyType='next'
            keyboardType='email-address'
            placeholder={strings.email}
            onSubmitEditing={() => passwordRef.current.focus()}
            onEndEditing={event => setEmail(event.nativeEvent.text)}
         />
         <TextInput
            ref={passwordRef}
            disableFullscreenUI
            style={s.textInput}
            maxLength={50}
            selectionColor='#a6c3fe'
            returnKeyType='done'
            placeholder={strings.password}
            secureTextEntry={true}
            onEndEditing={event => setPassword(event.nativeEvent.text)}
         />
         <Button
            disabled={props.isLoading}
            style={s.button}
            title={strings.enter}
            activeOpacity={0.9}
            icon={props.isLoading && authMethod === 'email' ? <ActivityIndicator color='white' /> : null}
            onPress={() => tryLogin()}
         />
         <TouchableOpacity
            disabled={props.isLoading}
            style={s.forgot}
            onPress={() => props.navigation.navigate('ResetPassword')}
         >
            <Text style={s.forgotText}>{strings.forgot}</Text>
         </TouchableOpacity>
         <Text style={s.warn}>{props.loginWarn?.slice(props.loginWarn.indexOf(' '))}</Text>
         <View style={s.socialBox}>
            {/* <Text style={s.socialText}>Войти через</Text> */}
            <Button
               disabled={props.isLoading}
               style={s.facebook}
               title={strings.fbLogin}
               activeOpacity={0.9}
               icon={props.isLoading && authMethod === 'fb'
                  ? <ActivityIndicator color='white' />
                  : <Icon name="facebook-official" color='white' size={14} />
               }
               onPress={() => tryFBLogin()}
            />
            {/* <Button
               style={s.google}
               title='Google'
               activeOpacity={0.9}
               icon={<Icon name="google" color='white' size={14} />}
            /> */}
         </View>

         <View style={s.registerWrapper}>
            <View style={s.registerBox}>
               <Text>{strings.noAccount}</Text>
               <TouchableOpacity
                  disabled={props.isLoading}
                  activeOpacity={0.5}
                  onPress={() => goToRegister()}
               >
                  <Text style={s.registerButton}>{strings.register}</Text>
               </TouchableOpacity>
            </View>
         </View>
      </ScrollView>
   )
}

export default connect(
   (state) => ({
      loginWarn: state.auth.loginWarn,
      isLoading: state.auth.isLoading
   }),
   {
      signIn,
      clearWarn,
      setLoading,
      signInWithFacebook
   }
)(Login);

const s = StyleSheet.create({
   main: {
      flexGrow: 1,
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingTop: 5,
      paddingBottom: 15
      // paddingVertical: 15
   },
   logo: {
      width: 125,
      height: 95,
      alignSelf: 'center',
   },
   welcomeText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#2566d4',
      alignSelf: 'center',
      marginTop: 10
   },
   subText: {
      // fontSize: 16,
      // fontWeight: 'bold',
      // color: '#4f6488',
      alignSelf: 'center',
      marginTop: 5,
      marginBottom: 20
   },
   textInput: {
      width: '80%',
      alignSelf: 'center',
      borderColor: '#e1e3e6',
      borderBottomWidth: 1,
   },
   button: {
      width: '80%',
      alignSelf: 'center',
      color: 'white',
      backgroundColor: '#2566d4',
      marginTop: 20
   },
   forgot: {
      alignSelf: 'center',
      marginTop: 20,
   },
   forgotText: {
      color: '#4f6488',
   },
   socialText: {
      color: '#9da1a7',
      alignSelf: 'center',
      // marginTop: 30,
      marginRight: 10
   },
   socialBox: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // marginTop: 10,
      marginTop: 20,
      marginBottom: 20
   },
   facebook: {
      color: 'white',
      backgroundColor: '#3b5998',
      height: 30,
      paddingLeft: 15
   },
   // google: {
   //    flex: 1,
   //    color: 'white',
   //    backgroundColor: '#f04337',
   //    marginLeft: 10
   // },
   registerWrapper: {
      flex: 1,
      justifyContent: 'flex-end',
   },
   registerBox: {
      flexDirection: 'row',
      marginTop: 15,
      justifyContent: 'center',
      alignItems: 'center'
   },
   registerButton: {
      color: '#4f6488',
      fontWeight: 'bold',
      marginLeft: 5,
      paddingVertical: 5,
   },
   warn: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20
   }
})
