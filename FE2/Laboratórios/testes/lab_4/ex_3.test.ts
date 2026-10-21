import { describe, expect, test } from "vitest";
import * as ts from "typescript";
import {
  classifyExpression,
  collectNodes,
  getSourceFile,
  getVariableDeclarations,
} from "./ast-helpers";

type VariableAssignments = {
  name: string | null;
  typeKinds: Set<string>;
};

function getAssignmentsForAnnotatedVariable(typeName: "any" | "unknown") {
  const sourceFile = getSourceFile("ex_3.ts");
  const info: VariableAssignments = { name: null, typeKinds: new Set() };

  for (const declaration of getVariableDeclarations(sourceFile)) {
    const name = declaration.name.getText(sourceFile);
    const type = declaration.type?.getText(sourceFile).trim();

    if (type === typeName && (!info.name || info.name === name)) {
      info.name = name;
      const kind = classifyExpression(declaration.initializer);

      if (kind) {
        info.typeKinds.add(kind);
      }
    }
  }

  for (const assignment of collectNodes(sourceFile, ts.isBinaryExpression)) {
    if (
      assignment.operatorToken.kind !== ts.SyntaxKind.EqualsToken ||
      !ts.isIdentifier(assignment.left) ||
      assignment.left.text !== info.name
    ) {
      continue;
    }

    const kind = classifyExpression(assignment.right);

    if (kind) {
      info.typeKinds.add(kind);
    }
  }

  return info;
}

function getAnnotatedVariableDeclaration(typeName: "any" | "unknown") {
  const sourceFile = getSourceFile("ex_3.ts");

  return getVariableDeclarations(sourceFile).find(
    (declaration) => declaration.type?.getText(sourceFile).trim() === typeName,
  );
}

function isLetDeclaration(declaration: ts.VariableDeclaration | undefined) {
  return !!(
    declaration &&
    ts.isVariableDeclarationList(declaration.parent) &&
    declaration.parent.flags & ts.NodeFlags.Let
  );
}

function hasTypeofCheckForVariable(variableName: string | null) {
  if (!variableName) return false;

  const sourceFile = getSourceFile("ex_3.ts");

  return (
    collectNodes(
      sourceFile,
      (node): node is ts.TypeOfExpression =>
        ts.isTypeOfExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === variableName,
    ).length > 0
  );
}

describe("Laboratório 4 - Exercício 3", () => {
  test("Deve declarar uma variável let com tipo any", () => {
    const declaration = getAnnotatedVariableDeclaration("any");

    const isLet = isLetDeclaration(declaration);

    expect(isLet).toBe(true);
  });

  test("Deve atribuir pelo menos 3 tipos diferentes à variável any", () => {
    const assignments = getAssignmentsForAnnotatedVariable("any");

    const quantidadeTipos = assignments.typeKinds.size;

    expect(quantidadeTipos).toBeGreaterThanOrEqual(3);
  });

  test("Deve declarar uma variável let com tipo unknown", () => {
    const declaration = getAnnotatedVariableDeclaration("unknown");

    const isLet = isLetDeclaration(declaration);

    expect(isLet).toBe(true);
  });

  test("Deve atribuir pelo menos 3 tipos diferentes à variável unknown", () => {
    const assignments = getAssignmentsForAnnotatedVariable("unknown");

    const quantidadeTipos = assignments.typeKinds.size;

    expect(quantidadeTipos).toBeGreaterThanOrEqual(3);
  });

  test("Deve verificar a variável unknown com typeof antes de usar o valor", () => {
    const unknownVariable = getAssignmentsForAnnotatedVariable("unknown").name;

    const hasTypeofCheck = hasTypeofCheckForVariable(unknownVariable);

    expect(hasTypeofCheck).toBe(true);
  });
});
