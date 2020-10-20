import firebaseApp from '@react-native-firebase/app';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { uploadImageFromUrl } from '../../utils/firebase';

export const setLoading = () => ({
  type: 'SET_AUTH_LOADING'
})

export const clearWarn = () => ({
  type: 'CLEAR_WARN_MESSAGE'
})

export const signUp = (newUser) => {
  return (dispatch, getState, getFirebase) => {
    const firebase = getFirebase();
    const firestore = getFirebase().firestore();

    firebase.auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password)
      .then(response => {
        firestore.collection('users').doc(response.user.uid).set({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          birthday: newUser.birthday,
          gender: newUser.gender,
        })
      })
      .then(() => {
        dispatch({ type: 'SIGNUP_SUCCESS' });
      }).catch(error => {
        dispatch({ type: 'SIGNUP_ERROR', error });
      })
  }
}

export const signIn = (data) => {
  return (dispatch, getState, getFirebase) => {
    const firebase = getFirebase();

    firebase.auth().signInWithEmailAndPassword(
      data.email,
      data.password
    ).then((user) => {
      dispatch({ type: 'LOGIN_SUCCESS', user });
    }).catch(error => {
      dispatch({ type: 'LOGIN_ERROR', error });
    })
  }
}

export const signInWithFacebook = () => {
  return (dispatch, getState, getFirebase) => {
    const firebase = getFirebase();
    LoginManager
      .logInWithPermissions(['public_profile', 'email', 'user_gender'])
      .then(result => {
        if (result.isCancelled)
          return Promise.reject('The user cancelled fb auth request');
        return AccessToken.getCurrentAccessToken();
      })
      .then(data => {
        const credential = firebaseApp.auth.FacebookAuthProvider.credential(data.accessToken);
        return firebase.auth().signInWithCredential(credential);
      })
      .then(fbUser => {
        console.log('Fb user:', fbUser);
        const isNewUser = fbUser.additionalUserInfo.isNewUser;
        const fbImageUrl = fbUser.additionalUserInfo.profile.picture.data.url;
        const profile = fbUser.additionalUserInfo.profile;

        if (isNewUser) {
          uploadImageFromUrl('avatars', fbImageUrl, imageUrl => {
            firebase.firestore()
              .collection('users')
              .doc(fbUser.user.uid)
              .set({
                email: profile.email,
                firstName: profile.first_name,
                lastName: profile.last_name,
                gender: profile.gender,
                avatar: imageUrl,
              })
          })
        }
      })
      .then(() => {
        dispatch({ type: 'FB_LOGIN_SUCCESS' });
      })
      .catch(error => {
        dispatch({ type: 'FB_LOGIN_ERROR', error });
      })
  }
}

export const signOut = () => {
  return (dispatch, getState, getFirebase) => {
    const firebase = getFirebase();

    firebase.auth().signOut().then(() => {
      dispatch({ type: 'SIGNOUT_SUCCESS' });
    })
  }
}

export const sendResetMail = (email, navigation) => {
  return (dispatch, getState, getFirebase) => {
    const firebase = getFirebase();

    firebase.auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        navigation.navigate('Login');
        dispatch({ type: 'SEND_RESET_SUCCESS' });
      }).catch(error => {
        dispatch({ type: 'SEND_RESET_ERROR', error });
      })
  }
}