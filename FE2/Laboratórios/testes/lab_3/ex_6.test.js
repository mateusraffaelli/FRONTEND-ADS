import { describe, test, expect } from "vitest";
import * as funcoes from "../../lab_3/ex_6.js";

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

function executarCapturandoHOF(funcao, input) {
  const orig = {
    filter: Array.prototype.filter,
    map: Array.prototype.map,
    reduce: Array.prototype.reduce,
    forEach: Array.prototype.forEach,
    push: Array.prototype.push,
  };

  const flags = { filter: 0, map: 0, reduce: 0, forEach: 0, push: 0 };

  Array.prototype.filter = function (...args) {
    flags.filter++;
    return orig.filter.apply(this, args);
  };
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
    Array.prototype.filter = orig.filter;
    Array.prototype.map = orig.map;
    Array.prototype.reduce = orig.reduce;
    Array.prototype.forEach = orig.forEach;
    Array.prototype.push = orig.push;
  }
}

describe("Laboratório 3 - Exercício 6:", () => {
  test("Deve filtrar strings com mais de 5 caracteres e converter para maiúsculas", () => {
    const entrada = ["casa", "janela", "computador", "sol", "amarelo"];
    const { result, flags } = executarCapturandoHOF(fn, entrada);

    expect(result).toEqual(["JANELA", "COMPUTADOR", "AMARELO"]);

    expect(flags.filter + flags.map + flags.reduce).toBeGreaterThan(0);
    expect(flags.forEach).toBe(0);
    expect(flags.push).toBe(0);
  });

  test("Não deve incluir strings com exatamente 5 caracteres", () => {
    const entrada = ["12345", "123456", "abcde", "abcdef"];
    const { result, flags } = executarCapturandoHOF(fn, entrada);

    expect(result).toEqual(["123456", "ABCDEF"]);

    expect(flags.filter + flags.map + flags.reduce).toBeGreaterThan(0);
    expect(flags.forEach).toBe(0);
    expect(flags.push).toBe(0);
  });

  test("Não deve retornar array vazio quando nenhuma string tem mais de 5 caracteres", () => {
    const entrada = ["um", "dois", "tres", "cinco"];
    const { result, flags } = executarCapturandoHOF(fn, entrada);

    expect(result).toEqual([]);

    expect(flags.filter + flags.map + flags.reduce).toBeGreaterThan(0);
    expect(flags.forEach).toBe(0);
    expect(flags.push).toBe(0);
  });

  test("Deve funcionar com array vazio", () => {
    const { result, flags } = executarCapturandoHOF(fn, []);

    expect(result).toEqual([]);

    expect(flags.filter + flags.map + flags.reduce).toBeGreaterThan(0);
    expect(flags.forEach).toBe(0);
    expect(flags.push).toBe(0);
  });

  test("Não deve modificar o array original", () => {
    const entrada = ["banana", "uva", "laranja"];
    const antes = [...entrada];

    const { result, flags } = executarCapturandoHOF(fn, entrada);

    expect(entrada).toEqual(antes);
    expect(result).toEqual(["BANANA", "LARANJA"]);

    expect(flags.filter + flags.map + flags.reduce).toBeGreaterThan(0);
    expect(flags.forEach).toBe(0);
    expect(flags.push).toBe(0);
  });

  test("Deve manter a ordem relativa dos elementos filtrados", () => {
    const entrada = ["zzzzzz", "a", "bbbbbb", "ccccc", "ddddddd"];
    const { result, flags } = executarCapturandoHOF(fn, entrada);

    expect(result).toEqual(["ZZZZZZ", "BBBBBB", "DDDDDDD"]);

    expect(flags.filter + flags.map + flags.reduce).toBeGreaterThan(0);
    expect(flags.forEach).toBe(0);
    expect(flags.push).toBe(0);
  });
});
