const BASE_PATH = '/api'

export async function submitFeedback(noteId, difficulty) {
  try {
    const response = await fetch(`${BASE_PATH}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        note_id: noteId,
        difficulty,
      }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.stats
  } catch {
    return null
  }
}

export async function getNoteStats(noteId) {
  try {
    const response = await fetch(`${BASE_PATH}/notes/${noteId}/stats`)

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch {
    return null
  }
}

export async function submitNote(url) {
  try {
    const response = await fetch(`${BASE_PATH}/submit-note`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    return response.ok
  } catch {
    return false
  }
}
