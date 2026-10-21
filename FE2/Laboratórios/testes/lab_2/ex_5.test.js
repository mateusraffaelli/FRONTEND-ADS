import { describe, test, expect, vi } from "vitest";

const EX3_PATH = "../../lab_2/ex_3.js";
const EX4_PATH = "../../lab_2/ex_4.js";
const EX5_PATH = "../../lab_2/ex_5.js";

function isSubclassOfAnimal(Ctor, Animal) {
  return typeof Ctor === "function" && Ctor.prototype instanceof Animal;
}

function getExportedSubclasses(modAnimais, Animal) {
  const values = Object.values(modAnimais);
  const unique = [...new Set(values)];
  return unique.filter((v) => isSubclassOfAnimal(v, Animal));
}

function findRunner(ex5mod) {
  const preferred = ["executarEx5", "executar", "main", "run", "start"];
  for (const name of preferred) {
    if (typeof ex5mod[name] === "function") return ex5mod[name];
  }
  if (typeof ex5mod.default === "function") return ex5mod.default;

  for (const v of Object.values(ex5mod)) {
    if (typeof v === "function") return v;
  }
  return null;
}

describe("Laboratório 2 - Exercício 5:", () => {
  test("Deve instanciar pelo menos 3 subclasses de Animal e chamar emitirSom/locomover/comer/informarTipo em cada uma", async () => {
    vi.resetModules();

    const { Animal } = await import(EX3_PATH);
    const modAnimais = await import(EX4_PATH);

    const classes = getExportedSubclasses(modAnimais, Animal);
    expect(classes.length).toBeGreaterThanOrEqual(3);

    const METODOS = ["emitirSom", "locomover", "comer", "informarTipo"];
    const stats = new Map();

    for (const C of classes) {
      const perClass = new Map();
      for (const m of METODOS) {
        expect(typeof C.prototype[m]).toBe("function");

        const orig = C.prototype[m];
        const instances = new Set();
        perClass.set(m, instances);

        vi.spyOn(C.prototype, m).mockImplementation(function (...args) {
          instances.add(this);
          return orig.apply(this, args);
        });
      }
      stats.set(C, perClass);
    }

    const ex5mod = await import(EX5_PATH);

    const runner = findRunner(ex5mod);
    if (runner) runner();

    let classesCompletas = 0;
    let totalChamadas = 0;

    for (const [C, perClass] of stats.entries()) {
      const ok = METODOS.every((m) => perClass.get(m).size >= 1);

      const callsThisClass = METODOS.reduce(
        (acc, m) => acc + perClass.get(m).size,
        0
      );
      totalChamadas += callsThisClass;

      if (ok) {
        for (const m of METODOS) {
          for (const inst of perClass.get(m)) {
            expect(inst).toBeInstanceOf(C);
            expect(inst.tipo ?? inst._tipo).toBeDefined();
            expect(inst.nome ?? inst._nome).toBeDefined();
            expect(inst.som ?? inst._som).toBeDefined();
          }
        }
        classesCompletas += 1;
      }
    }

    expect(classesCompletas).toBeGreaterThanOrEqual(3);
    expect(totalChamadas).toBeGreaterThanOrEqual(12);
  });
});