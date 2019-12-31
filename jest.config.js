module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './test/setup.js',
  globalTeardown: './test/teardown.js',
  testPathIgnorePatterns: ["/node_modules/", "/built/"]
};
