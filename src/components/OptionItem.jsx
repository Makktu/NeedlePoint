import { View, StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';

export default function OptionItem({ children, onPress, bgCol }) {
  // console.log(bgCol);
  return (
    <Pressable
      onPress={onPress}
      style={[styles.optionDefault, { backgroundColor: bgCol.backgroundColor }]}
    >
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
