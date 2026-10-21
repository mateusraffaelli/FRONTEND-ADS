// IIFE
// (function () {
//     var contador = 0
//     var numero = document.getElementById('numero')

//     function incrementar() {
//         contador++
//         numero.innerText = contador
//     }

//     function resetar(){
//         contador = 0;
//         numero.innerText = contador
//     }

//     window.incrementar = incrementar 
//     window.resetar = resetar
// })()

// A funcção é imediatamente invocada (fica sempre rodando)
// Isolamento, porque nenhum outro arquivo acessa o que está dentro da função


//Namespace
var App = App || {}

App.contador = (function () {
    var contador = 0
    var numero = document.getElementById('numero')

    function incrementar() {
        contador++
        numero.innerText = contador
    }

    function resetar(){
        contador = 0;
        numero.innerText = contador
    }

    return{
        incrementar: incrementar,
        resetar: resetar
    }
})()
