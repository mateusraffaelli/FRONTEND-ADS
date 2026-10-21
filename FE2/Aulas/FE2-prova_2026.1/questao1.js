// a) Adicionar/atualizar produto:
// • Nome da função: adicionarProduto
// • Parâmetros: lista (lista de produtos) e produto (objeto produto)
// • Retorno: nova lista adicionando ou atualizando o produto
// • Comportamento:
// – se o produto não estiver na lista, adicioná-lo;
// – se o produto já existir, atualizar seus dados.

const adicionarProduto = (lista, produto) => {
    const produtoEncontrado = lista.find(p => p.id === produto.id)

    if(!produtoEncontrado) return [...lista, produto]
    
    return lista.map(p => p.id === produto.id ? produto : p)
    
}


// b) Remover produto:
// • Nome da função: removerProduto
// • Parâmetros: lista (lista de produtos) e id (número do id do produto)
// • Retorno: nova lista sem o produto removido
// • Comportamento:
// – se o produto não estiver na lista, não alterar a lista;
// – se o produto estiver na lista, removê-lo.

const removerProduto = (lista , id) => {
    const produtoEncontrado = lista.find(p => p.id === id)

    if(!produtoEncontrado) return lista

    return lista.filter(p => p.id !== id)
}

// c) Atualizar propriedade do produto
// • Nome da função: atualizarPropriedadeProduto
// • Parâmetros: lista (lista de produtos), id (número do id do produto), propriedade (nome da
// propriedade a ser atualizada) e valor (novo valor da propriedade)
// • Retorno: nova lista com o produto atualizado
// • Comportamento:
// – se o produto não estiver na lista, não alterar a lista;
// – se o produto estiver na lista, atualizar a propriedade especificada com o novo valor, desde que:
// *o nome da propriedade esteja correto;
// * o valor seja válido para o tipo daquela propriedade (por exemplo, preco deve continuar
// sendo número, categoria deve ser um dos valores permitidos).

const atualizarPropriedadeProduto = (lista , id, propriedade, valor) => {
    const produtoEncontrado = lista.find(p => p.id === id)
    const propriedadesValidas = ['id', 'nome', 'categoria', 'preco', 'quantidade', 'emEstoque']

    if (!produtoEncontrado) return lista

    if (!propriedadesValidas.includes(propriedade)) return lista

    if (typeof produtoEncontrado[propriedade] !== typeof valor) return lista

    return lista.map(p => p.id === id ? { ...p, [propriedade]: valor } : p)
}

// d) Alterar status de disponibilidade
// • Nome da função: inverterDisponibilidade
// • Parâmetros: lista (lista de produtos), id (número do id do produto)
// • Retorno: nova lista com o produto atualizado
// • Comportamento:
// – se o produto não estiver na lista, não alterar a lista;
// – se o produto estiver na lista, inverter o valor da propriedade emEstoque.

const inverterDisponibilidade = (lista , id) => {
    const produtoEncontrado = lista.find(p => p.id === id)

    if(!produtoEncontrado) return lista

    return lista.map(p => p.id === id? {...p, [emEstoque]: !p.emEstoque}: p)
}


// e) Buscar produto por nome
// • Nome da função: buscarPorNome
// • Parâmetros: lista (lista de produtos), nome (string do nome do produto)
// • Retorno: objeto do produto encontrado ou null
// • Comportamento:
// – buscar o produto que corresponda ao nome fornecido;
// – o nome pode estar em maiúsculas ou minúsculas;
// – se o produto não for encontrado, retornar null.

const buscarPorNome = (lista, nome) => {
    const produtoEncontrado = lista.find(p => p.nome.toLowerCase() === nome.toLowerCase())

    return produtoEncontrado ? produtoEncontrado : null
}

// f) Listar resumos de produtos
// • Nome da função: listarResumosProdutos
// • Parâmetros: lista (lista de produtos)
// • Retorno: lista de strings no formato: "ID: [id], [nome] ([categoria]) - R$ [valor
// total: preco x quantidade] - em estoque: [sim/não]"
// • Comportamento:
// – Caso o produto esteja com emEstoque === true, o texto em estoque deve ser "sim";
// – Caso contrário, deve ser "não".

const listarResumosProdutos = (lista) => {
    return lista.map(p => `ID: ${p.id}, ${p.nome} (${p.categoria}) - R$ ${p.preco * p.quantidade} - em estoque: ${p.emEstoque ? 'sim' : 'não'}`)
}

// g) Limpar produtos indisponíveis
// • Nome da função: limparIndisponiveis
// • Parâmetros: lista (lista de produtos)
// • Retorno: nova lista apenas com os produtos que ainda estão em estoque.

const limparIndisponiveis = (lista) => {
    return lista.filter(p => p.emEstoque)
}