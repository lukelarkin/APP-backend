// src/tests/setup.ts
// Basic Jest setup for CI
import 'reflect-metadata';        // if your app uses decorators/TypeORM; safe if unused

// Increase default timeout for CI tests
jest.setTimeout(20000);

// Ensure test environment
process.env.NODE_ENV = 'test';

// Silence noisy logs in tests (optional)
beforeAll(() => {
  // Put any global test initialization here (mocks, environment tweaks)
});

afterAll(async () => {
  // Global teardown if needed (close DB connections, etc.)
});

export {};