import { describe, expect, test } from "vitest";
import formatarPreco from "../../lab_7/src/formatador.js";

describe("Laboratório 7 - Exercício 4", () => {
  test("deve exportar uma função como default", () => {
    expect(typeof formatarPreco).toBe("function");
  });

  test("deve formatar valores monetários em reais", () => {
    const resultado = formatarPreco(1234.5);

    expect(typeof resultado).toBe("string");
    expect(resultado).toMatch(/R\$\s?1\.234,50/);
  });
});
