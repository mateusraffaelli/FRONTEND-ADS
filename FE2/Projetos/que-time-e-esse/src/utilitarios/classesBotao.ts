export type VarianteBotao = 'primario' | 'secundario'

const base =
  'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-center font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disebled:cursor-not-allowed disabled:opacity-50'

const estilos: Record<VarianteBotao, string> = {
  primario: 'bg-stone-900 text-white hover:bg-stone-800',
  secundario: 'border-2 border-stone-300 text-stone-100 hover:bg-stone-500',
}

export function classesBotao(variante: VarianteBotao): string {
  return `${base} ${estilos[variante]}`
}
