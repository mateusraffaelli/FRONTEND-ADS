/*
1. A classe Cliente, que representa um cliente da locadora:
• Propriedades (privadas):
– nome (string): nome do cliente;
– codigo (number): código do cliente, que deve ser único;
– codigos (number[] – estática): lista de códigos já utilizados para garantir unicidade.
• Construtor: deve inicializar as propriedades da classe, garantindo que codigo seja único.
• Métodos:
– getters para nome e codigo;
– getter estático para codigos;
– gerarCodigo (estático)
* Parâmetros: nenhum;
* Retorno: número;
* Comportamento: gera um código único para um novo cliente.
*/

class Cliente {
    private _nome: string
    private _codigo: number
    private static _codigos: number[]

    constructor(nome: string){
        this._nome = nome;
        this._codigo = Cliente.gerarCodigo()
        Cliente._codigos = []
    }

    get nome (): string {
        return this._nome
    }

    get codigo (): number{
        return this._codigo
    }

    static get codigos (): number[]{
        return this._codigos
    }

    static gerarCodigo (): number {
        let numeroAleatorio = Math.random()
        
        while(this._codigos.find(p => p === numeroAleatorio)){
            numeroAleatorio = Math.random()
        }

        return numeroAleatorio
    }
}

/*
2. Uma classe abstrata Midia:
• Propriedades (protegidas):
– titulo (string): título da mídia;
– copias (number): número de cópias disponíveis;
– alugueis (lista de objetos do tipo { cliente: Cliente, dataAluguel: Date }):
registra os alugueis atuais do item.
• Construtor: deve inicializar as propriedades da classe.
• Métodos:
– descricao
* Parâmetros: nenhum;
* Retorno: string;
* Comportamento: retorna uma descrição do item no formato:
"Título: [titulo], Cópias Disponíveis: [copias]"

– alugar
* Parâmetros: cliente: Cliente;
* Retorno: boolean indicando se a operação foi bem-sucedida;
* Comportamento:
· permite alugar se houver cópias disponíveis;
· decrementa o número de cópias em caso de sucesso;
· um mesmo cliente não pode alugar o mesmo item mais de uma vez simultane-
amente (não pode ter dois alugueis abertos do mesmo item).

– devolver (abstrato)
* Parâmetros: cliente: Cliente;
* Retorno: number.
*/

abstract class Midia{
    protected titulo: string
    protected copias: number
    protected alugueis: {cliente: Cliente, dataAluguel: Date}[]
    
    constructor(titulo: string, copias: number, alugueis: {cliente: Cliente, dataAluguel: Date}[]){
        this.titulo = titulo
        this.copias = copias
        this.alugueis = alugueis
    }

    descricao(): string{
        return `"Título: ${this.titulo}, Cópias Disponíveis: ${this.copias}`
    }

    alugar(cliente: Cliente): boolean{
        if(this.copias === 0){
            return false
        }

        if(this.alugueis.find(p => p.cliente === cliente)){
            return false
        }

        this.copias--
        return true
    }

    abstract devolver(cliente: Cliente): number
}


/*

3. A classe Filme que estende Midia:
• Propriedade (privada):
– elenco (lista de objetos do tipo Artista).
• Construtor: deve inicializar as propriedades herdadas e a propriedade da classe.

• Métodos:
– Implementar o método devolver
* Retorno: valor da multa a ser paga (number);
* Comportamento: incrementa o número de cópias e calcula a multa com base no
número de dias atrasados, considerando que o cliente pode permanecer com o
filme por até 5 dias sem multa; a partir do 6o dia, é cobrada uma taxa fixa de R$
3,00 por dia de atraso; se não houver atraso, a multa é zero;
*
observação: caso o cliente não tenha alugado o filme, o método deve retornar
-1 para indicar erro.

– Sobrescrever o método descricao
* Retorno: string;
* Comportamento: adicionar ao final da descrição herdada, separado por vírgula,
o texto: "Elenco: [nome] [sobrenome] ([nacionalidade])"
*
Todos os artistas do elenco devem ser listados, separados por ponto e vírgula.
*/

class Filme extends Midia{
    private elenco: Artista[]

    constructor(titulo: string, copias: number, alugueis: {cliente: Cliente, dataAluguel: Date}[], elenco: Artista[]){
        super(titulo, copias, alugueis)
        this.elenco = elenco
    }

    devolver(cliente: Cliente): number {
        const clienteEncontrado = this.alugueis.find(p => p.cliente === cliente)
        let multa = 0

        if(!clienteEncontrado) return -1

        if(clienteEncontrado){
            const tempo = Date.now() - clienteEncontrado.dataAluguel.getTime()
            const diaEmMilisegundo = 24*60*60*1000
            if(tempo > (5*diaEmMilisegundo)){
                multa = 3* Math.ceil((tempo - (5*diaEmMilisegundo))/diaEmMilisegundo)
            }
        }
        
        
        this.copias ++
        return multa
    }

    descricao(): string {
        const msgElenco = this.elenco.map(p => {
            ` Elenco: ${p.nome} ${p.sobrenome} (${p.nacionalidade})`
        }).join(';')
        return `${super.descricao},${msgElenco}`
    }
}


/*
4. A classe Jogo que estende Midia:
• Propriedade (privada):
– plataforma (string) (por exemplo: "PC", "PlayStation", "Xbox", "Switch").
• Construtor: deve inicializar as propriedades herdadas e a propriedade da classe.
• Métodos:
– Implementar o método devolver
* Retorno: valor da multa a ser paga (number);
* Comportamento: incrementa o número de cópias e calcula a multa com base no
número de dias atrasados, considerando que o cliente pode permanecer com o
jogo por até 7 dias sem multa; a partir do 8o dia, é cobrada uma taxa fixa de R$
5,00 por dia de atraso; se não houver atraso, a multa é zero;
*
observação: caso o cliente não tenha alugado o jogo, o método deve retornar -1
para indicar erro.

– Sobrescrever o método descricao
* Retorno: string;
* Comportamento: adicionar "Plataforma: [plataforma]" ao final da descrição
herdada, separado por vírgula.
*/

class Jogo extends Midia{
    private plataforma: string

    constructor(titulo: string, copias: number, alugueis: {cliente: Cliente, dataAluguel: Date}[], plataforma: string){
        super(titulo,copias, alugueis)
        this.plataforma = plataforma
    }

    devolver(cliente: Cliente): number {
        const clienteEncontrado = this.alugueis.find(p => p.cliente === cliente)
        let multa = 0

        if(!clienteEncontrado) return -1

        if(clienteEncontrado){
            const tempo = Date.now() - clienteEncontrado.dataAluguel.getTime()
            const diaEmMilisegundo = 24*60*60*1000
            if(tempo > (7*diaEmMilisegundo)){
                multa = 5* Math.ceil((tempo - (5*diaEmMilisegundo))/diaEmMilisegundo)
            }
        }
        
        
        this.copias ++
        return multa
    }

    descricao(): string {
        return super.descricao + `, Plataforma: ${this.plataforma}`
    }
}

/*
5. A interface Artista com as seguintes propriedades:
• nome (string);
• sobrenome (string);
• nacionalidade (string).
*/

interface Artista{
    nome: string
    sobrenome: string
    nacionalidade: string
}