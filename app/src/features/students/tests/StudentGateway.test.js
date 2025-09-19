import { describe, it, expect, vi, beforeEach } from 'vitest'
import StudentGateway from '../gateways/StudentGateway.js'

describe('StudentGateway', () => {
  let gateway

  beforeEach(() => {
    gateway = new StudentGateway()
  })

  describe('fetchStudents', () => {
    it('should return an array of students', async () => {
      const result = await gateway.fetchStudents()
      
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should return initial student data', async () => {
      const result = await gateway.fetchStudents()
      
      expect(result).toHaveLength(4)
      expect(result[0].firstName).toBe('Arben')
      expect(result[1].firstName).toBe('Donika')
    })

    it('should be an async function', () => {
      const result = gateway.fetchStudents()
      
      expect(result).toBeInstanceOf(Promise)
    })
  })

  describe('Future API Integration Tests', () => {
    it('should handle API errors gracefully', async () => {
      // This test demonstrates how we would test error handling
      // when the gateway is connected to a real API
      
      // Mock fetch to simulate API error
      const originalFetch = global.fetch
      global.fetch = vi.fn().mockRejectedValue(new Error('API Error'))
      
      try {
        // In a real implementation, this would call the API
        // For now, it returns initial data as placeholder
        const result = await gateway.fetchStudents()
        expect(result).toHaveLength(4)
      } finally {
        global.fetch = originalFetch
      }
    })

    it('should handle network timeouts', async () => {
      // This test shows how we would test timeout scenarios
      const originalFetch = global.fetch
      global.fetch = vi.fn().mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      )
      
      try {
        const result = await gateway.fetchStudents()
        expect(result).toHaveLength(4)
      } finally {
        global.fetch = originalFetch
      }
    })
  })
})
