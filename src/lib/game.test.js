import { describe, expect, it } from 'vitest'
import { sampleQuestions } from './game'

const makeQuestions = (hotCount, coldCount) => [
  ...Array.from({ length: hotCount }, (_, i) => ({
    id: `hot-${i}`,
    is_hot: true,
  })),
  ...Array.from({ length: coldCount }, (_, i) => ({
    id: `cold-${i}`,
    is_hot: false,
  })),
]

describe('sampleQuestions', () => {
  it('returns requested count for 10-mode with sufficient pool', () => {
    const pool = makeQuestions(15, 15)
    const result = sampleQuestions(pool, 10)
    expect(result).toHaveLength(10)
  })

  it('returns balanced hot/cold split', () => {
    const pool = makeQuestions(15, 15)
    const result = sampleQuestions(pool, 10)
    const hot = result.filter((question) => question.is_hot).length
    const cold = result.filter((question) => !question.is_hot).length
    expect(Math.abs(hot - cold)).toBeLessThanOrEqual(1)
  })

  it('returns full requested count when one side is small', () => {
    const pool = makeQuestions(3, 15)
    const result = sampleQuestions(pool, 10)
    expect(result).toHaveLength(10)
  })

  it('degrades gracefully when total pool < requested count', () => {
    const pool = makeQuestions(8, 7)
    const result = sampleQuestions(pool, 100)
    expect(result).toHaveLength(15)
  })

  it('never duplicates questions in the sampled result', () => {
    const pool = makeQuestions(20, 20)
    const ids = sampleQuestions(pool, 10).map((question) => question.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
