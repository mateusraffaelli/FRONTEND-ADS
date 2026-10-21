import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import {
  arquivosFonte,
  conteudoFonte,
  possuiClasseAtribuidaDoFramework,
  removerComentarios,
} from "./helpers.js";

describe("Laboratório 8 - Exercício 2", () => {
  test("a página principal deve possuir contêiner e destaque visual", () => {
    const codigo = conteudoFonte();
    const codigoSemComentarios = removerComentarios(codigo);

    expect(codigo).toMatch(/Cafeteria/i);
    expect(
      possuiClasseAtribuidaDoFramework(codigo),
      "A página deve atribuir classes reais do framework a elementos do projeto. Comentários não contam."
    ).toBe(true);
    expect(
      codigoSemComentarios,
      "A estrutura principal deve possuir uma classe de contêiner, como container, max-w-* ou mx-auto."
    ).toMatch(
      /(?:class(?:Name)?\s*=|\.className\s*=|\.classList\.add\s*\(|\.setAttribute\s*\(\s*["']class)[\s\S]*\b(container|max-w-|mx-auto)\b/
    );
    expect(
      codigoSemComentarios,
      "A estrutura principal deve possuir alguma classe visual além do contêiner, como card, shadow, border, p-* ou m-*."
    ).toMatch(
      /(?:class(?:Name)?\s*=|\.className\s*=|\.classList\.add\s*\(|\.setAttribute\s*\(\s*["']class)[\s\S]*\b(card|shadow|border|p[xtblrse]?-[0-9]|m[xtblrse]?-[0-9]|rounded|bg-|text-)\b/
    );
  });

  test("a estilização não deve estar concentrada apenas no index.html", () => {
    const fontes = arquivosFonte()
      .filter((arquivo) => !arquivo.endsWith("index.html"))
      .map((arquivo) => readFileSync(arquivo, "utf-8"))
      .join("\n");

    expect(
      possuiClasseAtribuidaDoFramework(fontes),
      "Alguma estilização deve estar nos arquivos de src/, preferencialmente nos componentes. Classes apenas no index.html não bastam."
    ).toBe(true);
  });
});
