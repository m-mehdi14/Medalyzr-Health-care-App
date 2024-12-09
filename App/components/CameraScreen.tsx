import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Camera} from 'react-native-vision-camera';

const CameraScreen = ({camera, device, onCapture, onBack}: any) => (
  <View style={styles.cameraContainer}>
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
    <Camera
      ref={camera}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive
      photo
    />
    <TouchableOpacity style={styles.captureButton} onPress={onCapture}>
      <Text style={styles.captureButtonText}>Capture</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 5,
  },
  backButtonText: {
    color: '#FF5722',
    fontSize: 14,
    fontWeight: 'bold',
  },
  captureButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#FF5722',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 6,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScreen;
