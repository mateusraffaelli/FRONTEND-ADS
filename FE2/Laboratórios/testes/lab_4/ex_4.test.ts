import { describe, expect, test } from "vitest";
import * as ts from "typescript";
import {
  collectNodes,
  getAssignedProperty,
  getObjectPropertyName,
  getSourceFile,
} from "./ast-helpers";

type InstanceInfo = {
  baseProps: Set<string>;
  extraProps: Set<string>;
};

function getObjectTypeMembers(sourceFile: ts.SourceFile) {
  const declarations = collectNodes(
    sourceFile,
    (node): node is ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.VariableDeclaration =>
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node) ||
      ts.isVariableDeclaration(node),
  );

  return declarations
    .map((declaration) => getTypeMembers(declaration))
    .filter((members): members is ts.NodeArray<ts.TypeElement> => !!members);
}

function hasObjectTypeWith3RequiredProps(sourceFile: ts.SourceFile) {
  return getObjectTypeMembers(sourceFile).some((members) => {
    const requiredProps = members.filter(
      (member) => ts.isPropertySignature(member) && !member.questionToken,
    );

    return requiredProps.length >= 3;
  });
}

function hasObjectTypeWithAdditionalProps(sourceFile: ts.SourceFile) {
  return getObjectTypeMembers(sourceFile).some((members) =>
    members.some(ts.isIndexSignatureDeclaration),
  );
}

function getTypeMembers(
  declaration: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.VariableDeclaration,
) {
  if (ts.isInterfaceDeclaration(declaration)) {
    return declaration.members;
  }

  if (ts.isTypeAliasDeclaration(declaration) && ts.isTypeLiteralNode(declaration.type)) {
    return declaration.type.members;
  }

  if (
    ts.isVariableDeclaration(declaration) &&
    declaration.type &&
    ts.isTypeLiteralNode(declaration.type)
  ) {
    return declaration.type.members;
  }

  return null;
}

function getObjectInstances(sourceFile: ts.SourceFile) {
  const instances = new Map<string, InstanceInfo>();

  for (const declaration of collectNodes(sourceFile, ts.isVariableDeclaration)) {
    if (
      !ts.isIdentifier(declaration.name) ||
      !declaration.initializer ||
      !ts.isObjectLiteralExpression(declaration.initializer)
    ) {
      continue;
    }

    const info: InstanceInfo = { baseProps: new Set(), extraProps: new Set() };

    for (const property of declaration.initializer.properties) {
      const propertyName = getObjectPropertyName(property, sourceFile);

      if (propertyName) {
        info.baseProps.add(propertyName);
      }
    }

    instances.set(declaration.name.text, info);
  }

  for (const node of collectNodes(sourceFile, ts.isBinaryExpression)) {
    const assignment = getAssignedProperty(node);
    if (!assignment) continue;

    const info = instances.get(assignment.objectName);
    if (!info || info.baseProps.has(assignment.propertyName)) continue;

    info.extraProps.add(assignment.propertyName);
  }

  return instances;
}

describe("Laboratório 4 - Exercício 4", () => {
  test("Deve definir um tipo de objeto com pelo menos três propriedades obrigatórias", () => {
    const sourceFile = getSourceFile("ex_4.ts");

    const hasRequiredProps = hasObjectTypeWith3RequiredProps(sourceFile);

    expect(hasRequiredProps).toBe(true);
  });

  test("Deve permitir propriedades adicionais não definidas na criação", () => {
    const sourceFile = getSourceFile("ex_4.ts");

    const hasAdditionalProps = hasObjectTypeWithAdditionalProps(sourceFile);

    expect(hasAdditionalProps).toBe(true);
  });

  test("Deve instanciar um objeto com pelo menos três propriedades iniciais", () => {
    const sourceFile = getSourceFile("ex_4.ts");

    const instances = [...getObjectInstances(sourceFile).values()];
    const hasInstanceWith3Props = instances.some((info) => info.baseProps.size >= 3);

    expect(hasInstanceWith3Props).toBe(true);
  });

  test("Deve adicionar cinco propriedades extras à instância", () => {
    const sourceFile = getSourceFile("ex_4.ts");

    const instances = [...getObjectInstances(sourceFile).values()];
    const hasInstanceWith5Extras = instances.some(
      (info) => info.baseProps.size >= 3 && info.extraProps.size >= 5,
    );

    expect(hasInstanceWith5Extras).toBe(true);
  });
});
