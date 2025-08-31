import '@testing-library/jest-dom'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock matchMedia pour éviter les erreurs CSS
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock pour les images blob
global.URL.createObjectURL = () => 'mocked-url'
