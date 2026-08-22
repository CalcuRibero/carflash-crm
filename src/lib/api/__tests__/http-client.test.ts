import { apiRequest, clearApiToken } from '../http-client'

// Mock the API config
jest.mock('../config', () => ({
  NEXT_PUBLIC_API_BASE_PATH: 'http://localhost:3001',
  API_TOKEN_STORAGE_KEY: 'carflash_api_access_token',
}))

// Mock the ApiError
jest.mock('../errors', () => ({
  ApiError: class ApiError extends Error {
    status: number
    payload: unknown
    constructor(message: string, status: number, payload: unknown) {
      super(message)
      this.name = 'ApiError'
      this.status = status
      this.payload = payload
    }
  },
}))

describe('apiRequest - 401 Error Handling', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    
    // Reset window.location
    window.location.href = ''
    
    // Reset localStorage
    localStorage.clear()
    
    // Reset fetch mock
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should clear token and redirect to login on 401 error', async () => {
    // Setup: Save a token
    window.localStorage.setItem('carflash_api_access_token', 'test-token')
    expect(window.localStorage.getItem('carflash_api_access_token')).toBe('test-token')

    // Mock fetch to return 401 response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ message: 'Unauthorized' }),
        text: () => Promise.resolve('{"message": "Unauthorized"}'),
      } as Response)
    ) as jest.Mock

    // Act: Make API request that will fail with 401
    await expect(apiRequest('/test')).rejects.toThrow()

    // Assert: Token should be cleared
    expect(window.localStorage.getItem('carflash_api_access_token')).toBeNull()

    // Assert: Should redirect to login
    expect(window.location.href).toBe('/auth/login')
  })

  it('should not redirect on non-401 errors', async () => {
    // Setup: Save a token
    window.localStorage.setItem('carflash_api_access_token', 'test-token')
    expect(window.localStorage.getItem('carflash_api_access_token')).toBe('test-token')

    // Mock fetch to return 500 response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ message: 'Internal Server Error' }),
        text: () => Promise.resolve('{"message": "Internal Server Error"}'),
      } as Response)
    ) as jest.Mock

    // Act: Make API request that will fail with 500
    await expect(apiRequest('/test')).rejects.toThrow()

    // Assert: Token should NOT be cleared
    expect(window.localStorage.getItem('carflash_api_access_token')).toBe('test-token')

    // Assert: Should NOT redirect
    expect(window.location.href).toBe('')
  })

  it('should handle successful requests normally', async () => {
    // Setup: Save a token
    window.localStorage.setItem('carflash_api_access_token', 'test-token')

    // Mock fetch to return successful response
    const mockData = { success: true, data: 'test' }
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockData),
        text: () => Promise.resolve(JSON.stringify(mockData)),
      } as Response)
    ) as jest.Mock

    // Act: Make successful API request
    const result = await apiRequest('/test')

    // Assert: Should return data
    expect(result).toEqual(mockData)

    // Assert: Token should still be present
    expect(window.localStorage.getItem('carflash_api_access_token')).toBe('test-token')

    // Assert: Should NOT redirect
    expect(window.location.href).toBe('')
  })

  it('should clear token using clearApiToken function', () => {
    // Setup: Save a token
    window.localStorage.setItem('carflash_api_access_token', 'test-token')
    expect(window.localStorage.getItem('carflash_api_access_token')).toBe('test-token')

    // Act: Clear the token
    clearApiToken()

    // Assert: Token should be removed
    expect(window.localStorage.getItem('carflash_api_access_token')).toBeNull()
  })
})