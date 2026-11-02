import { partidasExemplo } from '../../dados/dadosExemplo'
import ItemHistorico from '../ItemHistorico'

const PainelHistorico = () => {
  const partidas = partidasExemplo

  if (partidas.length === 0) {
    return <p className="text-center text-stone-300">Nenhuma partida ainda.</p>
  }

  return (
    <ul className="flex flex-col gap-3">
      {partidas.map((partida) => (
        <ItemHistorico
          key={`${partida.data}-${partida.pontuacao}`}
          partida={partida}
        />
      ))}
    </ul>
  )
}

export default PainelHistorico
