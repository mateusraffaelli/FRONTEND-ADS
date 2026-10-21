import { describe, test, expect } from 'vitest';
import * as funcoes from "../../lab_3/ex_13.js";

const multiplicar = funcoes[Object.keys(funcoes)[0]];

describe('Laboratório 3 - Exercício 13:', () => {
  test('Deve multiplicar inteiros positivos', () => {
    expect(multiplicar(3)(4)).toBe(12);
    expect(multiplicar(7)(1)).toBe(7);
  });

  test('Deve funcionar com zero', () => {
    expect(multiplicar(0)(999)).toBe(0);
    expect(multiplicar(42)(0)).toBe(0);
  });

  test('Deve funcionar com negativos', () => {
    expect(multiplicar(-3)(4)).toBe(-12);
    expect(multiplicar(3)(-4)).toBe(-12);
    expect(multiplicar(-3)(-4)).toBe(12);
  });

  test('Deve funcionar com decimais', () => {
    expect(multiplicar(1.5)(2.2)).toBeCloseTo(3.3, 10);
    expect(multiplicar(0.1)(0.2)).toBeCloseTo(0.02, 10);
  });

  test('Deve permitir aplicação parcial com closure (reusar a função retornada)', () => {
    const por10 = multiplicar(10);
    expect(por10(1)).toBe(10);
    expect(por10(5)).toBe(50);
    expect(por10(-3)).toBe(-30);

    const porMeio = multiplicar(0.5);
    expect(porMeio(8)).toBe(4);
    expect(porMeio(3)).toBe(1.5);
  });
  
  test('Deve respeitar idempotência com mesmos argumentos', () => {
    const f = multiplicar(8);
    const r1 = f(7);
    const r2 = f(7);
    expect(r1).toBe(56);
    expect(r2).toBe(56);
  });

  test('Deve manter comportamento atual com não-numéricos ', () => {
    expect(multiplicar('3')(2)).toBe(6);
    expect(Number.isNaN(multiplicar('abc')(2))).toBe(true);
    expect(Number.isNaN(multiplicar(undefined)(2))).toBe(true);
    expect(multiplicar(null)(2)).toBe(0);
    expect(Number.isNaN(multiplicar({})(2))).toBe(true);
  });

  test('Deve respeitar comutatividade via avaliação manual (não pela API)', () => {
    const a = 7, b = 9;
    expect(multiplicar(a)(b)).toBe(a * b);
    expect(multiplicar(b)(a)).toBe(b * a);
  });
});
