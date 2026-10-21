class Cliente {

    private _nome: string;
    private _codigo: number;
    private static _codigos: number[] = [];


    constructor (nome: string){
        this._nome = nome;
        this._codigo = Cliente.gerarCodigo();
    }

    private static gerarCodigo(): number {
        let codigo = Date.now();

        while (Cliente._codigos.includes(codigo)){
            codigo = Date.now();
        }
        Cliente._codigos.push(codigo);
        return codigo;
    }

    get nome(): string {
        return this._nome;
    }

    get codigo(): number {
        return this._codigo;
    }

    static get codigos(): number[]{
        return [...Cliente._codigos];
    }

}

// type Aluguel = {
//     cliente: Cliente, 
//     dataAluguel: Date
// }

abstract class Midia{
    protected titulo: string
    protected copias: number
    protected alugueis: {cliente: Cliente, dataAluguel: Date}[] // ou Aluguel[]

    constructor(titulo: string, copias: number){
        this.titulo = titulo
        this.copias = copias
        this.alugueis = []
    }

    descricao(): string {
        return `Título: ${this.titulo}, Cópias Disponíveis: ${this.copias}`
    }

    alugar(cliente: Cliente): boolean{
        if(this.copias === 0) return false

        if (this.alugueis.find(aluguel => aluguel.cliente === cliente)) return false

        this.copias--
        this.alugueis.push({cliente, dataAluguel: new Date()})
        return true
    }

    abstract devolver(cliente: Cliente): number
}

class Filme extends Midia{
    private elenco: Artista[]

    constructor(titulo: string, copias: number, elenco: Artista[]){
        super(titulo, copias)
        this.elenco = elenco
    }

    devolver(cliente: Cliente): number {
        const indiceAluguel = this.alugueis.findIndex(aluguel => aluguel.cliente === cliente)

        if(indiceAluguel === -1) return -1

        this.copias++

        const diferencaMs = Date.now() - this.alugueis[indiceAluguel].dataAluguel.getTime()
        const diasAluguel = diferencaMs / (1000 * 60 * 60 * 24)

        const atraso = diasAluguel > 5 ? diasAluguel - 5 : 0
        const multa = atraso * 3

        this.alugueis.splice(indiceAluguel, 1)

        return multa
        
    }
       
    descricao(): string {
        const elencoFormatado = this.elenco.map(
            artista => `${artista.nome} ${artista.sobrenome} (${artista.nacionalidade})`
        ).join('; ')
        
        return `${super.descricao()} Elenco: ${elencoFormatado}`
    }
    
}

class Jogo extends Midia{
    private plataforma: string

    constructor(titulo: string, copias: number, plataforma: string){
        super(titulo, copias)
        this.plataforma = plataforma
    }

    devolver(cliente: Cliente): number {
        const indiceAluguel = this.alugueis.findIndex(aluguel => aluguel.cliente === cliente)

        if(indiceAluguel === -1) return -1

        this.copias++

        const diferencaMs = Date.now() - this.alugueis[indiceAluguel].dataAluguel.getTime()
        const diasAluguel = diferencaMs / (1000 * 60 * 60 * 24)

        const atraso = diasAluguel > 7 ? diasAluguel - 7 : 0
        const multa = atraso * 5

        this.alugueis.splice(indiceAluguel, 1)

        return multa
        
    }

    descricao(): string {
        return `${super.descricao()} Plataforma: ${this.plataforma}`
    }

}

interface Artista{
    nome: string
    sobrenome: string
    nacionalidade: string
}


export {Cliente, Midia, Filme, Jogo, Artista}
