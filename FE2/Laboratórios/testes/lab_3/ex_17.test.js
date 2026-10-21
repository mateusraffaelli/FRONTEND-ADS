/** @vitest-environment jsdom */
import { describe, test, expect, beforeEach } from "vitest";
import * as funcoes from "../../lab_3/ex_17.js";

const alterarAtributo = funcoes[Object.keys(funcoes)[0]];

describe("Laboratório 3 - Exercício 17:", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("Deve ser devidamente currificada em três estágios onde cada estágio é uma função", () => {
    const f1 = alterarAtributo("aria-label");
    expect(typeof f1).toBe("function");

    const f2 = f1("Salvar");
    expect(typeof f2).toBe("function");

    document.body.innerHTML = `<button id="b">OK</button>`;
    const btn = document.querySelector("#b");

    const ret = f2(btn);
    expect(ret).toBe(btn);
    expect(btn.getAttribute("aria-label")).toBe("Salvar");
  });

  test("Deve definir atributo em único elemento e permitir encadear chamadas subsequentes", () => {
    document.body.innerHTML = `<img id="i" alt="antigo" />`;
    const img = document.querySelector("#i");

    const setAlt = alterarAtributo("alt");
    const setTitle = alterarAtributo("title");
    const ret = setTitle("Logo")(setAlt("novo")(img));

    expect(ret).toBe(img);
    expect(img.getAttribute("alt")).toBe("novo");
    expect(img.getAttribute("title")).toBe("Logo");
  });

  test("Deve aplicar em múltiplos elementos reusando o segundo estágio (valor fixo)", () => {
    document.body.innerHTML = `
      <a id="l1" href="#">a</a>
      <a id="l2" href="#">b</a>
      <a id="l3" href="#">c</a>
    `;
    const links = Array.from(document.querySelectorAll("a"));

    const setRoleLink = alterarAtributo("role")("link");
    links.map(setRoleLink).forEach((el) => {
      expect(el.getAttribute("role")).toBe("link");
    });
  });

  test("Deve sobrescrever valor existente do atributo", () => {
    document.body.innerHTML = `<div id="d" data-status="old"></div>`;
    const d = document.querySelector("#d");

    alterarAtributo("data-status")("new")(d);
    expect(d.getAttribute("data-status")).toBe("new");

    alterarAtributo("data-status")("newer")(d);
    expect(d.getAttribute("data-status")).toBe("newer");
  });

  test('Deve manter atributo booleano: "disabled" presente mesmo com string vazia', () => {
    document.body.innerHTML = `<button id="x">Enviar</button>`;
    const x = document.querySelector("#x");

    alterarAtributo("disabled")("")(x);
    expect(x.hasAttribute("disabled")).toBe(true);
  });

  test("Deve funcionar normalmente com data-*", () => {
    document.body.innerHTML = `<div id="c"></div>`;
    const c = document.querySelector("#c");

    alterarAtributo("data-id")("123")(c);
    expect(c.getAttribute("data-id")).toBe("123");
  });

  test("Não deve haver efeito colateral antes do 3º estágio (só ao receber o elemento)", () => {
    document.body.innerHTML = `<span id="s"></span>`;
    const s = document.querySelector("#s");

    const f1 = alterarAtributo("title");
    const f2 = f1("Legenda");
    // Até aqui, nada mudou
    expect(s.getAttribute("title")).toBe(null);

    f2(s); // agora aplica
    expect(s.getAttribute("title")).toBe("Legenda");
  });

  test("Deve lançar erro se o elemento for inválido (null/undefined)", () => {
    const setter = alterarAtributo("x")("y");
    expect(() => setter(null)).toThrow(TypeError);
    expect(() => setter(undefined)).toThrow(TypeError);
  });
});
