
const renderizar = (elemento: HTMLElement): void => {
    const raiz = document.querySelector('#root')
    raiz!.appendChild(elemento)
}

const criarElemento = (tag: string, texto?: string): HTMLElement => {
    const elemento = document.createElement(tag)
    if (texto) elemento.textContent = texto
    return elemento
}

export { renderizar, criarElemento }