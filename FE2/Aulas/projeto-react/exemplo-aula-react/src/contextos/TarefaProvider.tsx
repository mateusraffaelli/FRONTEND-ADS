import { useState, type ReactNode } from "react"
import type { Tarefa } from "../modelo/interface"
import { TarefaContext } from "./TarefaContext"

const TarefaProvider = ({ children }: { children: ReactNode }) => {
    const [tarefas, setTarefas] = useState<Tarefa[]>([
        {
            id: 1,
            titulo: 'estudar react e funcional',
            status: 'a fazer',
        },
        {
            id: 2,
            titulo: 'fazer trabalho FE2',
            status: 'a fazer'
        }
    ])

    return (
        <TarefaContext value={{tarefas, setTarefas}}>
            {children}
        </TarefaContext>
    )

}

export { TarefaProvider }