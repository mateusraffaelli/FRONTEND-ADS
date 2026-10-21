// Crie uma variável let com tipo any e atribua a ela três valores de tipos diferentes, como string, number e boolean. 
// Depois, crie uma variável let com tipo unknown e atribua a ela três valores de tipos diferentes.

let qualquer: any
qualquer = "Olá"
console.log(qualquer)

qualquer = 10
console.log(qualquer)

qualquer = true
console.log(qualquer)

let desconhecido: unknown
desconhecido = "Texto qualquer"
if(typeof desconhecido === "string"){
    console.log(desconhecido)
}

desconhecido = 12
if(typeof desconhecido === "number"){
    console.log(desconhecido)
}

desconhecido = false
if(typeof desconhecido === "boolean"){
    console.log(desconhecido)
}