module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest", // This tells Jest to use Babel for .js and .jsx files
  },
  testEnvironment: "jsdom", // Necessary for running React tests in a simulated browser environment
};
