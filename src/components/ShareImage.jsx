import { forwardRef } from 'react'
import AppIcon from './AppIcon'

const personalityDesc = {
  '爆款雷达型选手': '你对流量有着天然的嗅觉，总能在平凡的文字中精准锁定那抹爆款的基因。下一个顶流推手就是你！',
  '内容直觉型选手': '你有扎实的内容感知力，大部分时候都能看穿流量密码，偶尔被迷惑也是正常的。',
  '流量迷雾型选手': '流量玄学对你来说还有些神秘，但直觉正在觉醒。多刷多看，爆款嗅觉练得出来。',
  '反向指标型选手': '你的判断常常和流量反着来，这说明你有自己独特的审美！坚持就是个性。',
}

function formatTime(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
}

const ShareImage = forwardRef(function ShareImage({ score, correct, total, label, elapsedMs }, ref) {
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')

  return (
    <div
      ref={ref}
      id="share-image"
      style={{ width: 375 }}
      className="relative bg-white rounded-[2.5rem] border-2 border-surface-container-high shadow-xl overflow-hidden font-body"
    >
      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary/20 rounded-tl-xl" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary/20 rounded-tr-xl" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary/20 rounded-bl-xl" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary/20 rounded-br-xl" />

      <div className="relative p-8 text-center flex flex-col gap-5">
        {/* Score */}
        <div>
          <p className="text-[10px] font-extrabold tracking-widest text-on-surface-variant/50 uppercase">总分</p>
          <div className="relative inline-block leading-none">
            <span className="text-[6rem] font-extrabold text-primary tracking-tighter">{score}</span>
            <span className="absolute -top-1 -right-5 font-headline text-xl text-primary/70">分</span>
          </div>
        </div>

        {/* Label badge */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary-container px-6 py-2 rounded-full border-2 border-primary sticker-shadow">
            <span className="font-headline text-xl text-on-primary-container tracking-wide">{label}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-primary/20" />
            <AppIcon name="sparkles" className="h-[18px] w-[18px] text-primary" />
            <span className="h-px w-6 bg-primary/20" />
          </div>
        </div>

        {/* Quote */}
        <p className="text-on-surface-variant font-medium leading-relaxed text-sm opacity-80 px-4">
          "{personalityDesc[label]}"
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 divide-x divide-surface-container-high/60 py-3 border-y border-surface-container-high/50">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-on-surface-variant/40 tracking-wider mb-1">正确题目数/总题数</span>
            <span className="font-extrabold text-xl text-primary">
              {correct}/{total} <span className="text-xs font-headline">题</span>
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-on-surface-variant/40 tracking-wider mb-1">耗时</span>
            <span className="font-extrabold text-xl text-primary">{formatTime(elapsedMs)}</span>
          </div>
        </div>

        {/* QR code placeholder */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <div className="bg-surface-container-low p-3 rounded-2xl border border-surface-container-high/30">
            {/* QR code will be injected here once user provides it */}
            <div className="w-24 h-24 flex items-center justify-center text-outline-variant text-xs">
              <AppIcon name="qr" className="h-12 w-12 opacity-30" strokeWidth={1.75} />
            </div>
          </div>
          <p className="text-on-surface-variant/60 text-xs font-bold tracking-wider">扫描二维码进入网址</p>
        </div>

        <p className="text-[10px] font-black text-on-surface-variant/30 tracking-[0.2em]">{today}</p>
      </div>
    </div>
  )
})

export default ShareImage
