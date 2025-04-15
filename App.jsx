import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useState } from 'react';
import CustomButton from './src/components/CustomButton';
import OptionItem from './src/components/OptionItem';
import DisplayAllOptions from './src/components/DisplayAllOptions';

export default function App() {
  const [started, setStarted] = useState(false);
  let testArray = [
    'Are you having trouble with a device?',
    'Need help making a decision?',
    'Navigation issues.',
    'Problem with a person or family member?',
    'None of these match my problem!',
  ];
  const startPress = () => {
    setStarted(true);
  };
  return (
    <ScrollView style={{ backgroundColor: '#101010' }}>
      <View style={styles.container}>
        <StatusBar style='light' />
        <Text style={styles.title}>NeedlePoint</Text>
        {/* <View syle={styles.mottoContainer}>
        <View style={styles.motto}>
          <Text style={styles.subText}>
            Real{'\n'}Solutions{'\n'}Fast
          </Text>
        </View>
        <View style={styles.mottoTwo}>
          <Text style={styles.subText}>
            Whatever{'\n'}Ails{'\n'}You
          </Text>
        </View>
      </View> */}
        <View style={styles.buttonContainer}>
          <CustomButton onPress={startPress}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
              GET STARTED
            </Text>
          </CustomButton>
        </View>
        {started && <DisplayAllOptions options={testArray} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  subText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  motto: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'white',
    padding: 4,
    borderRadius: 12,
    position: 'absolute',
    left: 20,
    top: 100,
  },
  mottoTwo: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'white',
    padding: 4,
    borderRadius: 12,
    position: 'absolute',
    right: 20,
    top: 100,
    alignContent: 'right',
  },
  mottoContainer: {
    position: 'absolute',
    top: 0,
    left: 10,
  },
  buttonContainer: {
    marginTop: 12,
    borderWidth: 2,
    borderColor: 'orange',
    padding: 4,
    borderRadius: 8,
  },
});
