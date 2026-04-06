import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getQuestionStats, submitFeedback, submitNote } from './api'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('submitFeedback', () => {
  it('returns stats on success', async () => {
    const mockStats = { too_hard: 1, just_right: 2, too_easy: 0, total: 3 }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ stats: mockStats }),
      }),
    )

    const result = await submitFeedback('q1', 'too_hard')
    expect(result).toEqual(mockStats)
  })

  it('returns null on network failure (silent)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const result = await submitFeedback('q1', 'too_hard')
    expect(result).toBeNull()
  })
})

describe('getQuestionStats', () => {
  it('returns stats object on success', async () => {
    const mockStats = { too_hard: 5, just_right: 10, too_easy: 2, total: 17 }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStats),
      }),
    )

    const result = await getQuestionStats('q1')
    expect(result).toEqual(mockStats)
  })

  it('returns null on failure (silent)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))

    const result = await getQuestionStats('q1')
    expect(result).toBeNull()
  })
})

describe('submitNote', () => {
  it('returns true on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 'received' }),
      }),
    )

    const result = await submitNote('https://www.xiaohongshu.com/x')
    expect(result).toBe(true)
  })

  it('returns false on failure (caller shows error)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))

    const result = await submitNote('https://www.xiaohongshu.com/x')
    expect(result).toBe(false)
  })
})
