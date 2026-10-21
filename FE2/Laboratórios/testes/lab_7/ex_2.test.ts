import { describe, expect, test } from "vitest";
import { catalogo } from "../../lab_7/src/catalogo.js";

describe("Laboratório 7 - Exercício 2", () => {
  test("deve exportar uma lista inicial com pelo menos cinco produtos", () => {
    expect(Array.isArray(catalogo)).toBe(true);
    expect(catalogo.length).toBeGreaterThanOrEqual(5);

    for (const produto of catalogo) {
      expect(typeof produto.id).toBe("number");
      expect(typeof produto.nome).toBe("string");
      expect(typeof produto.categoria).toBe("string");
      expect(typeof produto.preco).toBe("number");
      expect(typeof produto.disponivel).toBe("boolean");
    }
  });

  test("deve possuir pelo menos um produto indisponível", () => {
    expect(catalogo.some((produto) => produto.disponivel === false)).toBe(true);
  });
});
