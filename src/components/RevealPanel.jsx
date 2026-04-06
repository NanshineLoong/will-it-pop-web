function formatNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

export default function RevealPanel({ question, userAnswer, stats, onDifficulty, onNext, difficultyDone }) {
  const correct = userAnswer === question.is_hot

  return (
    <div className="space-y-3">
      {/* Result card */}
      <div className="bg-primary-container/30 border-4 border-primary rounded-lg p-5 space-y-4 sticker-shadow">
        {/* Verdict + user prediction */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary-dim opacity-70 uppercase tracking-wider">系统判定</span>
            <span className="font-headline text-2xl text-primary-dim">
              {question.is_hot ? '这篇会火！🔥' : '这篇没火 ❄️'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-on-surface-variant opacity-70 uppercase tracking-wider">你的预测</span>
            <span className={`block font-headline text-lg ${correct ? 'text-secondary' : 'text-error'}`}>
              {correct ? '非常准确 ✓' : '判断失误 ✗'}
            </span>
          </div>
        </div>

        {/* Interaction stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-primary/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary-dim">
              <span className="material-symbols-outlined icon-filled text-base">favorite</span>
              <span className="font-headline text-base">{formatNum(question.likes)}</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">点赞数</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary-dim">
              <span className="material-symbols-outlined icon-filled text-base">star</span>
              <span className="font-headline text-base">{formatNum(question.collects)}</span>
            </div>
            <span className="text-[10px] text-on-surface-variant">收藏数</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-primary-dim">
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

      {/* Difficulty distribution (shown after voting) */}
      {difficultyDone && stats && (
        <div className="bg-surface-container-low rounded-xl p-3 text-center space-y-1">
          <p className="text-xs text-on-surface-variant font-medium">大家觉得这题</p>
          <div className="flex justify-around text-xs">
            <span className="text-on-surface-variant">太难 <strong className="text-primary">{stats.too_hard}</strong></span>
            <span className="text-on-surface-variant">刚好 <strong className="text-primary">{stats.just_right}</strong></span>
            <span className="text-on-surface-variant">太简单 <strong className="text-primary">{stats.too_easy}</strong></span>
          </div>
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
