import { forwardRef } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import notesData from '../data/xhs_collection/final_notes.json'
import Home from './Home'
import Game from './Game'
import Result from './Result'
import {
  createGameSession,
  loadStoredGameSession,
  markGameSessionFinished,
  saveStoredGameSession,
} from '../lib/gameSession'

vi.mock('../components/AppIcon', () => ({
  default: () => <span data-testid="app-icon" />,
}))

vi.mock('../components/NoteCard', () => ({
  default: ({ note }) => <div>note:{note.note_id}</div>,
}))

vi.mock('../components/RevealPanel', () => ({
  default: ({ onNext }) => <button onClick={onNext}>next</button>,
}))

vi.mock('../components/ShareImage', () => ({
  default: forwardRef(function ShareImageMock({ score }, ref) {
    return <div ref={ref}>share-score:{score}</div>
  }),
}))

vi.mock('../lib/api', () => ({
  submitFeedback: vi.fn().mockResolvedValue(null),
  submitQuizAnswer: vi.fn().mockResolvedValue(true),
  submitQuizComplete: vi.fn().mockResolvedValue(true),
}))

function renderRoutes(initialEntries) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('game session flow', () => {
  const notes = notesData.notes.slice(0, 3)

  beforeEach(() => {
    sessionStorage.clear()
  })

  it('starts a new session from home even when an old snapshot exists', async () => {
    const oldSession = createGameSession(notes, 100)
    saveStoredGameSession({
      ...oldSession,
      index: 2,
      answers: [true, false],
      selected: true,
    })

    renderRoutes(['/'])

    await userEvent.click(screen.getByRole('button', { name: /10 题快速测试/i }))

    await waitFor(() => expect(screen.getByText('第 1 / 10 题')).toBeInTheDocument())

    const stored = loadStoredGameSession()
    expect(stored).toMatchObject({
      status: 'playing',
      count: 10,
      index: 0,
      answers: [],
      selected: null,
      revealed: false,
    })
    expect(stored.sessionId).not.toBe(oldSession.sessionId)
  })

  it('restores a playing session when the game page reloads', () => {
    const session = createGameSession(notes, 10)
    saveStoredGameSession({
      ...session,
      index: 1,
      answers: [true],
      selected: false,
      revealed: false,
    })

    renderRoutes(['/game'])

    expect(screen.getByText('第 2 / 3 题')).toBeInTheDocument()
    expect(screen.getByText(`note:${notes[1].note_id}`)).toBeInTheDocument()
  })

  it('restores a finished session when the result page reloads', () => {
    const session = createGameSession(notes, 10)
    saveStoredGameSession(markGameSessionFinished({
      ...session,
      index: 2,
      answers: [true, false, true],
      revealed: true,
      difficultyDone: true,
    }, 4567))

    renderRoutes(['/result'])

    expect(screen.getByText('测算结果报告')).toBeInTheDocument()
    expect(screen.getByText(/share-score:/i)).toBeInTheDocument()
  })

  it('clears saved state when leaving result for home', async () => {
    const session = createGameSession(notes, 10)
    const finished = markGameSessionFinished({
      ...session,
      index: 2,
      answers: [true, false, true],
      revealed: true,
      difficultyDone: true,
    }, 4567)
    saveStoredGameSession(finished)

    renderRoutes([{
      pathname: '/result',
      state: {
        notes: finished.notes,
        answers: finished.answers,
        elapsedMs: finished.elapsedMs,
        sessionId: finished.sessionId,
      },
    }])

    await userEvent.click(screen.getByRole('button', { name: /回到首页/i }))

    await waitFor(() => expect(screen.getByText('这篇会火吗？')).toBeInTheDocument())
    expect(loadStoredGameSession()).toBeNull()
  })
})
