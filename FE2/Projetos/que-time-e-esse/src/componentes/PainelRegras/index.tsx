const regras = [
  'Cada rodada começa com a dica mais difícil.',
  'Você pode responder ou pedir a próxima dica.',
  'Quanto mais dicas reveladas, menor a pontuação da rodada.',
  'Resposta errada tira uma vida. Sem vidas, a partida termina.',
  'Acertos consecutivos geram bônus de sequência.',
]

const PainelRegras = () => {
  return (
    <ol className="list-decimal space-y-2 pl-6 text-stone-200">
      {regras.map((regra) => (
        <li key={regra}>{regra}</li>
      ))}
    </ol>
  )
}

export default PainelRegras
