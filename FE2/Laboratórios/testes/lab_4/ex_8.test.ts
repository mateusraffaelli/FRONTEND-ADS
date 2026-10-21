import { describe, expect, test } from "vitest";
import * as ts from "typescript";
import { combinar } from "../../lab_4/src/ex_8";
import { collectNodes, getSourceFile } from "./ast-helpers";

function getCombinarDeclarations(sourceFile: ts.SourceFile) {
  return collectNodes(sourceFile, ts.isFunctionDeclaration).filter(
    (declaration) => declaration.name?.text === "combinar",
  );
}

function hasOverloadWithParameterTypes(sourceFile: ts.SourceFile, typeNames: string[]) {
  return getCombinarDeclarations(sourceFile).some((declaration) => {
    const parameterTypes = declaration.parameters.map((parameter) =>
      parameter.type?.getText(sourceFile),
    );

    return (
      !declaration.body &&
      parameterTypes.length === typeNames.length &&
      parameterTypes.every((type, index) => type === typeNames[index])
    );
  });
}

describe("Laboratório 4 - Exercício 8", () => {
  test("Deve definir sobrecargas para dois números e duas strings", () => {
    const sourceFile = getSourceFile("ex_8.ts");

    const hasNumberOverload = hasOverloadWithParameterTypes(sourceFile, [
      "number",
      "number",
    ]);
    const hasStringOverload = hasOverloadWithParameterTypes(sourceFile, [
      "string",
      "string",
    ]);

    expect(hasNumberOverload).toBe(true);
    expect(hasStringOverload).toBe(true);
  });

  test("Deve multiplicar dois números", () => {
    const resultado = combinar(2, 3);

    expect(resultado).toBe(6);
  });

  test("Deve concatenar duas strings", () => {
    const resultado = combinar("Type", "Script");

    expect(resultado).toBe("TypeScript");
  });

  test("Deve retornar um array quando os parâmetros forem de tipos diferentes", () => {
    const resultado = combinar("idade", 30);

    expect(resultado).toEqual(["idade", 30]);
  });
});
