import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import OptionItem from './OptionItem';
import optionColors from '../COLORS/COLORS';

export default function DisplayAllOptions({
  options,
  currentOptions,
  optionPicked,
}) {
  console.log('✅', currentOptions);
  const debugConsole = (ind, item) => {
    console.log(options);
    console.log(ind + 1, item);
    optionPicked(ind);
  };
  return (
    <View style={styles.displayAllOptions}>
      {currentOptions.map((item, ind) => (
        <OptionItem
          onPress={debugConsole.bind(this, ind, item)}
          key={ind}
          bgCol={{ backgroundColor: optionColors[ind] }}
          numeral={ind + 1}
        >
          {item}
        </OptionItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  displayAllOptions: {
    width: '100%',
    alignItems: 'center',
  },
});
