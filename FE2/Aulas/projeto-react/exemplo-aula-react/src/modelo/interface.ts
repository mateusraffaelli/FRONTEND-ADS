interface Tarefa {
    titulo: string
    id: number
    descricao?: string
    status: Status
    prioridade?: number
}

type Status = "a fazer" | "fazendo" | "feito"

export {type Tarefa, type Status}