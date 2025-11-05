import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@bands/(.*)$': '<rootDir>/src/app/(public)/grupos/$1',
    '^@users/(.*)$': '<rootDir>/src/app/(public)/users/$1',
    '^@home/(.*)$': '<rootDir>/src/app/(public)/(home)/$1',
    '^@auth/(.*)$': '<rootDir>/src/app/(public)/auth/$1',
    '^@admin/(.*)$': '<rootDir>/src/app/(private)/admin/$1',
    '^@ui/(.*)$': '<rootDir>/src/app/(public)/_ui/$1',
    '^@stores/(.*)$': '<rootDir>/src/global/stores/$1',
    '^@global/(.*)$': '<rootDir>/src/global/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
