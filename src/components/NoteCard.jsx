import {
  getNoteCoverAspectRatio,
  getNoteCoverSrc,
  getNoteDescription,
  getNoteTitle,
} from '../lib/notes'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533'%3E%3Crect width='400' height='533' fill='%23dbdddd'/%3E%3Ctext x='200' y='280' text-anchor='middle' font-size='72' fill='%23acadad'%3E%F0%9F%93%B7%3C/text%3E%3C/svg%3E"

export default function NoteCard({ note }) {
  const coverSrc = getNoteCoverSrc(note)
  const aspectRatio = getNoteCoverAspectRatio(note)

  return (
    <div className="bg-white rounded-lg overflow-hidden border-2 border-surface-container-high sticker-shadow flex flex-col">
      <div
        className="w-full max-h-[65dvh] bg-surface-container-highest relative flex items-center justify-center overflow-hidden"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <img
          src={coverSrc || PLACEHOLDER}
          alt="封面"
          className="w-full h-full object-contain"
          onError={e => { e.currentTarget.src = PLACEHOLDER }}
        />
      </div>

      <div className="p-5 space-y-3">
        <h2 className="font-bold text-lg leading-tight text-on-surface">
          {getNoteTitle(note)}
        </h2>
        <div className="text-sm text-on-surface-variant leading-relaxed max-h-52 overflow-y-auto pr-1">
          <p className="whitespace-pre-line">{getNoteDescription(note)}</p>
        </div>
      </div>
    </div>
  )
}
