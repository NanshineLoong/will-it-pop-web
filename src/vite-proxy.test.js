// @vitest-environment node

import { describe, expect, it } from 'vitest'
import config from '../vite.config'

describe('vite dev server config', () => {
  it('proxies /api requests to the backend in development', () => {
    expect(config.server?.proxy?.['/api']).toEqual({
      target: 'http://localhost:8000',
      changeOrigin: true,
    })
  })
})
