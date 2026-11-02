import type { RecordePartida } from '../../modelo/jogo'
import Cartao from '../Cartao'

interface ItemHistoricoProps {
  partida: RecordePartida
}

const ItemHistorico = ({ partida }: ItemHistoricoProps) => {
  const estatisticas = [
    { rotulo: 'Rodadas', valor: partida.rodadasJogadas },
    { rotulo: 'Acertos', valor: partida.acertos },
    { rotulo: 'Sequência', valor: partida.maiorSequencia },
  ]

  return (
    <li>
      <Cartao>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-2xl font-bold text-white">
                {partida.pontuacao} pts
              </p>
              <p className="text-sm text-stone-300">{partida.data}</p>
            </div>
            <dl className="grid grid-cols-3 gap-4 text-center text-sm">
              {estatisticas.map((item) => (
                <div key={item.rotulo}>
                  <dt className="text-stone-300">{item.rotulo}</dt>
                  <dd className="font-semibold text-white">{item.valor}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-stone-200">
              Times acertados
            </p>
            {partida.timesAcertados.length === 0 ? (
              <p className="text-sm text-stone-300">Nenhum time acertado.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {partida.timesAcertados.map((time) => (
                  <li
                    key={time}
                    className="rounded-full bg-stone-600 px-3 py-1 text-sm font-medium text-stone-100"
                  >
                    {time}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Cartao>
    </li>
  )
}

export default ItemHistorico
