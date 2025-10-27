// src/tests/setup.ts
// Global Jest setup: add matchers, globals or mocks here.

// Mock PrismaClient for tests
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    partsCheckIn: {
      create: jest.fn().mockImplementation((params) => {
        const data = params.data;
        return Promise.resolve({
          id: 1,
          userId: data.userId || 1,
          partName: data.partName,
          emotion: data.emotion,
          quadrant: data.quadrant,
          intensity: data.intensity,
          burden: data.burden || null,
          need: data.need || null,
          notes: data.notes || null,
          createdAt: data.createdAt || new Date(),
          updatedAt: new Date(),
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
          },
        });
      }),
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
    },
    $transaction: jest.fn().mockImplementation((promises) => Promise.all(promises)),
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});
