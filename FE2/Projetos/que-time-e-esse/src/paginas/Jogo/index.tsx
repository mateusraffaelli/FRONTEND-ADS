import Header from '../../componentes/Header'
import Main from '../../componentes/Main'
import Placar from '../../componentes/Placar'
import ListaDicas from '../../componentes/ListaDicas'
import CampoResposta from '../../componentes/CampoResposta'

const Jogo = () => {
  return (
    <>
      <Header />
      <Main>
        <Placar />
        <ListaDicas />
        <CampoResposta />
      </Main>
    </>
  )
}

export default Jogo
