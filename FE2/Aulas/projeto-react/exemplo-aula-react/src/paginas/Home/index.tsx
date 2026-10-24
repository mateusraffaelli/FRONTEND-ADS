import Footer from "../../componentes/Footer"
import Header from "../../componentes/Header"
import Main from "../../componentes/Main"
import { TarefaProvider } from "../../contextos/TarefaProvider"


const Home = () => {

    return (
        <div className="container">
            <Header titulo="Quadro Kanban" />
            <TarefaProvider>
                <Main />
            </TarefaProvider>
            <Footer />
        </div>
    )
}

export default Home