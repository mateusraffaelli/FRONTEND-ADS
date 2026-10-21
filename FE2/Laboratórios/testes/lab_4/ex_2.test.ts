import { describe, expect, test } from "vitest";
import { getSourceFile, getVariableDeclarations } from "./ast-helpers";

const source = () => getSourceFile("ex_2.ts");
const declarations = () => getVariableDeclarations(source());

describe("Laboratório 4 - Exercício 2", () => {
  test("Deve ter pelo menos 3 variáveis com tipos explícitos", () => {
    const variableDeclarations = declarations();

    const tiposExplicitos = variableDeclarations.filter(
      (declaration) => declaration.type,
    );

    expect(tiposExplicitos.length).toBeGreaterThanOrEqual(3);
  });

  test("Deve usar pelo menos 3 tipos explícitos diferentes", () => {
    const sourceFile = source();

    const tiposExplicitos = getVariableDeclarations(sourceFile)
      .filter((declaration) => declaration.type)
      .map((declaration) => declaration.type!.getText(sourceFile));
    const quantidadeTiposExplicitos = new Set(tiposExplicitos).size;

    expect(quantidadeTiposExplicitos).toBeGreaterThanOrEqual(3);
  });

  test("Deve ter pelo menos 3 variáveis com tipos inferidos", () => {
    const variableDeclarations = declarations();

    const tiposInferidos = variableDeclarations.filter(
      (declaration) => !declaration.type && declaration.initializer,
    );

    expect(tiposInferidos.length).toBeGreaterThanOrEqual(3);
  });
});
