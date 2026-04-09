import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppIcon from '../components/AppIcon'
import NoteSubmitForm from '../components/NoteSubmitForm'
import notesData from '../data/xhs_collection/final_notes.json'

export default function Home() {
  const navigate = useNavigate()
  const total = notesData.notes.length
  const [showRules, setShowRules] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  function startGame(count) {
    navigate('/game', { state: { count } })
  }

  return (
    <div className="relative min-h-dvh bg-surface font-body overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative background icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.07]">
        <AppIcon name="sparkles" className="absolute top-16 left-8 h-24 w-24 rotate-12 text-primary" strokeWidth={1.5} />
        <AppIcon name="rocket" className="absolute top-1/4 right-4 h-20 w-20 -rotate-12 text-tertiary" strokeWidth={1.5} />
        <AppIcon name="thumbsUp" className="absolute bottom-1/3 left-[-1rem] h-28 w-28 rotate-45 text-secondary" strokeWidth={1.5} />
        <AppIcon name="heart" className="absolute bottom-10 right-8 h-24 w-24 -rotate-12 text-primary-container" strokeWidth={1.5} />
      </div>

      <main className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center px-6 py-12 gap-10">
        {/* Title section */}
        <section className="text-center space-y-3">
          <div className="relative inline-block">
            <h1 className="font-headline font-black text-6xl text-primary tracking-tight leading-none tilt-left">
              这篇会火吗？
            </h1>
            <div className="absolute -top-4 -right-8">
              <AppIcon name="flame" className="h-10 w-10 text-tertiary-container" />
            </div>
          </div>
          <p className="font-brush text-2xl text-on-surface-variant tilt-right">
            测测你能不能看出爆款
          </p>
        </section>

        {/* Rules button */}
        <section className="flex justify-center -mb-4">
          <button
            className="flex flex-col items-center gap-1 group"
            onClick={() => setShowRules(true)}
          >
            <div className="w-16 h-16 rounded-full bg-white border-4 border-primary text-primary flex items-center justify-center sticker-shadow group-active:scale-95 transition-transform">
              <AppIcon name="help" className="h-9 w-9" />
            </div>
            <span className="font-headline text-primary font-bold text-lg">规则</span>
          </button>
        </section>

        {/* Mode buttons */}
        <section className="w-full flex flex-col gap-6">
          <button
            onClick={() => startGame(10)}
            className="dimensional-btn w-full h-24 bg-primary-container text-on-primary-container rounded-lg border-b-8 border-primary-dim flex items-center justify-between px-8 shadow-xl tilt-left sticker-shadow"
          >
            <div className="text-left">
              <span className="block font-headline font-black text-3xl">10 题快速测试</span>
              <span className="text-sm font-bold opacity-80">3分钟挑战你的直觉</span>
            </div>
            <AppIcon name="zap" className="h-9 w-9" />
          </button>

          <button
            onClick={() => startGame(100)}
            disabled={total < 100}
            className="dimensional-btn w-full h-24 bg-tertiary-container text-on-tertiary-container rounded-lg border-b-8 border-tertiary-dim flex items-center justify-between px-8 shadow-xl tilt-right sticker-shadow disabled:opacity-50"
          >
            <div className="text-left">
              <span className="block font-headline font-black text-3xl">100 题精准测算</span>
              <span className="text-sm font-bold opacity-80">深度解析你的审美</span>
            </div>
            <AppIcon name="chart" className="h-9 w-9" />
          </button>
        </section>

        {/* Upload note button */}
        <section>
          <button
            onClick={() => setShowUpload(true)}
            className="dimensional-btn flex items-center gap-2 bg-secondary-container text-on-secondary-container px-6 py-3 rounded-full border-b-4 border-secondary-dim font-headline font-bold sticker-shadow"
          >
            <AppIcon name="upload" className="h-5 w-5" />
            上传笔记
          </button>
        </section>
      </main>

      {/* Rules modal */}
      {showRules && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          onClick={() => setShowRules(false)}
        >
          <div
            className="bg-white w-full max-w-xs rounded-lg p-8 relative border-4 border-primary sticker-shadow"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-outline"
              onClick={() => setShowRules(false)}
            >
              <AppIcon name="close" className="h-5 w-5" />
            </button>
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-primary-container rounded-full mb-2">
                <AppIcon name="lightbulb" className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline text-2xl text-primary">什么叫"火"？</h3>
              <div className="text-left space-y-3 text-on-surface-variant font-medium text-sm leading-relaxed">
                <p className="bg-surface p-4 rounded-lg">
                  🔥 本游戏判定"火"的公式：<br />
                  <span className="font-bold text-primary">赞数 + 2×收藏 + 3×分享 &gt; 1000</span><br />
                  且博主粉丝数 ≤ 500
                </p>
                <p className="bg-surface p-4 rounded-lg">
                  ✨ 结果仅供娱乐，流量玄学，建议平常心对待。
                </p>
              </div>
              <button
                className="dimensional-btn w-full py-3 bg-primary text-white font-headline text-lg rounded-lg border-b-4 border-primary-dim"
                onClick={() => setShowRules(false)}
              >
                知道了！
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload note modal */}
      {showUpload && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          onClick={() => setShowUpload(false)}
        >
          <div
            className="bg-white w-full max-w-xs rounded-lg p-8 relative border-4 border-secondary sticker-shadow"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-outline"
              onClick={() => setShowUpload(false)}
            >
              <AppIcon name="close" className="h-5 w-5" />
            </button>
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="font-headline text-2xl text-secondary">上传你的笔记</h3>
                <p className="text-xs text-on-surface-variant mt-1">提交后会加入题库供大家判断</p>
              </div>
              <NoteSubmitForm />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
