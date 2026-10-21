/** @vitest-environment jsdom */
import { describe, test, expect, beforeEach } from "vitest";
import * as funcoes from "../../lab_3/ex_15.js";

const funcoesExportadas = Object.values(funcoes).filter(
  (funcao) => typeof funcao === "function",
);

function criarElementos() {
  document.body.innerHTML = `
    <p id="a">Tarefa urgente</p>
    <p id="b">Tarefa comum</p>
    <p id="c">URGENTE: revisar prova</p>
  `;

  return Array.from(document.querySelectorAll("p"));
}

function encontrarFuncaoFiltro() {
  return funcoesExportadas.find((funcao) => {
    try {
      const elementos = criarElementos();
      const resultado = funcao("urgente")(elementos);

      return (
        Array.isArray(resultado) &&
        resultado.length === 2 &&
        resultado[0] === document.getElementById("a") &&
        resultado[1] === document.getElementById("c")
      );
    } catch {
      return false;
    }
  });
}

function encontrarFuncaoCor() {
  return funcoesExportadas.find((funcao) => {
    try {
      const elementos = criarElementos();
      const resultado = funcao("red")(elementos);

      return (
        Array.isArray(resultado) &&
        resultado.length === elementos.length &&
        resultado.every((elemento, indice) => elemento === elementos[indice]) &&
        elementos.every((elemento) => elemento.style.color === "red")
      );
    } catch {
      return false;
    }
  });
}

function encontrarFuncaoNegrito() {
  return funcoesExportadas.find((funcao) => {
    try {
      const elementos = criarElementos();
      const resultado = funcao(elementos);

      return (
        Array.isArray(resultado) &&
        resultado.length === elementos.length &&
        resultado.every((elemento, indice) => elemento === elementos[indice]) &&
        elementos.every((elemento) => elemento.style.fontWeight === "bold")
      );
    } catch {
      return false;
    }
  });
}

function encontrarFuncaoEspecifica() {
  return funcoesExportadas.find((funcao) => {
    try {
      const elementos = criarElementos();
      const resultado = funcao(elementos);

      return (
        Array.isArray(resultado) &&
        resultado.length === 2 &&
        resultado[0] === document.getElementById("a") &&
        resultado[1] === document.getElementById("c") &&
        document.getElementById("a").style.color === "red" &&
        document.getElementById("a").style.fontWeight === "bold" &&
        document.getElementById("b").style.color === "" &&
        document.getElementById("b").style.fontWeight === "" &&
        document.getElementById("c").style.color === "red" &&
        document.getElementById("c").style.fontWeight === "bold"
      );
    } catch {
      return false;
    }
  });
}

describe("Laboratório 3 - Exercício 15:", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("deve exportar pelo menos quatro funções", () => {
    expect(funcoesExportadas.length).toBeGreaterThanOrEqual(4);
  });

  test("deve ter uma função que filtra elementos pelo texto sem diferenciar maiúsculas e minúsculas", () => {
    const filtrar = encontrarFuncaoFiltro();

    expect(filtrar).toBeTypeOf("function");

    document.body.innerHTML = `
      <p id="a">Tarefa urgente</p>
      <p id="b">URGENTE: responder e-mail</p>
      <p id="c" data-tipo="urgente">Tarefa comum</p>
    `;
    const elementos = Array.from(document.querySelectorAll("p"));

    const urgentes = filtrar("urgente")(elementos);

    expect(urgentes).toEqual([
      document.getElementById("a"),
      document.getElementById("b"),
    ]);
  });

  test("deve ter uma função que altera a cor dos elementos e preserva os próprios elementos", () => {
    const alterarCor = encontrarFuncaoCor();

    expect(alterarCor).toBeTypeOf("function");

    const elementos = criarElementos();

    const alterados = alterarCor("red")(elementos);

    expect(alterados).toEqual(elementos);
    expect(document.getElementById("a").style.color).toBe("red");
    expect(document.getElementById("b").style.color).toBe("red");
  });

  test("deve ter uma função que deixa o texto dos elementos em negrito e preserva os próprios elementos", () => {
    const transformarNegrito = encontrarFuncaoNegrito();

    expect(transformarNegrito).toBeTypeOf("function");

    const elementos = criarElementos();

    const alterados = transformarNegrito(elementos);

    expect(alterados).toEqual(elementos);
    expect(document.getElementById("a").style.fontWeight).toBe("bold");
    expect(document.getElementById("b").style.fontWeight).toBe("bold");
  });

  test("deve ter uma função específica que filtra urgentes e aplica vermelho e negrito", () => {
    const marcarUrgentes = encontrarFuncaoEspecifica();

    expect(marcarUrgentes).toBeTypeOf("function");

    const elementos = criarElementos();

    const urgentes = marcarUrgentes(elementos);

    expect(urgentes).toEqual([
      document.getElementById("a"),
      document.getElementById("c"),
    ]);
    expect(document.getElementById("a").style.color).toBe("red");
    expect(document.getElementById("a").style.fontWeight).toBe("bold");
    expect(document.getElementById("b").style.color).toBe("");
    expect(document.getElementById("b").style.fontWeight).toBe("");
    expect(document.getElementById("c").style.color).toBe("red");
    expect(document.getElementById("c").style.fontWeight).toBe("bold");
  });

  test("a função específica deve produzir o mesmo resultado do encadeamento das funções menores", () => {
    const filtrar = encontrarFuncaoFiltro();
    const alterarCor = encontrarFuncaoCor();
    const transformarNegrito = encontrarFuncaoNegrito();
    const marcarUrgentes = encontrarFuncaoEspecifica();

    expect(filtrar).toBeTypeOf("function");
    expect(alterarCor).toBeTypeOf("function");
    expect(transformarNegrito).toBeTypeOf("function");
    expect(marcarUrgentes).toBeTypeOf("function");

    const elementos = criarElementos();

    const resultado = marcarUrgentes(elementos);

    expect(resultado).toEqual(
      transformarNegrito(alterarCor("red")(filtrar("urgente")(elementos))),
    );
  });
});
