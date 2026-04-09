import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearStoredGameSession,
  createGameSession,
  loadStoredGameSession,
  markGameSessionFinished,
  saveStoredGameSession,
} from './gameSession'

describe('gameSession', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-09T10:00:00Z'))
  })

  it('creates a fresh playing session snapshot', () => {
    const session = createGameSession([{ note_id: 'n1', bucket: 'hot' }], 10)

    expect(session).toMatchObject({
      status: 'playing',
      count: 10,
      index: 0,
      answers: [],
      selected: null,
      revealed: false,
      difficultyDone: false,
      startedAt: Date.now(),
    })
    expect(session.notes).toEqual([{ note_id: 'n1', bucket: 'hot' }])
    expect(typeof session.sessionId).toBe('string')
  })

  it('loads a saved playing session', () => {
    const session = createGameSession([{ note_id: 'n1', bucket: 'hot' }], 10)

    saveStoredGameSession(session)

    expect(loadStoredGameSession()).toEqual(session)
  })

  it('rejects malformed saved data', () => {
    sessionStorage.setItem('will-it-pop:game-session', JSON.stringify({ status: 'playing' }))

    expect(loadStoredGameSession()).toBeNull()
  })

  it('marks a session as finished with elapsed time', () => {
    const session = createGameSession([{ note_id: 'n1', bucket: 'hot' }], 10)

    const finished = markGameSessionFinished({
      ...session,
      answers: [true],
      revealed: true,
    }, 3210)

    expect(finished).toMatchObject({
      status: 'finished',
      answers: [true],
      revealed: true,
      elapsedMs: 3210,
      finishedAt: Date.now(),
    })
  })

  it('clears the stored snapshot', () => {
    const session = createGameSession([{ note_id: 'n1', bucket: 'hot' }], 10)

    saveStoredGameSession(session)
    clearStoredGameSession()

    expect(loadStoredGameSession()).toBeNull()
  })
})
