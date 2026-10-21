/*
a) Adicionar contato:
• nome da função: adicionarContato
• parâmetro: um objeto com as propriedades id, nome e telefone
• retorno: do tipo boolean para indicar sucesso ou falha
• restrições:
– contatos com id duplicado não podem ser adicionados;
– todas as propriedades do contato são obrigatórias;
– a função deve utilizar o método push() para adicionar o contato à lista de contatos.
*/

const adicionarContato = (contato) => {
    if(!contato.id || !contato.nome || !contato.telefone) return false

    const contatoEncontrado = listaDeContatos.find(c => c.id === contato.id)
    if(contatoEncontrado)return false

    listaDeContatos.push(contato)
    return true
}

/*
b) Remover contato:
• nome da função: removerContato
• parâmetro: um id de contato
• retorno: do tipo boolean para indicar sucesso ou falha
• restrições:
– o contato deve existir para ser removido;
– a função deve utilizar o método filter() para remover o contato da lista de contatos.
*/

const removerContato = (id) => {
    const contatoEncontrado = listaDeContatos.find(p => p.id === id)

    if(!contatoEncontrado) return false

    listaDeContatos = listaDeContatos.filter(p => p.id !== id)
    return true
}

/*
c) Buscar contato:
• nome da função: buscarContato
• parâmetro: um nome de contato
• retorno: o objeto do contato encontrado ou null se não encontrado
• restrições:
– o nome a ser buscado pode estar em letras maiúsculas ou minúsculas;
– a função deve utilizar o método find() para buscar o contato na lista de contatos.
*/

const buscarContato = (nome) => {
    const contatoEncontrado = listaDeContatos.find(p => p.nome.toLowerCase() === nome.toLowerCase())

    if(!contatoEncontrado) return null

    return contatoEncontrado
}

/*
d) Listar contatos:
• nome da função: listarContatos
• parâmetro: nenhum
• retorno: uma lista com os contatos transformados em strings no formato "ID: [id], Nome:
[nome], Telefone: [telefone]"
• restrições:
– a função deve retornar um array vazio se não houver contatos na lista.
– a função deve utilizar o método map();
– a função deve utilizar template literals para formatar as strings dos contatos.
*/

const listarContatos = () =>{
    if(!listaDeContatos) return []

    return listaDeContatos.map(p => `ID: ${p.id}, Nome: ${p.nome}, Telefone: ${p.telefone}`)
}

/*
e) Limpar agenda:
• nome da função: limparAgenda
• parâmetro: nenhum
• retorno: nenhum
• comportamento: remove todos os contatos da lista de contatos
*/

const limparAgenda = () => {
    listaDeContatos.splice(0)
}