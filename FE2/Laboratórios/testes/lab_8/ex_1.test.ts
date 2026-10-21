import { describe, expect, test } from "vitest";
import { frameworkEscolhido, lerArquivo, lerJson } from "./helpers.js";

describe("Laboratório 8 - Exercício 1", () => {
  test("deve escolher Bootstrap ou Tailwind, sem misturar os dois", () => {
    expect(frameworkEscolhido()).toMatch(/^(bootstrap|tailwind)$/);
  });

  test("index.html deve carregar a aplicação como módulo", () => {
    const html = lerArquivo("index.html");

    expect(html).toMatch(/<script[^>]+type=["']module["'][^>]*>/i);
  });

  test("package.json deve registrar TypeScript e script de execução", () => {
    const packageJson = lerJson("package.json") as {
      scripts?: Record<string, string>;
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const scripts = packageJson.scripts ?? {};
    const dependencias = {
      ...(packageJson.dependencies ?? {}),
      ...(packageJson.devDependencies ?? {}),
    };

    expect(dependencias.typescript).toBeDefined();
    expect(Object.keys(scripts).some((nome) => /^(start|serve|dev)$/.test(nome))).toBe(
      true
    );
  });
});
