const percorrerDOM = (elemento) => {
    const texto =elemento.tagName.toLowerCase() === 'p' ? elemento.textContent : []

    const filhos =   Array.from(elemento.children)
    const resultado = filhos.reduce((resultado, filho) => [...resultado, ...percorrerDOM(filho)], texto)

     return resultado

}

export{percorrerDOM}









