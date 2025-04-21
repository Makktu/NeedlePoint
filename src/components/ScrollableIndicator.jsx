// src/components/ScrollableIndicator.jsx
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function ScrollableIndicator({ direction, visible }) {
  return visible ? (
    <View
      style={[
        styles.container,
        direction === 'up' ? styles.topIndicator : styles.bottomIndicator,
      ]}
    >
      <Text style={styles.arrow}>{direction === 'up' ? '⬆️' : '⬇️'}</Text>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  topIndicator: {
    top: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bottomIndicator: {
    bottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  arrow: {
    fontSize: 20,
  },
});
