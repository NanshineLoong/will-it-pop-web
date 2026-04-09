import fs from 'node:fs'
import path from 'node:path'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './pages/Home'

describe('font and icon delivery', () => {
  it('does not load Google Fonts from index.html', () => {
    const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8')

    expect(indexHtml).not.toContain('fonts.googleapis.com')
    expect(indexHtml).not.toContain('fonts.gstatic.com')
  })

  it('renders home page without Material Symbols font icons', () => {
    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(container.querySelector('.material-symbols-outlined')).toBeNull()
  })
})
