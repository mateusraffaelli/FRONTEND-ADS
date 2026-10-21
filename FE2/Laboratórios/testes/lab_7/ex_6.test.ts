import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

describe("Laboratório 7 - Exercício 6", () => {
  test("package.json deve possuir script para compilar o projeto", () => {
    const packageJson = JSON.parse(
      readFileSync("./lab_7/package.json", "utf-8")
    );

    expect(packageJson.scripts).toBeDefined();
    expect(Object.values(packageJson.scripts)).toContain("tsc");
  });

  test("TypeScript deve estar registrado como dependência de desenvolvimento", () => {
    const packageJson = JSON.parse(
      readFileSync("./lab_7/package.json", "utf-8")
    );

    expect(packageJson.devDependencies).toBeDefined();
    expect(packageJson.devDependencies.typescript).toBeDefined();
  });
});
