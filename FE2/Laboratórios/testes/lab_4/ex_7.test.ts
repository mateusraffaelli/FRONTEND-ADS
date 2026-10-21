import { describe, expect, test } from "vitest";
import * as ts from "typescript";
import { exibir } from "../../lab_4/src/ex_7";
import { collectNodes, getSourceFile } from "./ast-helpers";

function getExibirDeclarations(sourceFile: ts.SourceFile) {
  return collectNodes(sourceFile, ts.isFunctionDeclaration).filter(
    (declaration) => declaration.name?.text === "exibir",
  );
}

function hasOverloadForType(sourceFile: ts.SourceFile, typeName: string) {
  return getExibirDeclarations(sourceFile).some((declaration) => {
    const parameterType = declaration.parameters[0]?.type;

    return !declaration.body && parameterType?.getText(sourceFile) === typeName;
  });
}

describe("Laboratório 4 - Exercício 7", () => {
  test("Deve definir sobrecargas para number e string", () => {
    const sourceFile = getSourceFile("ex_7.ts");

    const hasNumberOverload = hasOverloadForType(sourceFile, "number");
    const hasStringOverload = hasOverloadForType(sourceFile, "string");

    expect(hasNumberOverload).toBe(true);
    expect(hasStringOverload).toBe(true);
  });

  test("Deve retornar mensagens diferentes para number e string", () => {
    const mensagemNumero = exibir(10);
    const mensagemTexto = exibir("Typescript");

    expect(mensagemNumero).not.toBe(mensagemTexto);
    expect(mensagemNumero).toContain("10");
    expect(mensagemTexto).toContain("Typescript");
  });
});
