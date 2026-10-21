import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

describe("Laboratório 7 - Exercício 1", () => {
  test("deve definir e exportar o tipo Produto", () => {
    const codigo = readFileSync("./lab_7/src/produto.ts", "utf-8");

    expect(codigo).toMatch(/type\s+Produto\s*=/);
    expect(codigo).toMatch(/export\s*\{[^}]*type\s+Produto[^}]*\}/);
  });

  test("Produto deve possuir as propriedades solicitadas", () => {
    const codigo = readFileSync("./lab_7/src/produto.ts", "utf-8");

    expect(codigo).toMatch(/id\s*:\s*number/);
    expect(codigo).toMatch(/nome\s*:\s*string/);
    expect(codigo).toMatch(/categoria\s*:\s*string/);
    expect(codigo).toMatch(/preco\s*:\s*number/);
    expect(codigo).toMatch(/disponivel\s*:\s*boolean/);
  });
});
