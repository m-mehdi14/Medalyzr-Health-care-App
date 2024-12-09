import {Alert} from 'react-native';
import RNFS from 'react-native-fs';
import {Camera} from 'react-native-vision-camera';

export const CheckPermissions = async () => {
  const cameraPermission = await Camera.requestCameraPermission();
  const microphonePermission = await Camera.requestMicrophonePermission();

  if (cameraPermission !== 'granted' || microphonePermission !== 'granted') {
    Alert.alert(
      'Permissions Required',
      'Camera and Microphone permissions are required to use this app.',
    );
  }
};

export const CaptureImage = async camera => {
  try {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      const base64Image = await RNFS.readFile(photo.path, 'base64');
      return {
        base64Image: `data:image/jpeg;base64,${base64Image}`,
        path: photo.path,
      };
    }
  } catch (error) {
    console.error('Error capturing photo:', error);
    Alert.alert('Error', 'Failed to capture image. Please try again.');
    return null;
  }
};

export const UploadImage = async base64Image => {
  try {
    const response = await fetch(
      'https://medalyzer-backend.onrender.com/api/v1/analyze-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({image_data: base64Image, is_url: false}),
      },
    );

    const result = await response.json();
    if (response.ok) {
      return {success: true, data: result};
    } else {
      return {success: false, message: 'Failed to analyze the image.'};
    }
  } catch (error) {
    console.error('Network Error:', error);
    return {success: false, message: 'Network error. Please try again.'};
  }
};
