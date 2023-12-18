function parseManifestFile(manifestTxt, setCachedState) {
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

  setCachedState((prevCachedState) => {
    const updatedManifest = parsedData
      .map(
        (innerArray, rowIndex, array) =>
          innerArray
            .map((str, index) => (index === 1 ? `{${str}}` : str))
            .join(", ") + (rowIndex === array.length - 1 ? "" : "\n")
      )
      .join("");

    // Set the updated manifest in localStorage
    localStorage.setItem("manifest", updatedManifest);

    // Return the updated state
    return {
      ...prevCachedState,
      manifest: parsedData,
    };
  });
}

export { parseManifestFile };
