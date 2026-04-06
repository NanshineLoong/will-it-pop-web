import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { calcScore, getPersonalityLabel } from '../lib/scoring'
import ShareImage from '../components/ShareImage'

export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const shareRef = useRef(null)

  useEffect(() => {
    if (!state) navigate('/')
  }, [state, navigate])

  if (!state) return null

  const { questions, answers, elapsedMs = 0 } = state
  const correctAnswers = questions.map(q => q.is_hot)
  const { correct, total, accuracy } = calcScore(answers, correctAnswers)
  const score = Math.round(accuracy * 100)
  const label = getPersonalityLabel(accuracy)

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
            onClick={() => navigate('/')}
            className="dimensional-btn flex-1 bg-surface-container-lowest text-on-surface font-headline text-lg py-4 rounded-2xl border-b-4 border-surface-dim shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">home</span>
            回到首页
          </button>
          <button
            onClick={handleSave}
            className="dimensional-btn flex-[1.4] bg-primary text-white font-headline text-lg py-4 rounded-2xl border-b-4 border-primary-dim shadow-lg flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined icon-filled text-xl">download</span>
            保存图片分享
          </button>
        </div>
      </footer>
    </div>
  )
}
