import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

const LoadingScreen = () => (
  <View style={styles.loadingScreen}>
    <ActivityIndicator size="large" color="#00AEEF" />
    <Text style={styles.loadingText}>Analyzing your image, please wait...</Text>
    <Text style={styles.loadingSubtitle}>
      Stay tuned as we process and generate insights for you!
    </Text>
  </View>
);

const styles = StyleSheet.create({
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
});

export default LoadingScreen;
