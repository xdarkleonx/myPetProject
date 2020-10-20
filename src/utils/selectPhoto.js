import ImagePicker from 'react-native-image-picker';
import { strings } from './localization';

export const selectPhoto = (title, photo, setPhoto, prevPhoto) => {
  const options = {
    maxWidth: 600,
    maxHeight: 600,
    ...(photo) && {
      customButtons: [{
        name: 'delete',
        title: strings.deleteCurrentPhoto
      }]
    },
    title: title,
  };

  ImagePicker.showImagePicker(options, (response) => {
    console.log('ImagePicker: ', response);

    if (response.didCancel) {
    }
    else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    }
    else if (response.customButton) {
      setPhoto({ prevPhotoSource: prevPhoto });
    }
    else {
      setPhoto({
        ...(prevPhoto) && {
          prevPhotoSource: prevPhoto
        },
        photoSource: { uri: response.uri },
        photoData: response.data
      })
    }
  });
};