type Categoria = "eletronico" | "livro" | "roupa";
type Produto = {
    id: number,
    nome: string,
    categoria: Categoria,
    preco: number,
    quantidade: number,
    emEstoque: boolean
};

// 1. Adicionar/atualizar produto:
// • Nome da função: adicionarProduto
// • Parâmetros: lista (lista de produtos do tipo
// Produto[]) e produto (objeto do tipo Produto)
// • Retorno: nova lista adicionando ou atualizando o produto
// • Comportamento:
// – se o produto não estiver na lista, adicioná-lo;
// – se o produto já existir, atualizar seus dados.

const adicionarProduto = (lista: Produto[], produto: Produto): Produto[] => {
    const produtoEncontrado = lista.find(_produto => _produto.id === produto.id)
    if(!produtoEncontrado){
        return [...lista, produto]
    }

    
    return lista.map(_produto => _produto.id === produto.id ? produto : _produto)
    
    
}

// 2. Remover produto:
// • Nome da função: removerProduto
// • Parâmetros: lista (lista de produtos do tipo Produto[]) e id (número do id do produto)
// • Retorno: nova lista sem o produto removido
// • Comportamento:
// – se o produto não estiver na lista, não alterar a lista;
// – se o produto estiver na lista, removê-lo.

const removerProduto = (lista: Produto[], id: number): Produto[] =>{
    return lista.filter(produto => produto.id !== id)
}


// 3. Atualizar quantidade do produto
// • Nome da função: atualizarQuantidadeProduto
// • Parâmetros: lista (lista de produtos do tipo Produto[]), id (número do id do produto) e
// quantidade (nova quantidade como string)
// • Retorno: nova lista com a quantidade do produto atualizada
// • Comportamento:
// – se o produto não estiver na lista, não alterar a lista;
// – converter a quantidade recebida como string para número;
// – se a quantidade convertida não for um número inteiro, considerar apenas a parte
// inteira;
// – se o produto estiver na lista e a quantidade for válida, atualizar apenas a proprie-
// dade quantidade, execeto quando a quantidade convertida for zero (nesse caso,
// alterar a propriedade emEstoque);
// – a lista original não deve ser modificada.

const atualizarQuantidadeProduto = (lista: Produto[], id: number, quantidade: string): Produto[] => {
    const qtdNumerica = parseInt(quantidade)
    if (isNaN(qtdNumerica) || qtdNumerica < 0) return [...lista]
    
    const produtoEncontrado = lista.find(produto => produto.id === id)
    if(!produtoEncontrado)  return [...lista]
    
    return lista.map(produto => produto.id === id ? 
        {
            ...produto, 
            quantidade: qtdNumerica,
            emEstoque : qtdNumerica === 0 ?  false : true

        } : produto)


}

// 4. Alterar status de disponibilidade
// • Nome da função: inverterDisponibilidade
// • Parâmetros: lista (lista de produtos do tipo Produto[]), id (número do id do produto)
// • Retorno: nova lista com o produto atualizado
// • Comportamento:
// – se o produto não estiver na lista, não alterar a lista;
// – se o produto estiver na lista, inverter o valor da propriedade emEstoque.

const inverterDisponibilidade = (lista: Produto[], id: number): Produto[] =>{
    const produtoEncontrado = lista.find(produto => produto.id === id)
    if(!produtoEncontrado)  return [...lista]

    return lista.map(produto => produto.id === id ? {...produto, emEstoque: !produto.emEstoque} : produto)
}

// 5. Buscar produto por nome
// • Nome da função: buscarPorNome
// • Parâmetros: lista (lista de produtos do tipo Produto[]), nome (string do nome do pro-
// duto)
// • Retorno: objeto do produto encontrado ou null
// • Comportamento:
// – buscar o produto que corresponda ao nome fornecido;
// – o nome pode estar em maiúsculas ou minúsculas;
// – se o produto não for encontrado, retornar null.

const buscarPorNome = (lista: Produto[], nome: string): Produto | null =>{
    const produtoEncontrado = lista.find(produto => produto.nome.toLowerCase() === nome.toLowerCase())
    
    return produtoEncontrado ? produtoEncontrado : null 

}

// 6. Listar resumos de produtos
// • Nome da função: listarResumosProdutos
// • Parâmetros: lista (lista de produtos do tipo Produto[])
// • Retorno: lista de strings no formato: "ID: [id], [nome] ([categoria]) - R$ [valor
// total: preco x quantidade] - em estoque: [sim/não]"
// • Comportamento:
// – Caso o produto esteja com propriedade emEstoque === true, o texto em estoque
// deve ser "sim";
// – Caso contrário, deve ser "não".

const listarResumosProdutos = (lista: Produto[]): string[] => {
    return lista.map(produto => `ID: ${produto.id}, ${produto.nome} (${produto.categoria}) - R$ ${(produto.preco * produto.quantidade).toFixed(2)} - em estoque: ${produto.emEstoque ? 'sim' : 'não'}`)
}


// 7. Limpar produtos indisponíveis
// • Nome da função: limparIndisponiveis
// • Parâmetros: lista (lista de produtos do tipo Produto[])
// • Retorno: nova lista apenas com os produtos que ainda estão em estoque.

const limparIndisponiveis = (lista: Produto[]): Produto[] => {
    return lista.filter(produto => produto.emEstoque)
}

export{adicionarProduto, removerProduto, atualizarQuantidadeProduto, inverterDisponibilidade, buscarPorNome , listarResumosProdutos, limparIndisponiveis}