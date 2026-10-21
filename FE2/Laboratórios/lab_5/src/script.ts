import { Cliente } from "./lab.js"

const formCliente = document.querySelector("#form-cliente") as HTMLFormElement

const clientesCadastrados: Cliente[] = []

formCliente.addEventListener('submit', e => {
    e.preventDefault
    const entradaNome = document.querySelector('#cliente-nome') as HTMLInputElement
    const nomeCliente = entradaNome.value.trim()
    const cliente = new Cliente(nomeCliente)
    clientesCadastrados.push(cliente)
    atualizarListaClientes()

})

const atualizarListaClientes = () => {
    const listaClientes = document.querySelector('#lista-clientes') as HTMLUListElement
    listaClientes.replaceChildren()

    clientesCadastrados.forEach(cliente => {
        const item = document.createElement('li')
        item.textContent = cliente.nome
        listaClientes.appendChild(item)
    })
}