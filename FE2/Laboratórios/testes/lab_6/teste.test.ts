import { describe, expect, test } from "vitest";
import {
  adicionarProduto,
  removerProduto,
  atualizarQuantidadeProduto,
  inverterDisponibilidade,
  buscarPorNome,
  listarResumosProdutos,
  limparIndisponiveis,
} from "../../lab_6/src/lab.js";

type Categoria = "eletronico" | "livro" | "roupa";

type Produto = {
  id: number;
  nome: string;
  categoria: Categoria;
  preco: number;
  quantidade: number;
  emEstoque: boolean;
};

function criarListaBase(): Produto[] {
  return [
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
}

describe("Laboratório 6", () => {
  describe("adicionarProduto()", () => {
    test("deve adicionar produto quando ele não existe na lista", () => {
      const lista = criarListaBase();
      const novoProduto: Produto = {
        id: 4,
        nome: "Mouse Gamer",
        categoria: "eletronico",
        preco: 150,
        quantidade: 1,
        emEstoque: true,
      };

      const novaLista: Produto[] = adicionarProduto(lista, novoProduto);

      expect(novaLista).not.toBe(lista);
      expect(novaLista).toHaveLength(lista.length + 1);
      expect(novaLista.find((p) => p.id === 4)).toEqual(novoProduto);
      expect(lista.find((p) => p.id === 4)).toBeUndefined();
    });

    test("deve atualizar produto existente (mesmo id)", () => {
      const lista = criarListaBase();
      const primeiroProdutoOriginal = lista[0];
      const produtoAtualizado: Produto = {
        id: 2,
        nome: "Livro de TypeScript",
        categoria: "livro",
        preco: 120,
        quantidade: 5,
        emEstoque: false,
      };

      const novaLista: Produto[] = adicionarProduto(lista, produtoAtualizado);

      expect(novaLista).toHaveLength(lista.length);
      expect(novaLista[0]).toBe(primeiroProdutoOriginal);
      const item2 = novaLista.find((p) => p.id === 2);
      expect(item2).toEqual(produtoAtualizado);
      expect(novaLista.map((p) => p.id)).toEqual([1, 2, 3]);
      const original = lista.find((p) => p.id === 2);
      expect(original?.nome).toBe("Livro de JS");
    });
  });

  describe("removerProduto()", () => {
    test("deve remover produto existente", () => {
      const lista = criarListaBase();
      const primeiroProdutoOriginal = lista[0];
      const terceiroProdutoOriginal = lista[2];

      const novaLista: Produto[] = removerProduto(lista, 2);

      expect(novaLista).not.toBe(lista);
      expect(novaLista).toHaveLength(lista.length - 1);
      expect(novaLista.find((p) => p.id === 2)).toBeUndefined();
      expect(novaLista.map((p) => p.id)).toEqual([1, 3]);
      expect(novaLista[0]).toBe(primeiroProdutoOriginal);
      expect(novaLista[1]).toBe(terceiroProdutoOriginal);
      expect(lista).toHaveLength(3);
    });

    test("não deve alterar a lista quando o id não existe", () => {
      const lista = criarListaBase();

      const novaLista: Produto[] = removerProduto(lista, 999);

      expect(novaLista).not.toBe(lista);
      expect(novaLista).toEqual(lista);
    });
  });

  describe("atualizarQuantidadeProduto()", () => {
    test("deve atualizar a quantidade convertendo o valor recebido como string", () => {
      const lista = criarListaBase();
      const novaLista: Produto[] = atualizarQuantidadeProduto(
        lista,
        1,
        "5"
      );

      const antigo = lista.find((p) => p.id === 1);
      const novo = novaLista.find((p) => p.id === 1);

      expect(novaLista).not.toBe(lista);
      expect(novo).not.toBe(antigo);
      expect(novo?.quantidade).toBe(5);
      expect(novo?.preco).toBe(antigo?.preco);
      expect(novo?.nome).toBe(antigo?.nome);
      expect(novo?.categoria).toBe(antigo?.categoria);
      expect(novo?.emEstoque).toBe(antigo?.emEstoque);
      expect(antigo?.quantidade).toBe(1);
    });

    test("não deve alterar a lista se o produto não existir", () => {
      const lista = criarListaBase();
      const produtosOriginais = [...lista];

      const novaLista: Produto[] = atualizarQuantidadeProduto(
        lista,
        999,
        "5"
      );

      expect(novaLista).not.toBe(lista);
      expect(novaLista).toEqual(lista);
      expect(novaLista).toEqual(produtosOriginais);
      expect(novaLista[0]).toBe(produtosOriginais[0]);
      expect(novaLista[1]).toBe(produtosOriginais[1]);
      expect(novaLista[2]).toBe(produtosOriginais[2]);
    });

    test("não deve alterar a lista se a quantidade não for numérica", () => {
      const lista = criarListaBase();
      const produtosOriginais = [...lista];

      const novaLista: Produto[] = atualizarQuantidadeProduto(
        lista,
        1,
        "cinco"
      );

      expect(novaLista).not.toBe(lista);
      expect(novaLista).toEqual(lista);
      expect(novaLista[0]).toBe(produtosOriginais[0]);
      expect(novaLista[1]).toBe(produtosOriginais[1]);
      expect(novaLista[2]).toBe(produtosOriginais[2]);
    });

    test("deve considerar apenas a parte inteira se a quantidade for decimal", () => {
      const lista = criarListaBase();

      const novaLista: Produto[] = atualizarQuantidadeProduto(
        lista,
        1,
        "2.5"
      );

      const antigo = lista.find((p) => p.id === 1);
      const novo = novaLista.find((p) => p.id === 1);

      expect(novaLista).not.toBe(lista);
      expect(novo).not.toBe(antigo);
      expect(novo?.quantidade).toBe(2);
      expect(novo?.emEstoque).toBe(antigo?.emEstoque);
      expect(antigo?.quantidade).toBe(1);
    });

    test("deve marcar o produto como indisponível se a quantidade for zero", () => {
      const lista = criarListaBase();

      const listaComZero: Produto[] = atualizarQuantidadeProduto(lista, 1, "0");
      const antigo = lista.find((p) => p.id === 1);
      const novo = listaComZero.find((p) => p.id === 1);

      expect(listaComZero).not.toBe(lista);
      expect(novo).not.toBe(antigo);
      expect(novo?.emEstoque).toBe(false);
      expect(novo?.quantidade).not.toBe(antigo?.quantidade);
      expect(antigo?.emEstoque).toBe(true);
    });

    test("não deve alterar a lista se a quantidade for negativa", () => {
      const lista = criarListaBase();

      const novaLista: Produto[] = atualizarQuantidadeProduto(lista, 1, "-3");

      expect(novaLista).toEqual(lista);
    });
  });

  describe("inverterDisponibilidade()", () => {
    test("deve inverter o valor de emEstoque de um produto existente", () => {
      const lista = criarListaBase();
      const produto = lista.find((p) => p.id === 1);
      const produtoNaoAlterado = lista.find((p) => p.id === 2);

      const novaLista: Produto[] = inverterDisponibilidade(lista, 1);
      const produtoNovo = novaLista.find((p) => p.id === 1);

      expect(novaLista).not.toBe(lista);
      expect(produtoNovo).not.toBe(produto);
      expect(produtoNovo?.emEstoque).toBe(!produto?.emEstoque);
      expect(novaLista.find((p) => p.id === 2)).toBe(produtoNaoAlterado);
      expect(produto?.emEstoque).toBe(true);
    });

    test("não deve alterar a lista se o produto não existir", () => {
      const lista = criarListaBase();
      const novaLista: Produto[] = inverterDisponibilidade(lista, 999);

      expect(novaLista).toEqual(lista);
    });
  });

  describe("buscarPorNome()", () => {
    test("deve encontrar produto ignorando maiúsculas/minúsculas", () => {
      const lista = criarListaBase();

      const resultado1: Produto | null = buscarPorNome(
        lista,
        "teclado mecânico"
      );
      const resultado2: Produto | null = buscarPorNome(
        lista,
        "TECLADO MECÂNICO"
      );

      expect(resultado1 && resultado1.id).toBe(1);
      expect(resultado2 && resultado2.id).toBe(1);
      expect(resultado1).toBe(lista[0]);
    });

    test("deve diferenciar nomes parecidos que não sejam exatamente iguais", () => {
      const lista = criarListaBase();

      const resultado: Produto | null = buscarPorNome(lista, "Teclado");

      expect(resultado).toBeNull();
    });

    test("deve retornar null quando o produto não existir", () => {
      const lista = criarListaBase();
      const resultado: Produto | null = buscarPorNome(
        lista,
        "Produto Inexistente"
      );

      expect(resultado).toBeNull();
    });
  });

  describe("listarResumosProdutos()", () => {
    test("deve retornar lista vazia quando não houver produtos", () => {
      const resumos: string[] = listarResumosProdutos([]);

      expect(resumos).toEqual([]);
    });

    test("deve montar as strings no formato especificado, com valor total e sim/não", () => {
      const lista = criarListaBase();

      const resumos: string[] = listarResumosProdutos(lista);

      expect(resumos).toHaveLength(lista.length);
      expect(resumos[0]).toBe(
        "ID: 1, Teclado Mecânico (eletronico) - R$ 200.00 - em estoque: sim"
      );
      expect(resumos[1]).toBe(
        "ID: 2, Livro de JS (livro) - R$ 200.00 - em estoque: sim"
      );
      expect(resumos[2]).toBe(
        "ID: 3, Camiseta Dev (roupa) - R$ 150.00 - em estoque: não"
      );
    });
  });

  describe("limparIndisponiveis()", () => {
    test("deve retornar apenas produtos com emEstoque === true", () => {
      const lista = criarListaBase();
      const novaLista: Produto[] = limparIndisponiveis(lista);

      expect(novaLista).not.toBe(lista);
      expect(novaLista.every((p) => p.emEstoque)).toBe(true);
      expect(novaLista).toHaveLength(2);
      expect(novaLista.find((p) => p.id === 3)).toBeUndefined();
      expect(novaLista[0]).toBe(lista[0]);
      expect(novaLista[1]).toBe(lista[1]);
      expect(lista).toHaveLength(3);
    });

    test("deve retornar lista vazia quando todos os produtos estiverem indisponíveis", () => {
      const lista: Produto[] = criarListaBase().map((produto) => ({
        ...produto,
        emEstoque: false,
      }));

      const novaLista: Produto[] = limparIndisponiveis(lista);

      expect(novaLista).toEqual([]);
      expect(lista).toHaveLength(3);
    });
  });
});
