import CardDica from '../CardDica'

const pontos = [100, 80, 60, 40, 20, 10]
const dicaAtual = 2

function pegarEstado(numero: number) {
  if (numero < dicaAtual) {
    return 'passada'
  }
  if (numero === dicaAtual) {
    return 'atual'
  }
  return 'bloqueada'
}

const ListaDicas = () => {
  return (
    <section className="flex flex-col gap-3">
      <ul className="flex flex-col gap-3">
        {pontos.map((ponto, indice) => (
          <CardDica
            key={indice}
            numero={indice + 1}
            pontos={ponto}
            estado={pegarEstado(indice + 1)}
          />
        ))}
      </ul>
    </section>
  )
}

export default ListaDicas
