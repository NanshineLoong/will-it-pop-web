function formatNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

export default function RevealPanel({ question, userAnswer, onDifficulty, onNext, difficultyDone }) {
  const correct = userAnswer === question.is_hot
  const isHot = question.is_hot

  return (
    <div className="space-y-3">
      {/* Result card */}
      <div className={`border-4 rounded-lg p-5 space-y-4 sticker-shadow ${
        isHot
          ? 'bg-tertiary-container/30 border-tertiary'
          : 'bg-secondary-container/30 border-secondary'
      }`}>
        {/* Verdict + user prediction */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className={`text-[10px] font-bold opacity-70 uppercase tracking-wider ${isHot ? 'text-tertiary-dim' : 'text-secondary-dim'}`}>系统判定</span>
            <span className={`font-headline text-2xl ${isHot ? 'text-tertiary-dim' : 'text-secondary'}`}>
              {isHot ? '这篇火了！🔥' : '这篇没火 ❄️'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-on-surface-variant opacity-70 uppercase tracking-wider">你的预测</span>
            <span className={`block font-headline text-lg ${correct ? 'text-primary-dim' : 'text-error'}`}>
              {correct ? '非常准确 ✓' : '判断失误 ✗'}
            </span>
          </div>
        </div>

        {/* Interaction stats */}
        <div className={`grid grid-cols-3 gap-2 py-3 border-y ${isHot ? 'border-tertiary/20' : 'border-secondary/20'}`}>
          <div className="text-center">
            <div className={`flex items-center justify-center gap-1 ${isHot ? 'text-tertiary-dim' : 'text-secondary'}`}>
              <span className="material-symbols-outlined icon-filled text-base">favorite</span>
              <span className="font-headline text-base">{formatNum(question.likes)}</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">点赞数</span>
          </div>
          <div className="text-center">
            <div className={`flex items-center justify-center gap-1 ${isHot ? 'text-tertiary-dim' : 'text-secondary'}`}>
              <span className="material-symbols-outlined icon-filled text-base">star</span>
              <span className="font-headline text-base">{formatNum(question.collects)}</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">收藏数</span>
          </div>
          <div className="text-center">
            <div className={`flex items-center justify-center gap-1 ${isHot ? 'text-tertiary-dim' : 'text-secondary'}`}>
              <span className="material-symbols-outlined icon-filled text-base">share</span>
              <span className="font-headline text-base">{formatNum(question.shares)}</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">分享数</span>
          </div>
        </div>

        {/* Source link */}
        <a
          href={question.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-secondary font-headline rounded-full border-2 border-secondary-container text-sm"
        >
          <span className="material-symbols-outlined text-sm">link</span>
          原笔记链接
        </a>
      </div>

      {/* Difficulty rating */}
      {!difficultyDone && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-surface-container-highest" />
            <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest">
              这道题难度如何？
            </span>
            <span className="h-px w-8 bg-surface-container-highest" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'too_hard', label: '太难了' },
              { key: 'just_right', label: '刚刚好' },
              { key: 'too_easy', label: '太简单' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onDifficulty(key)}
                className="dimensional-btn py-2.5 bg-surface-container-low text-on-surface-variant font-medium text-xs rounded-xl border-b-2 border-surface-dim"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Thank you message (shown after voting) */}
      {difficultyDone && (
        <div className="bg-surface-container-low rounded-xl p-3 text-center">
          <p className="text-sm text-on-surface-variant font-medium">谢谢您的反馈 🙏</p>
        </div>
      )}

      {/* Next button */}
      <button
        onClick={onNext}
        className="dimensional-btn w-full bg-primary text-white font-headline text-xl py-4 rounded-xl border-b-4 border-primary-dim shadow-lg"
      >
        下一题
      </button>
    </div>
  )
}
