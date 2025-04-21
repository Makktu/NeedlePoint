import { StatusBar } from 'expo-status-bar';
import { Animated } from 'react-native';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
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
  'Technical Issue (device, software, connectivity)',
  'Communication (writing, messaging)',
  'Navigation/directions',
  'Decision-making assistance',
  'None of these match my problem!',
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState(startingQuestions); // as hardcoded above - possibly let LLM pick as the project advances
  const [history, setHistory] = useState([]); // Track all user selections - vital for the LLM to maintain context
  const [currentOptions, setCurrentOptions] = useState(startingQuestions); // Current options to display
  const [isLoading, setIsLoading] = useState(false); // For API call states
  const [headerMessage, setHeaderMessage] = useState("👀 What's the Problem?");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isContentBelowVisible, setIsContentBelowVisible] = useState(false);
  const [llmConclusion, setLlmConclusion] = useState('');

  const scrollY = new Animated.Value(0);

  // Start the conversation
  const startPress = () => {
    if (started) {
      // Reset other state when needed
      setStarted(false);
      // delay before restarting as visual feedback
      setTimeout(() => {
        setStarted(true);
        setQuestions(startingQuestions);
        setCurrentOptions(startingQuestions);
        setHistory([]);
        setIsLoading(false);
        setHeaderMessage("👀 What's the Problem?");
        setLlmConclusion('');
      }, 500);
    } else {
      setStarted(true);
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
      const response = await apiService.sendRequest(messages);

      // Parse the LLM response to extract options
      let message = '';
      const newOptions = parseOptionsFromLLMResponse(response);
      if (newOptions.sentEmoji) {
        message += newOptions.sentEmoji;
      }
      if (newOptions.sentTitle) {
        console.log(
          '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',
          newOptions.sentTitle
        );
        if (newOptions.sentTitle === "🎯 Here's the likely issue:") {
          setLlmConclusion(newOptions);
          console.log(llmConclusion, response);
        }
        message += ' ' + newOptions.sentTitle;
      }
      console.log(message);
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
              : 'GET STARTED'}
          </Text>
        </CustomButton>
      </View>
      {!started && (
        <View>
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab commodi
            velit itaque magnam, culpa fugiat ut deleniti iusto ducimus. Magni
            eveniet omnis corrupti numquam eligendi aperiam architecto
            dignissimos praesentium a. Lorem ipsum dolor sit amet consectetur,
            adipisicing elit. Quam labore at iusto, magni officiis voluptate
            illo! Fugit omnis quae saepe odio repudiandae modi pariatur dolorem!
            Ratione ullam excepturi eos quos soluta dolorem iusto ab pariatur
            tenetur, nihil animi sed quasi eaque perspiciatis in inventore
            perferendis. Est error aperiam atque, incidunt corrupti numquam
            laborum aliquam natus eos nam asperiores debitis sequi tempora
            quidem ducimus? Tempora neque, voluptates vero a aut officiis minima
            soluta quia ducimus ratione velit fugit similique laudantium sint
            recusandae, molestias perspiciatis consequuntur et voluptas harum
            eius obcaecati. Veniam voluptatem incidunt nemo ipsa odit non
            pariatur quisquam sequi, dignissimos iusto quae quod fugit
            perspiciatis adipisci optio cum officia quos iste quibusdam fuga
            suscipit doloribus amet.
          </Text>
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
              {(llmConclusion && (
                <DisplayConclusion conclusion={llmConclusion} />
              )) || (
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
});
