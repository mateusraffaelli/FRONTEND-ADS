import { describe, test, expect } from "vitest";
import * as funcoes from "../../lab_3/ex_4.js";

function pegarFuncao(modulo) {
  if (typeof modulo.default === "function") return modulo.default;

  const funcoes = Object.entries(modulo)
    .filter(([k, v]) => k !== "default" && typeof v === "function")
    .map(([, v]) => v);

  if (funcoes.length === 1) return funcoes[0];

  throw new Error(
    "Não foi possível identificar a função. Exporte apenas UMA função.",
  );
}

const fn = pegarFuncao(funcoes);

function executarCapturandoReduce(funcao, input) {
  const orig = {
    reduce: Array.prototype.reduce,
    map: Array.prototype.map,
    forEach: Array.prototype.forEach,
    push: Array.prototype.push,
  };

  const flags = { reduce: 0, map: 0, forEach: 0, push: 0 };

  Array.prototype.reduce = function (...args) {
    flags.reduce++;
    return orig.reduce.apply(this, args);
  };
  Array.prototype.map = function (...args) {
    flags.map++;
    return orig.map.apply(this, args);
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
    Array.prototype.reduce = orig.reduce;
    Array.prototype.map = orig.map;
    Array.prototype.forEach = orig.forEach;
    Array.prototype.push = orig.push;
  }
}

describe("Laboratório 3 - Exercício 4:", () => {
  test("Deve retornar o maior elemento de um array de inteiros", () => {
    const { result, flags } = executarCapturandoReduce(fn, [1, 9, 3, 7, 2]);

    expect(result).toBe(9);
    expect(flags.reduce).toBeGreaterThan(0);
  });

  test("Deve funcionas com números negativos", () => {
    const { result, flags } = executarCapturandoReduce(fn, [-10, -3, -50, -7]);

    expect(result).toBe(-3);
    expect(flags.reduce).toBeGreaterThan(0);
  });

  test("Deve funcionar com valores decimais", () => {
    const { result, flags } = executarCapturandoReduce(
      fn,
      [1.2, 3.4, 3.39, 3.41],
    );

    expect(result).toBeCloseTo(3.41, 12);
    expect(flags.reduce).toBeGreaterThan(0);
  });

  test("Não deve modificar o array original", () => {
    const arr = [5, 1, 5, 2];
    const antes = [...arr];

    const { result, flags } = executarCapturandoReduce(fn, arr);

    expect(arr).toEqual(antes);
    expect(result).toBe(5);
    expect(flags.reduce).toBeGreaterThan(0);
  });

  test("Deve funcionar com array com um único elemento", () => {
    const { result, flags } = executarCapturandoReduce(fn, [42]);

    expect(result).toBe(42);
    expect(flags.reduce).toBeGreaterThan(0);
  });

  test("Deve utilzar reduce em vez de uma abordagem imperativa", () => {
    const { result, flags } = executarCapturandoReduce(fn, [2, 8, 4]);

    expect(result).toBe(8);
    expect(flags.reduce).toBeGreaterThan(0);
    expect(flags.forEach).toBe(0);
    expect(flags.push).toBe(0);
    expect(flags.map).toBe(0);
  });

  test("Deve retornar o valor máximo, independentemente da posição (caso de empate)", () => {
    const { result, flags } = executarCapturandoReduce(fn, [7, 1, 7, 3]);

    expect(result).toBe(7);
    expect(flags.reduce).toBeGreaterThan(0);
  });
});
