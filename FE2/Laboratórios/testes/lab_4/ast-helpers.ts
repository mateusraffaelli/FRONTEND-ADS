import { existsSync, readFileSync } from "fs";
import path from "path";
import * as ts from "typescript";
import { expect } from "vitest";

const rootDir = path.resolve(__dirname, "../../lab_4");

function readJsonFile<T>(filePath: string): T {
  expect(existsSync(filePath)).toBe(true);

  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function getSourceFile(fileName: string) {
  const srcPath = path.join(rootDir, "src", fileName);
  expect(existsSync(srcPath)).toBe(true);

  return ts.createSourceFile(
    fileName,
    readFileSync(srcPath, "utf-8"),
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TS,
  );
}

function collectNodes<T extends ts.Node>(
  sourceFile: ts.SourceFile,
  predicate: (node: ts.Node) => node is T,
) {
  const nodes: T[] = [];

  function visit(node: ts.Node) {
    if (predicate(node)) {
      nodes.push(node);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return nodes;
}

function getVariableDeclarations(sourceFile: ts.SourceFile) {
  return collectNodes(
    sourceFile,
    (node): node is ts.VariableDeclaration =>
      ts.isVariableDeclaration(node) && ts.isIdentifier(node.name),
  );
}

function classifyExpression(expr: ts.Expression | undefined) {
  if (!expr) return null;

  switch (expr.kind) {
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
      return "string";
    case ts.SyntaxKind.NumericLiteral:
      return "number";
    case ts.SyntaxKind.TrueKeyword:
    case ts.SyntaxKind.FalseKeyword:
      return "boolean";
    case ts.SyntaxKind.ObjectLiteralExpression:
      return "object";
    case ts.SyntaxKind.ArrayLiteralExpression:
      return "array";
    case ts.SyntaxKind.ArrowFunction:
    case ts.SyntaxKind.FunctionExpression:
      return "function";
    default:
      return null;
  }
}

function getObjectPropertyName(
  prop: ts.ObjectLiteralElementLike | ts.TypeElement,
  sourceFile: ts.SourceFile,
) {
  if (!("name" in prop) || !prop.name) return null;

  if (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) {
    return prop.name.text;
  }

  return prop.name.getText(sourceFile);
}

function isConsoleLogCall(node: ts.Node): node is ts.CallExpression {
  if (!ts.isCallExpression(node)) return false;

  const expression = node.expression;

  return (
    ts.isPropertyAccessExpression(expression) &&
    ts.isIdentifier(expression.expression) &&
    expression.expression.text === "console" &&
    expression.name.text === "log"
  );
}

function getAssignedProperty(node: ts.Node) {
  if (
    !ts.isBinaryExpression(node) ||
    node.operatorToken.kind !== ts.SyntaxKind.EqualsToken
  ) {
    return null;
  }

  if (ts.isPropertyAccessExpression(node.left) && ts.isIdentifier(node.left.expression)) {
    return {
      objectName: node.left.expression.text,
      propertyName: node.left.name.text,
    };
  }

  if (
    ts.isElementAccessExpression(node.left) &&
    ts.isIdentifier(node.left.expression) &&
    ts.isStringLiteral(node.left.argumentExpression)
  ) {
    return {
      objectName: node.left.expression.text,
      propertyName: node.left.argumentExpression.text,
    };
  }

  return null;
}

export {
  classifyExpression,
  collectNodes,
  getAssignedProperty,
  getObjectPropertyName,
  getSourceFile,
  getVariableDeclarations,
  isConsoleLogCall,
  readJsonFile,
  rootDir,
};
