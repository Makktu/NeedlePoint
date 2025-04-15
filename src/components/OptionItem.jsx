import { StyleSheet, Text, Pressable } from 'react-native';
import React from 'react';

export default function OptionItem({ children, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.optionDefault}>
      <Text style={{ fontSize: 22 }}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionDefault: {
    width: '90%',
    height: '20%',
    backgroundColor: '#f7f761',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 10,
    padding: 4,
  },
});
