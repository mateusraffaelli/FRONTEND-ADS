/**
 * Formato comum de sala, usado tanto pela primeira quanto pela segunda questão.
 * @typedef {Object} Sala
 * @property {number} id - Identificador da sala.
 * @property {string} nome - Nome da sala.
 * @property {"individual"|"grupo"|"laboratorio"} categoria - Categoria da sala.
 * @property {number} preco - Valor por hora da reserva.
 * @property {number} quantidade - Quantidade de horários disponíveis.
 * @property {boolean} disponivel - Indica se a sala está liberada para reservas.
 */

/**
 * Recurso associado a uma sala de grupo (ex: projetor, quadro, etc).
 * @typedef {Object} Recurso
 * @property {string} nome - Nome do recurso.
 * @property {string} tipo - Tipo do recurso.
 * @property {string} localizacao - Localização do recurso.
 */

/**
 * Classe "abstrata": não pode ser instanciada diretamente (ver checagem de
 * new.target no construtor). Deve ser estendida por classes concretas como
 * SalaGrupo.
 */
class SalaReservavel {
    /**
     * @param {Sala} sala - Objeto no formato Sala com os dados iniciais.
     */
    constructor(sala) {
        if (new.target === SalaReservavel) {
            throw new Error("SalaReservavel é abstrata e não pode ser instanciada diretamente.");
        }

        this.id = sala.id;
        this.nome = sala.nome;
        this.categoria = sala.categoria;
        this.preco = sala.preco;
        this.quantidade = sala.quantidade;
        this.disponivel = sala.disponivel;
        /** @type {{ usuario: Usuario }[]} */
        this.reservas = [];
    }

    /**
     * @returns {string}
     */
    descricao() {
        return `ID: ${this.id}, ${this.nome} (${this.categoria}) - R$ ${this.preco} por hora - horários disponíveis: ${this.quantidade} - disponível: ${this.disponivel ? 'sim' : 'não'}`;
    }

    /**
     * @param {Usuario} usuario
     * @returns {boolean}
     */
    reservar(usuario) {
        if (!this.disponivel || this.quantidade === 0) return false;

        // Um mesmo usuário não pode ter duas reservas abertas da mesma sala.
        const jaReservou = this.reservas.some(r => r.usuario === usuario);
        if (jaReservou) return false;

        this.quantidade--;
        if (this.quantidade === 0) {
            this.disponivel = false;
        }
        this.reservas.push({ usuario });
        return true;
    }

    /**
     * Método abstrato: deve ser sobrescrito pelas subclasses.
     * @param {Usuario} usuario
     * @returns {number}
     */
    encerrarReserva(usuario) {
        throw new Error("O método encerrarReserva deve ser sobrescrito pela subclasse.");
    }


    toSala() {
        return {
            id: this.id,
            nome: this.nome,
            categoria: this.categoria,
            preco: this.preco,
            quantidade: this.quantidade,
            disponivel: this.disponivel
        };
    }
}

class SalaGrupo extends SalaReservavel {
    #recursos;

    constructor(sala, recursos = []) {
        if (sala.categoria !== "grupo") {
            throw new Error("SalaGrupo exige uma sala com categoria 'grupo'.");
        }
        super(sala);
        this.#recursos = recursos;
    }

    
    encerrarReserva(usuario) {
        const indice = this.reservas.findIndex(r => r.usuario === usuario);
        if (indice === -1) return -1;

        this.reservas.splice(indice, 1);
        this.quantidade++;
        if (this.quantidade > 0) {
            this.disponivel = true;
        }
        return 0;
    }

    
    descricao() {
        const base = super.descricao();
        const recursosTexto = this.#recursos
            .map(r => `Recursos: ${r.nome} ${r.tipo} (${r.localizacao})`)
            .join('; ');
        return `${base}, ${recursosTexto}`;
    }
}

class Usuario {
    #nome;
    #codigo;
    static #codigos = [];

    constructor(nome) {
        this.#nome = nome;
        this.#codigo = Usuario.gerarCodigo();
    }

    get nome() {
        return this.#nome;
    }

    get codigo() {
        return this.#codigo;
    }

    static get codigos() {
        // Retorna uma cópia para não permitir alteração externa do array privado.
        return [...Usuario.#codigos];
    }

    static gerarCodigo() {
        let numeroAleatorio = Math.floor(Math.random() * 1_000_000);

        while (Usuario.#codigos.includes(numeroAleatorio)) {
            numeroAleatorio = Math.floor(Math.random() * 1_000_000);
        }

        Usuario.#codigos.push(numeroAleatorio);
        return numeroAleatorio;
    }
}

export { SalaReservavel, SalaGrupo, Usuario };