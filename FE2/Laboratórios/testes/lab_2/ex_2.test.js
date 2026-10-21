import { describe, test, expect } from "vitest";
import { Livro } from "../../lab_2/ex_2.js";

function getTitulo(l) {
  return l?.titulo ?? l?.["título"];
}
function getAutor(l) {
  return l?.autor ?? l?.["autor"];
}
function getAno(l) {
  return l?.ano ?? l?.["ano"];
}

describe("Laboratório 2 - Exercício 2:", () => {
  test("Deve exportar um construtor", () => {
    expect(Livro).toBeTruthy();
    expect(typeof Livro).toBe("function");
  });

  test("Deve criar instância com new e definir título/titulo, autor e ano", () => {
    const l = new Livro("Dom Casmurro", "Machado de Assis", 1899);

    expect(typeof l).toBe("object");
    expect(l).toBeInstanceOf(Livro);

    expect(getTitulo(l)).toBe("Dom Casmurro");
    expect(getAutor(l)).toBe("Machado de Assis");
    expect(getAno(l)).toBe(1899);
  });

  test("Deve ter os métodos emprestar() e devolver()", () => {
    const l = new Livro("1984", "George Orwell", 1949);

    expect(typeof l.emprestar).toBe("function");
    expect(typeof l.devolver).toBe("function");
  });

  test("Deve ter métodos vindos do protótipo (não devem ser propriedades próprias)", () => {
    const l = new Livro("O Hobbit", "J. R. R. Tolkien", 1937);

    expect(Object.hasOwn(l, "emprestar")).toBe(false);
    expect(Object.hasOwn(l, "devolver")).toBe(false);

    const proto = Object.getPrototypeOf(l);
    expect(typeof proto.emprestar).toBe("function");
    expect(typeof proto.devolver).toBe("function");
  });

  test("Duas instâncias devem compartilhar as mesmas funções de método", () => {
    const a = new Livro("Livro A", "Autor A", 2000);
    const b = new Livro("Livro B", "Autor B", 2001);

    expect(a.emprestar).toBe(b.emprestar);
    expect(a.devolver).toBe(b.devolver);
  });

  test("Deve instanciar dois livros e conseguir chamar emprestar() e devolver() sem lançar erro", () => {
    const l1 = new Livro("Clean Code", "Robert C. Martin", 2008);
    const l2 = new Livro("Refactoring", "Martin Fowler", 1999);

    expect(() => l1.emprestar()).not.toThrow();
    expect(() => l1.devolver()).not.toThrow();

    expect(() => l2.emprestar()).not.toThrow();
    expect(() => l2.devolver()).not.toThrow();
  });
});
