//Escreva uma função que calcula ab (onde a é a base e b é o expoente), usando memoization
//para armazenar os resultados das potenciações anteriores.

const potenciacaoMemo = () => {
    let cache = {}
    return function potenciacao(a, b){
        let chave = `${a}^${b}`;

        if (chave in cache) {
            return cache[chave];
        }

        cache[chave] = a ** b;

        return cache[chave];
    }
}

export{potenciacaoMemo}