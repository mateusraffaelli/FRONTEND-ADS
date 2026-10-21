const display = document.querySelector('#display')

const teclado = document.querySelector('.keys')

let entradaAtual = '0'
let operador = null
let valorAnterior = null
let resultado = 0;
let historico = ''
let contator = 0

let digitos = []
let operadores = []


// mudando teclado para document
document.addEventListener('click', (evento) => {
    const botao = evento.target
    if(!botao) return

    const digito = botao.dataset.digit
    const operacao = botao.dataset.op
    const acao = botao.dataset.action

    if(digito){
        inserirDigito(digito)
        if(entradaAtual < 0){
            atualizarDisplay('(' + entradaAtual + ')')
        }else{
            atualizarDisplay(entradaAtual)
        }
        return
    }
    if(operacao){
        registrarOperacao(operacao)
        return
    }
    if(acao){
        executarAcao(acao)
        return
    }
})

const inserirDigito = digito => {
    if(digito === "." && entradaAtual.includes('.'))return

    if(entradaAtual === '0'){
        entradaAtual = digito
        return
    }
    
    entradaAtual += digito
    
    
}

const atualizarDisplay = (entrada) => {
    display.textContent = entrada
}

const registrarOperacao = operacao => {
    if(operacao === 'raiz' || operacao === 'porcento'){
        calcularUnaria(operacao)
        atualizarDisplay(entradaAtual)
        return
    }

    // if(operacao === 'adicao' || operacao === 'subtracao'  || operacao === 'multiplicacao'
    // || operacao === 'divisao' || operacao === 'potenciacao')

    if(operacao == 'adicao'){
        operacao = '+'
        calcularBinaria(operacao)
    }
    if(operacao == 'subtracao'){
        operacao = '-'
        calcularBinaria(operacao)
    }
    if(operacao == 'multiplicacao'){
        operacao = '*'
        calcularBinaria(operacao)
    }
    if(operacao == 'divisao'){
        operacao = '/'
        calcularBinaria(operacao)
    }
    
    if(operacao == 'potenciacao'){
        operacao = '^'
        calcularBinaria(operacao)
    }
    
}

const calcularBinaria = (op) => {
    if(display.textContent.slice(-1) == operador){
        operador = op
        atualizarDisplay(entradaAtual + op)
    }else{
        valorAnterior = Number(entradaAtual)
        digitos.push(valorAnterior)
        operadores.push(op)

        if(digitos.length == 1){
            resultado = digitos[0]
            
        }else{
            resultado = eval(`${resultado} ${operador} ${valorAnterior}`); 
        }

        operador = op
        entradaAtual += op
        
        atualizarDisplay(entradaAtual)
        entradaAtual = '0'
    }

    
}

const calcularUnaria = (op) => {
    const valor = Number(entradaAtual)
    

    if(op === 'raiz') {
        resultado = Math.sqrt(valor)
        historico = `√${entradaAtual}` 
    }
    if(op === 'porcento') {
        resultado = valor / 100
        historico = `${entradaAtual}%`
    }
    
    adicionarHistorico()    
    entradaAtual = String(resultado)

    
    
}




const executarAcao = acao => {
    switch (acao){
        case 'clear':
            limparTudo()
            atualizarDisplay(entradaAtual)
            break
        case 'backspace':
            limparUltimo()
            atualizarDisplay(entradaAtual)
            break
        case 'sign':
            mudarSinal()
            break
        case 'equals':
            calcularResultado()
            break
        case 'history-clear':
            limparHistorico()
            break
    }
}

const limparTudo = () => {
    entradaAtual = '0'
    valorAnterior = null
    operador = null
    digitos = []
    operadores = []
}

const limparUltimo = () => {
    if(entradaAtual.length == 1){
        //Dando algum erro
        limparTudo()
    }else{
        entradaAtual = entradaAtual.slice(0, -1)
        atualizarDisplay(entradaAtual)
    }
}

const mudarSinal = () => {
    if(entradaAtual > 0){
        entradaAtual = (-entradaAtual)
        atualizarDisplay('(' + entradaAtual + ')')
        
    }else if(entradaAtual < 0){
        entradaAtual = (-entradaAtual)
        atualizarDisplay(entradaAtual)
    }
}

const calcularResultado = () => {
    // if para divisao por 0
    // arrumar operação numerica (2*2)+(2*2) = 8, não 12
    // Se eu trocar de operação
    // Potenciação, raiz e porcento.
    
    if(digitos.length == 0){
        digitos.push(entradaAtual)
        entradaAtual = eval(`${entradaAtual} ${operador} ${valorAnterior}`);
        
        
        digitos.push(valorAnterior)
        operadores.push(operador)
    }else{
        valorAnterior = entradaAtual
        digitos.push(entradaAtual)
        entradaAtual = eval(`${resultado} ${operador} ${entradaAtual}`);
    
    }

    atualizarDisplay(entradaAtual)
    adicionarHistorico() 

    digitos = []
    operadores = []
    
}

const adicionarHistorico = () => {
    const item = document.createElement('li');
    const lista = document.querySelector('#history-list');

    if(contator == 10){
        lista.lastElementChild.remove();
        contator--
    }

    if(digitos.length > 0){
        for(let i = 0; i < operadores.length; i++){
            historico += `${digitos[i]} ${operadores[i]} `
        }
        historico += digitos[digitos.length - 1]
    }
    
    item.textContent = historico;
    lista.prepend(item)

    historico = ''
    contator++
}

const limparHistorico = () => {
    const lista = document.querySelector('#history-list');
    lista.replaceChildren()
    contator = 0;
}

