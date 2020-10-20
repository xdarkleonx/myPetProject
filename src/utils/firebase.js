import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const blobToDataURL = (blob, callback) => {
  var a = new FileReader();
  a.onload = function (e) { callback(e.target.result); }
  a.readAsDataURL(blob);
}

const uploadImage = (path, imageData, callback) => {
  firebase
    .storage()
    .ref()
    .child(`${path}/image-${uuidv4()}`)
    .putString(imageData, 'base64')
    .then(snap => {
      firebase
        .storage()
        .ref()
        .child(snap.metadata.fullPath)
        .getDownloadURL()
        .then(imageUrl => callback(imageUrl))
        .catch((error) => console.log('Cannot read url: ' + error));
    })
    .catch(error => console.error('Error uploading file: ', error))
}

const uploadImageFromUrl = async (path, uri, callback) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = firebase.storage().ref();

  blobToDataURL(blob, dataurl => {
    const dataUrl = dataurl.replace('application/octet-stream', 'image/jpeg');
    ref
      .child(`${path}/image-${uuidv4()}`)
      .putString(dataUrl, 'data_url')
      .then(snap => {
        ref
          .child(snap.metadata.fullPath)
          .getDownloadURL()
          .then(imageUrl => callback(imageUrl))
          .catch(error => console.log('Cannot read url: ' + error));
      })
      .catch(error => {
        console.error(error);
      })
  })
}

const deleteFile = (path) => {
  firebase
    .storage()
    .ref()
    .child(path)
    .delete()
    .then(() => console.log(`File: ${path} deleted succesfull`))
    .catch(error => console.error('Error deleting file: ', error))
}

export { firebase, uploadImage, uploadImageFromUrl, deleteFile } 