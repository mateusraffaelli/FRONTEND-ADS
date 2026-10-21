import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import {
  arquivosFonte,
  conteudoFonte,
  possuiClasseAtribuidaDoFramework,
} from "./helpers.js";

describe("Laboratório 8 - Exercício 4", () => {
  test("o projeto deve continuar organizado em módulos", () => {
    const arquivos = arquivosFonte().filter((arquivo) => arquivo.endsWith(".ts"));
    const codigo = conteudoFonte();

    expect(arquivos.length).toBeGreaterThanOrEqual(6);
    expect(codigo).toMatch(/import\s+.+from\s+["'][^"']+["']/);
    expect(codigo).toMatch(/export\s+(default|\{)/);
  });

  test("deve manter componente baseado em classe e componentes baseados em função", () => {
    const codigo = conteudoFonte();

    expect(codigo).toMatch(/class\s+\w+/);
    expect(codigo).toMatch(/const\s+\w+\s*=\s*\([^)]*\)\s*=>/);
  });

  test("arquivos de componentes devem conter parte da estilização", () => {
    const codigoComponentes = arquivosFonte()
      .filter((arquivo) => /componentes/.test(arquivo))
      .map((arquivo) => readFileSync(arquivo, "utf-8"))
      .join("\n");

    expect(possuiClasseAtribuidaDoFramework(codigoComponentes)).toBe(true);
  });
});
