/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  collectCoverageFrom: [
    '**/**/*.ts',
    '!**/node_modules/**',
    '!src/generated/**/*.ts',
    '!dist/**/*'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src']
};