import { Cliente, Midia, Filme, Jogo, Artista } from "./lab.js";

type AluguelAberto = {
  cliente: Cliente;
  midia: Midia;
};

const selecionarElemento = <T extends Element>(seletor: string): T => {
  const elemento = document.querySelector<T>(seletor);

  if (!elemento) {
    throw new Error(`Elemento obrigatório não encontrado: ${seletor}`);
  }

  return elemento;
};

const formCliente = selecionarElemento<HTMLFormElement>("#form-cliente");
const formMidia = selecionarElemento<HTMLFormElement>("#form-midia");
const tipoMidia = selecionarElemento<HTMLSelectElement>("#midia-tipo");
const camposFilme = selecionarElemento<HTMLDivElement>("#campos-filme");
const camposJogo = selecionarElemento<HTMLDivElement>("#campos-jogo");
const listaCliente = selecionarElemento<HTMLSelectElement>("#operacao-cliente");
const listaMidia = selecionarElemento<HTMLSelectElement>("#operacao-midia");
const botaoAlugar = selecionarElemento<HTMLButtonElement>("#btn-alugar");
const botaoDevolver = selecionarElemento<HTMLButtonElement>("#btn-devolver");
const botaoDescricao = selecionarElemento<HTMLButtonElement>("#btn-descricao");
const saidaOperacao = selecionarElemento<HTMLOutputElement>("#saida-operacao");

const clientesCadastrados: Cliente[] = [];
const catalogo: Midia[] = [];
const alugueisAbertos: AluguelAberto[] = [];

formCliente.addEventListener("submit", (e) => {
  e.preventDefault();
  const entradaNome = document.querySelector("#cliente-nome") as HTMLInputElement;
  const nomeCliente = entradaNome.value;
  const cliente = new Cliente(nomeCliente);
  clientesCadastrados.push(cliente);
  atualizarClientes();
  formCliente.reset();
});

const atualizarClientes = () => {
  atualizarLista("clientes", clientesCadastrados, (cliente) => cliente.nome);
  atualizarSelect(
    listaCliente,
    clientesCadastrados,
    (cliente) => String(cliente.codigo),
    (cliente) => cliente.nome,
  );
};

const atualizarLista = <T>(
  idLista: string,
  lista: T[],
  obterTexto: (item: T) => string,
): void => {
  const listaHtml = document.querySelector(`#lista-${idLista}`) as HTMLUListElement;
  listaHtml.replaceChildren();

  lista.forEach((item) => {
    const itemLista = document.createElement("li");
    itemLista.textContent = obterTexto(item);
    listaHtml.appendChild(itemLista);
  });
};

const atualizarCamposMidia = (): void => {
  const filmeSelecionado = tipoMidia.value === "filme";

  camposFilme.hidden = !filmeSelecionado;
  camposJogo.hidden = filmeSelecionado;
};

tipoMidia.addEventListener("change", atualizarCamposMidia);

formMidia.addEventListener("submit", (e) => {
  e.preventDefault();

  const midia: Midia = tipoMidia.value === "filme" ? criarFilme() : criarJogo();
  catalogo.push(midia);
  atualizarMidias();

  formMidia.reset();
  atualizarCamposMidia();
});

const criarFilme = (): Filme => {
  const entradaCopias = document.querySelector("#midia-copias") as HTMLInputElement;
  const entradaTitulo = document.querySelector("#midia-titulo") as HTMLInputElement;
  const entradaElenco = document.querySelector("#filme-elenco") as HTMLTextAreaElement;

  const copias = entradaCopias.valueAsNumber;
  const titulo = entradaTitulo.value.trim();

  const listaElenco: Artista[] = entradaElenco.value
    .split("\n")
    .filter((linha) => linha.trim() !== "")
    .map((linha) => {
      const [nome, sobrenome, nacionalidade] = linha
        .split(";")
        .map((valor) => valor.trim());
      return { nome, sobrenome, nacionalidade };
    });

  return new Filme(entradaTitulo.value, entradaCopias.valueAsNumber, listaElenco);
};

const criarJogo = (): Jogo => {
  const copias = document.querySelector("#midia-copias") as HTMLInputElement;
  const titulo = document.querySelector("#midia-titulo") as HTMLInputElement;
  const plataforma = document.querySelector("#jogo-plataforma") as HTMLInputElement;

  return new Jogo(titulo.value, copias.valueAsNumber, plataforma.value);
};

const atualizarMidias = () => {
  atualizarLista("midias", catalogo, (midia) => midia.descricao());
  atualizarSelect(
    listaMidia,
    catalogo,
    (_midia, indice) => String(indice + 1),
    (midia) => midia.descricao(),
  );
};

const atualizarSelect = <T>(
  operacao: HTMLSelectElement,
  lista: T[],
  obterCodigo: (item: T, valor: number) => string,
  obterTexto: (item: T) => string,
): void => {
  const opcoes: HTMLOptionElement[] = [];
  lista.forEach((item, indice) => {
    const opcao = document.createElement("option");
    opcao.value = obterCodigo(item, indice);
    opcao.textContent = obterTexto(item);
    opcoes.push(opcao);
  });
  operacao.replaceChildren(operacao.children[0], ...opcoes);
};

const obterClienteSelecionado = (): Cliente | undefined => {
  return clientesCadastrados.find(
    (cliente) => cliente.codigo === Number(listaCliente.value),
  );
};

const atualizarAlugueis = () => {
  atualizarLista(
    "alugueis",
    alugueisAbertos,
    (aluguel) => `${aluguel.cliente.nome} - ${aluguel.midia.descricao()}`,
  );
};

botaoAlugar.addEventListener("click", () => {
  const cliente = obterClienteSelecionado();
  const midia = obterMidiaSelecionada();

  if (!cliente || !midia) {
    exibirMensagem("É necessário selecionar um cliente e uma mídia!");
    return;
  }

  if (!midia.alugar(cliente)) {
    exibirMensagem("Não foi possível completar o aluguel.");
    return;
  }

  alugueisAbertos.push({ cliente, midia });
  exibirMensagem("Aluguel efetivado.");

  atualizarMidias();
  atualizarAlugueis();

  listaCliente.value = "";
  listaMidia.value = "";
});

botaoDevolver.addEventListener("click", () => {
  const cliente = obterClienteSelecionado();
  const midia = obterMidiaSelecionada();

  if (!cliente || !midia) {
    exibirMensagem("É necessário selecionar um cliente e uma mídia!");
    return;
  }

  const indiceAluguel = alugueisAbertos.findIndex(
    (aluguel) => aluguel.cliente === cliente && aluguel.midia === midia,
  );

  if (indiceAluguel === -1) {
    exibirMensagem("Este cliente não possui aluguel aberto para essa mídia");
    return;
  }

  const multa = midia.devolver(cliente);

  if (multa === -1) {
    exibirMensagem("Não foi possível devolver esta mídia.");
    return;
  }

  alugueisAbertos.splice(indiceAluguel, 1);
  atualizarAlugueis();
  atualizarMidias();

  listaCliente.value = "";
  listaMidia.value = "";

  exibirMensagem(
    `A devolução foi concluída e o cliente deverá pagar R$ ${multa.toFixed(2)}`,
  );
});

const obterMidiaSelecionada = (): Midia | undefined => {
  return catalogo.find((_, indice) => Number(listaMidia.value) === indice + 1);
};

const exibirMensagem = (mensagem: string): void => {
  saidaOperacao.textContent = mensagem;
};

botaoDescricao.addEventListener("click", () => {
  exibirMensagem(obterMidiaSelecionada()?.descricao() ?? "Selecione uma mídia.");
});

atualizarCamposMidia();
