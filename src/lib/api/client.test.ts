import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock fetch for testing
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock SvelteKit $app modules
vi.mock('$app/environment', () => ({
  browser: true
}))

vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should construct URL with base URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'test' })
    })

    // Import after mocking
    const { api } = await import('./client')
    await api.get('/users')

    expect(mockFetch).toHaveBeenCalled()
    const callArgs = mockFetch.mock.calls[0]
    expect(callArgs[0]).toContain('/users')
  })

  it('should include auth header when token exists', async () => {
    localStorageMock.getItem.mockReturnValue('test-token')

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'test' })
    })

    // Re-import to get fresh instance
    vi.resetModules()
    const { api } = await import('./client')
    await api.get('/users')

    const callArgs = mockFetch.mock.calls[0]
    expect(callArgs[1].headers['Authorization']).toBe('Bearer test-token')
  })

  it('should append query params for GET requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: 'test' })
    })

    const { api } = await import('./client')
    await api.get('/users', { page: '1', limit: '10' })

    const callArgs = mockFetch.mock.calls[0]
    expect(callArgs[0]).toContain('page=1')
    expect(callArgs[0]).toContain('limit=10')
  })

  it('should send JSON body for POST requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    })

    const { api } = await import('./client')
    await api.post('/users', { name: 'John', email: 'john@example.com' })

    const callArgs = mockFetch.mock.calls[0]
    expect(callArgs[1].method).toBe('POST')
    expect(callArgs[1].body).toBe(JSON.stringify({ name: 'John', email: 'john@example.com' }))
  })

  it('should handle PUT requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    })

    const { api } = await import('./client')
    await api.put('/users/1', { name: 'Updated' })

    const callArgs = mockFetch.mock.calls[0]
    expect(callArgs[1].method).toBe('PUT')
  })

  it('should handle DELETE requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    })

    const { api } = await import('./client')
    await api.delete('/users/1')

    const callArgs = mockFetch.mock.calls[0]
    expect(callArgs[1].method).toBe('DELETE')
  })

  it('should handle PATCH requests', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    })

    const { api } = await import('./client')
    await api.patch('/users/1', { status: 'active' })

    const callArgs = mockFetch.mock.calls[0]
    expect(callArgs[1].method).toBe('PATCH')
  })

  it('should throw error on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad request' })
    })

    const { api } = await import('./client')

    await expect(api.get('/users')).rejects.toThrow('Bad request')
  })

  it('should throw error on 401 and clear localStorage', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' })
    })

    const { api } = await import('./client')

    await expect(api.get('/users')).rejects.toThrow('Unauthorized')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
  })

  it('should set Content-Type header to application/json', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({})
    })

    const { api } = await import('./client')
    await api.get('/test')

    const callArgs = mockFetch.mock.calls[0]
    expect(callArgs[1].headers['Content-Type']).toBe('application/json')
  })
})
