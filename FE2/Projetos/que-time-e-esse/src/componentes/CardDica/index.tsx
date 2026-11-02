import { FaLock } from 'react-icons/fa'
import Cartao from '../Cartao'

interface CardDicaProps {
  numero: number
  pontos: number
  estado: string
}

const CardDica = ({ numero, pontos, estado }: CardDicaProps) => {
  let corSelo = 'bg-stone-600 text-stone-300'
  if (estado === 'atual') {
    corSelo = 'bg-teal-600 text-white'
  }

  return (
    <li className={estado === 'bloqueada' ? 'opacity-60' : ''}>
      <Cartao compacto>
        <div className="flex items-center justify-between px-2">
          <p className="flex items-center gap-2 text-stone-200">
            {estado === 'bloqueada' && <FaLock />}
            Dica {numero}
          </p>
          <span className={`rounded-full px-3 py-1 text-sm ${corSelo}`}>
            {pontos} pts
          </span>
        </div>
      </Cartao>
    </li>
  )
}

export default CardDica
