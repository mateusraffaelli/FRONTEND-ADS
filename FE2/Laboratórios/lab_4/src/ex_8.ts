// Crie uma função sobrecarregada combinar 

function combinar(a: number, b: number): number;
function combinar(a: string, b: string): string;
function combinar(a: number | string, b: number | string): (number | string)[];
function combinar(
  a: number | string,
  b: number | string
): number | string | (number | string)[] {
  if (typeof a === "number" && typeof b === "number") {
    return a * b;
  }

  if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }

  return [a, b];
}

console.log(combinar(4, 5)); 
console.log(combinar("Type", "Script")); 
console.log(combinar(10, "anos")); 