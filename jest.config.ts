import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  testMatch: ['<rootDir>/tests/**/*.test.ts?(x)'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.node.json', 
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy', //Mocks some CSS imports
  },
  moduleDirectories: ['node_modules', 'src'], 
};

export default config;




