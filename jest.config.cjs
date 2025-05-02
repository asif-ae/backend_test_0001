module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test|spec).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!node-fetch)', // Allow node-fetch to be transformed
  ],
};
