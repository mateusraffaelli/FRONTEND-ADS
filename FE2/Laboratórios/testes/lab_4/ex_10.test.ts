import { describe, expect, test } from "vitest";
import * as ts from "typescript";
import { Animal, Cachorro, Gato, Passaro } from "../../lab_4/src/ex_10";
import { collectNodes, getSourceFile } from "./ast-helpers";

function getClass(sourceFile: ts.SourceFile, className: string) {
  return collectNodes(sourceFile, ts.isClassDeclaration).find(
    (declaration) => declaration.name?.text === className,
  );
}

function isAbstractClass(declaration: ts.ClassDeclaration | undefined) {
  return declaration?.modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.AbstractKeyword,
  );
}

function classExtendsAnimal(declaration: ts.ClassDeclaration | undefined) {
  return declaration?.heritageClauses?.some(
    (clause) =>
      clause.token === ts.SyntaxKind.ExtendsKeyword &&
      clause.types.some((type) => type.expression.getText() === "Animal"),
  );
}

describe("Laboratório 4 - Exercício 10", () => {
  test("Deve converter Animal para uma classe abstrata em TypeScript", () => {
    const sourceFile = getSourceFile("ex_10.ts");

    const animalClass = getClass(sourceFile, "Animal");

    expect(animalClass).toBeDefined();
    expect(isAbstractClass(animalClass)).toBe(true);
  });

  test("Deve converter Cachorro, Gato e Passaro estendendo Animal", () => {
    const sourceFile = getSourceFile("ex_10.ts");

    const classes = ["Cachorro", "Gato", "Passaro"].map((className) =>
      getClass(sourceFile, className),
    );

    expect(classes.every((declaration) => classExtendsAnimal(declaration))).toBe(true);
  });

  test("Deve manter o comportamento da classe Cachorro", () => {
    const cachorro = new Cachorro("mamífero", "Rex");

    expect(cachorro.nome).toBe("Rex");
    expect(cachorro.informarTipo()).toBe("mamífero");
    expect(cachorro.emitirSom()).toBe("au au");
    expect(cachorro.locomover()).toBe("correndo");
    expect(cachorro.comer()).toBe("ração");
  });

  test("Deve manter o comportamento da classe Gato", () => {
    const gato = new Gato("mamífero", "Mia");

    expect(gato.nome).toBe("Mia");
    expect(gato.informarTipo()).toBe("mamífero");
    expect(gato.emitirSom()).toBe("miau");
    expect(gato.locomover()).toBe("andando");
    expect(gato.comer()).toBe("ração de gato");
  });

  test("Deve manter o comportamento da classe Passaro", () => {
    const passaro = new Passaro("ave", "Piu-Piu");

    expect(passaro.nome).toBe("Piu-Piu");
    expect(passaro.informarTipo()).toBe("ave");
    expect(passaro.emitirSom()).toBe("piu piu");
    expect(passaro.locomover()).toBe("voando");
    expect(passaro.comer()).toBe("sementes");
  });

  test("Deve manter o contador estático de animais", () => {
    const quantidadeAntes = Animal.getQuantidade();

    new Cachorro("mamífero", "Bob");
    new Gato("mamífero", "Nina");
    new Passaro("ave", "Loro");

    expect(Animal.getQuantidade()).toBe(quantidadeAntes + 3);
  });
});
