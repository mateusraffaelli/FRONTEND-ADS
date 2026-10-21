// Crie uma classe abstrata para criar objetos da classe Animal

class Animal{
    static contador = 0;
    #tipo;
    #nome;
    #som;

    constructor(tipo, nome, som){
        this.#tipo = tipo;
        this.#nome = nome;
        this.#som = som;
 
        Animal.contador++;
    }

    get tipo(){
        return this.#tipo;
    }

    get nome(){
        return this.#nome;
    }

    get som(){
        return this.#som;
    }

    set tipo(tipo){
        this.#tipo = tipo;
    }

    set nome(nome){
        this.#nome = nome;
    }

    set som (som){
        this.#som = som;
    }

    emitirSom(){
        throw new Error("Deve ser implementado");
    }

    locomover(){
        throw new Error("Deve ser implementado");
    }

    comer(){
       throw new Error("Deve ser implementado");
    }

    informarTipo(){
        throw new Error("Deve ser implementado");
    }

    static quantidadeAnimais(){
        return Animal.contador
    }
}

class Cachorro extends Animal {
    constructor(nome, som) {
        super("Mamífero", nome, som);
    }

    emitirSom() {
        return `${this.nome} emite ${this.som}`;
    }

    locomover() {
        return `${this.nome} está andando`;
    }

    comer() {
        return `${this.nome} está comendo`;
    }

    informarTipo() {
        return `Tipo: ${this.tipo}`;
    }
}

const cachorro = new Animal("Caramelo", "Au Au")
console.log(cachorro.nome);
console.log(cachorro.tipo);
console.log(cachorro.som);

console.log(cachorro.emitirSom());
console.log(cachorro.locomover());
console.log(cachorro.comer());
console.log(cachorro.informarTipo());

console.log(Animal.quantidadeAnimais());


export{Animal}

