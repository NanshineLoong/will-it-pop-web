import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import NoteSubmitForm from './NoteSubmitForm'
import * as api from '../lib/api'

describe('NoteSubmitForm', () => {
  it('shows success message after successful submit', async () => {
    vi.spyOn(api, 'submitNote').mockResolvedValue(true)
    render(<NoteSubmitForm />)
    await userEvent.type(screen.getByRole('textbox'), 'https://www.xiaohongshu.com/x')
    await userEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.getByText('提交成功，感谢！')).toBeInTheDocument())
  })

  it('shows error message on failed submit', async () => {
    vi.spyOn(api, 'submitNote').mockResolvedValue(false)
    render(<NoteSubmitForm />)
    await userEvent.type(screen.getByRole('textbox'), 'https://www.xiaohongshu.com/x')
    await userEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.getByText('提交失败，请重试')).toBeInTheDocument())
  })
})
