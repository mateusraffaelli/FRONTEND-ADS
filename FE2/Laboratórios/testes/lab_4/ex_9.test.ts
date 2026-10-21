import { describe, expect, test, vi } from "vitest";
import * as ts from "typescript";
import { PilhaArray, demonstrarPilha } from "../../lab_4/src/ex_9";
import { collectNodes, getSourceFile } from "./ast-helpers";

function getPilhaInterface(sourceFile: ts.SourceFile) {
  return collectNodes(sourceFile, ts.isInterfaceDeclaration).find(
    (declaration) => declaration.name.text === "Pilha",
  );
}

function getPilhaClass(sourceFile: ts.SourceFile) {
  return collectNodes(sourceFile, ts.isClassDeclaration).find(
    (declaration) => declaration.name?.text === "PilhaArray",
  );
}

function classImplementsPilha(declaration: ts.ClassDeclaration | undefined) {
  return declaration?.heritageClauses?.some(
    (clause) =>
      clause.token === ts.SyntaxKind.ImplementsKeyword &&
      clause.types.some((type) => type.expression.getText() === "Pilha"),
  );
}

describe("Laboratório 4 - Exercício 9", () => {
  test("Deve definir uma interface genérica chamada Pilha", () => {
    const sourceFile = getSourceFile("ex_9.ts");

    const pilhaInterface = getPilhaInterface(sourceFile);
    const typeParameterCount = pilhaInterface?.typeParameters?.length ?? 0;

    expect(pilhaInterface).toBeDefined();
    expect(typeParameterCount).toBeGreaterThanOrEqual(1);
  });

  test("Deve definir uma classe genérica que implementa Pilha", () => {
    const sourceFile = getSourceFile("ex_9.ts");

    const pilhaClass = getPilhaClass(sourceFile);
    const typeParameterCount = pilhaClass?.typeParameters?.length ?? 0;

    expect(pilhaClass).toBeDefined();
    expect(typeParameterCount).toBeGreaterThanOrEqual(1);
    expect(classImplementsPilha(pilhaClass)).toBe(true);
  });

  test("Deve empilhar e desempilhar elementos mantendo o mesmo tipo", () => {
    const pilha = new PilhaArray<string>();

    pilha.empilhar("primeiro");
    pilha.empilhar("segundo");
    const removido = pilha.desempilhar();

    expect(removido).toBe("segundo");
    expect(pilha.topo()).toBe("primeiro");
    expect(pilha.listar()).toEqual(["primeiro"]);
  });

  test("Deve exibir o estado da pilha após operações", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    demonstrarPilha();

    expect(consoleSpy).toHaveBeenCalledTimes(3);
    expect(consoleSpy.mock.calls.map((call) => call[0])).toEqual([
      [10],
      [10, 20],
      [10],
    ]);

    consoleSpy.mockRestore();
  });
});
