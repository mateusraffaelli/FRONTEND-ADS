let numerosInt = [2,3,3,1,4,5,11];
let numerosInt2 = [2,3,3,1,4,5,12];
let hist = [32, 5, 63, 68, 89, 10, 42, 12, 16, 22, 72, 97];
let alunos = ["Yuri Alberto", "Rodrigo Garro", "Hugo Souza", "Breno Bidon", "Memphis Depay"]

function somar(numerosInt){
    let somaElementos = 0;
    numerosInt.forEach(element => {
        somaElementos += element;
    });
    return somaElementos;
}

function media(numerosInt){
    return somar(numerosInt) / numerosInt.length;
}

function menorElemento(numerosInt){
    let menorElemento = numerosInt[0];
    numerosInt.forEach(element =>{
        menorElemento = menorElemento < element? menorElemento : element;
    })
    return menorElemento
}

function segundoMenorElemento(numerosInt){
    let menorElemento = numerosInt[0];
    let segundoMenorElemento = numerosInt[0];

    numerosInt.forEach(element =>{
        menorElemento = menorElemento < element? menorElemento : element;
    })

    numerosInt.forEach(element =>{
        if(element > menorElemento && element <= segundoMenorElemento){
            segundoMenorElemento = element;
        }
    })
    return segundoMenorElemento;
    
}

function filtrar(numerosInt){
    let arrayImpares = [];

    for(let i = 0; i < numerosInt.length; i++){
        if(!(numerosInt[i] % 2 == 0)){
            arrayImpares.push(numerosInt[i]);
        }
    }

    return arrayImpares;
}

function inverso(numerosInt){
    let arrayInvertido = [];

    numerosInt.forEach(element =>{
        arrayInvertido.unshift(element);
    })

    return arrayInvertido;
}

function histograma(hist){
    let n1 = 0;
    let n2 = 0;
    let n3 = 0;
    let n4 = 0;
    let n5 = 0;

    hist.forEach(element =>{
        if(element > 0 && element <= 20){
            n1++
        }else if(element > 20 && element <= 40){
            n2++
        }else if(element > 40 && element <= 60){
            n3++
        }else if(element > 60 && element <= 80){
            n4++
        }else if(element > 80 && element <= 100){
            n5++
        }else{
            return "Número inválido";
        }
    })

    return `hist(${hist}) \n [01, 20] : ${"*".repeat(n1)} \n [21, 40] : ${"*".repeat(n2)} \n [41, 60] : ${"*".repeat(n3)} \n [61, 80] : ${"*".repeat(n4)} \n [81, 100] : ${"*".repeat(n5)}`
}

// function verificador(alunos){
//     let userName = prompt("Entre com o nome do aluno", "Yuri Alberto");
//     if(alunos.includes(userName)){
//         return "Este nome está presente";
//     } else {
//         return "Nome não encontrado";
//     }
// }

function comparador(numerosInt, numerosInt2){
    let igual = true;
    
    if(numerosInt.length == numerosInt2.length){
        for(i = 0; i < numerosInt.length; i++){
            igual = numerosInt[i] === numerosInt2[i] ? true : false;
            if(igual == false){
                break;
            }
        }
    }else{
        igual = false;
    }

    return igual == true ? "São iguais" : "Não são iguais"
    
}


console.log(somar(numerosInt));
console.log(media(numerosInt));
console.log(menorElemento(numerosInt));
console.log(segundoMenorElemento(numerosInt));
console.log(filtrar(numerosInt));
console.log(inverso(numerosInt));
console.log(histograma(hist));
//console.log(verificador(alunos));
console.log(comparador(numerosInt, numerosInt2));


