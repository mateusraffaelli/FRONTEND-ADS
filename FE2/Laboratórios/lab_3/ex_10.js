// Dado um array que pode conter números e subarrays, implemente uma função recursiva que
// percorra o array e retorne a soma de todos os números. Não utilize loops imperativos.

const somaNumerosArray = (array) => {
    const arrayDeNumeros = array.filter(item => typeof item === "number")
    const soma = arrayDeNumeros.reduce(function(acumulador, numAtual){
        return acumulador + numAtual
    })

    return soma
}

export{somaNumerosArray}