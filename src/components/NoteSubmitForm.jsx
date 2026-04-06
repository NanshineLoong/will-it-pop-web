import { useState } from 'react'
import { submitNote } from '../lib/api'

export default function NoteSubmitForm() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState(null) // null | 'success' | 'error'
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const ok = await submitNote(url)
    setStatus(ok ? 'success' : 'error')
    setLoading(false)
    if (ok) setUrl('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-surface p-3 rounded-lg border-2 border-surface-container">
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="在此粘贴小红书笔记链接..."
          required
          className="w-full bg-transparent border-none outline-none text-sm placeholder:text-outline-variant text-center text-on-surface"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="dimensional-btn w-full py-3 bg-secondary text-white font-headline text-lg rounded-lg border-b-4 border-secondary-dim disabled:opacity-60"
      >
        {loading ? '提交中…' : '加入题库'}
      </button>
      {status === 'success' && (
        <p className="text-center text-sm font-medium text-primary">提交成功，感谢！</p>
      )}
      {status === 'error' && (
        <p className="text-center text-sm font-medium text-error">提交失败，请重试</p>
      )}
    </form>
  )
}
