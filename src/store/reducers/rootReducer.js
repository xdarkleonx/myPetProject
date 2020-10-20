import authReducer from './authReducer';
import mainReducer from './mainReducer';
import foodReducer from './foodReducer';
import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

const rootReducer = combineReducers({
  auth: authReducer,
  main: mainReducer,
  food: foodReducer,
  firestore: firestoreReducer,
  firebase: firebaseReducer,
})

export default rootReducer;
