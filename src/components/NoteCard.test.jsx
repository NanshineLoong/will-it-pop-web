import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import NoteCard from './NoteCard'

const multiImageNote = {
  note_id: 'note-1',
  title: '多图笔记',
  desc: '正文',
  images: [
    { url: 'https://example.com/1.webp', width: 1080, height: 1440 },
    { url: 'https://example.com/2.webp', width: 1080, height: 1440 },
    { url: 'https://example.com/3.webp', width: 1080, height: 1440 },
  ],
}

describe('NoteCard', () => {
  it('moves with the swipe gesture before settling', () => {
    render(<NoteCard note={multiImageNote} />)

    const carousel = screen.getByLabelText('笔记图片轮播')
    Object.defineProperty(carousel, 'clientWidth', {
      configurable: true,
      value: 320,
    })

    fireEvent.touchStart(carousel, { touches: [{ clientX: 300 }] })
    fireEvent.touchMove(carousel, { touches: [{ clientX: 220 }] })

    expect(carousel.firstChild).toHaveStyle('transform: translateX(calc(-0% + -80px))')
  })

  it('moves at most one image per swipe gesture', async () => {
    render(<NoteCard note={multiImageNote} />)

    const carousel = screen.getByLabelText('笔记图片轮播')
    Object.defineProperty(carousel, 'clientWidth', {
      configurable: true,
      value: 320,
    })

    fireEvent.touchStart(carousel, { touches: [{ clientX: 300 }] })
    fireEvent.touchEnd(carousel, { changedTouches: [{ clientX: -500 }] })

    await waitFor(() => {
      expect(screen.getByLabelText('当前图片序号')).toHaveTextContent('2/3')
    })
  })

  it('shows note text without an internal vertical scroll container', () => {
    render(<NoteCard note={multiImageNote} />)

    const descriptionContainer = screen.getByText('正文').parentElement.parentElement

    expect(descriptionContainer).not.toHaveClass('max-h-52')
    expect(descriptionContainer).not.toHaveClass('overflow-y-auto')
  })
})
