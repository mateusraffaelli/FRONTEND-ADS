import ListaTarefas from "../../componentes/ListaTarefas"
import type { Status, Tarefa } from "../../modelo/interface"

interface ColunaProps {
    tamanho?: number,
    titulo: Status,
    tarefas: Tarefa[]
}

const Coluna = ({ tamanho, titulo, tarefas }: ColunaProps) => {

    const listaTarefas = tarefas.filter( tarefa => tarefa.status === titulo)

    return (
        <div className={`col${tamanho ? `-${tamanho}` : ''}`}>
            <h2>{titulo}</h2>
            <ListaTarefas lista={listaTarefas} />
        </div>
    )
}

export default Coluna