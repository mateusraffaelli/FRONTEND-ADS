
/*
a) Filtrar por categoria:
• nome da função: produtosPorCategoria
• parâmetros: produtos (array de produtos), categoria (string)
• retorno: novo array contendo apenas os produtos da categoria informada
• restrições:
– usar filter;
– retornar um array vazio se produtos estiver vazio ou se não houver produtos na categoria;
– não usar laços imperativos;
– não alterar o array de entrada.
*/

const produtosPorCategoria = (produtos, categoria) => {
    if(!produtos ){
        return []
    }

    return produtos.filter(p => p.categoria === categoria)
}

/*
b) Listar nomes formatados
• nome da função: nomesFormatados
• parâmetros: produtos (array de produtos)
• retorno: novo array de strings no formato "ID: [id] | Nome: [nome] | Categoria:
[categoria]"
• restrições:
– usar map e template literals;
– retornar um array vazio se produtos estiver vazio;
– não usar laços imperativos;
– não alterar o array de entrada.
*/

const nomesFormatados = (produtos) =>{
    if(!produtos){
        return []
    }

    return produtos.map(p => `ID: ${p.id} | Nome: ${p.nome} | Categoria: ${p.categoria}`)
}

/*
c) Total de estoque (valor monetário)
• nome da função: totalEstoque
• parâmetros: produtos (array de produtos)
• retorno: número representando a soma de preco * qtd de todos os produtos
• restrições:
– usar reduce;
– retornar 0 para array vazio;
– não usar laços imperativos;
– não alterar o array de entrada.
*/

const totalEstoque = (produtos) =>{
    if(!produtos) return 0
    
    return produtos.reduce((acumulador, produtoAtual) => {
        return acumulador + produtoAtual.preco * produtoAtual.quantidade
    }, 0)
}

/*
d) Média de preço por categoria
• nome da função: mediaPrecoPorCategoria
• parâmetros: produtos (array de produtos), categoria (string)
• retorno: número com a média de preco dos produtos da categoria (ou 0 se não houver itens)
• restrições:
– retornar 0 se produtos estiver vazio ou se não houver produtos na categoria;
– usar filter e reduce;
– não usar laços imperativos;
– não alterar o array de entrada.
*/

const mediaPrecoPorCategoria = (produtos, categoria) => {
    if(!produtos) return 0

    const produtosDaCategoria = produtos.filter(p => p.categoria === categoria)

    if(produtosDaCategoria.length === 0) return 0

    const somaDosPrecos = produtosDaCategoria.reduce((acumulador, produtoAtual) => acumulador + produtoAtual.preco, 0)
    
    return somaDosPrecos/produtosDaCategoria.length
}

/*
e) Buscar produto por nome
• Nome da função: buscarPorNome
• Parâmetros: lista (lista de produtos), nome (string do nome do produto)
• Retorno: objeto do produto encontrado ou null
• Comportamento:
– buscar o produto que corresponda ao nome fornecido;
– o nome pode estar em maiúsculas ou minúsculas;
– se o produto não for encontrado, retornar null.
*/

const buscarPorNome = (lista, nome) => {
    const produtoEncontrado = lista.find(p => p.nome.toLowerCase() === nome.toLowerCase())

    if(!produtoEncontrado) return null

    return produtoEncontrado
}

/*
f) Listar resumos de produtos
• Nome da função: listarResumosProdutos
• Parâmetros: lista (lista de produtos)
• Retorno: lista de strings no formato: "ID: [id], [nome] ([categoria]) - R$ [valor
total: preco x quantidade] - em estoque: [sim/não]"
• Comportamento:
– Caso o produto esteja com emEstoque === true, o texto em estoque deve ser "sim";
– Caso contrário, deve ser "não".
*/

const listarResumosProdutos = (lista) => {
    return lista.map(p => `ID: ${p.id}, ${p.nome} (${p.categoria}) - R$ ${p.preco * p.quantidade} - em estoque: ${p.emEstoque ? 'sim': 'não'}`)
}

/*
g) Limpar produtos indisponíveis
• Nome da função: limparIndisponiveis
• Parâmetros: lista (lista de produtos)
• Retorno: nova lista apenas com os produtos que ainda estão em estoque.
*/


const limparIndisponiveis = (lista) => {
    return lista.filter(p => p.emEstoque)
}

