/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
};
