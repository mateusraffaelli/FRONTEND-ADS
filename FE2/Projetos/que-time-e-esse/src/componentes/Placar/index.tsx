import { FaHeart } from 'react-icons/fa'
import Cartao from '../Cartao'

const Placar = () => {
  return (
    <section>
      <Cartao compacto>
        <div className="grid grid-cols-4 items-center text-center">
          <div>
            <p className="text-sm text-stone-300">Pontos</p>
            <p className="font-bold">180</p>
          </div>
          <div>
            <p className="text-sm text-stone-300">Rodada</p>
            <p className="font-bold">2 de 10</p>
          </div>
          <div>
            <p className="text-sm text-stone-300">Vidas</p>
            <div className="flex justify-center gap-1">
              <FaHeart className="text-red-400" />
              <FaHeart className="text-red-400" />
              <FaHeart className="text-stone-500" />
            </div>
          </div>
          <div>
            <p className="text-sm text-stone-300">Sequência</p>
            <p className="font-bold">1</p>
          </div>
        </div>
      </Cartao>
    </section>
  )
}

export default Placar
