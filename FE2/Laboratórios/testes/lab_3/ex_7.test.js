import { describe, test, expect } from "vitest";
import * as funcoes from "../../lab_3/ex_7.js";

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

const incrementarPor = pegarFuncao(funcoes);

describe("Laboratório 3 - Exercício 7:", () => {
  test("incrementarPor(5) deve retornar uma função", () => {
    const inc5 = incrementarPor(5);
    expect(typeof inc5).toBe("function");
  });

  test("A função retornada deve somar o incremento fixo ao valor recebido", () => {
    const inc5 = incrementarPor(5);
    expect(inc5(10)).toBe(15);
    expect(inc5(0)).toBe(5);
    expect(inc5(-2)).toBe(3);
  });

  test("Incrementos diferentes devem geram funções diferentes", () => {
    const inc2 = incrementarPor(2);
    const inc10 = incrementarPor(10);

    expect(inc2(7)).toBe(9);
    expect(inc10(7)).toBe(17);
  });

  test("Não deve manter estado interno entre chamadas", () => {
    const inc3 = incrementarPor(3);

    expect(inc3(10)).toBe(13);
    expect(inc3(10)).toBe(13);
    expect(inc3(1)).toBe(4);
    expect(inc3(1)).toBe(4);
  });

  test("Deve funcionar com incrementos negativos", () => {
    const dec4 = incrementarPor(-4);
    expect(dec4(10)).toBe(6);
    expect(dec4(-1)).toBe(-5);
  });

  test("Deve funcionar com valores decimais", () => {
    const inc05 = incrementarPor(0.5);
    expect(inc05(1.2)).toBeCloseTo(1.7, 12);
  });

  test("O valor do incremento deve ser capturado na função retornada", () => {
    let n = 5;
    const incN = incrementarPor(n);

    n = 100;

    expect(incN(10)).toBe(15);
  });
});
