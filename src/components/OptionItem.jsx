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
      <Text style={styles.numeralStyle}>{numerals[numeral - 1]}</Text>
      <Text style={styles.textStyle}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionDefault: {
    flexDirection: 'row',
    width: '90%',
    minHeight: 90,
    backgroundColor: '#e062e0',
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 10,
    padding: 8,
  },
  numeralStyle: {
    fontSize: 14,
    paddingRight: 18,
    position: 'absolute',
    left: 8,
  },
  textStyle: {
    fontSize: 18,
    paddingLeft: 18,
  },
});
