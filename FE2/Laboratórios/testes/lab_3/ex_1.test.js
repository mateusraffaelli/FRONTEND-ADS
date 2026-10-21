import { describe, test, expect } from "vitest";
import * as funcoes from "../../lab_3/ex_1.js";

const quadradosImperativo = funcoes[Object.keys(funcoes)[0]];

describe("Laboratório 3 - Exercício 1:", () => {
  test("Deve retornar um novo array com os quadrados, na mesma ordem", () => {
    expect(quadradosImperativo([1, 2, 3, 4])).toEqual([1, 4, 9, 16]);
  });

  test("Não deve modificar o array original", () => {
    const original = [2, 3, 5];
    const copiaAntes = [...original];

    const resultado = quadradosImperativo(original);

    expect(original).toEqual(copiaAntes);
    expect(resultado).toEqual([4, 9, 25]);
  });

  test("Deve retornar um novo array", () => {
    const arr = [1, 2, 3];
    const resultado = quadradosImperativo(arr);

    expect(resultado).not.toBe(arr);
  });

  test("Deve funcionar com array vazio", () => {
    expect(quadradosImperativo([])).toEqual([]);
  });

  test("Deve funcionar com números negativos", () => {
    expect(quadradosImperativo([-1, -2, 3])).toEqual([1, 4, 9]);
  });

  test("Deve funcionar com zero e números decimais", () => {
    expect(quadradosImperativo([0, 1.5, -0.5])).toEqual([0, 2.25, 0.25]);
  });

  test("Não deve alterar a quantidade de elementos", () => {
    const arr = [10, 20, 30, 40];
    const resultado = quadradosImperativo(arr);

    expect(resultado).toHaveLength(arr.length);
  });

  test("Não deve alterar a ordem dos elementos", () => {
    expect(quadradosImperativo([3, 1, 2])).toEqual([9, 1, 4]);
  });
});
