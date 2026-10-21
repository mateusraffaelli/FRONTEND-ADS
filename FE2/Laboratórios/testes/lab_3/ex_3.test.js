import { describe, test, expect, vi } from "vitest";
import * as funcoes from "../../lab_3/ex_3.js";

const aumentarPreco = funcoes[Object.keys(funcoes)[0]];

function executarCapturandoFP(funcao, input) {
  const orig = {
    map: Array.prototype.map,
    reduce: Array.prototype.reduce,
    forEach: Array.prototype.forEach,
    push: Array.prototype.push,
  };

  const flags = { map: 0, reduce: 0, forEach: 0, push: 0 };

  Array.prototype.map = function (...args) {
    flags.map++;
    return orig.map.apply(this, args);
  };
  Array.prototype.reduce = function (...args) {
    flags.reduce++;
    return orig.reduce.apply(this, args);
  };
  Array.prototype.forEach = function (...args) {
    flags.forEach++;
    return orig.forEach.apply(this, args);
  };
  Array.prototype.push = function (...args) {
    flags.push++;
    return orig.push.apply(this, args);
  };

  try {
    const result = funcao(input);
    return { result, flags };
  } finally {
    Array.prototype.map = orig.map;
    Array.prototype.reduce = orig.reduce;
    Array.prototype.forEach = orig.forEach;
    Array.prototype.push = orig.push;
  }
}

describe("Laboratório 3 - Exercício 3:", () => {
  test("Deve retornar novo array com preços aumentados em 10% sem alterar o original", () => {
    const produtos = [
      { nome: "A", preco: 100 },
      { nome: "B", preco: 59.9 },
      { nome: "C", preco: 0 },
    ];

    const snapshot = JSON.parse(JSON.stringify(produtos));
    Object.freeze(produtos);
    produtos.forEach(Object.freeze);

    const { result } = executarCapturandoFP(aumentarPreco, produtos);

    expect(produtos).toEqual(snapshot);
    expect(result).not.toBe(produtos);

    expect(result).toHaveLength(3);
    expect(result.map((p) => p.nome)).toEqual(["A", "B", "C"]);

    expect(result[0].preco).toBeCloseTo(110, 10);
    expect(result[1].preco).toBeCloseTo(59.9 * 1.1, 10);
    expect(result[2].preco).toBeCloseTo(0, 10);
  });

  test("Deve retornar novos objetos sem reaproveitar as referências originais", () => {
    const produtos = [
      { nome: "A", preco: 100 },
      { nome: "B", preco: 50 },
    ];

    const { result } = executarCapturandoFP(aumentarPreco, produtos);

    expect(result[0]).not.toBe(produtos[0]);
    expect(result[1]).not.toBe(produtos[1]);
  });

  test("Deve utilizar programação funcional", () => {
    const produtos = [
      { nome: "A", preco: 100 },
      { nome: "B", preco: 50 },
    ];

    const { flags } = executarCapturandoFP(aumentarPreco, produtos);

    expect(flags.map + flags.reduce).toBeGreaterThan(0);
    expect(flags.forEach).toBe(0);
    expect(flags.push).toBe(0);
  });

  test("Deve funcionar com array vazio", () => {
    const { result, flags } = executarCapturandoFP(aumentarPreco, []);
    expect(result).toEqual([]);
    expect(flags.map + flags.reduce).toBeGreaterThan(0);
  });
});
