const carro = (ano, modelo, marca) =>{
    let c = Object.create(carro.metodos)
    c.ano = ano
    c.modelo = modelo
    c.marca = marca
    return c
}

carro.metodos = {
    andar: function(){
        return "Andando"
    },

    buzinar: function(){
        return "Buzinando"
    },

    virar: function(direcao){
        return `Virando para ${direcao}`
    }
}


const c1 = carro(2021, 'Sandero', 'Renault')
const c2 = carro(2018, 'Fiesta', 'Ford')

export{carro}

console.log(c1.ano)
console.log(c1.modelo)
console.log(c1.marca)

console.log(c2.andar())
console.log(c2.buzinar())
console.log(c2.virar("direita"))