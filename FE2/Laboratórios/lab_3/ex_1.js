function elevarQuadrado(numeros){
    const quadrados = []

    for(let i = 0; i < numeros.length; i++){
        quadrados.push(numeros[i] ** 2)
    }

    return quadrados
}

export{elevarQuadrado}