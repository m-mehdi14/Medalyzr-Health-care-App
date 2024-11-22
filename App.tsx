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
import LinearGradient from 'react-native-linear-gradient';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

function App() {
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const [imageData, setImageData] = useState('');
  console.log('🚀 Image ------ > ', imageData);
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
      // @ts-ignore
      const photo = await camera.current.takePhoto();

      setImageData(photo.path);

      // Create a FormData object to send the image file
      const formData = new FormData();
      formData.append('file', {
        uri: `file://${photo.path}`, // Ensure correct file URI for Android/iOS
        name: 'captured_image.jpg', // File name
        type: 'image/jpeg', // MIME type
      });
      setIsCameraActive(false);
    }
  };

  if (!device) {
    return (
      <ActivityIndicator
        style={styles.loadingIndicator}
        size="large"
        color="#00AEEF"
      />
    );
  }

  return (
    <LinearGradient colors={['#003973', '#E5E5BE']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {!isCameraActive && (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Health Analyzer</Text>
              <Text style={styles.subtitle}>
                Capture and analyze health data effortlessly
              </Text>
            </View>
          </>
        )}

        {isCameraActive ? (
          <View style={styles.cameraContainer}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setIsCameraActive(false)}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Camera
              ref={camera}
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              photo={true}
            />
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}>
              <Text style={styles.captureButtonText}>Capture</Text>
            </TouchableOpacity>
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
              <Text style={styles.photoButtonText}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    paddingTop: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  captureButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 6,
    elevation: 6,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  previewImage: {
    width: '90%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 4,
  },
  noImageText: {
    fontSize: 18,
    // color: '#4A4A4A',
    color: '#fff',
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: '#00AEEF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 4,
    elevation: 5,
  },
  photoButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  backButtonText: {
    color: '#FF5722',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageWrapper: {
    position: 'relative',
    width: '90%',
    height: 250,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF0000',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 5,
  },
  deleteIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
