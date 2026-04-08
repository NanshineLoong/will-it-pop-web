import { useEffect, useRef, useState } from 'react'
import {
  getNoteCoverAspectRatio,
  getNoteDescriptionParts,
  getNoteImages,
  getNoteTitle,
} from '../lib/notes'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533'%3E%3Crect width='400' height='533' fill='%23dbdddd'/%3E%3Ctext x='200' y='280' text-anchor='middle' font-size='72' fill='%23acadad'%3E%F0%9F%93%B7%3C/text%3E%3C/svg%3E"

export default function NoteCard({ note }) {
  const swipeRef = useRef({ startX: 0, startIndex: 0, pointerId: null })
  const images = getNoteImages(note)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const safeCurrentIndex = Math.min(currentIndex, Math.max(images.length - 1, 0))
  const currentImage = images[safeCurrentIndex] ?? images[0]
  const aspectRatio = currentImage?.width && currentImage?.height
    ? `${currentImage.width} / ${currentImage.height}`
    : getNoteCoverAspectRatio(note)
  const title = getNoteTitle(note)
  const descriptionParts = getNoteDescriptionParts(note)
  const hasMultipleImages = images.length > 1

  useEffect(() => {
    setCurrentIndex(0)
    setDragOffset(0)
    setIsDragging(false)
  }, [note.note_id])

  function goToImage(nextIndex) {
    if (!images.length) return

    const boundedIndex = Math.min(Math.max(nextIndex, 0), images.length - 1)
    setCurrentIndex(boundedIndex)
    setDragOffset(0)
    setIsDragging(false)
  }

  function startSwipe(clientX, pointerId) {
    if (!hasMultipleImages) return

    swipeRef.current = {
      startX: clientX,
      startIndex: safeCurrentIndex,
      pointerId,
    }
    setDragOffset(0)
    setIsDragging(true)
  }

  function moveSwipe(clientX, width, pointerId) {
    if (!hasMultipleImages || swipeRef.current.pointerId !== pointerId || !width) return

    const rawDeltaX = clientX - swipeRef.current.startX
    const atFirstImage = swipeRef.current.startIndex === 0 && rawDeltaX > 0
    const atLastImage = swipeRef.current.startIndex === images.length - 1 && rawDeltaX < 0
    const resistedDeltaX = atFirstImage || atLastImage ? rawDeltaX * 0.35 : rawDeltaX
    const boundedDeltaX = Math.min(Math.max(resistedDeltaX, -width), width)
    setDragOffset(boundedDeltaX)
  }

  function finishSwipe(clientX, width, pointerId) {
    if (!hasMultipleImages || swipeRef.current.pointerId !== pointerId) return

    const deltaX = clientX - swipeRef.current.startX
    const threshold = Math.min(Math.max(width * 0.18, 36), 96)
    if (Math.abs(deltaX) >= threshold) {
      goToImage(swipeRef.current.startIndex + (deltaX < 0 ? 1 : -1))
    } else {
      goToImage(swipeRef.current.startIndex)
    }

    swipeRef.current.pointerId = null
    setDragOffset(0)
    setIsDragging(false)
  }

  function handlePointerDown(event) {
    startSwipe(event.clientX, event.pointerId)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function handlePointerMove(event) {
    moveSwipe(event.clientX, event.currentTarget.clientWidth, event.pointerId)
  }

  function handlePointerUp(event) {
    finishSwipe(event.clientX, event.currentTarget.clientWidth, event.pointerId)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  function handlePointerCancel(event) {
    if (swipeRef.current.pointerId !== event.pointerId) return

    goToImage(swipeRef.current.startIndex)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    swipeRef.current.pointerId = null
    setDragOffset(0)
    setIsDragging(false)
  }

  function handleTouchStart(event) {
    if (window.PointerEvent) return

    startSwipe(event.touches[0]?.clientX ?? 0, 'touch')
  }

  function handleTouchMove(event) {
    if (window.PointerEvent) return

    moveSwipe(event.touches[0]?.clientX ?? 0, event.currentTarget.clientWidth, 'touch')
  }

  function handleTouchEnd(event) {
    if (window.PointerEvent) return

    finishSwipe(event.changedTouches[0]?.clientX ?? 0, event.currentTarget.clientWidth, 'touch')
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden border-2 border-surface-container-high sticker-shadow flex flex-col">
      <div
        className="w-full max-h-[65dvh] bg-surface-container-highest relative flex items-center justify-center overflow-hidden"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-label="笔记图片轮播"
          className="w-full h-full overflow-hidden touch-pan-y select-none"
        >
          <div
            className={`flex h-full ${isDragging ? '' : 'transition-transform duration-300 ease-out'}`}
            style={{ transform: `translateX(calc(-${safeCurrentIndex * 100}% + ${dragOffset}px))` }}
          >
            {(images.length ? images : [{ src: PLACEHOLDER }]).map((image, index) => (
              <div
                key={`${image.src}-${index}`}
                className="w-full h-full flex-none flex items-center justify-center"
              >
                <img
                  src={image.src || PLACEHOLDER}
                  alt={`笔记图片 ${index + 1}`}
                  className="w-full h-full object-contain"
                  draggable="false"
                  onDragStart={e => e.preventDefault()}
                  onError={e => { e.currentTarget.src = PLACEHOLDER }}
                />
              </div>
            ))}
          </div>
        </div>

        {hasMultipleImages && (
          <>
            <div className="absolute top-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-white">
              {safeCurrentIndex + 1}/{images.length}
            </div>
            <button
              type="button"
              onClick={() => goToImage(safeCurrentIndex - 1)}
              disabled={safeCurrentIndex === 0}
              aria-label="上一张图片"
              className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-on-surface shadow disabled:opacity-35"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={() => goToImage(safeCurrentIndex + 1)}
              disabled={safeCurrentIndex === images.length - 1}
              aria-label="下一张图片"
              className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-on-surface shadow disabled:opacity-35"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </>
        )}
      </div>

      <div className="p-5 space-y-3">
        {title && (
          <h2 className="font-bold text-lg leading-tight text-on-surface">
            {title}
          </h2>
        )}
        <div className="text-sm text-on-surface-variant leading-relaxed">
          <p className="whitespace-pre-wrap">
            {descriptionParts.map((part, index) => (
              part.type === 'topic'
                ? (
                    <span key={`${part.text}-${index}`} className="mr-1 font-medium text-secondary">
                      {part.text}
                    </span>
                  )
                : part.text
            ))}
          </p>
        </div>
      </div>
    </div>
  )
}
