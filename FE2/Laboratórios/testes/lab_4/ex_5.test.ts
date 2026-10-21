import { describe, expect, test } from "vitest";
import * as ts from "typescript";
import { collectNodes, getSourceFile } from "./ast-helpers";

const requiredMembers = ["ALUNO", "PROFESSOR", "ADMIN"];

function getNivelAcessoEnum(sourceFile: ts.SourceFile) {
  return collectNodes(sourceFile, ts.isEnumDeclaration).find(
    (declaration) => declaration.name.text === "NivelAcesso",
  );
}

function getUsuarioObject(sourceFile: ts.SourceFile) {
  return collectNodes(sourceFile, ts.isVariableDeclaration).find(
    (declaration) =>
      ts.isIdentifier(declaration.name) &&
      declaration.name.text === "usuario" &&
      !!declaration.initializer &&
      ts.isObjectLiteralExpression(declaration.initializer),
  );
}

function getUsuarioProperties(sourceFile: ts.SourceFile) {
  const usuario = getUsuarioObject(sourceFile);
  if (
    !usuario ||
    !usuario.initializer ||
    !ts.isObjectLiteralExpression(usuario.initializer)
  ) {
    return [];
  }

  return usuario.initializer.properties.filter(
    (property) =>
      ts.isPropertyAssignment(property) ||
      ts.isShorthandPropertyAssignment(property) ||
      ts.isMethodDeclaration(property),
  );
}

function usuarioUsesNivelAcesso(sourceFile: ts.SourceFile) {
  return getUsuarioProperties(sourceFile).some((property) => {
    if (!ts.isPropertyAssignment(property)) return false;

    const initializer = property.initializer;

    return (
      ts.isPropertyAccessExpression(initializer) &&
      ts.isIdentifier(initializer.expression) &&
      initializer.expression.text === "NivelAcesso" &&
      requiredMembers.includes(initializer.name.text)
    );
  });
}

describe("Laboratório 4 - Exercício 5", () => {
  test("Deve definir um enum chamado NivelAcesso", () => {
    const sourceFile = getSourceFile("ex_5.ts");

    const nivelAcessoEnum = getNivelAcessoEnum(sourceFile);

    expect(nivelAcessoEnum).toBeDefined();
  });

  test("Deve definir os valores ALUNO, PROFESSOR e ADMIN no enum", () => {
    const sourceFile = getSourceFile("ex_5.ts");

    const members = getNivelAcessoEnum(sourceFile)?.members.map((member) =>
      member.name.getText(sourceFile),
    );

    expect(members).toEqual(expect.arrayContaining(requiredMembers));
  });

  test("Deve criar um objeto chamado usuario", () => {
    const sourceFile = getSourceFile("ex_5.ts");

    const usuario = getUsuarioObject(sourceFile);

    expect(usuario).toBeDefined();
  });

  test("Deve criar usuario com três propriedades além do nível de acesso", () => {
    const sourceFile = getSourceFile("ex_5.ts");

    const properties = getUsuarioProperties(sourceFile);

    expect(properties.length).toBeGreaterThanOrEqual(4);
  });

  test("Deve definir o nível de acesso do usuario usando o enum", () => {
    const sourceFile = getSourceFile("ex_5.ts");

    const usesNivelAcesso = usuarioUsesNivelAcesso(sourceFile);

    expect(usesNivelAcesso).toBe(true);
  });
});
