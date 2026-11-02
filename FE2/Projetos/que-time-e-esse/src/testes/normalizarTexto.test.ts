import { describe, expect, it } from 'vitest'
import { normalizarTexto } from '../utilitarios/normalizarTexto'

describe('normalizarTexto', () => {
  it('remove acentos', () => {
    expect(normalizarTexto('São Paulo')).toBe('sao paulo')
  })

  it('ignora maiúsculas e espaços nas pontas', () => {
    expect(normalizarTexto(' CORINTHIANS ')).toBe('corinthians')
  })
})
