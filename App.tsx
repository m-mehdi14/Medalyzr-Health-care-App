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
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import RNFS from 'react-native-fs'; // Library to read file as base64

function App() {
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const [imageData, setImageData] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  // Permission checking function
  const checkPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const microphonePermission = await Camera.requestMicrophonePermission();
    if (cameraPermission !== 'granted' || microphonePermission !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and Microphone permissions are required to use this app.',
      );
    }
  };

  // Function to capture the image
  const takePicture = async () => {
    try {
      if (camera.current) {
        const photo = await camera.current.takePhoto();
        const base64Image = await RNFS.readFile(photo.path, 'base64');
        setImageData(`data:image/jpeg;base64,${base64Image}`);
        setIsCameraActive(false);
        uploadImage(base64Image);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    }
  };

  // Function to upload the captured image to the backend
  const uploadImage = async base64Image => {
    setLoading(true);
    setAnalysisData(null); // Clear previous analysis data
    try {
      const response = await fetch(
        'https://medalyzer-backend.onrender.com/api/v1/analyze-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_data: `data:image/jpeg;base64,${base64Image}`,
            is_url: false,
          }),
        },
      );

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setAnalysisData(result);
      } else {
        console.error('Server Error:', result);
        Alert.alert('Error', 'Failed to analyze the image.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Network Error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
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

  // Helper function to apply regex formatting
  const formatText = text => {
    if (!text) return null;

    // Split into bullet points if it starts with asterisks or numbers
    const bulletRegex = /(^|\n)[*-]\s(.+?)(?=\n|$)/g;
    const matches = text.match(bulletRegex);

    if (matches) {
      return (
        <View>
          {matches.map((match, idx) => (
            <Text key={idx} style={styles.bulletPoint}>
              • {match.replace(/(^[-*]\s)/, '')}
            </Text>
          ))}
        </View>
      );
    }

    // If no bullet points, render plain paragraphs
    return text.split('\n').map((line, idx) => (
      <Text key={idx} style={styles.paragraph}>
        {line.trim()}
      </Text>
    ));
  };

  const renderAnalysisData = () => {
    if (!analysisData) return null;

    const {groq_analysis, crew_analysis} = analysisData;

    return (
      <ScrollView style={styles.resultContainer}>
        {/* Groq Analysis */}
        <Text style={styles.sectionTitle}>Groq Analysis</Text>
        <Text style={styles.resultText}>
          {groq_analysis?.choices[0]?.message?.content}
        </Text>

        {/* Crew Analysis
        <Text style={styles.sectionTitle}>Crew Analysis</Text>
        <Text style={styles.resultText}>{crew_analysis?.raw}</Text> */}

        {/* Crew Analysis */}
        <Text style={styles.sectionTitle}>Crew Analysis</Text>
        {crew_analysis?.tasks_output
          ?.filter((task: any) => task.name !== 'health_research_task')
          ?.map((task: any, index: any) => {
            // Mapping task names to beautiful titles
            const taskNameMapping = {
              // health_research_task: 'In-Depth Health Research',
              diagnostic_analysis_task: 'Diagnostic Image Analysis',
              treatment_advice_task: 'Treatment Options and Costs',
              doctor_recommendation_task: 'Doctor Recommendations',
            };

            // Get the beautiful title or fallback to the original task name
            const beautifulTaskName = taskNameMapping[task.name] || task.name;

            return (
              <View key={index} style={styles.taskContainer}>
                <Text style={styles.taskTitle}>{beautifulTaskName}</Text>
                <Text style={styles.taskDescription}>
                  <Text style={styles.boldText}>Description: </Text>
                  {task.description}
                  {/* {formatText(task.description)} */}
                </Text>
                {task.summary && (
                  <Text style={styles.taskSummary}>
                    <Text style={styles.boldText}>Summary: </Text>
                    {task.summary}
                    {/* {formatText(task.summary)} */}
                  </Text>
                )}
                {task.raw && (
                  <Text style={styles.taskRaw}>
                    <Text style={styles.boldText}>Details: </Text>
                    {task.raw}
                    {/* {formatText(task.raw)} */}
                  </Text>
                )}
              </View>
            );
          })}

        {/* Task Outputs */}
        {/* <Text style={styles.sectionTitle}>Tasks Output</Text> */}
        {/* {crew_analysis?.tasks_output?.map((task, index) => (
          <View key={index} style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{task.name}</Text>
            <Text style={styles.taskDescription}>{task.description}</Text>
            <Text style={styles.taskSummary}>{task.summary}</Text>
          </View>
        ))} */}
      </ScrollView>
    );
  };

  const renderLoadingScreen = () => (
    <View style={styles.loadingScreen}>
      <ActivityIndicator size="large" color="#00AEEF" />
      <Text style={styles.loadingText}>
        Analyzing your image, please wait...
      </Text>
      <Text style={styles.loadingSubtitle}>
        Stay tuned as we process and generate insights for you!
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={['#003973', '#E5E5BE']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {loading ? (
          renderLoadingScreen()
        ) : isCameraActive ? (
          <View style={styles.cameraContainer}>
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
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.header}>
              <Text style={styles.title}>Health Analyzer</Text>
              <Text style={styles.subtitle}>
                Capture and analyze health data effortlessly
              </Text>
            </View>
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
            {renderAnalysisData()}
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
  header: {
    marginBottom: 20,
    alignItems: 'center',
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
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 20,
    fontWeight: 'bold',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#D3D3D3',
    marginTop: 10,
    textAlign: 'center',
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003973',
  },
  resultText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  taskContainer: {
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 10, // Added space between paragraphs
  },
  taskDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10, // Added space between paragraphs
  },
  taskSummary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10, // Added space between paragraphs
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
  loadingIndicator: {
    marginVertical: 20, // Added style for the ActivityIndicator
  },
  boldText: {
    fontWeight: 'bold',
    // fontSize: 14,
    // color: '#555',
    // padding: 10,
    fontSize: 16,
    color: '#555',
  },
  taskRaw: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10, // Added space between paragraphs
  },

  bulletPoint: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginVertical: 5, // Added space between bullet points
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10, // Added space between paragraphs
  },
});

export default App;
