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

const adicionarProduto = (listaDeProdutos: Produto[] , produto: Produto): Produto[] =>{
    const produtoEncontrado = listaDeProdutos.find(p => p === produto)

    if(!produtoEncontrado){
        listaDeProdutos.push(produto)
        return listaDeProdutos
    }

    const novaLista = listaDeProdutos.filter(p => p !== produto)
    novaLista.push(produto)
    return novaLista
}

// 2. Remover produto:
// • Nome da função: removerProduto
// • Parâmetros: lista (lista de produtos do tipo Produto[]) e id (número do id do produto)
// • Retorno: nova lista sem o produto removido
// • Comportamento:
// – se o produto não estiver na lista, não alterar a lista;
// – se o produto estiver na lista, removê-lo.

const removerProduto = (listaDeProdutos: Produto[], id: number): Produto[] => {
    const produtoEncontrado = listaDeProdutos.find(p => p.id === id)

    if(!produtoEncontrado){
        return listaDeProdutos
    }

    return listaDeProdutos.filter(p => p.id !== id)
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
// – atualizar apenas a propriedade quantidade, execeto quando a quantidade convertida for zero (nesse caso,
// alterar a propriedade emEstoque);
// – a lista original não deve ser modificada.

const atualizarQuantidadeProduto = (listaDeProdutos: Produto[], id: number, quantidade: string): Produto[] =>{
    const produtoEncontrado = listaDeProdutos.find(p => p.id === id)

    if(!produtoEncontrado){
        return listaDeProdutos
    }

    // Math.trunc não considera o que tem depois da virgula
    const quantidadeConvertida = Math.trunc(Number(quantidade)) 
       
    return listaDeProdutos.map(p => {
        if(p.id !== id){
            return p
        }

        if (quantidadeConvertida === 0) {
            return { ...p, quantidade: quantidadeConvertida };
        } else {
            return { ...p, emEstoque: false };
        }
    })
}

// 4. Alterar status de disponibilidade
// • Nome da função: inverterDisponibilidade
// • Parâmetros: lista (lista de produtos do tipo Produto[]), id (número do id do produto)
// • Retorno: nova lista com o produto atualizado
// • Comportamento:
// – se o produto não estiver na lista, não alterar a lista;
// – se o produto estiver na lista, inverter o valor da propriedade emEstoque.

const inverterDisponibilidade = (listaDeProdutos: Produto[], id: number): Produto[] => {
    const produtoEncontrado = listaDeProdutos.find(p => p.id === id)

    if(!produtoEncontrado){
        return listaDeProdutos
    }

    return listaDeProdutos.map(p => {
        if(p.id !== id){
            return p
        }

        if(p.emEstoque){
            return {...p, emEstoque: false}
        }else{
            return {...p, emEstoque: true}
        }
    })
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

const buscarPorNome = (listaDeProdutos: Produto[], nome: string): Produto | null => {
    const produtoEncontrado = listaDeProdutos.find(p => p.nome.toLowerCase === nome.toLowerCase)

    if(!produtoEncontrado){
        return null
    }

    return produtoEncontrado
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

const listarResumosProdutos = (listaDeProdutos: Produto[]): string[] => {
    return listaDeProdutos.map(p =>{
        return `ID: ${p.id}, ${p.nome} (${p.categoria}) - R$ [valor total: ${p.preco * p.quantidade}] - em estoque: ${p.emEstoque? 'sim' : 'não'}`
    })
}


// 7. Limpar produtos indisponíveis
// • Nome da função: limparIndisponiveis
// • Parâmetros: lista (lista de produtos do tipo Produto[])
// • Retorno: nova lista apenas com os produtos que ainda estão em estoque.


const limparIndisponiveis = (listaDeProdutos: Produto[]): Produto[] =>{
    return listaDeProdutos.filter(p => p.emEstoque)
}


export{adicionarProduto, removerProduto, atualizarQuantidadeProduto, inverterDisponibilidade, buscarPorNome , listarResumosProdutos, limparIndisponiveis}