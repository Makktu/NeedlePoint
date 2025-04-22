import { StyleSheet, View, ScrollView } from 'react-native';
import React from 'react';
import Markdown from 'react-native-markdown-display';

export default function DisplayConclusion({ llmConclusion }) {
  // Format the conclusion text by removing numbered options
  const formattedConclusion = llmConclusion
    .split('\n')
    .filter(line => !line.trim().match(/^\d+\.\s/)) // Remove numbered options
    .join('\n');
    
  return (
    <View style={styles.displayConclusion}>
      <ScrollView style={styles.scrollContainer}>
        <Markdown 
          style={markdownStyles}
        >
          {formattedConclusion}
        </Markdown>
      </ScrollView>
    </View>
  );
}

const markdownStyles = {
  // Heading styles
  heading1: {
    fontSize: 24,
    color: '#00FFFF', // Cyan
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  heading2: {
    fontSize: 22,
    color: '#00FFFF', // Cyan
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  heading3: {
    fontSize: 20,
    color: '#00FFFF', // Cyan
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 6,
  },
  // Paragraph styles
  paragraph: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
    lineHeight: 24,
  },
  // List styles
  bullet_list: {
    marginLeft: 20,
  },
  ordered_list: {
    marginLeft: 20,
  },
  list_item: {
    marginBottom: 5,
    color: 'white',
  },
  // Emphasis styles
  strong: {
    fontWeight: 'bold',
    color: '#FFFF00', // Yellow for emphasis
  },
  em: {
    fontStyle: 'italic',
    color: '#FF00FF', // Magenta for emphasis
  },
  // Link styles
  link: {
    color: '#00FFFF', // Cyan
    textDecorationLine: 'underline',
  },
  // Code styles
  code_inline: {
    fontFamily: 'monospace',
    backgroundColor: '#333333',
    color: '#00FF00', // Green
    padding: 2,
    borderRadius: 3,
  },
  code_block: {
    fontFamily: 'monospace',
    backgroundColor: '#333333',
    color: '#00FF00', // Green
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  // Blockquote styles
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#00FFFF', // Cyan
    paddingLeft: 10,
    fontStyle: 'italic',
    marginLeft: 10,
    marginVertical: 10,
    color: 'white',
  },
  // Add text styling for all other elements to ensure visibility
  body: {
    color: 'white',
  },
  text: {
    color: 'white',
  },
  bullet_list_icon: {
    color: 'white',
  },
  ordered_list_icon: {
    color: 'white',
  },
};

const styles = StyleSheet.create({
  displayConclusion: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'cyan',
    marginTop: 12,
    padding: 10,
    maxHeight: 500, // Limit height and enable scrolling for long content
  },
  scrollContainer: {
    width: '100%',
  },
});
