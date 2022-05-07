import React, { useEffect, useState } from 'react'
import { StyledView } from './HomeScreen.styled';
import { useDispatch } from 'react-redux';
import { Screens } from '../../../navigation/Screens';
import { useNavigation } from '@react-navigation/native';
import ImageButton from '../../atoms/ImageButton/ImageButton.component';
import nice from '../../../../assets/niceoffice.jpg'
import messy from '../../../../assets/messy.jpg'
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import storage from 'firebase/storage'
import Spinner from '../../atoms/Spinner/Spinner.component';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    (async () => {
      await Camera.requestCameraPermissionsAsync();
      // setHasPermission(status === 'granted');
    })();
  },[])

  const uploadImage = async (image) => {
    const response = await fetch(image);
    const blob:any = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
      reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
  });
    // const blob = await response.blob();
    const fileName = image.substring(image.lastIndexOf('/') + 1);
    try {
      setLoading(true);
      const ref = storage.ref().child(new Date().toISOString());
      const snapshot = await ref.put(blob);
      blob.close();
    } catch (e) {
      console.error(e);
    }finally{
      setLoading(false);
    }
  };

  const handleCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });
    if(!result.cancelled){
      await uploadImage(result["uri"])
    }
    // navigation.navigate(Screens.CAMERA);
  }

  return (
    <StyledView colors={['#a8c0ff', '#3f2b96']}>  
      {loading && <Spinner />}
      <ImageButton raise onPress={handleCamera} src={nice} />
      <ImageButton raise onPress={()=>{}} dislike src={messy} />
    </StyledView>
  )
}

export default HomeScreen