import { describe, expect, test } from "vitest";

import {
  adicionarSala,
  removerSala,
  atualizarPropriedadeSala,
  calcularTotalPorDisponibilidade,
  buscarPorNome,
  listarResumosSalas,
  limparIndisponiveis,
} from "../questoes/questao1.js";

const salasBase = Object.freeze([
  Object.freeze({
    id: 1,
    nome: "Sala Aurora",
    categoria: "individual",
    preco: 12,
    quantidade: 2,
    disponivel: true,
  }),
  Object.freeze({
    id: 2,
    nome: "Sala Atlas",
    categoria: "grupo",
    preco: 30,
    quantidade: 3,
    disponivel: true,
  }),
  Object.freeze({
    id: 3,
    nome: "Lab Ada",
    categoria: "laboratorio",
    preco: 50,
    quantidade: 1,
    disponivel: false,
  }),
]);

const clonarSalas = () => salasBase.map((sala) => ({ ...sala }));
const snapshot = (valor) => JSON.stringify(valor);

describe("Questão 1:", () => {
  describe("a)", () => {
    test("adicionarSala inclui uma sala nova sem alterar a lista original", () => {
      const salas = clonarSalas();
      const antes = snapshot(salas);
      const novaSala = {
        id: 4,
        nome: "Sala Delta",
        categoria: "grupo",
        preco: 25,
        quantidade: 4,
        disponivel: true,
      };

      const resultado = adicionarSala(salas, novaSala);

      expect(resultado).toHaveLength(4);
      expect(resultado).toContainEqual(novaSala);
      expect(resultado).not.toBe(salas);
      expect(snapshot(salas)).toBe(antes);
    });

    test("adicionarSala funciona com lista vazia", () => {
      const salas = [];
      const novaSala = {
        id: 1,
        nome: "Sala Inicial",
        categoria: "individual",
        preco: 10,
        quantidade: 1,
        disponivel: true,
      };

      const resultado = adicionarSala(salas, novaSala);

      expect(resultado).toEqual([novaSala]);
    });

    test("adicionarSala não atualiza nem duplica sala já existente", () => {
      const salas = clonarSalas();
      const antes = snapshot(salas);
      const salaAlterada = {
        id: 2,
        nome: "Sala Atlas Premium",
        categoria: "grupo",
        preco: 100,
        quantidade: 10,
        disponivel: false,
      };

      const resultado = adicionarSala(salas, salaAlterada);

      expect(resultado).toHaveLength(3);
      expect(resultado.find((sala) => sala.id === 2)).toEqual(salas[1]);
      expect(snapshot(salas)).toBe(antes);
    });

    test("adicionarSala considera salas com mesmo id como existentes", () => {
      const salas = clonarSalas();
      const salaComMesmoId = {
        id: 1,
        nome: "Outro nome",
        categoria: "laboratorio",
        preco: 99,
        quantidade: 9,
        disponivel: false,
      };

      const resultado = adicionarSala(salas, salaComMesmoId);

      expect(resultado).toEqual(salas);
    });
  });

  describe("b)", () => {
    test("removerSala remove por id sem alterar a lista original", () => {
      const salas = clonarSalas();
      const antes = snapshot(salas);

      const resultado = removerSala(salas, 2);

      expect(resultado).toHaveLength(2);
      expect(resultado.some((sala) => sala.id === 2)).toBe(false);
      expect(snapshot(salas)).toBe(antes);
    });

    test("removerSala mantém lista equivalente quando o id não existe", () => {
      const salas = clonarSalas();
      const antes = snapshot(salas);

      const resultado = removerSala(salas, 999);

      expect(resultado).toEqual(salas);
      expect(snapshot(salas)).toBe(antes);
    });

    test("removerSala retorna lista vazia ao remover o único item", () => {
      const sala = clonarSalas()[0];

      const resultado = removerSala([sala], sala.id);

      expect(resultado).toEqual([]);
    });

    test("removerSala mantém lista vazia quando não há itens", () => {
      const salas = [];

      const resultado = removerSala(salas, 1);

      expect(resultado).toEqual([]);
    });
  });

  describe("c)", () => {
    test("atualizarPropriedadeSala atualiza propriedade válida preservando as demais", () => {
      const salas = clonarSalas();
      const antes = snapshot(salas);

      const resultado = atualizarPropriedadeSala(salas, 1, "preco", 18);

      expect(resultado.find((sala) => sala.id === 1)).toEqual({
        ...salas[0],
        preco: 18,
      });
      expect(snapshot(salas)).toBe(antes);
    });

    test("atualizarPropriedadeSala atualiza nome, categoria, quantidade e disponibilidade com valores válidos", () => {
      const salas = clonarSalas();

      const nomeAtualizado = atualizarPropriedadeSala(salas, 1, "nome", "Sala Boreal");
      const categoriaGrupo = atualizarPropriedadeSala(salas, 1, "categoria", "grupo");
      const categoriaLaboratorio = atualizarPropriedadeSala(
        salas,
        1,
        "categoria",
        "laboratorio",
      );
      const quantidadeAtualizada = atualizarPropriedadeSala(salas, 1, "quantidade", 5);
      const disponibilidadeAtualizada = atualizarPropriedadeSala(
        salas,
        1,
        "disponivel",
        false,
      );

      expect(nomeAtualizado.find((sala) => sala.id === 1)).toEqual({
        ...salas[0],
        nome: "Sala Boreal",
      });
      expect(categoriaGrupo.find((sala) => sala.id === 1)).toEqual({
        ...salas[0],
        categoria: "grupo",
      });
      expect(categoriaLaboratorio.find((sala) => sala.id === 1)).toEqual({
        ...salas[0],
        categoria: "laboratorio",
      });
      expect(quantidadeAtualizada.find((sala) => sala.id === 1)).toEqual({
        ...salas[0],
        quantidade: 5,
      });
      expect(disponibilidadeAtualizada.find((sala) => sala.id === 1)).toEqual({
        ...salas[0],
        disponivel: false,
      });
    });

    test("atualizarPropriedadeSala não permite alterar id", () => {
      const salas = clonarSalas();
      const antes = snapshot(salas);

      const resultado = atualizarPropriedadeSala(salas, 1, "id", 99);

      expect(resultado).toEqual(salas);
      expect(snapshot(salas)).toBe(antes);
    });

    test("atualizarPropriedadeSala aceita todas as categorias válidas", () => {
      const salas = clonarSalas();

      const individual = atualizarPropriedadeSala(salas, 2, "categoria", "individual");
      const grupo = atualizarPropriedadeSala(salas, 2, "categoria", "grupo");
      const laboratorio = atualizarPropriedadeSala(salas, 2, "categoria", "laboratorio");

      expect(individual.find((sala) => sala.id === 2)).toEqual({
        ...salas[1],
        categoria: "individual",
      });
      expect(grupo.find((sala) => sala.id === 2)).toEqual({
        ...salas[1],
        categoria: "grupo",
      });
      expect(laboratorio.find((sala) => sala.id === 2)).toEqual({
        ...salas[1],
        categoria: "laboratorio",
      });
    });

    test("atualizarPropriedadeSala mantém lista equivalente quando a sala não existe", () => {
      const salas = clonarSalas();
      const antes = snapshot(salas);

      const resultado = atualizarPropriedadeSala(salas, 999, "preco", 18);
      
      expect(resultado).toEqual(salas);
      expect(snapshot(salas)).toBe(antes);
    });

    test("atualizarPropriedadeSala rejeita propriedade inexistente", () => {
      const salas = clonarSalas();

      const resultado = atualizarPropriedadeSala(salas, 1, "capacidade", 8);

      expect(resultado).toEqual(salas);
    });

    test("atualizarPropriedadeSala rejeita valor incompatível com o tipo da propriedade", () => {
      const salas = clonarSalas();

      const nomeInvalido = atualizarPropriedadeSala(salas, 1, "nome", 18);
      const precoInvalido = atualizarPropriedadeSala(salas, 1, "preco", "18");
      const quantidadeInvalida = atualizarPropriedadeSala(salas, 1, "quantidade", "5");
      const disponivelInvalido = atualizarPropriedadeSala(salas, 1, "disponivel", "sim");
      const categoriaInvalida = atualizarPropriedadeSala(
        salas,
        1,
        "categoria",
        "auditorio",
      );

      expect(nomeInvalido).toEqual(salas);
      expect(precoInvalido).toEqual(salas);
      expect(quantidadeInvalida).toEqual(salas);
      expect(disponivelInvalido).toEqual(salas);
      expect(categoriaInvalida).toEqual(salas);
    });
  });

  describe("d)", () => {
    test("calcularTotalPorDisponibilidade usa todas as salas quando disponibilidade é omitida", () => {
      const salas = clonarSalas();

      const resultado = calcularTotalPorDisponibilidade(salas);

      expect(resultado).toBe(164);
    });

    test("calcularTotalPorDisponibilidade soma apenas salas disponíveis quando disponibilidade é true", () => {
      const salas = clonarSalas();

      const resultado = calcularTotalPorDisponibilidade(salas, true);

      expect(resultado).toBe(114);
    });

    test("calcularTotalPorDisponibilidade soma apenas salas indisponíveis quando disponibilidade é false", () => {
      const salas = clonarSalas();

      const resultado = calcularTotalPorDisponibilidade(salas, false);

      expect(resultado).toBe(50);
    });

    test("calcularTotalPorDisponibilidade retorna zero quando nenhuma sala atende ao critério", () => {
      const salas = clonarSalas().map((sala) => ({ ...sala, disponivel: true }));

      const resultado = calcularTotalPorDisponibilidade(salas, false);

      expect(resultado).toBe(0);
    });

    test("calcularTotalPorDisponibilidade retorna zero para lista vazia", () => {
      const salas = [];

      const totalGeral = calcularTotalPorDisponibilidade(salas);
      const totalDisponiveis = calcularTotalPorDisponibilidade(salas, true);
      const totalIndisponiveis = calcularTotalPorDisponibilidade(salas, false);

      expect(totalGeral).toBe(0);
      expect(totalDisponiveis).toBe(0);
      expect(totalIndisponiveis).toBe(0);
    });

    test("calcularTotalPorDisponibilidade considera salas com quantidade zero", () => {
      const salas = [
        { ...salasBase[0], quantidade: 0 },
        { ...salasBase[1], quantidade: 4 },
      ];

      const resultado = calcularTotalPorDisponibilidade(salas);

      expect(resultado).toBe(120);
    });
  });

  describe("e)", () => {
    test("buscarPorNome ignora diferenças entre maiúsculas e minúsculas", () => {
      const salas = clonarSalas();

      const salaMinuscula = buscarPorNome(salas, "sala atlas");
      const salaMaiuscula = buscarPorNome(salas, "LAB ADA");
      
      expect(salaMinuscula).toEqual(salas[1]);
      expect(salaMaiuscula).toEqual(salas[2]);
    });

    test("buscarPorNome retorna null para sala inexistente", () => {
      const salas = clonarSalas();

      const salaInexistente = buscarPorNome(salas, "Sala Inexistente");
      
      expect(salaInexistente).toBeNull();
    });

    test("buscarPorNome encontra correspondência exata e retorna null em lista vazia", () => {
      const salas = clonarSalas();

      const salaEncontrada = buscarPorNome(salas, "Sala Aurora");
      const salaEmListaVazia = buscarPorNome([], "Sala Aurora");

      expect(salaEncontrada).toBe(salas[0]);
      expect(salaEmListaVazia).toBeNull();
    });
  });

  describe("f)", () => {
    test("listarResumosSalas retorna textos no formato especificado", () => {
      const salas = clonarSalas();

      const resultado = listarResumosSalas(salas);

      expect(resultado).toEqual([
        "ID: 1, Sala Aurora (individual) - R$ 24 - disponível: sim",
        "ID: 2, Sala Atlas (grupo) - R$ 90 - disponível: sim",
        "ID: 3, Lab Ada (laboratorio) - R$ 50 - disponível: não",
      ]);
    });

    test("listarResumosSalas retorna lista vazia quando não há salas", () => {
      const salas = [];

      const resultado = listarResumosSalas(salas);

      expect(resultado).toEqual([]);
    });

    test("listarResumosSalas calcula valor total usando preco vezes quantidade", () => {
      const salas = [
        {
          id: 4,
          nome: "Sala Delta",
          categoria: "grupo",
          preco: 25,
          quantidade: 0,
          disponivel: false,
        },
      ];

      const resultado = listarResumosSalas(salas);

      expect(resultado).toEqual(["ID: 4, Sala Delta (grupo) - R$ 0 - disponível: não"]);
    });
  });

  describe("g)", () => {
    test("limparIndisponiveis mantém apenas salas disponíveis", () => {
      const salas = clonarSalas();
      const antes = snapshot(salas);

      const resultado = limparIndisponiveis(salas);

      expect(resultado).toHaveLength(2);
      expect(resultado.every((sala) => sala.disponivel)).toBe(true);
      expect(resultado.some((sala) => sala.id === 3)).toBe(false);
      expect(snapshot(salas)).toBe(antes);
    });

    test("limparIndisponiveis retorna lista vazia quando nenhuma sala está disponível", () => {
      const salas = clonarSalas().map((sala) => ({ ...sala, disponivel: false }));

      const resultado = limparIndisponiveis(salas);

      expect(resultado).toEqual([]);
    });

    test("limparIndisponiveis retorna lista vazia ao receber lista vazia", () => {
      const salas = [];

      const resultado = limparIndisponiveis(salas);
      
      expect(resultado).toEqual([]);
    });
  });
});
