import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';

export default function CustomButton({ children, onPress }) {
  return (
    <View style={styles.pressableDefault}>
      <Pressable onPress={onPress}>{children}</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressableDefault: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'orange',
  },
});
