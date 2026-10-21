import { describe, expect, beforeAll, vi, test } from "vitest";
import { existsSync } from "fs";
import path from "path";
import { execSync } from "child_process";
import { readJsonFile, rootDir } from "./ast-helpers";

describe("Laboratório 4 - Exercício 1:", () => {
  beforeAll(() => {
    execSync("npx tsc -p tsconfig.json", {
      cwd: rootDir,
      stdio: "ignore",
    });
  });

  test("Deve ter TypeScript instalado localmente no projeto", () => {
    const pkgPath = path.join(rootDir, "package.json");

    const pkgJson = readJsonFile<{
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    }>(pkgPath);
    const hasTypescript =
      pkgJson.devDependencies?.typescript || pkgJson.dependencies?.typescript;

    expect(hasTypescript).toBeTruthy();
  });

  test('Deve ter tsconfig.json com rootDir "src" e outDir "dist/js"', () => {
    const tsconfigPath = path.join(rootDir, "tsconfig.json");

    const tsconfig = readJsonFile<{
      compilerOptions?: Record<string, unknown>;
    }>(tsconfigPath);
    const opts = tsconfig.compilerOptions ?? {};

    expect(opts.rootDir).toContain("src");
    expect(opts.outDir).toContain("dist/js");
  });

  test("Deve ter tsconfig.json configurado em modo estrito", () => {
    const tsconfigPath = path.join(rootDir, "tsconfig.json");

    const tsconfig = readJsonFile<{
      compilerOptions?: Record<string, unknown>;
    }>(tsconfigPath);
    const opts = tsconfig.compilerOptions ?? {};

    expect(opts.strict).toBe(true);
  });

  test("Deve ter tsconfig.json configurado para não compilar em caso de erro", () => {
    const tsconfigPath = path.join(rootDir, "tsconfig.json");

    const tsconfig = readJsonFile<{
      compilerOptions?: Record<string, unknown>;
    }>(tsconfigPath);
    const opts = tsconfig.compilerOptions ?? {};

    expect(opts.noEmitOnError).toBe(true);
  });

  test("Deve compilar src/ex_1.ts para dist/js/ex_1.js", () => {
    const srcPath = path.join(rootDir, "src", "ex_1.ts");
    const outPath = path.join(rootDir, "dist", "js", "ex_1.js");

    const hasSourceFile = existsSync(srcPath);
    const hasCompiledFile = existsSync(outPath);

    expect(hasSourceFile).toBe(true);
    expect(hasCompiledFile).toBe(true);
  });

  test("Deve exibir uma string no console", async () => {
    const outPath = path.join(rootDir, "dist", "js", "ex_1.js");
    expect(existsSync(outPath)).toBe(true);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await import(outPath + "?" + Date.now());
    const firstCallArg = consoleSpy.mock.calls[0]?.[0];

    expect(consoleSpy).toHaveBeenCalled();
    expect(typeof firstCallArg).toBe("string");

    consoleSpy.mockRestore();
  });
});
