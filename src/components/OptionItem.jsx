import { View, StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';

const numerals = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

export default function OptionItem({ children, onPress, bgCol, numeral }) {
  console.log(bgCol);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optionDefault, { backgroundColor: bgCol.backgroundColor }]}
    >
      <Text style={{ fontSize: 30 }}>{numerals[numeral - 1]}</Text>
      <Text style={{ fontSize: 22 }}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionDefault: {
    width: '90%',
    height: 90,
    minHeight: 90,
    backgroundColor: '#e062e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 10,
    padding: 8,
  },
});
