import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getNoteStats,
  submitFeedback,
  submitNote,
  submitQuizAnswer,
  submitQuizComplete,
} from './api'

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

describe('getNoteStats', () => {
  it('returns stats object on success', async () => {
    const mockStats = { too_hard: 5, just_right: 10, too_easy: 2, total: 17 }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStats),
      }),
    )

    const result = await getNoteStats('n1')
    expect(result).toEqual(mockStats)
  })

  it('returns null on failure (silent)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))

    const result = await getNoteStats('n1')
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

describe('submitQuizAnswer', () => {
  it('posts quiz answers to the answer endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
      }),
    )

    const result = await submitQuizAnswer({
      sessionId: 's1',
      questionCount: 10,
      questionIndex: 0,
      noteId: 'n1',
      userAnswer: true,
      correctAnswer: false,
    })

    expect(fetch).toHaveBeenCalledWith('/api/quiz/answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: 's1',
        question_count: 10,
        question_index: 0,
        note_id: 'n1',
        user_answer: true,
        correct_answer: false,
      }),
    })
    expect(result).toBe(true)
  })

  it('returns false on answer write failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))

    const result = await submitQuizAnswer({
      sessionId: 's1',
      questionCount: 10,
      questionIndex: 0,
      noteId: 'n1',
      userAnswer: true,
      correctAnswer: false,
    })

    expect(result).toBe(false)
  })
})

describe('submitQuizComplete', () => {
  it('posts quiz completion to the completion endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
      }),
    )

    const result = await submitQuizComplete({
      sessionId: 's1',
      questionCount: 10,
      answeredCount: 8,
      correctCount: 6,
      score: 75,
      elapsedMs: 12345,
    })

    expect(fetch).toHaveBeenCalledWith('/api/quiz/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: 's1',
        question_count: 10,
        answered_count: 8,
        correct_count: 6,
        score: 75,
        elapsed_ms: 12345,
      }),
    })
    expect(result).toBe(true)
  })

  it('returns false on completion write failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))

    const result = await submitQuizComplete({
      sessionId: 's1',
      questionCount: 10,
      answeredCount: 8,
      correctCount: 6,
      score: 75,
      elapsedMs: 12345,
    })

    expect(result).toBe(false)
  })
})
