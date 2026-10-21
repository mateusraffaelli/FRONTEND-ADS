import { describe, test, expect } from "vitest";
import { Animal } from "../../lab_2/ex_3.js";

describe("Laboratório 2 - Exercício 3:", () => {
  test("Deve exportar Animal como classe/função", () => {
    expect(Animal).toBeTruthy();
    expect(typeof Animal).toBe("function");
  });

  test("Não deve permitir instanciar Animal diretamente (classe abstrata)", () => {
    expect(() => new Animal("mamífero", "Rex", "au au")).toThrow();
  });

  test("Deve ter getters e setters para tipo, nome e som", () => {
    const dTipo = Object.getOwnPropertyDescriptor(Animal.prototype, "tipo");
    const dNome = Object.getOwnPropertyDescriptor(Animal.prototype, "nome");
    const dSom = Object.getOwnPropertyDescriptor(Animal.prototype, "som");

    expect(typeof dTipo?.get).toBe("function");
    expect(typeof dTipo?.set).toBe("function");

    expect(typeof dNome?.get).toBe("function");
    expect(typeof dNome?.set).toBe("function");

    expect(typeof dSom?.get).toBe("function");
    expect(typeof dSom?.set).toBe("function");
  });

  test("Os métodos 'abstratos' da classe base devem lançar erro", () => {
    expect(() => Animal.prototype.emitirSom.call({})).toThrow();
    expect(() => Animal.prototype.locomover.call({})).toThrow();
    expect(() => Animal.prototype.comer.call({})).toThrow();
    expect(() => Animal.prototype.informarTipo.call({})).toThrow();
  });

  test("Deve possuir método estático getQuantidade() e contador deve incrementar a cada instância criada", () => {
    expect(typeof Animal.getQuantidade).toBe("function");

    class Cachorro extends Animal {
      emitirSom() {
        return this.som;
      }
      locomover() {
        return "correndo";
      }
      comer() {
        return "ração";
      }
      informarTipo() {
        return this.tipo;
      }
    }

    const base = Animal.getQuantidade();
    expect(Number.isFinite(base)).toBe(true);

    const a1 = new Cachorro("mamífero", "Rex", "au au");
    expect(Animal.getQuantidade()).toBe(base + 1);

    const a2 = new Cachorro("mamífero", "Bob", "au au");
    expect(Animal.getQuantidade()).toBe(base + 2);
  });
});
