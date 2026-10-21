// Interface Pilha e classe PilhaArray que a implementa.

interface Pilha<T> {
  empilhar(item: T): void;
  desempilhar(): T | undefined;
  topo(): T | undefined;
  estaVazia(): boolean;
  tamanho(): number;
}

class PilhaArray<T> implements Pilha<T> {
  private itens: T[] = [];

  empilhar(item: T): void {
    this.itens.push(item);
  }

  desempilhar(): T | undefined {
    return this.itens.pop();
  }

  topo(): T | undefined {
    return this.itens[this.itens.length - 1];
  }

  estaVazia(): boolean {
    return this.itens.length === 0;
  }

  tamanho(): number {
    return this.itens.length;
  }

  exibirEstado(): void {
    console.log("Estado da pilha:", this.itens);
  }
}


const pilha = new PilhaArray<number>();

console.log("Empilhando 10...");
pilha.empilhar(10);
pilha.exibirEstado();

console.log("Empilhando 20...");
pilha.empilhar(20);
pilha.exibirEstado();

console.log("Empilhando 30...");
pilha.empilhar(30);
pilha.exibirEstado();

console.log("Desempilhando...");
const removido = pilha.desempilhar();
console.log("Elemento removido:", removido);
pilha.exibirEstado();

console.log("Topo atual:", pilha.topo());
console.log("Pilha está vazia?", pilha.estaVazia());
console.log("Tamanho da pilha:", pilha.tamanho());