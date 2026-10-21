import { describe, expect, test } from "vitest";
import { buscarPorId, listarDisponiveis } from "../../lab_7/src/catalogo.js";

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  disponivel: boolean;
};

function criarCatalogoBase(): Produto[] {
  return [
    {
      id: 1,
      nome: "Teclado Mecânico",
      categoria: "Periféricos",
      preco: 249.9,
      disponivel: true,
    },
    {
      id: 2,
      nome: "Monitor 24",
      categoria: "Monitores",
      preco: 899,
      disponivel: false,
    },
    {
      id: 3,
      nome: "Mouse sem fio",
      categoria: "Periféricos",
      preco: 99.5,
      disponivel: true,
    },
  ];
}

describe("Laboratório 7 - Exercício 3", () => {
  describe("listarDisponiveis()", () => {
    test("deve retornar apenas produtos disponíveis", () => {
      const lista = criarCatalogoBase();

      const resultado: Produto[] = listarDisponiveis(lista);

      expect(resultado).toHaveLength(2);
      expect(resultado.map((produto) => produto.id)).toEqual([1, 3]);
      expect(resultado.every((produto) => produto.disponivel)).toBe(true);
    });

    test("não deve alterar a lista recebida por parâmetro", () => {
      const lista = criarCatalogoBase();
      const copia = structuredClone(lista);

      const resultado: Produto[] = listarDisponiveis(lista);

      expect(resultado).not.toBe(lista);
      expect(lista).toEqual(copia);
    });
  });

  describe("buscarPorId()", () => {
    test("deve retornar o produto com o ID informado", () => {
      const lista = criarCatalogoBase();

      const resultado: Produto | null = buscarPorId(lista, 2);

      expect(resultado).toEqual(lista[1]);
    });

    test("deve retornar null quando o ID não existir", () => {
      const lista = criarCatalogoBase();

      const resultado: Produto | null = buscarPorId(lista, 999);

      expect(resultado).toBeNull();
    });
  });
});
