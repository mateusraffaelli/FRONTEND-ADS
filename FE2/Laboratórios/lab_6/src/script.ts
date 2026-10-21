import {
  type Produto,
  type Categoria,
  adicionarProduto,
  removerProduto,
  atualizarQuantidadeProduto,
  inverterDisponibilidade,
  buscarPorNome,
  listarResumosProdutos,
  limparIndisponiveis,
} from "./lab.js";

let carrinho: Produto[] = [
  {
    id: 1,
    nome: "Teclado Mecânico",
    categoria: "eletronico",
    preco: 200,
    quantidade: 1,
    emEstoque: true,
  },
  {
    id: 2,
    nome: "Livro de JS",
    categoria: "livro",
    preco: 100,
    quantidade: 2,
    emEstoque: true,
  },
  {
    id: 3,
    nome: "Camiseta Dev",
    categoria: "roupa",
    preco: 50,
    quantidade: 3,
    emEstoque: false,
  },
];

const iniciarInterface = (): void => {
  const formProduto = document.querySelector<HTMLFormElement>("#form-produto");
  const formQuantidade = document.querySelector<HTMLFormElement>("#form-quantidade");
  const formBusca = document.querySelector<HTMLFormElement>("#form-busca");
  const listaProdutos = document.querySelector<HTMLUListElement>("#lista-produtos");
  const resultadoBusca = document.querySelector<HTMLDivElement>("#resultado-busca");
  const saidaOperacao = document.querySelector<HTMLOutputElement>("#saida-operacao");
  const btnInverter = document.querySelector<HTMLButtonElement>("#btn-inverter");
  const btnRemover = document.querySelector<HTMLButtonElement>("#btn-remover");
  const btnLimpar = document.querySelector<HTMLButtonElement>("#btn-limpar");
  const quantidadeId = document.querySelector<HTMLInputElement>("#quantidade-id");
  const totalProdutos = document.querySelector<HTMLElement>("#total-produtos");
  const totalItens = document.querySelector<HTMLElement>("#total-itens");
  const totalEstoque = document.querySelector<HTMLElement>("#total-estoque");

  if (
    !formProduto ||
    !formQuantidade ||
    !formBusca ||
    !listaProdutos ||
    !resultadoBusca ||
    !saidaOperacao ||
    !btnInverter ||
    !btnRemover ||
    !btnLimpar ||
    !quantidadeId ||
    !totalProdutos ||
    !totalItens ||
    !totalEstoque
  ) {
    return;
  }

  const informar = (mensagem: string): void => {
    saidaOperacao.value = mensagem;
  };

  const renderizar = (): void => {
    listaProdutos.replaceChildren(
      ...listarResumosProdutos(carrinho).map((resumo) => {
        const item = document.createElement("li");
        item.textContent = resumo;
        return item;
      }),
    );

    totalProdutos.textContent = String(carrinho.length);
    totalItens.textContent = String(
      carrinho.reduce((total, produto) => total + produto.quantidade, 0),
    );
    totalEstoque.textContent = String(
      carrinho.filter((produto) => produto.emEstoque).length,
    );
  };

  formProduto.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dados = new FormData(formProduto);
    const produto: Produto = {
      id: Number(dados.get("id")),
      nome: String(dados.get("nome")),
      categoria: String(dados.get("categoria")) as Categoria,
      preco: Number(dados.get("preco")),
      quantidade: Number(dados.get("quantidade")),
      emEstoque: dados.get("emEstoque") === "on",
    };

    carrinho = adicionarProduto(carrinho, produto);
    quantidadeId.value = String(produto.id);
    informar(`Produto ${produto.nome} salvo no carrinho.`);
    renderizar();
  });

  formQuantidade.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dados = new FormData(formQuantidade);
    const id = Number(dados.get("id"));
    const quantidade = String(dados.get("quantidade"));

    carrinho = atualizarQuantidadeProduto(carrinho, id, quantidade);
    informar(`Quantidade do produto ${id} atualizada quando os dados forem válidos.`);
    renderizar();
  });

  formBusca.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const dados = new FormData(formBusca);
    const nome = String(dados.get("nome"));
    const produto = buscarPorNome(carrinho, nome);

    resultadoBusca.textContent = produto
      ? `Encontrado: ${produto.nome} (${produto.categoria}), R$ ${produto.preco.toFixed(2)}, quantidade ${produto.quantidade}.`
      : "Produto não encontrado.";
    informar(`Busca realizada por: ${nome}.`);
  });

  btnInverter.addEventListener("click", () => {
    const id = Number(quantidadeId.value);
    carrinho = inverterDisponibilidade(carrinho, id);
    informar(`Disponibilidade do produto ${id} invertida.`);
    renderizar();
  });

  btnRemover.addEventListener("click", () => {
    const id = Number(quantidadeId.value);
    carrinho = removerProduto(carrinho, id);
    informar(`Produto ${id} removido, se existia no carrinho.`);
    renderizar();
  });

  btnLimpar.addEventListener("click", () => {
    carrinho = limparIndisponiveis(carrinho);
    informar("Produtos indisponíveis removidos do carrinho.");
    renderizar();
  });

  renderizar();
};

if (typeof document !== "undefined") {
  iniciarInterface();
}