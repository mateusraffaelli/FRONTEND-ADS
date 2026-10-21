// Função genérica que retorna o primeiro elemento de um array de qualquer tipo.

function primeiroElemento<T>(array: T[]): T | undefined {
  return array[0];
}

const numeros = [10, 20, 30];
const nomes = ["Ana", "Bruno", "Carla"];
const booleanos = [true, false, true];

console.log(primeiroElemento(numeros)); 
console.log(primeiroElemento(nomes)); 
console.log(primeiroElemento(booleanos)); 
console.log(primeiroElemento([]));