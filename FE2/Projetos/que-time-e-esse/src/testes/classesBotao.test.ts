import { describe, expect, it } from 'vitest'
import { classesBotao } from '../utilitarios/classesBotao'

describe('classesBotao', () => {
  it('usa o fundo preenchido na variante primaria', () => {
    expect(classesBotao('primario')).toContain('bg-stone-900')
  })

  it('usa a borda na variante secundaria', () => {
    expect(classesBotao('secundario')).toContain('border-stone-300')
  })

  it('mantem as classes base nas duas variantes', () => {
    expect(classesBotao('primario')).toContain('rounded-lg')
    expect(classesBotao('secundario')).toContain('rounded-lg')
  })
})
