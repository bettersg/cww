module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@jsr|@supabase)/)"
  ],
  globals: {
    'ts-jest': {
      diagnostics: false,
      astTransformers: {
        before: [
          {
            path: 'node_modules/ts-jest-mock-import-meta', // Requires installing this package
          }
        ]
      }
    }
  }
};
