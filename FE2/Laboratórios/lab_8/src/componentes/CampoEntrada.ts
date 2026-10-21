import { criarElemento } from "../util/ui.js"

type Campo = HTMLInputElement | HTMLSelectElement

const CampoEntrada = (textoRotulo: string, tipo = 'text', opcoes: string[] = []) => {
    const container = criarElemento('div')
    const rotulo = criarElemento('label', textoRotulo)

    let entrada: Campo

    if(tipo === 'select'){
        const selecao = criarElemento('select') as HTMLSelectElement
        opcoes.map(texto => {
            const opcao = criarElemento('option', texto) as HTMLOptionElement
            opcao.value = texto;
            selecao.appendChild(opcao);
        })

        entrada = selecao
    }else{

        const input = criarElemento('input') as HTMLInputElement;
        input.type = tipo;
        entrada = input;

    }

    container.append(rotulo, entrada)

    return container
}

export default CampoEntrada