// src/utils/responseParser.js
export function parseOptionsFromLLMResponse(response) {
  // Extract options from the formatted LLM response
  // Based on your systemPrompt format requirements
  const content = response.choices[0].message.content;
  // Extract emoji (first visible character before the title)
  const sentEmoji = content.trim().charAt(0);

  // Extract title (text between ** **)
  const titleMatch = content.match(/\*\*(.*?)\*\*/);
  const sentTitle = titleMatch ? titleMatch[1] : '';

  // Extract options (lines starting with number followed by period)
  const optionLines = content
    .split('\n')
    .filter((line) => /^\d+\.\s/.test(line.trim()));

  const optionsArray = optionLines.map((line) =>
    line.replace(/^\d+\.\s/, '').trim()
  );

  return {
    sentEmoji,
    sentTitle,
    options: optionsArray,
  };
  // Parse the numbered options (regex or string manipulation)
  // Return array of options
}
