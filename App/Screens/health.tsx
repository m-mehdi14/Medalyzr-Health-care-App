import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  // useCameraDevices,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';

export default function CameraFeedScreen() {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const devices = useCameraDevice('back');
  const device = devices;

  const {
    hasPermission: hasCameraPermission,
    requestPermission: requestCameraPermission,
  } = useCameraPermission();
  const {
    hasPermission: hasMicrophonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const cameraPermissionGranted = await requestCameraPermission();
        const microphonePermissionGranted = await requestMicrophonePermission();

        if (cameraPermissionGranted && microphonePermissionGranted) {
          setPermissionsGranted(true);
          setIsCameraActive(true);
          console.log('Camera and microphone permissions granted.');
        } else {
          Alert.alert(
            'Permissions Required',
            'Camera and microphone permissions are required to use this feature.',
          );
        }
      } catch (error) {
        console.log('Error requesting permissions:', error);
        Alert.alert('Error', 'Failed to request necessary permissions.');
      }
    };

    checkPermissions();
  }, []);

  const toggleCamera = () => {
    setIsCameraActive(prevState => !prevState);
  };

  const openGallery = () => {
    Alert.alert('Gallery Feature', 'This feature will be implemented soon!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4c669f" />

      <View style={styles.header}>
        <Text style={styles.headerText}>Live Camera Feed</Text>
      </View>

      <View style={styles.cameraContainer}>
        {permissionsGranted && device ? (
          <Camera
            style={styles.camera}
            device={device}
            isActive={isCameraActive}
            videoStabilizationMode="auto"
          />
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#4c669f"
              style={styles.loader}
            />
            <Text style={styles.infoText}>
              {permissionsGranted
                ? 'Loading camera...'
                : 'Requesting permissions...'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCamera}>
          <Text style={styles.buttonText}>
            {isCameraActive ? 'Stop Camera' : 'Start Camera'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={openGallery}>
          <Text style={styles.buttonText}>Open Gallery</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Ensure that you have granted camera and microphone permissions.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4c669f',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 100,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    width: '90%',
    height: '60%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginTop: 20,
    borderColor: '#4c669f',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loader: {
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#4c669f',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 10,
    marginTop: 10,
    width: '90%',
    marginBottom: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4c669f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    height: 60,
    alignContent: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
