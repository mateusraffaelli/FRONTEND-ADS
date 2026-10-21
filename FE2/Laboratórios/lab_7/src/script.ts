// • Importe os módulos criados;
// • Renderize na página a lista de produtos disponíveis;
// • Exiba o nome, a categoria e o preço formatado de cada produto;
// • O arquivo script.ts não deve conter a lista fixa de produtos nem a função de formatação de preço;
// • O HTML deve importar somente o arquivo compilado dist/js/script.js com type="module".

import { catalogo, listarDisponiveis, buscarPorId } from "./catalogo"
import formatarValores from "./formatador"

const listaDeProdutos = document.querySelector<HTMLUListElement>('#lista-produtos')
const totalDisponiveis = document.querySelector<HTMLElement>('#total-disponiveis')
const formBusca = document.querySelector<HTMLFormElement>('#form-busca')
const produtoId = document.querySelector<HTMLInputElement>('#produto-id')
const resultadoBusca = document.querySelector<HTMLOutputElement>('#resultado-busca')

if (!listaDeProdutos || !totalDisponiveis || !formBusca || !produtoId || !resultadoBusca) {
    throw new Error("Elementos esperados não foram encontrados")
}

const renderizarProdutos = (): void => {
    const disponiveis = listarDisponiveis(catalogo)

    listaDeProdutos.innerHTML = disponiveis
        .map(produto => `
            <li>
                <strong>${produto.nome}</strong>
                <span>${produto.categoria}</span>
                <span>${formatarValores(produto.preco)}</span>
            </li>
        `).join('')

    totalDisponiveis.textContent = String(disponiveis.length)
}

renderizarProdutos()

formBusca.addEventListener('submit', (evento: SubmitEvent) => {
    evento.preventDefault()

    const id = Number(produtoId.value)
    const produto = buscarPorId(catalogo, id)

    if (!produto) {
        resultadoBusca.textContent = "Nenhum produto encontrado"
        return
    }

    resultadoBusca.textContent = `${produto.nome} — ${produto.categoria} — ${formatarValores(produto.preco)}`
})