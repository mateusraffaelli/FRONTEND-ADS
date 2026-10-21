import Formulario from "../componentes/Formulario.js"
import Titulo from "../componentes/Titulo.js"
import { criarElemento } from "../util/ui.js"

const principal = () => {
    const conteiner = criarElemento('div')
    // conteiner.classList.add("container", "py-5")
    conteiner.classList.add('bg-sky-600')

    const cabecalho = criarElemento('header')
    // cabecalho.classList.add('mb-5', "p-4", "shadow", "rounded")
    cabecalho.classList.add('flex')

   // const titulo = criarElemento('h1', "Melhor cafeteria do IFSC!!!")
    const titulo = new Titulo(1, "Melhor cafeteria do IFSC!!!").elemento
    titulo.classList.add("font-bold", "text-5xl")
    cabecalho.appendChild(titulo)

    conteiner.appendChild(cabecalho)

    const subtitulo = new Titulo(3, "Cristiano Ronaldo").elemento
    conteiner.appendChild(subtitulo)

    conteiner.appendChild(Formulario())
    
    return conteiner
}

export default principal