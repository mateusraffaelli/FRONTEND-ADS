import type { Tarefa } from "../../modelo/interface"
import Prioridade from "../Prioridade"

const ListaTarefas = ({ lista }: { lista: Tarefa[] }) => {

    return (
        <ul className="list-group">
            {lista.map(tarefa => (
                <li key={tarefa.id} className="list-group-item d-flex justify-content-between">
                    <p className="mb-0">{tarefa.titulo}</p>
                    <Prioridade />
                </li>
            ))}
        </ul>
    )
}

export default ListaTarefas