/** @vitest-environment jsdom */
import { describe, test, expect, beforeEach } from "vitest";
import * as funcoes from "../../lab_3/ex_16.js";

const funcoesExportadas = Object.values(funcoes).filter(
  (funcao) => typeof funcao === "function",
);

function encontrarContadorCliques() {
  return funcoesExportadas.find((funcao) => {
    try {
      document.body.innerHTML = `<button id="btn">Clique: 0</button>`;
      const btn = document.querySelector("#btn");
      const resultado = funcao(btn);

      if (typeof resultado === "function") {
        btn.addEventListener("click", resultado);
      }

      btn.click();
      btn.click();

      return numeroExibido(btn) === 2;
    } catch {
      return false;
    }
  });
}

function configurarContador(botao) {
  const contadorCliques = encontrarContadorCliques();

  expect(contadorCliques).toBeTypeOf("function");

  const resultado = contadorCliques(botao);

  if (typeof resultado === "function") {
    botao.addEventListener("click", resultado);
  }

  return resultado;
}

function numeroExibido(elemento) {
  const match = elemento.textContent.match(/\d+/);
  return match ? Number(match[0]) : null;
}

describe("Laboratório 3 - Exercício 16:", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("Deve exportar uma função que configure o contador de cliques", () => {
    expect(encontrarContadorCliques()).toBeTypeOf("function");
  });

  test("Deve incrementar e exibir a contagem no botão", () => {
    document.body.innerHTML = `<button id="btn">Clique: 0</button>`;
    const btn = document.querySelector("#btn");

    configurarContador(btn);

    expect(numeroExibido(btn)).toBe(0);

    btn.click();
    expect(numeroExibido(btn)).toBe(1);

    btn.click();
    expect(numeroExibido(btn)).toBe(2);

    btn.click();
    expect(numeroExibido(btn)).toBe(3);
  });

  test("Deve funcionar mesmo quando o botão começa sem número", () => {
    document.body.innerHTML = `<button id="btn">Enviar</button>`;
    const btn = document.querySelector("#btn");

    configurarContador(btn);

    btn.click();
    expect(numeroExibido(btn)).toBe(1);
  });

  test("Deve manter estados independentes entre duas instâncias (closures diferentes)", () => {
    document.body.innerHTML = `
      <button id="a">Clique: 0</button>
      <button id="b">Clique: 0</button>
    `;
    const a = document.querySelector("#a");
    const b = document.querySelector("#b");

    configurarContador(a);
    configurarContador(b);

    a.click(); // a: 1
    a.click(); // a: 2
    b.click(); // b: 1

    expect(numeroExibido(a)).toBe(2);
    expect(numeroExibido(b)).toBe(1);

    b.click(); // b: 2
    expect(numeroExibido(b)).toBe(2);
  });

  test("Deve preservar estado ao remover e reanexar o mesmo handler", () => {
    document.body.innerHTML = `<button id="btn">Clique: 0</button>`;
    const btn = document.querySelector("#btn");

    const h = configurarContador(btn);

    btn.click(); // 1
    expect(numeroExibido(btn)).toBe(1);

    if (typeof h === "function") {
      btn.removeEventListener("click", h);
      // (nenhum clique contado enquanto não anexado)
      btn.addEventListener("click", h);
    }

    btn.click(); // continua de 1 -> 2
    expect(numeroExibido(btn)).toBe(2);
  });
});
