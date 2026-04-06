const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533'%3E%3Crect width='400' height='533' fill='%23dbdddd'/%3E%3Ctext x='200' y='280' text-anchor='middle' font-size='72' fill='%23acadad'%3E%F0%9F%93%B7%3C/text%3E%3C/svg%3E"

export default function QuestionCard({ question }) {
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

    </div>
  )
}
