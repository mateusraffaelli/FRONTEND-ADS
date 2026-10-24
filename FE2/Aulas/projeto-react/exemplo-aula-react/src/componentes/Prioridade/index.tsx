import { useState } from "react"
import Exclamacao from "./Exclamacao"

interface PrioridadeProps {
    id: number,
    aoAlterar: (id: number, prioridade: number) => void
}

const Prioridade = ({id, aoAlterar}: PrioridadeProps) => {

    const numExclamacoes = 3
    const exclamacoes = [...Array(numExclamacoes)]
    // let selecionado = false
    const [ selecionado, setSelecionado ] = useState(0)

    return (
        <div>
            {exclamacoes.map((_, indice) => (
                <Exclamacao 
                    selecionado={selecionado > indice} 
                    aoSelecionar={() => {
                        // if (selecionado === indice + 1) {
                        //     setSelecionado(0)
                        //     return
                        // }
                        setSelecionado(indice + 1)
                        aoAlterar(id, indice + 1)
                    }} 
                />
            )
            )}
        </div>
    )
}

export default Prioridade