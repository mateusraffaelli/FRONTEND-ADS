const display = document.querySelector('#display')

const app = document.querySelector('.app')

let entradaAtual = '0'
let operador = null
let valorAnterior = null
let resultado = 0;
let historico = ''
let contator = 0
let aguardandoNumero = false
let contaFinalizada = false 

let digitos = []
let operadores = []


app.addEventListener('click', (evento) => {
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
    if(aguardandoNumero){
        entradaAtual = '0'
        aguardandoNumero = false
    }

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
        operacao = '**'
        calcularBinaria(operacao)
    }
    
}

const operar = (a, op, b) => {
      switch(op){
          case '+': return a + b
          case '-': return a - b
          case '*': return a * b
          case '/': return b === 0 ? NaN : a / b
          case '**': return a ** b
      }
  }

const calcularBinaria = (op) => {
    if(contaFinalizada){
        contaFinalizada = false
        valorAnterior = Number(entradaAtual)
        digitos = [valorAnterior]
        operadores = [op]
        resultado = valorAnterior
        operador = op
        atualizarDisplay(entradaAtual + op)
        entradaAtual = '0'
        aguardandoNumero = true
        return
    }

    if(aguardandoNumero){
        operador = op
        operadores[operadores.length - 1] = op
        atualizarDisplay(entradaAtual + op)
        return
    }

    valorAnterior = Number(entradaAtual)
    digitos.push(valorAnterior)
    operadores.push(op)

    if(digitos.length == 1){
        resultado = digitos[0]
        
    }else{
        resultado = operar(resultado, operador, valorAnterior); 
    }

    operador = op
    atualizarDisplay(entradaAtual + op)

    entradaAtual = '0'
    aguardandoNumero = true

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
    
    adicionarHistorico(resultado)    
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
    aguardandoNumero = false
    contaFinalizada = false
}

const limparUltimo = () => {
    if(entradaAtual.length === 1){
        entradaAtual = '0'
    } else {
        entradaAtual = entradaAtual.slice(0, -1)
    }
}

const mudarSinal = () => {
    const valor = Number(entradaAtual)
    entradaAtual = String(-valor)

    if(valor > 0){
        atualizarDisplay('(' + entradaAtual + ')')
    }else{
        atualizarDisplay(entradaAtual)
    }
}

const calcularResultado = () => {
    // arrumar operação numerica (2*2)+(2*2) = 8, não 12

    if(operador === null || aguardandoNumero) return
    
    valorAnterior = Number(entradaAtual)
    digitos.push(valorAnterior)
    resultado = operar(resultado, operador, valorAnterior)
    entradaAtual = String(resultado)

    atualizarDisplay(entradaAtual)
    adicionarHistorico(resultado) 

    digitos = []
    operadores = []
    operador = null
    aguardandoNumero = true
    contaFinalizada = true
}

const adicionarHistorico = (valorResultado) => {
    const item = document.createElement('li');
    const lista = document.querySelector('#history-list');

    if(digitos.length > 0){
        for(let i = 0; i < operadores.length; i++){
            historico += `${digitos[i]} ${operadores[i]} `
        }
        historico += digitos[digitos.length - 1]
    }
    historico += " = " + valorResultado

    item.textContent = historico;
    lista.prepend(item)

    while(lista.children.length > 10){
        lista.lastElementChild.remove()
    }

    historico = ''
    contator++
}

const limparHistorico = () => {
    const lista = document.querySelector('#history-list');
    lista.replaceChildren()
    contator = 0;
}

