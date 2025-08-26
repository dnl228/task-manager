import '@testing-library/jest-dom';

// Mock the api module used throughout the app to avoid network calls during tests
const apiMock = {
  api: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  },
  registerUnauthorizedHandler: jest.fn(),
};

// Ensure the same module is mocked for all importers
jest.mock('./src/libs/api', () => apiMock);

// Reset localStorage and mocks between tests
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});