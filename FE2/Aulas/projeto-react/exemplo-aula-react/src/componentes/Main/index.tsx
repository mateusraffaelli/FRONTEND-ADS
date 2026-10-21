import type { Tarefa } from "../../modelo/interface"
import Coluna from "../Coluna"

const Principal = () => {

    const tarefas: Tarefa[] = [
        {
            id: 1,
            titulo: 'estudar react',
            status: 'a fazer'
        },
        {
            id: 2,
            titulo: 'fazer trabalho FE2',
            status: 'a fazer'
        }
    ]

    return (
        <main className="h-100">
            <div className="row">
                <Coluna tamanho={4} titulo='a fazer' tarefas={tarefas} />
                <Coluna tamanho={4} titulo='fazendo' tarefas={tarefas} />
                <Coluna tamanho={4} titulo='feito' tarefas={tarefas} />
            </div>
        </main>
    )
}

export default Principal