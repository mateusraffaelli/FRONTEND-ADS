import { describe, test, expect } from "vitest";
import * as funcoes from "../../lab_3/ex_5.js";

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

function executarCapturandoMFR(funcao, input) {
  const orig = {
    map: Array.prototype.map,
    filter: Array.prototype.filter,
    reduce: Array.prototype.reduce,
    forEach: Array.prototype.forEach,
    push: Array.prototype.push,
  };

  const flags = { map: 0, filter: 0, reduce: 0, forEach: 0, push: 0 };

  Array.prototype.map = function (...args) {
    flags.map++;
    return orig.map.apply(this, args);
  };
  Array.prototype.filter = function (...args) {
    flags.filter++;
    return orig.filter.apply(this, args);
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
    Array.prototype.filter = orig.filter;
    Array.prototype.reduce = orig.reduce;
    Array.prototype.forEach = orig.forEach;
    Array.prototype.push = orig.push;
  }
}

describe("Laboratório 3 - Exercício 5:", () => {
  test("Deve calcular a soma dos pares ao quadrado", () => {
    const { result, flags } = executarCapturandoMFR(fn, [1, 2, 3, 4, 5, 6]);

    expect(result).toBe(56);

    expect(flags.filter).toBeGreaterThan(0);
    expect(flags.map).toBeGreaterThan(0);
    expect(flags.reduce).toBeGreaterThan(0);
  });

  test("Deve ignorar ímpares e lidar com negativos", () => {
    const { result, flags } = executarCapturandoMFR(fn, [-3, -2, -1, 1, 3, 4]);

    expect(result).toBe(20);

    expect(flags.filter).toBeGreaterThan(0);
    expect(flags.map).toBeGreaterThan(0);
    expect(flags.reduce).toBeGreaterThan(0);
  });

  test("Deve retornar 0 quando não há pares", () => {
    const { result, flags } = executarCapturandoMFR(fn, [1, 3, 5, 7]);

    expect(result).toBe(0);

    expect(flags.filter).toBeGreaterThan(0);
    expect(flags.map).toBeGreaterThan(0);
    expect(flags.reduce).toBeGreaterThan(0);
  });

  test("Deve funcionar com array vazio", () => {
    const { result, flags } = executarCapturandoMFR(fn, []);

    expect(result).toBe(0);

    expect(flags.filter).toBeGreaterThan(0);
    expect(flags.map).toBeGreaterThan(0);
    expect(flags.reduce).toBeGreaterThan(0);
  });

  test("Não deve modificar o array original", () => {
    const arr = [2, 3, 4];
    const antes = [...arr];

    const { result, flags } = executarCapturandoMFR(fn, arr);

    expect(arr).toEqual(antes);
    expect(result).toBe(20);

    expect(flags.filter).toBeGreaterThan(0);
    expect(flags.map).toBeGreaterThan(0);
    expect(flags.reduce).toBeGreaterThan(0);
  });

  test("Deve utilizar map + filter + reduce em vez de uma abordagem imperativa", () => {
    const { result, flags } = executarCapturandoMFR(fn, [2, 8, 1]);

    expect(result).toBe(68);

    expect(flags.filter).toBeGreaterThan(0);
    expect(flags.map).toBeGreaterThan(0);
    expect(flags.reduce).toBeGreaterThan(0);

    expect(flags.forEach).toBe(0);
    expect(flags.push).toBe(0);
  });
});
