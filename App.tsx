import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

function App() {
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const [imageData, setImageData] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const microphonePermission = await Camera.requestMicrophonePermission();

    console.log('Camera Permission:', cameraPermission);
    console.log('Microphone Permission:', microphonePermission);
  };

  const takePicture = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      setImageData(photo.path);
      setIsCameraActive(false);
      console.log('Photo Path:', photo.path);
    }
  };

  if (!device) {
    return (
      <ActivityIndicator
        style={styles.loadingIndicator}
        size="large"
        color="#FF0037"
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isCameraActive ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          />
        </View>
      ) : (
        <View style={styles.previewContainer}>
          {imageData ? (
            <Image
              source={{uri: `file://${imageData}`}}
              style={styles.previewImage}
            />
          ) : (
            <Text style={styles.noImageText}>No Image Captured</Text>
          )}
          <TouchableOpacity
            style={styles.photoButton}
            onPress={() => setIsCameraActive(true)}>
            <Text style={styles.photoButtonText}>Click Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF0037',
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  photoButton: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#4c669f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  photoButtonText: {
    fontSize: 16,
    color: '#4c669f',
    fontWeight: 'bold',
  },
});

export default App;
