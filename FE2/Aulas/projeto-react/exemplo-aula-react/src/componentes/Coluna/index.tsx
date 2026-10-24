import { useContext } from "react"
import ListaTarefas from "../../componentes/ListaTarefas"
import type { Status, Tarefa } from "../../modelo/interface"
import { TarefaContext } from "../../contextos/TarefaContext"

interface ColunaProps {
    tamanho?: number,
    titulo: Status,
    aoAlterar: (id: number, prioridade: number) => void
}

const Coluna = ({ tamanho, titulo, aoAlterar }: ColunaProps) => {

    const { tarefas } = useContext(TarefaContext)!

    const listaTarefas = tarefas.filter( tarefa => tarefa.status === titulo)

    return (
        <div className={`col${tamanho ? `-${tamanho}` : ''}`}>
            <h2>{titulo}</h2>
            <ListaTarefas lista={listaTarefas} aoAlterar={aoAlterar} />
        </div>
    )
}

export default Coluna