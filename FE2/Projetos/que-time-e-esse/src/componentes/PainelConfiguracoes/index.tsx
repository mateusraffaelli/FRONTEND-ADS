import { classesBotao } from '../../utilitarios/classesBotao'

const campo = 'rounded-lg border border-stone-500 bg-stone-800 px-3 py-2'

const PainelConfiguracoes = () => {
  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="liga" className="font-semibold">
          Liga
        </label>
        <select id="liga" className={campo}>
          <option>Premier League</option>
          <option>La Liga</option>
          <option>Serie A</option>
          <option>Bundesliga</option>
          <option>Ligue 1</option>
          <option>English League Championship</option>
          <option>Scottish Premier League</option>
          <option>Greek Super League 1</option>
          <option>Dutch Eredivisie</option>
          <option>Belgian Pro League</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="modo" className="font-semibold">
          Modo de resposta
        </label>
        <select id="modo" className={campo}>
          <option value="multiplaEscolha">Múltipla escolha</option>
          <option value="digitacao">Digitação</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="vidas" className="font-semibold">
          Vidas
        </label>
        <input
          id="vidas"
          type="number"
          min={1}
          max={5}
          defaultValue={3}
          className={campo}
        />
      </div>

      <button className={classesBotao('primario')}>Salvar</button>
    </form>
  )
}

export default PainelConfiguracoes
