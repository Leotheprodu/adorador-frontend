import { fetchAPI } from '../fetchAPI';
import * as jwtUtils from '../jwtUtils';

// Mock jwtUtils
jest.mock('../jwtUtils', () => ({
  getValidAccessToken: jest.fn(),
  clearTokens: jest.fn(),
}));

global.fetch = jest.fn();

describe('fetchAPI', () => {
  const mockUrl = 'http://localhost:3000/api/test';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should make a successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'mock-token',
      );

      const result = await fetchAPI<typeof mockData>({
        url: mockUrl,
        method: 'GET',
      });

      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        }),
      );
    });

    it('should not include body in GET request', async () => {
      const mockData = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'mock-token',
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await fetchAPI<typeof mockData, any>({
        url: mockUrl,
        method: 'GET',
        body: { test: 'data' },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          body: undefined,
        }),
      );
    });
  });

  describe('POST requests', () => {
    it('should make a successful POST request with JSON body', async () => {
      const mockBody = { name: 'Test', email: 'test@example.com' };
      const mockResponse = { id: 1, ...mockBody };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'mock-token',
      );

      const result = await fetchAPI<typeof mockResponse, typeof mockBody>({
        url: mockUrl,
        method: 'POST',
        body: mockBody,
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockBody),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token',
          }),
        }),
      );
    });

    it('should handle FormData body', async () => {
      const formData = new FormData();
      formData.append('file', 'test-file');

      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'mock-token',
      );

      const result = await fetchAPI<typeof mockResponse>({
        url: mockUrl,
        method: 'POST',
        body: formData,
        isFormData: true,
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          method: 'POST',
          body: formData,
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        }),
      );

      // Should not have Content-Type for FormData
      const callHeaders = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(callHeaders['Content-Type']).toBeUndefined();
    });
  });

  describe('PUT and DELETE requests', () => {
    it('should make a successful PUT request', async () => {
      const mockBody = { name: 'Updated' };
      const mockResponse = { id: 1, ...mockBody };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'mock-token',
      );

      const result = await fetchAPI<typeof mockResponse, typeof mockBody>({
        url: mockUrl,
        method: 'PUT',
        body: mockBody,
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(mockBody),
        }),
      );
    });

    it('should make a successful DELETE request', async () => {
      const mockResponse = { success: true };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'mock-token',
      );

      const result = await fetchAPI<typeof mockResponse>({
        url: mockUrl,
        method: 'DELETE',
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });

    it('should make a successful PATCH request', async () => {
      const mockBody = { status: 'active' };
      const mockResponse = { id: 1, ...mockBody };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'mock-token',
      );

      const result = await fetchAPI<typeof mockResponse, typeof mockBody>({
        url: mockUrl,
        method: 'PATCH',
        body: mockBody,
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('Authentication handling', () => {
    it('should include Authorization header for authenticated requests', async () => {
      const mockData = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'test-token-123',
      );

      await fetchAPI<typeof mockData>({ url: mockUrl });

      const callHeaders = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(callHeaders.Authorization).toBe('Bearer test-token-123');
    });

    it('should not include Authorization header if token is null', async () => {
      const mockData = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(null);

      await fetchAPI<typeof mockData>({ url: mockUrl });

      const callHeaders = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(callHeaders.Authorization).toBeUndefined();
    });

    it('should skip authentication for public endpoints', async () => {
      const publicUrls = [
        'http://localhost:3000/auth/login',
        'http://localhost:3000/auth/sign-up',
        'http://localhost:3000/auth/refresh',
        'http://localhost:3000/auth/forgot-password',
        'http://localhost:3000/auth/new-password',
        'http://localhost:3000/auth/verify-email',
        'http://localhost:3000/users',
        'http://localhost:3000/users/resend-verification',
      ];

      for (const url of publicUrls) {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        await fetchAPI({ url, method: 'POST', body: {} });

        const callHeaders = (global.fetch as jest.Mock).mock.calls[0][1]
          .headers;
        expect(callHeaders.Authorization).toBeUndefined();

        jest.clearAllMocks();
      }

      expect(jwtUtils.getValidAccessToken).not.toHaveBeenCalled();
    });

    it('should skip authentication when skipAuth is true', async () => {
      const mockData = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await fetchAPI<typeof mockData>({
        url: mockUrl,
        skipAuth: true,
      });

      expect(jwtUtils.getValidAccessToken).not.toHaveBeenCalled();
      const callHeaders = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(callHeaders.Authorization).toBeUndefined();
    });
  });

  describe('Error handling', () => {
    it('should handle 401 error and clear tokens', async () => {
      const mockError = { statusCode: 401, message: 'Unauthorized' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockError,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'expired-token',
      );

      await expect(fetchAPI({ url: mockUrl })).rejects.toThrow(
        '401-Token expired',
      );

      expect(jwtUtils.clearTokens).toHaveBeenCalled();
    });

    it('should not redirect on 401 if no token was provided', async () => {
      const mockError = { statusCode: 401, message: 'Unauthorized' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockError,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(null);

      await expect(fetchAPI({ url: mockUrl })).rejects.toThrow(
        '401-Token expired',
      );

      expect(jwtUtils.clearTokens).toHaveBeenCalled();
      // Should not redirect when no token was provided
    });

    it('should handle 401 for public endpoints', async () => {
      const mockError = { statusCode: 401, message: 'Unauthorized' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockError,
      });

      // Public endpoints still trigger 401 logic but shouldn't have a token
      await expect(
        fetchAPI({
          url: 'http://localhost:3000/auth/login',
          method: 'POST',
          body: { email: 'test@test.com', password: 'wrong' },
        }),
      ).rejects.toThrow('401-Token expired');

      // clearTokens is called even for public endpoints with 401
      expect(jwtUtils.clearTokens).toHaveBeenCalled();
    });

    it('should throw error with status code and message for API errors', async () => {
      const mockError = {
        statusCode: 400,
        message: 'Bad Request - Invalid input',
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockError,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'valid-token',
      );

      await expect(fetchAPI({ url: mockUrl })).rejects.toThrow(
        '400-Bad Request - Invalid input',
      );
    });

    it('should handle 500 server error', async () => {
      const mockError = {
        statusCode: 500,
        message: 'Internal Server Error',
      };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => mockError,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'valid-token',
      );

      await expect(fetchAPI({ url: mockUrl })).rejects.toThrow(
        '500-Internal Server Error',
      );
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValue(
        'valid-token',
      );

      await expect(fetchAPI({ url: mockUrl })).rejects.toThrow('Network error');
    });
  });

  describe('Default method', () => {
    it('should default to GET method if not specified', async () => {
      const mockData = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'mock-token',
      );

      await fetchAPI<typeof mockData>({ url: mockUrl });

      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          method: 'GET',
        }),
      );
    });
  });

  describe('Body handling edge cases', () => {
    it('should handle null body', async () => {
      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'mock-token',
      );

      await fetchAPI<typeof mockResponse>({
        url: mockUrl,
        method: 'POST',
        body: null,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          body: undefined,
        }),
      );
    });

    it('should stringify non-FormData body', async () => {
      const complexBody = {
        name: 'Test',
        nested: { value: 123 },
        array: [1, 2, 3],
      };
      const mockResponse = { success: true };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });
      (jwtUtils.getValidAccessToken as jest.Mock).mockResolvedValueOnce(
        'mock-token',
      );

      await fetchAPI<typeof mockResponse, typeof complexBody>({
        url: mockUrl,
        method: 'POST',
        body: complexBody,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        mockUrl,
        expect.objectContaining({
          body: JSON.stringify(complexBody),
        }),
      );
    });
  });
});
