import 'reflect-metadata'
import { vi } from 'vitest'

// Global test setup
// This file runs before all tests

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore console.log in tests
  // log: vi.fn(),
  // debug: vi.fn(),
  // info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}
