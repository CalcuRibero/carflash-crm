import '@testing-library/jest-dom'

// Mock window.location
delete window.location
window.location = {
  href: '',
  assign: jest.fn(),
  replace: jest.fn(),
} as any

// Mock localStorage with actual storage functionality
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

global.localStorage = localStorageMock as any

// Mock document.cookie with actual cookie functionality
let cookieStore: Record<string, string> = {}

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