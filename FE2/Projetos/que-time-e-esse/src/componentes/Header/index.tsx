import { useState } from 'react'
import {
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
  FaCog,
  FaQuestion,
} from 'react-icons/fa'
import Modal from '../Modal'
import PainelConfiguracoes from '../PainelConfiguracoes'
import PainelHistorico from '../PainelHistorico'
import PainelRegras from '../PainelRegras'

const classeBotao =
  'flex h-9 w-9 items-center justify-center rounded border-2 border-stone-400 text-stone-300 hover:bg-stone-500'

const Header = () => {
  const [modosAbertos, setModosAbertos] = useState(false)
  const [painel, setPainel] = useState('')

  return (
    <header>
      {modosAbertos && (
        <nav className="mx-auto flex max-w-3xl gap-6 bg-stone-900 px-6 py-4">
          <span className="text-stone-400">múltipla escolha</span>
          <span>digitação</span>
        </nav>
      )}

      <div className="mx-auto grid max-w-3xl grid-cols-3 items-center p-3">
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Modos de jogo"
            onClick={() => setModosAbertos(!modosAbertos)}
            className={classeBotao}
          >
            {modosAbertos ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          <button
            type="button"
            aria-label="Como jogar"
            onClick={() => setPainel('regras')}
            className={classeBotao}
          >
            <FaQuestion />
          </button>
        </div>

        <h1 className="text-center text-2xl font-bold">Que Time É Esse?</h1>

        <div className="flex justify-end gap-1">
          <button
            type="button"
            aria-label="Histórico"
            onClick={() => setPainel('historico')}
            className={classeBotao}
          >
            <FaChartBar />
          </button>
          <button
            type="button"
            aria-label="Configurações"
            onClick={() => setPainel('configuracoes')}
            className={classeBotao}
          >
            <FaCog />
          </button>
        </div>
      </div>

      {painel === 'regras' && (
        <Modal titulo="Como jogar" onFechar={() => setPainel('')}>
          <PainelRegras />
        </Modal>
      )}
      {painel === 'historico' && (
        <Modal titulo="Histórico" onFechar={() => setPainel('')}>
          <PainelHistorico />
        </Modal>
      )}
      {painel === 'configuracoes' && (
        <Modal titulo="Configurações" onFechar={() => setPainel('')}>
          <PainelConfiguracoes />
        </Modal>
      )}
    </header>
  )
}

export default Header
