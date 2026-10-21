interface Produto{
    id: string,
    nome: string,
    categoria: "bebida" | "salgado" | "doce",
    preco: number,
    estoque: number,
    ativo: boolean
}

let catalogo: Produto[] = [];

const adicionarProduto = (catalogo: Produto[], produto: Produto): Produto[] =>{
    const existe = catalogo.some(_produto => _produto.id === produto.id)
    return existe? [...catalogo] : [...catalogo, produto]
}

const enviarProduto = (produto: Produto): void =>{
    catalogo = adicionarProduto(catalogo, produto)
}

export {Produto, enviarProduto}