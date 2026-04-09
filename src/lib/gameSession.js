const STORAGE_KEY = 'will-it-pop:game-session'

function createSessionId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function isValidNotes(notes) {
  return Array.isArray(notes) && notes.length > 0
}

function isValidBaseSession(session) {
  if (!session || typeof session !== 'object') return false
  if (session.status !== 'playing' && session.status !== 'finished') return false
  if (!Number.isInteger(session.count) || session.count < 1) return false
  if (!isValidNotes(session.notes)) return false
  if (!Array.isArray(session.answers) || session.answers.length > session.notes.length) return false
  if (session.selected !== null && typeof session.selected !== 'boolean') return false
  if (typeof session.revealed !== 'boolean') return false
  if (typeof session.difficultyDone !== 'boolean') return false
  if (typeof session.sessionId !== 'string' || session.sessionId.length === 0) return false
  if (!Number.isInteger(session.startedAt) || session.startedAt < 0) return false

  return true
}

function isValidPlayingSession(session) {
  if (!Number.isInteger(session.index)) return false
  if (session.index < 0 || session.index >= session.notes.length) return false
  if (session.revealed && session.answers.length !== session.index + 1) return false
  if (!session.revealed && session.answers.length !== session.index) return false

  return true
}

function isValidFinishedSession(session) {
  if (!Number.isInteger(session.elapsedMs) || session.elapsedMs < 0) return false
  if (!Number.isInteger(session.finishedAt) || session.finishedAt < 0) return false

  return true
}

function isValidSession(session) {
  if (!isValidBaseSession(session)) return false

  if (session.status === 'playing') {
    return isValidPlayingSession(session)
  }

  return isValidFinishedSession(session)
}

export function createGameSession(notes, count) {
  return {
    status: 'playing',
    count,
    notes,
    index: 0,
    answers: [],
    selected: null,
    revealed: false,
    difficultyDone: false,
    sessionId: createSessionId(),
    startedAt: Date.now(),
    finishedAt: null,
    elapsedMs: null,
  }
}

export function saveStoredGameSession(session) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function loadStoredGameSession() {
  const raw = sessionStorage.getItem(STORAGE_KEY)

  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)

    if (!isValidSession(parsed)) {
      clearStoredGameSession()
      return null
    }

    return parsed
  } catch {
    clearStoredGameSession()
    return null
  }
}

export function clearStoredGameSession() {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function markGameSessionFinished(session, elapsedMs) {
  return {
    ...session,
    status: 'finished',
    elapsedMs,
    finishedAt: Date.now(),
  }
}

export function getPlayingSessionElapsedMs(session) {
  return Date.now() - session.startedAt
}

export function isFinishedGameSession(session) {
  return session?.status === 'finished'
}
