import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { Animal } from "../../lab_2/ex_3.js";
import * as modAnimais from "../../lab_2/ex_4.js";

function isSubclassOfAnimal(Ctor) {
  return (
    typeof Ctor === "function" &&
    Ctor.prototype &&
    (Ctor.prototype instanceof Animal)
  );
}

function getExportedAnimalClasses(moduleExports) {
  const values = Object.values(moduleExports);
  const unique = [...new Set(values)];
  return unique.filter(isSubclassOfAnimal);
}

describe("Laboratório 2 - Exercício 4:", () => {
  let logSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Deve exportar pelo menos 3 classes diferentes que estendem Animal", () => {
    const classes = getExportedAnimalClasses(modAnimais);

    expect(classes.length).toBeGreaterThanOrEqual(3);

    const nomes = classes.map((C) => C.name);
    expect(new Set(nomes).size).toBeGreaterThanOrEqual(3);
  });

  test("Cada classe deve poder ser instanciada e definir tipo, nome e som no construtor", () => {
    const classes = getExportedAnimalClasses(modAnimais);
    expect(classes.length).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < 3; i++) {
      const C = classes[i];
      const tipo = `tipo-${i}`;
      const nome = `nome-${i}`;
      const som = `som-${i}`;

      const a = new C(tipo, nome, som);

      expect(a).toBeInstanceOf(Animal);
      expect(a.tipo).toBe(tipo);
      expect(a.nome).toBe(nome);
      expect(a.som).toBe(som);
    }
  });

  test("Cada classe deve implementar os métodos emitirSom, locomover, comer e informarTipo", () => {
    const classes = getExportedAnimalClasses(modAnimais);
    expect(classes.length).toBeGreaterThanOrEqual(3);

    const metodos = ["emitirSom", "locomover", "comer", "informarTipo"];

    for (let i = 0; i < 3; i++) {
      const C = classes[i];
      const a = new C(`tipo-${i}`, `nome-${i}`, `som-${i}`);

      for (const m of metodos) {
        expect(typeof a[m]).toBe("function");
        expect(C.prototype[m]).not.toBe(Animal.prototype[m]);
        expect(() => a[m]()).not.toThrow();
      }
    }
  });

  test("emitirSom() e informarTipo() devem refletir os dados do animal (por retorno ou console.log)", () => {
    const classes = getExportedAnimalClasses(modAnimais);
    expect(classes.length).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < classes.length; i++) {
      logSpy.mockClear();

      const C = classes[i];
      const tipo = `tipo-${i}`;
      const som = `som-${i}`;
      const a = new C(tipo, `nome-${i}`, som);

      const rSom = a.emitirSom();
      const rTipo = a.informarTipo();

      const somOk = rSom === som || logSpy.mock.calls.flat().some((x) => String(x).includes(som));
      const tipoOk = rTipo === tipo || logSpy.mock.calls.flat().some((x) => String(x).includes(tipo));

      expect(somOk).toBe(true);
      expect(tipoOk).toBe(true);
    }
  });
});