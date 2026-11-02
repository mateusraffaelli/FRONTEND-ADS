import { type ReactNode } from 'react'

interface CartaoProps {
  children: ReactNode
  compacto?: boolean
}

const Cartao = ({ children, compacto = false }: CartaoProps) => {
  const espacamento = compacto ? 'p-2' : 'p-4'

  return (
    <div
      className={`rounded-lg border border-stone-500 bg-stone-700 ${espacamento}`}
    >
      {children}
    </div>
  )
}

export default Cartao
