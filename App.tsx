import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useCameraDevice} from 'react-native-vision-camera';

import {CheckPermissions, CaptureImage, UploadImage} from './utils/ImageUtils';
import LoadingScreen from './App/components/LoadingScreen';
import CameraScreen from './App/components/CameraScreen';
import Header from './App/components/Header';
import AnalysisResult from './App/components/AnalysisResult';

function App() {
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const [imageData, setImageData] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    CheckPermissions();
  }, []);

  const handleTakePicture = async () => {
    const result = await CaptureImage(camera);
    if (result) {
      setImageData(result.base64Image);
      setIsCameraActive(false);
      handleUploadImage(result.base64Image);
    }
  };

  const handleUploadImage = async (base64Image: any) => {
    setLoading(true);
    setAnalysisData(null);
    const result = await UploadImage(base64Image);
    setLoading(false);

    if (result.success) {
      setAnalysisData(result.data);
    } else {
      Alert.alert('Error', result.message);
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
        {loading ? (
          <LoadingScreen />
        ) : isCameraActive ? (
          <CameraScreen
            camera={camera}
            device={device}
            onCapture={handleTakePicture}
            onBack={() => setIsCameraActive(false)}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Header
              title="Health Analyzer"
              subtitle="Capture and analyze health data effortlessly"
            />
            {imageData ? (
              <Image source={{uri: imageData}} style={styles.previewImage} />
            ) : (
              <Text style={styles.noImageText}>No Image Captured</Text>
            )}
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => setIsCameraActive(true)}>
              <Text style={styles.photoButtonText}>Open Camera</Text>
            </TouchableOpacity>
            <AnalysisResult analysisData={analysisData} />
          </ScrollView>
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
  },
  scrollView: {
    alignItems: 'center',
    padding: 20,
  },
  previewImage: {
    width: '90%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
  },
  noImageText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: '#00AEEF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
    marginBottom: 20,
  },
  photoButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default App;
