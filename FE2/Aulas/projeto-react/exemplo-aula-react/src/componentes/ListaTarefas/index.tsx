import type { Tarefa } from "../../modelo/interface"
import Prioridade from "../Prioridade"

interface ListaTarefasProps {
    lista: Tarefa[], 
    aoAlterar: (id: number, prioridade: number) => void
}

const ListaTarefas = ({ lista , aoAlterar}: ListaTarefasProps) => {

    return (
        <ul className="list-group">
            {lista.map(tarefa => (
                <li key={tarefa.id} className="list-group-item d-flex justify-content-between">
                    <p className="mb-0">{tarefa.titulo}</p>
                    <Prioridade id={tarefa.id} aoAlterar={aoAlterar}/>
                </li>
            ))}
        </ul>
    )
}

export default ListaTarefas