const SomarNumeros = (array) =>{
    // return array
    //     .filter(par => par%2 === 0)
    //     .map(n => n**2)
    //     .reduce((acumulador, preco) => acumulador + preco, 0)
    
    const pares = array.filter(par => par%2 === 0)
    const elevado = pares.map(n => n**2)
    const novoArray = elevado.reduce((acumulador, preco) => acumulador + preco, 0)
    return novoArray
}

export{SomarNumeros}