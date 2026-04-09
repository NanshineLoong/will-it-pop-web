import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import {
  clearStoredGameSession,
  loadStoredGameSession,
  saveStoredGameSession,
} from '../lib/gameSession'
import { calcScore, getPersonalityLabel } from '../lib/scoring'
import { isHotNote } from '../lib/notes'
import AppIcon from '../components/AppIcon'
import ShareImage from '../components/ShareImage'

function createFinishedSessionFromLocationState(state) {
  if (!state?.notes || !state?.answers || !state?.sessionId) {
    return null
  }

  const finishedSession = {
    status: 'finished',
    count: state.notes.length,
    notes: state.notes,
    index: Math.max(state.notes.length - 1, 0),
    answers: state.answers,
    selected: null,
    revealed: true,
    difficultyDone: true,
    sessionId: state.sessionId,
    startedAt: Date.now() - (state.elapsedMs ?? 0),
    finishedAt: Date.now(),
    elapsedMs: state.elapsedMs ?? 0,
  }

  saveStoredGameSession(finishedSession)
  return finishedSession
}

export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const shareRef = useRef(null)
  const [session] = useState(() => {
    const storedSession = loadStoredGameSession()
    return storedSession?.status === 'finished'
      ? storedSession
      : createFinishedSessionFromLocationState(state)
  })

  useEffect(() => {
    if (!session) navigate('/', { replace: true })
  }, [navigate, session])

  const notes = session?.notes ?? []
  const answers = session?.answers ?? []
  const elapsedMs = session?.elapsedMs ?? 0
  const correctAnswers = notes.map(isHotNote)
  const { correct, total, accuracy } = calcScore(answers, correctAnswers)
  const score = Math.round(accuracy * 100)
  const label = getPersonalityLabel(accuracy)

  if (!session) return null

  async function handleSave() {
    const el = document.getElementById('share-image')
    const dataUrl = await toPng(el, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    })
    const link = document.createElement('a')
    link.download = 'will-it-pop-result.png'
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="relative min-h-dvh bg-surface font-body flex flex-col">
      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-30 px-6 py-4 bg-surface/90 backdrop-blur-md border-b border-surface-container-high">
        <div className="max-w-md mx-auto flex justify-center">
          <span className="font-headline text-primary text-2xl tracking-tight">测算结果报告</span>
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 w-full max-w-md mx-auto pt-20 pb-40 px-4 scrollbar-none">
        <ShareImage
          ref={shareRef}
          score={score}
          correct={correct}
          total={total}
          label={label}
          elapsedMs={elapsedMs}
        />
      </main>

      {/* Fixed footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-surface via-surface/95 to-transparent px-6 pb-safe pt-4">
        <div className="max-w-md mx-auto flex gap-4">
          <button
            onClick={() => {
              clearStoredGameSession()
              navigate('/')
            }}
            className="dimensional-btn flex-1 bg-surface-container-lowest text-on-surface font-headline text-lg py-4 rounded-2xl border-b-4 border-surface-dim shadow-md flex items-center justify-center gap-2"
          >
            <AppIcon name="home" className="h-5 w-5" />
            回到首页
          </button>
          <button
            onClick={handleSave}
            className="dimensional-btn flex-[1.4] bg-primary text-white font-headline text-lg py-4 rounded-2xl border-b-4 border-primary-dim shadow-lg flex items-center justify-center gap-2"
          >
            <AppIcon name="download" className="h-5 w-5" />
            保存图片分享
          </button>
        </div>
      </footer>
    </div>
  )
}
