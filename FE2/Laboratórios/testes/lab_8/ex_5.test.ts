import { describe, expect, test } from "vitest";
import {
  conteudoFonte,
  possuiClasseAtribuidaDoFramework,
  removerComentarios,
} from "./helpers.js";

describe("Laboratório 8 - Exercício 5", () => {
  test("a interface deve demonstrar uso consistente do framework escolhido", () => {
    const codigo = conteudoFonte();

    expect(possuiClasseAtribuidaDoFramework(codigo)).toBe(true);
    expect(removerComentarios(codigo)).toMatch(
      /(?:class(?:Name)?\s*=|\.className\s*=|\.classList\.add\s*\(|\.setAttribute\s*\(\s*["']class)[\s\S]*\b(gap-|space-y-|mb-|mt-|p-|px-|py-|rounded|shadow|border|card|form-|btn|text-|bg-)\b/
    );
  });

  test("a interface deve conter indícios de responsividade", () => {
    const codigo = conteudoFonte();

    expect(codigo).toMatch(
      /viewport|\b(sm:|md:|lg:|xl:|col-sm|col-md|col-lg|row|container|w-full|max-w-)\b/i
    );
  });
});
