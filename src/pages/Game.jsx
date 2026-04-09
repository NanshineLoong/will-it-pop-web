import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import notesData from '../data/xhs_collection/final_notes.json'
import { sampleNotes } from '../lib/game'
import {
  createGameSession,
  getPlayingSessionElapsedMs,
  isFinishedGameSession,
  loadStoredGameSession,
  markGameSessionFinished,
  saveStoredGameSession,
} from '../lib/gameSession'
import { calcScore } from '../lib/scoring'
import { submitFeedback, submitQuizAnswer, submitQuizComplete } from '../lib/api'
import { isHotNote } from '../lib/notes'
import AppIcon from '../components/AppIcon'
import NoteCard from '../components/NoteCard'
import RevealPanel from '../components/RevealPanel'

export default function Game() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const count = state?.count ?? 10

  const [session, setSession] = useState(() => {
    const storedSession = loadStoredGameSession()

    if (storedSession) {
      return storedSession
    }

    const freshSession = createGameSession(sampleNotes(notesData.notes, count), count)
    saveStoredGameSession(freshSession)
    return freshSession
  })

  useEffect(() => {
    if (isFinishedGameSession(session)) {
      navigate('/result', { replace: true })
    }
  }, [navigate, session])

  function updateSession(updater) {
    setSession((previousSession) => {
      const nextSession = updater(previousSession)
      saveStoredGameSession(nextSession)
      return nextSession
    })
  }

  const note = session.notes[session.index]
  const progress = (session.index / session.notes.length) * 100
  const pct = Math.round(progress)

  function handleConfirm() {
    if (session.selected === null) return

    void submitQuizAnswer({
      sessionId: session.sessionId,
      questionCount: session.notes.length,
      questionIndex: session.index,
      noteId: note.note_id,
      userAnswer: session.selected,
      correctAnswer: isHotNote(note),
    }).then((ok) => {
      if (!ok) {
        console.error('Failed to persist quiz answer')
      }
    })

    updateSession((previousSession) => ({
      ...previousSession,
      answers: [...previousSession.answers, previousSession.selected],
      revealed: true,
    }))
  }

  async function handleDifficulty(difficulty) {
    updateSession((previousSession) => ({
      ...previousSession,
      difficultyDone: true,
    }))
    await submitFeedback(note.note_id, difficulty)
  }

  function handleNext() {
    if (session.index + 1 >= session.notes.length) {
      const elapsedMs = getPlayingSessionElapsedMs(session)
      const finishedSession = markGameSessionFinished(session, elapsedMs)
      const correctAnswers = finishedSession.notes.map(isHotNote)
      const { correct, total, accuracy } = calcScore(finishedSession.answers, correctAnswers)

      saveStoredGameSession(finishedSession)
      void submitQuizComplete({
        sessionId: finishedSession.sessionId,
        questionCount: finishedSession.notes.length,
        answeredCount: total,
        correctCount: correct,
        score: Math.round(accuracy * 100),
        elapsedMs,
      }).then((ok) => {
        if (!ok) {
          console.error('Failed to persist quiz completion')
        }
      })

      navigate('/result')
    } else {
      updateSession((previousSession) => ({
        ...previousSession,
        index: previousSession.index + 1,
        selected: null,
        revealed: false,
        difficultyDone: false,
      }))
      // Scroll to top of content
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (isFinishedGameSession(session)) return null
  if (!note) return null

  return (
    <div className="relative min-h-dvh bg-surface font-body flex flex-col">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-30 px-5 py-3 bg-surface/90 backdrop-blur-md border-b border-surface-container-high">
        <div className="max-w-md mx-auto flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="font-headline text-primary text-xl">
              第 {session.index + 1} / {session.notes.length} 题
            </span>
            <span className="text-xs font-bold text-on-surface-variant opacity-60">
              完成度 {pct}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <main className={`flex-1 w-full max-w-md mx-auto px-4 pt-20 scrollbar-none ${session.revealed ? 'pb-[28rem]' : 'pb-52'}`}>
        <NoteCard note={note} />
      </main>

      {/* Fixed footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-surface via-surface/95 to-transparent px-4 pt-4 pb-safe">
        <div className="max-w-md mx-auto space-y-3">
          {!session.revealed ? (
            /* Before answering */
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateSession((previousSession) => ({ ...previousSession, selected: true }))}
                  className={[
                    'dimensional-btn py-4 rounded-lg border-b-4 flex flex-col items-center justify-center gap-1 transition-colors',
                    session.selected === true
                      ? 'bg-primary-container border-primary-dim text-on-primary-container'
                      : 'bg-white border-surface-container-highest text-primary'
                  ].join(' ')}
                >
                  <AppIcon name="flame" className="h-9 w-9" />
                  <span className="font-headline text-lg">会火</span>
                </button>
                <button
                  onClick={() => updateSession((previousSession) => ({ ...previousSession, selected: false }))}
                  className={[
                    'dimensional-btn py-4 rounded-lg border-b-4 flex flex-col items-center justify-center gap-1 transition-colors',
                    session.selected === false
                      ? 'bg-error-container/20 border-error text-error'
                      : 'bg-white border-surface-container-highest text-outline'
                  ].join(' ')}
                >
                  <AppIcon name="ban" className="h-9 w-9" />
                  <span className="font-headline text-lg text-on-surface-variant">不会火</span>
                </button>
              </div>
              <button
                onClick={handleConfirm}
                disabled={session.selected === null}
                className="dimensional-btn w-full bg-primary text-white font-headline text-xl py-4 rounded-xl border-b-4 border-primary-dim shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                确认选择
              </button>
            </div>
          ) : (
            /* After answering */
            <RevealPanel
              note={note}
              userAnswer={session.answers[session.answers.length - 1]}
              onDifficulty={handleDifficulty}
              onNext={handleNext}
              difficultyDone={session.difficultyDone}
            />
          )}
        </div>
      </footer>
    </div>
  )
}
