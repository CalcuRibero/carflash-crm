import { apiRequest, getApiToken } from '../apiClient'

// Mock the API config
jest.mock('@/lib/api/config', () => ({
  NEXT_PUBLIC_API_BASE_PATH: 'http://localhost:3001',
}))

// Mock the ApiError
jest.mock('@/lib/api/errors', () => ({
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

describe('apiClient - 401 Error Handling', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    
    // Reset window.location
    window.location.href = ''
    
    // Reset localStorage
    localStorage.clear()
    
    // Reset document.cookie
    document.cookie = ''
    
    // Clear the cookie store
    const cookieStore: Record<string, string> = {}
    Object.defineProperty(document, 'cookie', {
      get: () => {
        return Object.entries(cookieStore)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ')
      },
      set: (cookie: string) => {
        const [keyValue] = cookie.split(';')
        const [key, value] = keyValue.split('=')
        if (key && value) {
          cookieStore[key.trim()] = value.trim()
        }
      },
    })
    
    // Reset fetch mock
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should clear token and redirect to login on 401 error', async () => {
    // Setup: Save a token in localStorage
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

    // Assert: Token should be cleared from localStorage
    expect(window.localStorage.getItem('carflash_api_access_token')).toBeNull()

    // Assert: Should redirect to login
    expect(window.location.href).toBe('/auth/login')
  })

  it('should read token from localStorage', () => {
    // Setup: Save a token in localStorage
    window.localStorage.setItem('carflash_api_access_token', 'test-token')

    // Act: Get the token
    const token = getApiToken()

    // Assert: Should return the token
    expect(token).toBe('test-token')
  })

  it('should read token from cookie if localStorage is empty', () => {
    // Setup: Set token in cookie
    document.cookie = 'accessToken=cookie-token'

    // Act: Get the token
    const token = getApiToken()

    // Assert: Should return the token from cookie
    expect(token).toBe('cookie-token')
  })

  it('should prefer localStorage over cookies', () => {
    // Setup: Set token in both localStorage and cookie
    window.localStorage.setItem('carflash_api_access_token', 'local-token')
    document.cookie = 'accessToken=cookie-token'

    // Act: Get the token
    const token = getApiToken()

    // Assert: Should prefer localStorage
    expect(token).toBe('local-token')
  })

  it('should not redirect on non-401 errors', async () => {
    // Setup: Save a token
    window.localStorage.setItem('carflash_api_access_token', 'test-token')

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
})