import { useState } from "react"
import type { Tarefa } from "../../modelo/interface"
import Coluna from "../Coluna"

const Principal = () => {

    const [tarefas, setTarefas] = useState<Tarefa[]>([
        {
            id: 1,
            titulo: 'estudar react',
            status: 'a fazer',
        },
        {
            id: 2,
            titulo: 'fazer trabalho FE2',
            status: 'a fazer'
        }
    ])

    const alterarPrioridade = (id: number, prioridade: number): void => {
        setTarefas(tarefas.map(tarefa => (tarefa.id === id ? { ...tarefa, prioridade } : tarefa)))
    }

    return (
        <main className="h-100">
            <div className="row">
                <Coluna tamanho={4} titulo='a fazer' aoAlterar={alterarPrioridade} />
                <Coluna tamanho={4} titulo='fazendo' aoAlterar={alterarPrioridade} />
                <Coluna tamanho={4} titulo='feito' aoAlterar={alterarPrioridade} />
            </div>
        </main>
    )
}

export default Principal