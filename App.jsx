import { StatusBar } from 'expo-status-bar';
import { Animated } from 'react-native';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { useState } from 'react';
import CustomButton from './src/components/CustomButton';
import DisplayAllOptions from './src/components/DisplayAllOptions';
import ScrollableIndicator from './src/components/ScrollableIndicator';
import systemPrompt from './src/services/systemPrompt';
import apiService from './src/services/apiService';
import DisplayConclusion from './src/components/DisplayConclusion';
import { parseOptionsFromLLMResponse } from './src/utils/responseParser';

// Dummy data for testing
let startingQuestions = [
  'Help me solve a personal problem',
  'Help me plan or create something',
  'Other (Let me describe the issue)',
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState(startingQuestions); // as hardcoded above - possibly let LLM pick as the project advances
  const [history, setHistory] = useState([]); // Track all user selections - vital for the LLM to maintain context
  const [currentOptions, setCurrentOptions] = useState(startingQuestions); // Current options to display
  const [isLoading, setIsLoading] = useState(false); // For API call states
  const [headerMessage, setHeaderMessage] = useState(
    '🧩 How can I assist you?'
  );
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isContentBelowVisible, setIsContentBelowVisible] = useState(false);
  const [llmConclusion, setLlmConclusion] = useState('');
  const [userInput, setUserInput] = useState('');

  const scrollY = new Animated.Value(0);

  // Start the conversation
  const startPress = () => {
    if (started) {
      // Reset all states to restart
      setStarted(false);
      setQuestions(startingQuestions);
      setCurrentOptions(startingQuestions);
      setHistory([]);
      setIsLoading(false);
      setHeaderMessage('🧩 How can I assist you?');
      setLlmConclusion('');
      setUserInput('');
    } else {
      setStarted(true);

      // Check if user provided input text
      if (userInput.trim()) {
        // Use the user input directly instead of going through the standard flow
        setIsLoading(true);

        // Create a new history with just the user input
        const newHistory = [userInput.trim()];
        setHistory(newHistory);

        // Format messages for the LLM with user input
        const messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput.trim() },
        ];

        // Call the API directly with the user's input
        apiService
          .sendRequest(messages, 0.2)
          .then((response) => {
            // Parse the LLM response to extract options
            let message = '';
            const newOptions = parseOptionsFromLLMResponse(response);

            if (newOptions.sentEmoji) {
              message += newOptions.sentEmoji;
            }
            if (newOptions.sentTitle) {
              // Check if the title is "🎯 Here's the likely issue:"
              if (newOptions.sentTitle.toLowerCase().includes('likely issue')) {
                setLlmConclusion(response.choices[0].message.content);
              }
              message += ' ' + newOptions.sentTitle;
            }

            setHeaderMessage(message);
            setCurrentOptions(newOptions.options);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('API error:', error);
            setIsLoading(false);
          });
      } else {
        // No user input, use standard starting questions
        setCurrentOptions(startingQuestions);
      }
    }
  };

  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

    setScrollPosition(currentOffset);
    setIsContentBelowVisible(
      contentHeight - currentOffset > scrollViewHeight + 20
    );
  };

  const userInputReceived = (text) => {
    setUserInput(text);
    // setQuestions([text]);
    console.log(userInput);
  };

  // When user selects an option
  const optionPicked = async (ind) => {
    setIsLoading(true);

    // Add selection to history
    const selectedOption = currentOptions[ind];
    const updatedHistory = [...history, selectedOption];
    setHistory(updatedHistory);

    try {
      // Format messages for the LLM
      const messages = [
        { role: 'system', content: systemPrompt },
        ...updatedHistory.map((option) => ({ role: 'user', content: option })),
      ];

      // Call the API
      const response = await apiService.sendRequest(messages, 0.2);

      // Parse the LLM response to extract options
      let message = '';
      const newOptions = parseOptionsFromLLMResponse(response);
      if (newOptions.sentEmoji) {
        message += newOptions.sentEmoji;
      }
      if (newOptions.sentTitle) {
        // Check if the title is "🎯 Here's the likely issue:"
        if (newOptions.sentTitle.toLowerCase().includes('likely issue')) {
          setLlmConclusion(response.choices[0].message.content);
          console.log('ᣉ', llmConclusion, response);
        }
        message += ' ' + newOptions.sentTitle;
      }
      setHeaderMessage(message);
      setCurrentOptions(newOptions.options);
    } catch (error) {
      console.error('API error:', error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed header elements */}
      <StatusBar style='light' />
      <Text style={styles.title}>NeedlePoint ✴️</Text>
      <View style={styles.buttonContainer}>
        <CustomButton onPress={startPress}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            {started
              ? isLoading
                ? '🤔 THINKING... 🤔'
                : 'START AGAIN'
              : 'Choose an option.\nTap here any time to restart.'}
          </Text>
        </CustomButton>
      </View>
      {!started && (
        <View style={styles.inputContainer}>
          <DisplayAllOptions
            options={questions.slice(-5)}
            currentOptions={currentOptions}
            optionPicked={optionPicked}
          />
        </View>
      )}

      {/* Scrollable content area */}
      {started && (
        <View style={styles.scrollContainer}>
          <ScrollableIndicator direction='up' visible={scrollPosition > 20} />
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false, listener: handleScroll }
            )}
            scrollEventThrottle={16}
          >
            <View style={styles.headerContainer}>
              <Text style={{ fontSize: 22, color: 'white' }}>
                {headerMessage}
              </Text>
            </View>
            <View style={styles.optionsContainer}>
              {llmConclusion ? (
                <DisplayConclusion llmConclusion={llmConclusion} />
              ) : isLoading && userInput.trim() ? (
                <Text
                  style={{
                    fontSize: 18,
                    color: 'white',
                    textAlign: 'center',
                    marginTop: 20,
                  }}
                >
                  Processing your question...
                </Text>
              ) : (
                <DisplayAllOptions
                  options={questions.slice(-5)}
                  currentOptions={currentOptions}
                  optionPicked={optionPicked}
                />
              )}
            </View>
          </ScrollView>
          <ScrollableIndicator
            direction='down'
            visible={isContentBelowVisible}
          />
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>🤔 Thinking...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 52,
    backgroundColor: '#101010',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  title: {
    color: 'orange',
    fontSize: 40,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: 'orange',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '90%',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'orange',
    padding: 4,
    borderRadius: 8,
  },
  scrollContainer: {
    width: '90%',
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  optionsContainer: {
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'orange',
    padding: 8,
    borderRadius: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // semi-transparent black
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // ensure it's on top of everything
  },

  loadingText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 2,
    borderColor: 'orange',
    borderRadius: 8,
    marginVertical: 20,
    padding: 8,
    color: 'white',
    backgroundColor: 'gray',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 20,
    padding: 4,
    flexDirection: 'column',
  },
  textStyle: {
    color: 'white',
    fontSize: 18,
    marginVertical: 4,
  },
});
