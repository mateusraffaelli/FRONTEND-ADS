import { criarElemento } from "../util/ui.js"

const Botao = (texto: string, tipo?: "submit" | "reset" | "button") => {

    const botao = criarElemento('button', texto) as HTMLButtonElement
    botao.type = tipo ? tipo: "button" 
    botao.classList.add('btn')
    botao.classList.add(`${tipo == 'submit' ? 'btn-outline-primary' : 'btn-outline-danger'}`)
    return botao
}

export default Botao