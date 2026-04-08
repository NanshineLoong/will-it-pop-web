import { describe, expect, it } from 'vitest'
import {
  getNoteCoverAspectRatio,
  getNoteDescription,
  getNoteTitle,
  isHotNote,
} from './notes'

describe('note helpers', () => {
  it('uses the note title when present', () => {
    expect(getNoteTitle({ title: '  标题  ', desc: '正文' })).toBe('标题')
  })

  it('falls back to the first non-empty desc line for blank titles', () => {
    expect(getNoteTitle({ title: '', desc: '\n  第一行正文\n第二行' })).toBe('第一行正文')
  })

  it('uses a placeholder for blank title and desc', () => {
    expect(getNoteTitle({ title: '', desc: '' })).toBe('无标题笔记')
    expect(getNoteDescription({ desc: '' })).toBe('这条笔记没有正文。')
  })

  it('derives hot state from the bucket field', () => {
    expect(isHotNote({ bucket: 'hot' })).toBe(true)
    expect(isHotNote({ bucket: 'cold' })).toBe(false)
  })

  it('derives the cover aspect ratio from the first image dimensions', () => {
    expect(getNoteCoverAspectRatio({
      images: [{ width: 1080, height: 1440 }],
    })).toBe('1080 / 1440')
  })
})
