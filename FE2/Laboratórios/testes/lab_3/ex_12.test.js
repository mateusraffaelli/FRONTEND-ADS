import { describe, test, expect } from "vitest";
import * as funcoes from "../../lab_3/ex_12.js";

const gerarSequencia = funcoes[Object.keys(funcoes)[0]];

describe("Laboratório 3 - Exercício 12:", () => {
  test('Deve retornar "inicio" na primeira chamada e somar "passo" nas subsequentes', () => {
    const prox = gerarSequencia(10, 5);
    expect(prox()).toBe(10);
    expect(prox()).toBe(15);
    expect(prox()).toBe(20);
    expect(prox()).toBe(25);
  });

  test("Deve manter o estado via closure (geradores independentes não interferem)", () => {
    const a = gerarSequencia(0, 2);
    const b = gerarSequencia(100, 10);

    expect(a()).toBe(0);
    expect(a()).toBe(2);
    expect(a()).toBe(4);

    expect(b()).toBe(100);
    expect(b()).toBe(110);
    expect(b()).toBe(120);

    expect(a()).toBe(6);
    expect(b()).toBe(130);
  });

  test("Deve funcionar com números negativos (inicio e/ou passo)", () => {
    const s1 = gerarSequencia(-5, 3);
    expect(s1()).toBe(-5);
    expect(s1()).toBe(-2);
    expect(s1()).toBe(1);

    const s2 = gerarSequencia(10, -4);
    expect(s2()).toBe(10);
    expect(s2()).toBe(6);
    expect(s2()).toBe(2);
  });

  test("Deve dar passo decimal", () => {
    const prox = gerarSequencia(1, 0.1);
    expect(prox()).toBeCloseTo(1.0, 10);
    expect(prox()).toBeCloseTo(1.1, 10);
    expect(prox()).toBeCloseTo(1.2, 10);
  });

  test('Deve gerar sequência constante igual a "inicio" com passo zero', () => {
    const prox = gerarSequencia(42, 0);
    expect(prox()).toBe(42);
    expect(prox()).toBe(42);
    expect(prox()).toBe(42);
  });

  test("Deve validar a progressão aritmética em várias chamadas (estresse leve)", () => {
    const inicio = 7;
    const passo = 3;
    const prox = gerarSequencia(inicio, passo);

    for (let i = 0; i < 50; i++) {
      const esperado = inicio + i * passo;
      expect(prox()).toBe(esperado);
    }
  });
});
