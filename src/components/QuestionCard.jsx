const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533'%3E%3Crect width='400' height='533' fill='%23dbdddd'/%3E%3Ctext x='200' y='280' text-anchor='middle' font-size='72' fill='%23acadad'%3E%F0%9F%93%B7%3C/text%3E%3C/svg%3E"

export default function QuestionCard({ question, selected, onSelect }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border-2 border-surface-container-high sticker-shadow flex flex-col">
      {/* Cover image */}
      <div className="aspect-[3/4] bg-surface-container-highest relative">
        <img
          src={question.cover}
          alt="封面"
          className="w-full h-full object-cover"
          onError={e => { e.target.src = PLACEHOLDER }}
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h2 className="font-bold text-lg leading-tight text-on-surface">
          {question.title}
        </h2>
        <div className="text-sm text-on-surface-variant leading-relaxed">
          <p>{question.body}</p>
        </div>
      </div>

      {/* Choice buttons inside card bottom */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => onSelect(true)}
          className={[
            'dimensional-btn py-4 rounded-lg border-b-4 flex flex-col items-center justify-center gap-1 transition-colors',
            selected === true
              ? 'bg-primary-container border-primary-dim text-on-primary-container'
              : 'bg-white border-surface-container-highest text-primary'
          ].join(' ')}
        >
          <span className="material-symbols-outlined icon-filled text-4xl">local_fire_department</span>
          <span className="font-headline text-lg">会火</span>
        </button>
        <button
          onClick={() => onSelect(false)}
          className={[
            'dimensional-btn py-4 rounded-lg border-b-4 flex flex-col items-center justify-center gap-1 transition-colors',
            selected === false
              ? 'bg-error-container/20 border-error text-error'
              : 'bg-white border-surface-container-highest text-outline'
          ].join(' ')}
        >
          <span className="material-symbols-outlined text-4xl">block</span>
          <span className="font-headline text-lg text-on-surface-variant">不会火</span>
        </button>
      </div>
    </div>
  )
}
