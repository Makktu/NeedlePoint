import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function CustomInput() {
  return (
    <View>
      <TextInput style={styles.input} onChangeText={userInputReceived} />
    </View>
  );
}

const styles = StyleSheet.create({});
