import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import * as funcoes from "../../lab_3/ex_8.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const arquivoExercicio = path.resolve(__dirname, "../../lab_3/ex_8.js");
const fibonacci = pegarFuncao(funcoes);

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

function pegarFuncao(modulo) {
  if (typeof modulo.default === "function") return modulo.default;

  const funcoes = Object.entries(modulo)
    .filter(([k, v]) => k !== "default" && typeof v === "function")
    .map(([, v]) => v);

  if (funcoes.length === 1) return funcoes[0];

  throw new Error(
    "Nao foi possivel identificar a funcao. Exporte apenas UMA funcao.",
  );
}

describe("Laboratorio 3 - Exercicio 8:", () => {
  test("Deve calcular os casos base da sequencia de Fibonacci", () => {
    expect(fibonacci(0)).toBe(0);
    expect(fibonacci(1)).toBe(1);
  });

  test("Deve calcular os primeiros numeros da sequencia", () => {
    const esperados = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

    expect(esperados.map((_, n) => fibonacci(n))).toEqual(esperados);
  });

  test("Deve calcular valores maiores corretamente", () => {
    expect(fibonacci(20)).toBe(6765);
    expect(fibonacci(30)).toBe(832040);
    expect(fibonacci(40)).toBe(102334155);
  });

  test("Chamadas repetidas devem retornar sempre o mesmo resultado", () => {
    expect(fibonacci(35)).toBe(9227465);
    expect(fibonacci(35)).toBe(9227465);
    expect(fibonacci(36)).toBe(14930352);
  });

  test("Deve usar memoization para armazenar resultados ja calculados", () => {
    const codigo = readFileSync(arquivoExercicio, "utf-8");

    expect(usaMemoization(codigo)).toBe(true);
  });
});
