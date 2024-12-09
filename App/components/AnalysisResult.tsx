import React from 'react';
import {ScrollView, Text, View, StyleSheet} from 'react-native';

const AnalysisResult = ({analysisData}: any) => {
  if (!analysisData) {
    return null;
  }

  const {groq_analysis, crew_analysis} = analysisData;

  // Map task names to user-friendly titles
  const taskNameMapping = {
    diagnostic_analysis_task: 'Diagnostic Image Analysis',
    treatment_advice_task: 'Treatment Options and Costs',
    doctor_recommendation_task: 'Doctor Recommendations',
  };

  // Helper function to format text using regex
  const formatText = (text: any) => {
    if (!text) {
      return null;
    }

    // Match bullet points (e.g., `-`, `*`, or numbered lists like `1.`)
    const bulletRegex = /(^|\n)[*-]\s(.+?)(?=\n|$)/g;
    const numberedListRegex = /(^|\n)\d+\.\s(.+?)(?=\n|$)/g;

    // Extract and render bullet points
    const bulletPoints = text.match(bulletRegex);
    if (bulletPoints) {
      return (
        <View>
          {bulletPoints.map((point: any, index: any) => (
            <Text key={index} style={styles.bulletPoint}>
              • {point.replace(/(^[-*]\s)/, '').trim()}
            </Text>
          ))}
        </View>
      );
    }

    // Extract and render numbered lists
    const numberedLists = text.match(numberedListRegex);
    if (numberedLists) {
      return (
        <View>
          {numberedLists.map((item: any, index: any) => (
            <Text key={index} style={styles.numberedList}>
              {item.replace(/(^\d+\.\s)/, '').trim()}
            </Text>
          ))}
        </View>
      );
    }

    // Render plain paragraphs
    return text.split('\n').map((line: any, index: any) => (
      <Text key={index} style={styles.paragraph}>
        {line.trim()}
      </Text>
    ));
  };

  return (
    <ScrollView style={styles.resultContainer}>
      {/* Groq Analysis */}
      <Text style={styles.sectionTitle}>Image Analysis</Text>
      <View style={styles.analysisContent}>
        {formatText(
          groq_analysis?.choices[0]?.message?.content ||
            'No analysis available',
        )}
      </View>

      {/* Crew Analysis */}
      <Text style={styles.sectionTitle}>Detailed Analysis</Text>
      {crew_analysis?.tasks_output?.map((task: any, index: any) => {
        // @ts-ignore
        const taskTitle = taskNameMapping[task.name] || task.name;

        return (
          <View key={index} style={styles.taskContainer}>
            <Text style={styles.taskTitle}>{taskTitle}</Text>
            {task.description && (
              <View style={styles.taskDescription}>
                <Text style={styles.boldText}>Description: </Text>
                {formatText(task.description)}
              </View>
            )}
            {task.summary && (
              <View style={styles.taskSummary}>
                <Text style={styles.boldText}>Summary: </Text>
                {formatText(task.summary)}
              </View>
            )}
            {task.raw && (
              <View style={styles.taskRaw}>
                <Text style={styles.boldText}>Details: </Text>
                {formatText(task.raw)}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  analysisContent: {
    marginBottom: 15,
    fontSize: 15,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginBottom: 5,
  },
  numberedList: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
  },
  taskContainer: {
    marginBottom: 20,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  taskDescription: {
    marginBottom: 10,
  },
  taskSummary: {
    marginBottom: 10,
  },
  taskRaw: {
    marginBottom: 10,
  },
});

export default AnalysisResult;
