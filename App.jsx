import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState } from 'react';
import CustomButton from './src/components/CustomButton';
import DisplayAllOptions from './src/components/DisplayAllOptions';
import systemPrompt from './src/services/systemPrompt';
import apiService from './src/services/apiService';
import { parseOptionsFromLLMResponse } from './src/utils/responseParser';

// Dummy data for testing
let testArray = [
  'Are you having trouble with a device?',
  'Need help making a decision?',
  'Navigation issues.',
  'Problem with a person or family member?',
  'None of these match my problem!',
];

let testArray2 = [
  'When is the best time to make a decision?',
  'What type of decision are you making?',
  'Are you having trouble with a device?',
  'Is it somebody you are trying to contact?',
  'Ask me again!',
];

export default function App() {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState(testArray);
  const [history, setHistory] = useState([]); // Track all user selections
  const [currentOptions, setCurrentOptions] = useState(testArray); // Current options to display
  const [isLoading, setIsLoading] = useState(false); // For API call states

  const startPress = () => {
    if (started) {
      // Reset other state when needed
      setStarted(false);
      // delay before restarting as visual feedback
      setTimeout(() => {
        setStarted(true);
        setQuestions(testArray);
      }, 500);
    } else {
      setStarted(true);
    }
  };

  const testOptionPicked = (ind) => {
    console.log('option picked:', ind + 1);
    setQuestions((prevQuestions) => [...prevQuestions, testArray2]);
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
      const newOptions = parseOptionsFromLLMResponse(response); // returns an object with emoji, title, and options array
      console.log(newOptions.sentEmoji);
      console.log(newOptions.sentTitle);
      console.log(newOptions.options);
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
            {started ? 'START AGAIN' : 'GET STARTED'}
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
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          <View style={styles.optionsContainer}>
            <DisplayAllOptions
              options={questions.slice(-5)}
              currentOptions={currentOptions}
              optionPicked={optionPicked}
            />
          </View>
        </ScrollView>
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
});
