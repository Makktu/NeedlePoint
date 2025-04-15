import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NeedlePoint</Text>
      <View style={styles.motto}>
        <Text style={styles.subText}>
          Real{'\n'}Solutions{'\n'}Fast
        </Text>
      </View>
      <Pressable title='GET STARTED'>
        <Text
          style={{
            color: 'orange',
            fontWeight: 'bold',
            fontSize: 20,
            marginTop: 20,
          }}
        >
          GET STARTED
        </Text>
      </Pressable>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: 'white',
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
});
