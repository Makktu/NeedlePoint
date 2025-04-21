import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function DisplayConclusion({ llmConclusion }) {
  return (
    <View style={styles.displayConclusion}>
      <Text style={styles.textStyle}>{llmConclusion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  displayConclusion: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'cyan',
    marginTop: 12,
  },
  textStyle: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
});
