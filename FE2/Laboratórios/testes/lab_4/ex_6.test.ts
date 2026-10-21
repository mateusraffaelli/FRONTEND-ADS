import { describe, expect, test } from "vitest";
import * as ts from "typescript";
import { primeiroElemento } from "../../lab_4/src/ex_6";
import { collectNodes, getSourceFile } from "./ast-helpers";

function getPrimeiroElementoDeclaration(sourceFile: ts.SourceFile) {
  return collectNodes(sourceFile, ts.isFunctionDeclaration).find(
    (declaration) => declaration.name?.text === "primeiroElemento",
  );
}

describe("Laboratório 4 - Exercício 6", () => {
  test("Deve definir uma função genérica", () => {
    const sourceFile = getSourceFile("ex_6.ts");

    const declaration = getPrimeiroElementoDeclaration(sourceFile);
    const typeParameterCount = declaration?.typeParameters?.length ?? 0;

    expect(typeParameterCount).toBeGreaterThanOrEqual(1);
  });

  test("Deve receber um array como parâmetro", () => {
    const sourceFile = getSourceFile("ex_6.ts");

    const declaration = getPrimeiroElementoDeclaration(sourceFile);
    const parameterType = declaration?.parameters[0]?.type;

    expect(parameterType && ts.isArrayTypeNode(parameterType)).toBe(true);
  });

  test("Deve retornar o primeiro elemento de arrays de tipos diferentes", () => {
    const numeros = [1, 2, 3];
    const textos = ["a", "b", "c"];

    const primeiroNumero = primeiroElemento(numeros);
    const primeiroTexto = primeiroElemento(textos);

    expect(primeiroNumero).toBe(1);
    expect(primeiroTexto).toBe("a");
  });
});
