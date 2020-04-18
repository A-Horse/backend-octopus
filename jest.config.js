module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './test/setup.js',
  globalTeardown: './test/teardown.js',
  testTimeout: 50000,
  testPathIgnorePatterns: ["/node_modules/", "/built/"]
};
