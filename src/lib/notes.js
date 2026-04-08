const imageModules = import.meta.glob('../data/xhs_collection/images/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

export function isHotNote(note) {
  return note.bucket === 'hot'
}

export function getNoteTitle(note) {
  const title = note.title?.trim()
  if (title) return title

  const firstLine = (note.desc ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean)

  return firstLine || '无标题笔记'
}

export function getNoteDescription(note) {
  return note.desc?.trim() || '这条笔记没有正文。'
}

export function getNoteCoverSrc(note) {
  const firstImage = note.images?.[0]
  if (!firstImage) return note.image_urls?.[0] ?? ''

  return imageModules[`../${firstImage.path}`] ?? firstImage.url ?? note.image_urls?.[0] ?? ''
}

export function getNoteCoverAspectRatio(note) {
  const firstImage = note.images?.[0]
  if (!firstImage?.width || !firstImage?.height) return undefined

  return `${firstImage.width} / ${firstImage.height}`
}
