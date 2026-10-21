// Crie um construtor para criar objetos da classe Livro

function Livro(titulo, autor, ano) {
    this.titulo = titulo;
    this.autor = autor;
    this.ano = ano;
}

Livro.prototype = {
    emprestar: function(){return `Livro ${this.titulo} foi emprestado`},
    devolver: function(){return `Livro ${this.titulo} foi devolvido`}
}

const livro1 = new Livro("Dom Casmurro", "Machado de Assis", "1899")
console.log(livro1.emprestar())
console.log(livro1.devolver())

const livro2 = new Livro("Quincas Borba", "Machado de Assis", "1891")
console.log(livro2.emprestar())
console.log(livro2.devolver())

export{Livro};