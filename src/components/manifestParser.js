function manifestTxtToArray(manifestTxt) {
  const regexPattern = /\[(\d{2},\d{2})\],\s\{(\d{5})\},\s([^\r\n]+)/g;

  // Initialize an array to store the parsed data
  const parsedData = [];

  // Use a loop to match and extract data from the input string
  let match;

  while ((match = regexPattern.exec(manifestTxt)) !== null) {
    // Extract matched groups and push them to the result array
    const [, position, weight, name] = match;
    parsedData.push([`[${position}]`, weight, name]);
  }
  
  return(parsedData);
}

export { manifestTxtToArray };
