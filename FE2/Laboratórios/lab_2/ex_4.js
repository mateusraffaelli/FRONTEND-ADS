// Crie as classes de três animais diferentes que herdam da classe Animal

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

class Leao extends Animal {
    constructor(nome, som) {
        super("Mamífero", nome, som);
    }

    emitirSom() {
        return `${this.nome} ruge ${this.som}`;
    }

    locomover() {
        return `${this.nome} está andando`;
    }

    comer() {
        return `${this.nome} está comendo carne`;
    }

    informarTipo() {
        return `Tipo: ${this.tipo}`;
    }
}

class Elefante extends Animal {
    constructor(nome, som) {
        super("Mamífero", nome, som);
    }

    emitirSom() {
        return `${this.nome} faz ${this.som}`;
    }

    locomover() {
        return `${this.nome} está andando`;
    }

    comer() {
        return `${this.nome} está comendo plantas`;
    }

    informarTipo() {
        return `Tipo: ${this.tipo}`;
    }
}

class Girafa extends Animal {
    constructor(nome, som) {
        super("Mamífero", nome, som);
    }

    emitirSom() {
        return `${this.nome} faz ${this.som}`;
    }

    locomover() {
        return `${this.nome} está andando`;
    }

    comer() {
        return `${this.nome} está comendo plantas`;
    }

    informarTipo() {
        return `Tipo: ${this.tipo}`;
    }
}

export{Leao}
export{Elefante}
export{Girafa}