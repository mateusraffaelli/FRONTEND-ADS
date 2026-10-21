let pessoa = {
    nome: String,
    idade: Number,
    cidade: String,
}

pessoa.idade = 21;
pessoa.nome = "Mateus";

let msg = `“Olá, meu nome é ${pessoa.nome} e tenho ${pessoa.idade} anos`

pessoa.profissao = {
    cargo: String,
    salario: Number,
    cargaHoraria: Number
}

delete pessoa.cidade

console.log(msg)
console.log(pessoa)


// 2. Livro
let livro = {
    titulo: String,
    ano: Number,
    autor: {
        primeiroNome: String,
        sobrenome: String
    },

    padrao: function(){
        return `${this.autor.sobrenome}, ${this.ano}`
    }
}

livro.autor.primeiroNome = "Machado";
livro.autor["sobrenome"] = "de Assis";
livro.ano = 1899;
console.log(livro.padrao())


// 3. Animal
let animal = {
    tipo: String,
    falar() {
        return "O animal faz um som"
    }
}

let cachorro = Object.create(animal);
cachorro.nome = "Eros";

cachorro.falar = () => `O ${cachorro.nome} late`;

console.log(cachorro.falar())
console.log(animal.falar())
