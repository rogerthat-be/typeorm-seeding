export default {
  collectCoverageFrom: ['src/**/!(*.d).ts'],
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/jest-setup.ts'],
  testEnvironment: 'node',
}
