import { createContext, type Dispatch } from "react";
import type { Tarefa } from "../modelo/interface";

interface ITarefaContext {
    tarefas: Tarefa[]
    setTarefas: Dispatch<React.SetStateAction<Tarefa[]>>
}

const TarefaContext = createContext<ITarefaContext | undefined>(undefined)

export {TarefaContext}