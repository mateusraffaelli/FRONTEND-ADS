import { enviarProduto, Produto } from "../modelo/Catalogo.js"
import { gerarID } from "../util/id.js"
import { criarElemento } from "../util/ui.js"
import Botao from "./Botao.js"
import CampoEntrada from "./CampoEntrada.js"

const Formulario = () => {
    const form = criarElemento('form') as HTMLFormElement

    const titulo = criarElemento('h2', "Adicionar produtos")
    form.appendChild(titulo)

    form.append(
        CampoEntrada("Nome:"),
        CampoEntrada('Categoria', 'select', ["bebida" , "salgado" , "doce"]),
        CampoEntrada('Preço:', 'number'),
        CampoEntrada('Estoque:', 'number'),
        CampoEntrada('Ativo:', 'checkbox')
    )

    form.append(
        Botao('Enviar', 'submit'),
        Botao('Limpar' , 'reset')
    )

    form.addEventListener('submit', (evento) =>{
        evento.preventDefault()
        // debugger
        const nome = form[0] as HTMLInputElement
        const categoria = form[1] as HTMLSelectElement
        const preco = form[2] as HTMLInputElement
        const estoque = form[3] as HTMLInputElement
        const ativo = form[4] as HTMLInputElement

        const produto: Produto = {
            id: gerarID(),
            nome: nome.value,
            categoria: categoria.value as 'bebida' | 'salgado' | 'doce',
            preco: preco.valueAsNumber,
            estoque: estoque.valueAsNumber,
            ativo: ativo.checked
        }

        enviarProduto(produto)
        form.reset()

    })

    return form
}

export default Formulario