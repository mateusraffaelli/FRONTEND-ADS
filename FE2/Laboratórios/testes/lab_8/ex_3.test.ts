import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { arquivosFonte, possuiClasseAtribuidaDoFramework } from "./helpers.js";

function codigoDoFormulario(): string {
  const arquivos = arquivosFonte().filter((arquivo) => /form|campo|botao/i.test(arquivo));

  return arquivos.map((arquivo) => readFileSync(arquivo, "utf-8")).join("\n");
}

describe("Laboratório 8 - Exercício 3", () => {
  test("o formulário deve manter os campos solicitados", () => {
    const codigo = codigoDoFormulario();

    expect(codigo).toMatch(/Nome/i);
    expect(codigo).toMatch(/Categoria/i);
    expect(codigo).toMatch(/Pre[cç]o/i);
    expect(codigo).toMatch(/Estoque/i);
    expect(codigo).toMatch(/Ativo/i);
    expect(codigo).toMatch(/select/i);
    expect(codigo).toMatch(/checkbox/i);
  });

  test("campos e botões devem receber classes do framework escolhido", () => {
    const codigo = codigoDoFormulario();

    expect(possuiClasseAtribuidaDoFramework(codigo)).toBe(true);
    expect(codigo).toMatch(/Salvar/i);
    expect(codigo).toMatch(/Limpar/i);
    expect(codigo).toMatch(/submit/i);
    expect(codigo).toMatch(/reset/i);
  });
});
