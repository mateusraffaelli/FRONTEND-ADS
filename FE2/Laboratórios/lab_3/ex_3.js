//Implemente uma função pura que recebe uma lista de objetos representando produtos e retorna um novo array com o preço de cada produto aumentado em 10%

function aumentarPreco (listaObjetos){
    let listaNova = [];

    for(let i = 0; i < listaObjetos.length; i++){
        listaNova[i] = {
            nome: listaObjetos[i].nome,
            preco: listaObjetos[i].preco *1.1
            
        }
    }
    return listaNova;
}

const produtos = [
    { nome: "Arroz", preco: 20 },
    { nome: "Feijão", preco: 10 },
    { nome: "Macarrão", preco: 8 }
];

const produtosAumentados = aumentarPreco(produtos);

console.log(produtos);
console.log(produtosAumentados);

export{aumentarPreco}

