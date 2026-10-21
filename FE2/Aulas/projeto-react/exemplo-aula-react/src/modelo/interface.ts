interface Tarefa {
    titulo: string
    id: number
    descricao?: string
    status: Status
}

type Status = "a fazer" | "fazendo" | "feito"

export {type Tarefa, type Status}