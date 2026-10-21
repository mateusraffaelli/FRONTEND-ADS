import type { Tarefa } from "../../modelo/interface"

const ListaTarefas = ({ lista }: { lista: Tarefa[] }) => {

    return (
        <ul>
            {lista.map(tarefa => (
                <li key={tarefa.id}>{tarefa.titulo}</li>
            ))}
        </ul>
    )
}

export default ListaTarefas