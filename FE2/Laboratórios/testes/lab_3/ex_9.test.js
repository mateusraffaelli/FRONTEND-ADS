import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import * as funcoes from "../../lab_3/ex_9.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const arquivoExercicio = path.resolve(__dirname, "../../lab_3/ex_9.js");
const potencia = pegarFuncaoPotencia(funcoes);

function removerComentarios(codigo) {
  return codigo
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
}

function usaMemoization(codigo) {
  const codigoSemComentarios = removerComentarios(codigo);
  const criaCache =
    /new\s+(Weak)?Map\s*\(/i.test(codigoSemComentarios) ||
    /(?:cache|memo)\w*\s*=\s*(?:\{\s*\}|\[\s*\]|new\s+(Weak)?Map\s*\()/i.test(
      codigoSemComentarios,
    );
  const consultaCache =
    /\.has\s*\(/.test(codigoSemComentarios) ||
    /\bhasOwn(Property)?\s*\(/.test(codigoSemComentarios) ||
    /\bin\b/.test(codigoSemComentarios) ||
    /(?:cache|memo)\w*\s*\[[^\]]+\]/i.test(codigoSemComentarios);
  const armazenaCache =
    /\.set\s*\(/.test(codigoSemComentarios) ||
    /(?:cache|memo)\w*\s*\[[^\]]+\]\s*=/i.test(codigoSemComentarios);

  return criaCache && consultaCache && armazenaCache;
}

function pegarFuncaoPotencia(modulo) {
  if (typeof modulo.default === "function") return normalizarFuncao(modulo.default);

  const funcoes = Object.entries(modulo)
    .filter(([k, v]) => k !== "default" && typeof v === "function")
    .map(([, v]) => v);

  if (funcoes.length === 1) return normalizarFuncao(funcoes[0]);

  throw new Error(
    "Nao foi possivel identificar a funcao. Exporte apenas UMA funcao.",
  );
}

function normalizarFuncao(funcao) {
  const resultado = funcao(2, 3);

  if (resultado === 8) return funcao;
  if (typeof resultado === "function") return resultado;

  return funcao;
}

describe("Laboratorio 3 - Exercicio 9:", () => {
  test("Deve calcular potencias com expoentes positivos", () => {
    expect(potencia(2, 3)).toBe(8);
    expect(potencia(2, 10)).toBe(1024);
    expect(potencia(3, 5)).toBe(243);
    expect(potencia(10, 4)).toBe(10000);
  });

  test("Deve retornar 1 quando o expoente for zero", () => {
    expect(potencia(2, 0)).toBe(1);
    expect(potencia(10, 0)).toBe(1);
    expect(potencia(-3, 0)).toBe(1);
  });

  test("Deve funcionar com base zero, base um e bases negativas", () => {
    expect(potencia(0, 5)).toBe(0);
    expect(potencia(1, 100)).toBe(1);
    expect(potencia(-2, 3)).toBe(-8);
    expect(potencia(-2, 4)).toBe(16);
  });

  test("Deve funcionar com bases decimais", () => {
    expect(potencia(1.5, 2)).toBeCloseTo(2.25, 12);
    expect(potencia(0.5, 3)).toBeCloseTo(0.125, 12);
  });

  test("Chamadas repetidas devem retornar sempre o mesmo resultado", () => {
    expect(potencia(2, 12)).toBe(4096);
    expect(potencia(2, 12)).toBe(4096);
    expect(potencia(2, 13)).toBe(8192);
  });

  test("Deve usar memoization para armazenar potenciacoes anteriores", () => {
    const codigo = readFileSync(arquivoExercicio, "utf-8");

    expect(usaMemoization(codigo)).toBe(true);
  });
});
