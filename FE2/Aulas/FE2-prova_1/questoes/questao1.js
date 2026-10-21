// Escreva o seu código aqui

// **a) Adicionar sala**
// - Nome da função: `adicionarSala`
// - Parâmetros: `lista` (`Sala[]`) e `sala` (`Sala`)
// - Retorno: `Sala[]` — nova lista incluindo a sala
// - Comportamento:
//   - se a sala não estiver na lista, adicioná-la;
//   - se a sala já existir (mesmo `id`), não alterar a lista.

const adicionarSala = (lista, sala) => {
    const salaEncontrada = lista.find(p => p.id === sala.id)
    
    if(!salaEncontrada) return [...lista, sala]
    
    return lista
}

// **b) Remover sala**
// - Nome da função: `removerSala`
// - Parâmetros: `lista` (`Sala[]`) e `id` (`number`)
// - Retorno: `Sala[]` — nova lista sem a sala removida
// - Comportamento:
//   - se a sala não estiver na lista, não alterar a lista;
//   - se a sala estiver na lista, removê-la.

const removerSala = (lista, id) => {
    const salaEncontrada = lista.find(p => p.id === id)

    if(!salaEncontrada) return lista

    return lista.filter(p => p.id !== id)
}

// **c) Atualizar propriedade da sala**
// - Nome da função: `atualizarPropriedadeSala`
// - Parâmetros: `lista` (`Sala[]`), `id` (`number`), `propriedade` (`string`) e `valor` (`unknown`)
// - Retorno: `Sala[]` — nova lista com a sala atualizada
// - Comportamento:
//   - se a sala não estiver na lista, não alterar a lista;
//   - se a sala estiver na lista, atualizar a propriedade especificada com o novo valor, desde que:
//     - o nome da propriedade esteja correto;
//     - a propriedade não seja `id`, pois o identificador da sala não pode ser alterado;
//     - o valor seja válido para o tipo daquela propriedade (por exemplo, `preco` deve continuar sendo número, `categoria` deve ser um dos valores permitidos);
//   - se a propriedade for `id`, se o nome da propriedade ou se o valor não forem válidos, não alterar a lista.


const atualizarPropriedadeSala = (lista , id , propriedade, valor) =>{
    const salaEncontrada = lista.find(p => p.id === id)
    const propriedadesCorretas = ['nome', 'categoria', 'preco', 'quantidade', 'disponivel']
    const categoriasCertas = ['individual', 'grupo' , 'laboratorio']

    if(!salaEncontrada) return [...lista]

    if(!propriedadesCorretas.includes(propriedade)) return [...lista]

    if(propriedade === 'categoria' && !categoriasCertas.includes(valor)) return [...lista]

    if(typeof salaEncontrada[propriedade] !== typeof valor) return [...lista]
    
    return lista.map(p => p.id === id ? {...p,[propriedade]: valor} : p )
}


// **d) Calcular valor total das salas por disponibilidade**
// - Nome da função: `calcularTotalPorDisponibilidade`
// - Parâmetros: `lista` (`Sala[]`) e `disponibilidade` (`boolean`, opcional)
// - Retorno: `number` — soma de `preco * quantidade` das salas consideradas
// - Comportamento:
//   - se `disponibilidade` não for informada, considerar todas as salas;
//   - se `disponibilidade` for `true`, considerar apenas as salas disponíveis (`disponivel === true`);
//   - se `disponibilidade` for `false`, considerar apenas as salas indisponíveis (`disponivel === false`);
//   - se não houver salas que atendam ao critério, retornar `0`.

const calcularTotalPorDisponibilidade = (lista , disponibilidade) => {
    
    if(disponibilidade === undefined) return lista.reduce((acumulador, salaAtual) => {return acumulador + salaAtual.preco * salaAtual.quantidade}, 0)

    if(disponibilidade) {
        const listaSalasDisponiveis = lista.filter(p => p.disponivel)
        return listaSalasDisponiveis.reduce((acumulador, salaAtual) => {return acumulador + salaAtual.preco * salaAtual.quantidade}, 0)
    }

    if(!disponibilidade) {
        const listaSalasDisponiveis = lista.filter(p => !p.disponivel)
        return listaSalasDisponiveis.reduce((acumulador, salaAtual) => {return acumulador + salaAtual.preco * salaAtual.quantidade}, 0)
    }

    return 0

}


// **e) Buscar sala por nome**
// - Nome da função: `buscarPorNome`
// - Parâmetros: `lista` (`Sala[]`), `nome` (`string`)
// - Retorno: `Sala | null`
// - Comportamento:
//   - buscar a sala que corresponda ao nome fornecido;
//   - o nome pode estar em maiúsculas ou minúsculas;
//   - se a sala não for encontrada, retornar `null`.

const buscarPorNome = (lista , nome)=> {
    const salaEncontrada = lista.find(p => p.nome.toLocaleLowerCase() === nome.toLocaleLowerCase())

    if(!salaEncontrada) return null

    return salaEncontrada
}

// **f) Listar resumos de salas**
// - Nome da função: `listarResumosSalas`
// - Parâmetros: `lista` (`Sala[]`)
// - Retorno: `string[]` no formato: `"ID: [id], [nome] ([categoria]) - R$ [valor total: preco x quantidade] - disponível: [sim/não]"`
// - Comportamento:
//   - caso a sala esteja com `disponivel === true`, o texto disponível deve ser `"sim"`;
//   - caso contrário, deve ser `"não"`.

const listarResumosSalas = (lista) => {
    return lista.map( p => `ID: ${p.id}, ${p.nome} (${p.categoria}) - R$ ${p.preco * p.quantidade} - disponível: ${p.disponivel ? 'sim' : 'não'}`)
}

// **g) Limpar salas indisponíveis**
// - Nome da função: `limparIndisponiveis`
// - Parâmetros: `lista` (`Sala[]`)
// - Retorno: `Sala[]` — nova lista apenas com as salas que ainda estão disponíveis para reserva.

const limparIndisponiveis = (lista) => {
    return lista.filter(p => p.disponivel)
}

// Não altere esse código
export {
  adicionarSala,
  removerSala,
  atualizarPropriedadeSala,
  calcularTotalPorDisponibilidade,
  buscarPorNome,
  listarResumosSalas,
  limparIndisponiveis,
};
