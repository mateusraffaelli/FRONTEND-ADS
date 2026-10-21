// Escreva o seu código aqui

interface Sala{
    id: number,
    nome: string,
    categoria: "individual" | "grupo" | "laboratorio",
    preco: number,
    quantidade: number,
    disponivel: boolean
}

abstract class SalaReservavel {
    protected id: number
    protected nome: string
    protected categoria: "individual" | "grupo" | "laboratorio"
    protected preco: number
    protected quantidade: number
    protected disponivel: boolean
    protected reservas: {usuario : Usuario}[]

    constructor(sala: Sala){
        this.id = sala.id
        this.nome = sala.nome
        this.categoria = sala.categoria
        this.preco = sala.preco
        this.quantidade = sala.quantidade
        this.disponivel = sala.disponivel
        this.reservas = []
    }

    descricao(): string {
        const msg = this.disponivel ? "sim" : "não"

        return `ID: ${this.id}, ${this.nome} (${this.categoria}) - R$ ${this.preco} por hora - horários disponíveis: ${this.quantidade} - disponível: ${msg}`
    }

    reservar(usuario: Usuario): boolean {
        if(!this.disponivel || this.quantidade <= 0){
            return false
        }
        
        const usuarioEncontrado = this.reservas.find(r => r.usuario === usuario)

        if(usuarioEncontrado){
            return false
        }

        this.quantidade--
        if(this.quantidade === 0) this.disponivel = false

        this.reservas.push({usuario})

        return true
            
    }

    abstract encerrarReserva(usuario: Usuario): number

    toSala(): Sala{
        return {
            id: this.id,
            nome: this.nome,
            categoria: this.categoria,
            preco: this.preco,
            quantidade: this.quantidade,
            disponivel: this.disponivel
        }
    }

}

class SalaGrupo extends SalaReservavel{
    private recursos: Recurso[]

    constructor(sala: Sala, recursos: Recurso[]){
        super(sala)
        sala.categoria = "grupo" 
        this.recursos = recursos
    }


    encerrarReserva(usuario: Usuario): number {
        const usuarioEncontrado = this.reservas.find(r => r.usuario === usuario)

        if(!usuarioEncontrado){
            return -1 
        }

        this.quantidade++
        if(this.quantidade > 0) this.disponivel = true

        const index = this.reservas.findIndex(x => x.usuario === usuario) 

        this.reservas.splice(index, 1)

        return 0
    }


    descricao(): string {
        const listaRecursos = this.recursos
            .map(r => `${r.nome} ${r.tipo} (${r.localizacao})`)
            .join('; ')
        return `${super.descricao()}, Recursos: ${listaRecursos}`
    }
}

class Usuario{
    private _nome: string
    private _codigo: number
    private static _codigos: number[] = []

    constructor(nome: string){
        this._nome = nome
        this._codigo = Usuario.gerarCodigo()
    }

    get nome(): string {return this._nome}
    get codigo(): number{return this._codigo}
    static get codigos(): number[]{return [...this._codigos]}
    
    static gerarCodigo(): number{
        let numAleatorio = Math.random()
        
        while(this._codigos.find(p => p === numAleatorio)){
            numAleatorio = Math.random()
        }
        
        this._codigos.push(numAleatorio)
        return numAleatorio
    }
}

interface Recurso{
    nome: string,
    tipo: string,
    localizacao: string
}

// Não altere esse código
export { type Sala, type Recurso, SalaReservavel, SalaGrupo, Usuario };
