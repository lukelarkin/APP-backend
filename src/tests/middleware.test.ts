import { authenticate } from '../../middleware/auth.middleware';
import { Request, Response } from 'express';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should return 401 if no authorization header', async () => {
    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: 'No token provided',
    });
  });

  it('should return 401 if authorization header does not start with Bearer', async () => {
    mockRequest.headers = {
      authorization: 'InvalidToken',
    };

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
  });
});
