import { describe, expect, vi, beforeEach, afterEach, test } from "vitest";
import { carro } from "../../lab_2/ex_1.js";

describe("Laboratório 2 - Exercício 1:", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Deve criar um objeto com as propriedades ano, modelo e marca", () => {
    const c = carro(2014, "Gol bolinha", "Volks");

    expect(c.ano).toBe(2014);
    expect(c.modelo).toBe("Gol bolinha");
    expect(c.marca).toBe("Volks");
  });

  test("Deve usar uma propriedade de carro como protótipo do objeto criado", () => {
    const c = carro(2020, "Civic", "Honda");
    const nomeProto = Object.keys(carro)[0];

    expect(Object.getPrototypeOf(c)).toBe(carro[nomeProto]);
  });

  test("Deve ter os métodos andar, buzinar e virar no protótipo", () => {
    const nomeProto = Object.keys(carro)[0];

    expect(typeof carro[nomeProto].andar).toBe("function");
    expect(typeof carro[nomeProto].buzinar).toBe("function");
    expect(typeof carro[nomeProto].virar).toBe("function");
  });

  test("Não deve criar os métodos como propriedades próprias do objeto (devem vir do protótipo)", () => {
    const c = carro(2020, "Civic", "Honda");

    expect(Object.hasOwn(c, "andar")).toBe(false);
    expect(Object.hasOwn(c, "buzinar")).toBe(false);
    expect(Object.hasOwn(c, "virar")).toBe(false);
  });

  test("Duas instâncias devem compartilhar os mesmos métodos (mesma referência)", () => {
    const a = carro(2014, "Gol bolinha", "Volks");
    const b = carro(2020, "Civic", "Honda");

    expect(a.andar).toBe(b.andar);
    expect(a.buzinar).toBe(b.buzinar);
    expect(a.virar).toBe(b.virar);
  });

  test("Alterar uma instância não deve afetar a outra (propriedades independentes)", () => {
    const a = carro(2014, "Gol bolinha", "Volks");
    const b = carro(2020, "Civic", "Honda");

    a.modelo = "Uno";

    expect(a.modelo).toBe("Uno");
    expect(b.modelo).toBe("Civic");
  });
});
