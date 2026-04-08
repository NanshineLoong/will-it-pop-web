import { describe, expect, it } from 'vitest'
import { sampleNotes } from './game'

const makeNotes = (hotCount, coldCount) => [
  ...Array.from({ length: hotCount }, (_, i) => ({
    note_id: `hot-${i}`,
    bucket: 'hot',
  })),
  ...Array.from({ length: coldCount }, (_, i) => ({
    note_id: `cold-${i}`,
    bucket: 'cold',
  })),
]

describe('sampleNotes', () => {
  it('returns requested count for 10-mode with sufficient pool', () => {
    const pool = makeNotes(15, 15)
    const result = sampleNotes(pool, 10)
    expect(result).toHaveLength(10)
  })

  it('returns balanced hot/cold split', () => {
    const pool = makeNotes(15, 15)
    const result = sampleNotes(pool, 10)
    const hot = result.filter((note) => note.bucket === 'hot').length
    const cold = result.filter((note) => note.bucket !== 'hot').length
    expect(Math.abs(hot - cold)).toBeLessThanOrEqual(1)
  })

  it('returns full requested count when one side is small', () => {
    const pool = makeNotes(3, 15)
    const result = sampleNotes(pool, 10)
    expect(result).toHaveLength(10)
  })

  it('degrades gracefully when total pool < requested count', () => {
    const pool = makeNotes(8, 7)
    const result = sampleNotes(pool, 100)
    expect(result).toHaveLength(15)
  })

  it('never duplicates notes in the sampled result', () => {
    const pool = makeNotes(20, 20)
    const ids = sampleNotes(pool, 10).map((note) => note.note_id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
