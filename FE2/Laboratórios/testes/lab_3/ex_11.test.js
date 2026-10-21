import { describe, expect, test, vi } from "vitest";
import * as funcoes from "../../lab_3/ex_11.js";

const composicao = funcoes[Object.keys(funcoes)[0]];

describe("Laboratório 3 - Exercício 11:", () => {
  test("Deve compor funções numéricas: dobrar ∘ incrementar", () => {
    const dobrar = (x) => x * 2;
    const incrementar = (x) => x + 1;

    const h = composicao(dobrar, incrementar);
    expect(h(3)).toBe(8);
    expect(h(0)).toBe(2);
    expect(h(-2)).toBe(-2);
  });

  test("Deve compor funções de string: toUpperCase ∘ trim", () => {
    const upper = (s) => s.toUpperCase();
    const trim = (s) => s.trim();

    const format = composicao(upper, trim);
    expect(format("  ifsc ")).toBe("IFSC");
  });

  test("Deve manter a identidade à esquerda e à direita", () => {
    const identidade = (x) => x;
    const potencia = (x) => x ** 2;

    const fDepoisId = composicao(potencia, identidade);
    const idDepoisF = composicao(identidade, potencia);

    expect(fDepoisId(5)).toBe(potencia(5));
    expect(idDepoisF(5)).toBe(potencia(5));
  });

  test("Deve respeitar a associatividade (f ∘ (g ∘ h) = (f ∘ g) ∘ h)", () => {
    const f = (x) => x + 10;
    const g = (x) => x * 3;
    const h = (x) => x - 2;

    const esquerda = composicao(f, composicao(g, h));
    const direita = composicao(composicao(f, g), h);

    for (const x of [-5, 0, 2, 7, 13]) {
      expect(esquerda(x)).toBe(direita(x));
    }
  });

  test("Deve respeitar a kordem das chamadas: g(x) antes de f(…); cada uma chamada uma vez", () => {
    const f = vi.fn((y) => y + 100);
    const g = vi.fn((x) => x * 4);

    const h = composicao(f, g);
    const result = h(5);

    expect(result).toBe(5 * 4 + 100);

    // Chamadas únicas
    expect(g).toHaveBeenCalledTimes(1);
    expect(f).toHaveBeenCalledTimes(1);

    // Ordem: g primeiro
    expect(g.mock.invocationCallOrder[0]).toBeLessThan(
      f.mock.invocationCallOrder[0]
    );

    // Argumentos corretos
    expect(g).toHaveBeenCalledWith(5);
    expect(f).toHaveBeenCalledWith(20);
  });

  test("Deve fazer avaliação preguiçosa: nada é chamado até invocar a função resultante", () => {
    const f = vi.fn((x) => x);
    const g = vi.fn((x) => x);
    const h = composicao(f, g);

    // Até aqui nada foi chamado
    expect(f).not.toHaveBeenCalled();
    expect(g).not.toHaveBeenCalled();

    // Agora chama
    h("ok");

    expect(g).toHaveBeenCalledTimes(1);
    expect(f).toHaveBeenCalledTimes(1);
  });

  test("Deve funcionar com tipos mistos (ex.: extrair campo e transformar)", () => {
    const getName = (obj) => obj.name;
    const len = (s) => s.length;

    const nameLen = composicao(len, getName);
    expect(nameLen({ name: "Adriano" })).toBe(7);
  });

  test("Deve capturar f, g do momento da composição (escopo/fechamento)", () => {
    let fVar = (x) => x + 1;
    let gVar = (x) => x * 2;

    const h = composicao(fVar, gVar);

    fVar = (x) => x + 1000;
    gVar = (x) => x * 1000;

    expect(h(3)).toBe(7);
  });

  test("Deve lançar erro em tempo de execução se f não for função", () => {
    // A implementação não valida tipos; o erro ocorre ao tentar chamar f(…)
    const notAFunction = 123;
    const g = (x) => x;
    const h = composicao(notAFunction, g);
    expect(() => h(1)).toThrow(TypeError);
  });

  test("Deve lançar erro em tempo de execução se g não for função", () => {
    const f = (x) => x;
    const notAFunction = null;
    const h = composicao(f, notAFunction);
    expect(() => h(1)).toThrow(TypeError);
  });

  test.each([{ x: 0 }, { x: 1 }, { x: -3 }, { x: 2.5 }])(
    "Tabela de casos: dobrar ∘ incrementar ($x)",
    ({ x }) => {
      const dobrar = (n) => n * 2;
      const inc = (n) => n + 1;
      expect(composicao(dobrar, inc)(x)).toBe(dobrar(inc(x)));
    }
  );
});
