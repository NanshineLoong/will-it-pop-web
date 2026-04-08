const imageModules = import.meta.glob('../data/xhs_collection/images/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

export function isHotNote(note) {
  return note.bucket === 'hot'
}

export function getNoteTitle(note) {
  return note.title?.trim() ?? ''
}

export function getNoteDescription(note) {
  return normalizeNoteText(note.desc?.trim()) || '这条笔记没有正文。'
}

export function normalizeNoteText(text = '') {
  return text.replace(/\[[^\]\r\n]+?R\]/g, '')
}

export function getNoteDescriptionParts(note) {
  const text = getNoteDescription(note)
  const parts = []
  const topicPattern = /#([^#\[\]\r\n]+)\[话题\]#/g
  let lastIndex = 0
  let match

  while ((match = topicPattern.exec(text))) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: text.slice(lastIndex, match.index) })
    }

    parts.push({ type: 'topic', text: `#${match[1].trim()}` })
    lastIndex = topicPattern.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', text: text.slice(lastIndex) })
  }

  return parts.length ? parts : [{ type: 'text', text }]
}

export function getNoteImages(note) {
  const localImages = (note.images ?? [])
    .map((image, index) => ({
      src: imageModules[`../${image.path}`] ?? image.url ?? note.image_urls?.[index] ?? '',
      width: image.width,
      height: image.height,
    }))
    .filter((image) => image.src)

  if (localImages.length) return localImages

  return (note.image_urls ?? [])
    .filter(Boolean)
    .map((src) => ({ src }))
}

export function getNoteCoverSrc(note) {
  return getNoteImages(note)[0]?.src ?? ''
}

export function getNoteCoverAspectRatio(note) {
  const firstImage = note.images?.[0]
  if (!firstImage?.width || !firstImage?.height) return undefined

  return `${firstImage.width} / ${firstImage.height}`
}
