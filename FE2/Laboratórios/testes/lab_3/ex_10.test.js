import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import * as funcoes from "../../lab_3/ex_10.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const arquivoExercicio = path.resolve(__dirname, "../../lab_3/ex_10.js");
const somaArrayAninhado = funcoes[Object.keys(funcoes)[0]];

function removerComentarios(codigo) {
  return codigo
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function contemLoopImperativo(codigo) {
  const codigoSemComentarios = removerComentarios(codigo);

  return (
    /\bfor\s*\(/.test(codigoSemComentarios) ||
    /\bwhile\s*\(/.test(codigoSemComentarios) ||
    /\bdo\s*\{/.test(codigoSemComentarios) ||
    /\.forEach\s*\(/.test(codigoSemComentarios)
  );
}

describe('Laboratório 3 - Exercício 10:', () => {
  test('Deve somar um array simples (sem aninhamento)', () => {
    expect(somaArrayAninhado([1, 2, 3, 4])).toBe(10);
  });

  test('Deve somar com aninhamento de um nível', () => {
    expect(somaArrayAninhado([1, [2, 3], 4])).toBe(10);
  });

  test('Deve somar com aninhamento de múltiplos níveis', () => {
    expect(somaArrayAninhado([1, [2, [3, [4]]]])).toBe(10);
  });

  test('Deve lidar com arrays vazios', () => {
    expect(somaArrayAninhado([])).toBe(0);
    expect(somaArrayAninhado([[], []])).toBe(0);
    expect(somaArrayAninhado([1, [], [2, []], 3])).toBe(6);
  });

  test('Deve funcionar com números negativos e zero', () => {
    expect(somaArrayAninhado([-1, [-2, [3]], 0])).toBe(0);
  });

  test('Deve funcionar com números decimais', () => {
    const resultado = somaArrayAninhado([1.1, [2.2, [3.3]]]); // 6.6
    expect(resultado).toBeCloseTo(6.6, 10);
  });

  test('Não deve alterar o array de entrada (imutabilidade superficial)', () => {
    const input = [1, [2, 3]];
    const snapshot = JSON.parse(JSON.stringify(input));
    somaArrayAninhado(input);
    expect(input).toEqual(snapshot);
  });

  test('Deve lançar erro se o argumento não for um array (reduce em não-array)', () => {
    expect(() => somaArrayAninhado(null)).toThrow(TypeError);
    expect(() => somaArrayAninhado(42)).toThrow(TypeError);
    expect(() => somaArrayAninhado({ a: 1 })).toThrow(TypeError);
  });

  test('Deve somar com aninhamento relativamente profundo (estresse leve de recursão)', () => {
    const deep = Array.from({ length: 50 }).reduce((acc, _, i) => [i + 1, acc], []); 
    // Estrutura como [1, [2, [3, ...]]] até 50
    const esperado = (50 * (50 + 1)) / 2; // soma 1..50
    expect(somaArrayAninhado(deep)).toBe(esperado);
  });

  test.each([
    { input: [0], esperado: 0 },
    { input: [[[[[0]]]]], esperado: 0 },
    { input: [[1], [2], [3, [4]]], esperado: 10 },
    { input: [10, [-5, [2]], -3], esperado: 4 },
  ])('Tabela de casos: $input => $esperado', ({ input, esperado }) => {
    expect(somaArrayAninhado(input)).toBe(esperado);
  });

  test('Não deve usar loops imperativos', () => {
    const codigo = readFileSync(arquivoExercicio, 'utf-8');

    expect(contemLoopImperativo(codigo)).toBe(false);
  });
});
