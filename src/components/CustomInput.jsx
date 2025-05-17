import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, useColorScheme } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';

export default function CustomInput({ onInputSubmit, onDismiss, placeholder = 'Describe your issue...' }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const colorScheme = useColorScheme(); // Will be 'dark', 'light', or null
  
  // Focus the input when component mounts
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  const handleSubmit = () => {
    if (text.trim()) {
      onInputSubmit(text.trim());
      setText('');
      Keyboard.dismiss();
    }
  };

  const handleDismiss = () => {
    setText('');
    Keyboard.dismiss();
    onDismiss();
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={[styles.input, colorScheme === 'dark' ? styles.darkInput : styles.lightInput]}
        onChangeText={setText}
        value={text}
        placeholder={placeholder}
        placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#666'}
        multiline
        numberOfLines={3}
        keyboardAppearance={colorScheme === 'dark' ? 'dark' : 'light'} // iOS only
        returnKeyType="send"
        blurOnSubmit
        onSubmitEditing={handleSubmit}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.submitButton, !text.trim() && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={!text.trim()}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderWidth: 2,
    borderColor: 'orange',
    marginVertical: 20,
  },
  input: {
    minHeight: 100,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  darkInput: {
    backgroundColor: '#333',
    color: 'white',
    borderColor: '#555',
  },
  lightInput: {
    backgroundColor: '#f5f5f5',
    color: 'black',
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dismissButton: {
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#996633',
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
