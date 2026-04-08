import { describe, expect, it } from 'vitest'
import {
  getNoteCoverAspectRatio,
  getNoteDescription,
  getNoteDescriptionParts,
  getNoteImages,
  getNoteTitle,
  isHotNote,
  normalizeNoteText,
} from './notes'

describe('note helpers', () => {
  it('uses the note title when present', () => {
    expect(getNoteTitle({ title: '  标题  ', desc: '正文' })).toBe('标题')
  })

  it('keeps blank titles blank instead of falling back to desc text', () => {
    expect(getNoteTitle({ title: '', desc: '\n  第一行正文\n第二行' })).toBe('')
  })

  it('uses a placeholder for blank desc only', () => {
    expect(getNoteTitle({ title: '', desc: '' })).toBe('')
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

  it('returns all note images with local metadata when present', () => {
    expect(getNoteImages({
      images: [
        { url: 'https://example.com/1.webp', width: 1080, height: 1440 },
        { url: 'https://example.com/2.webp', width: 800, height: 600 },
      ],
    })).toEqual([
      { src: 'https://example.com/1.webp', width: 1080, height: 1440 },
      { src: 'https://example.com/2.webp', width: 800, height: 600 },
    ])
  })

  it('falls back to image_urls when no image metadata is available', () => {
    expect(getNoteImages({
      image_urls: ['https://example.com/1.webp', 'https://example.com/2.webp'],
    })).toEqual([
      { src: 'https://example.com/1.webp' },
      { src: 'https://example.com/2.webp' },
    ])
  })

  it('removes unsupported Xiaohongshu bracket emoji text', () => {
    expect(normalizeNoteText('今天要加油[加油R][拳头R]')).toBe('今天要加油')
  })

  it('splits topics into display tokens', () => {
    expect(getNoteDescriptionParts({
      desc: '#育儿新视角[话题]# #家庭教育知识[话题]# 加油[拳头R]',
    })).toEqual([
      { type: 'topic', text: '#育儿新视角' },
      { type: 'text', text: ' ' },
      { type: 'topic', text: '#家庭教育知识' },
      { type: 'text', text: ' 加油' },
    ])
  })
})
