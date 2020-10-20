import 'react-native-gesture-handler';
import React, { Component } from 'react';
import AppRoot from './utils/navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createFirestoreInstance } from 'redux-firestore';
import { ReactReduxFirebaseProvider, getFirebase } from 'react-redux-firebase';
import rootReducer from './store/reducers/rootReducer';
import { firebase } from './utils/firebase';
import { MenuProvider } from 'react-native-popup-menu';

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument(getFirebase))
  )
)

const rrfProps = {
  firebase: firebase.app(),
  config: {
    userProfile: 'users',
    useFirestoreForProfile: true,
  },
  dispatch: store.dispatch,
  createFirestoreInstance
}

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <MenuProvider>
            <AppRoot />
          </MenuProvider>
        </ReactReduxFirebaseProvider>
      </Provider>
    )
  }
}
