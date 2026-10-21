// Função exibir com sobrecarga: recebe número ou string e retorna uma mensagem diferente para cada tipo.

function exibir(valor: number): string;
function exibir(valor: string): string;
function exibir(valor: number | string): string {
  if (typeof valor === "number") {
    return `Você informou um número: ${valor}`;
  } else {
    return `Você informou um texto: "${valor}"`;
  }
}

console.log(exibir(100));
console.log(exibir("TypeScript"));