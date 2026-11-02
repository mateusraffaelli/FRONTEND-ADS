import Cartao from '../Cartao'
import { classesBotao } from '../../utilitarios/classesBotao'

const CampoResposta = () => {
  return (
    <section>
      <Cartao>
        <form className="flex flex-col gap-3">
          <label htmlFor="resposta" className="font-semibold">
            Qual é o time?
          </label>
          <input
            id="resposta"
            type="text"
            placeholder="Digite o nome do time"
            className="rounded-lg border border-stone-500 bg-stone-800 px-3 py-2"
          />
          <div className="flex flex-col gap-3 md:flex-row">
            <button className={`${classesBotao('primario')} md:flex-1`}>
              Responder
            </button>
            <button
              type="button"
              className={`${classesBotao('secundario')} md:flex-1`}
            >
              Próxima dica
            </button>
          </div>
        </form>
      </Cartao>
    </section>
  )
}

export default CampoResposta
