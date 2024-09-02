const encoder = (message: string): string => {
  const gridSize = Math.ceil(Math.sqrt(message.length));
  let paddedMessage = message.slice().padEnd(gridSize ** 2);
  let messageGrid: Array<string[]> = [];

  for (let i = 0; i < gridSize; i++) {
    messageGrid[i] = [];
    while (messageGrid[i].length < gridSize) {
      messageGrid[i].push(paddedMessage[0]);
      paddedMessage = paddedMessage.slice(1);
    }
  }

  let outputString = '';
  for (let columnIndex = 0; columnIndex < gridSize; columnIndex++) {
    for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
      outputString += messageGrid[rowIndex][columnIndex];
    }
  }

  return outputString;
};

export { encoder };
