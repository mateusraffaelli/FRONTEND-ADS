import { describe, test, expect, vi } from "vitest";
import * as funcoes from "../../lab_3/ex_2.js";

const quadradosFuncional = funcoes[Object.keys(funcoes)[0]];

describe("Laboratório 3 - Exercício 2:", () => {
  test("Deve retornar um novo array com os quadrados, na mesma ordem", () => {
    expect(quadradosFuncional([1, 2, 3, 4])).toEqual([1, 4, 9, 16]);
  });

  test("Não deve modificar o array original", () => {
    const original = [2, 3, 5];
    const antes = [...original];

    const resultado = quadradosFuncional(original);

    expect(original).toEqual(antes);
    expect(resultado).toEqual([4, 9, 25]);
  });

  test("Deve retornar um novo array", () => {
    const arr = [1, 2, 3];
    const resultado = quadradosFuncional(arr);

    expect(resultado).not.toBe(arr);
  });

  test("Deve funcionar com array vazio", () => {
    expect(quadradosFuncional([])).toEqual([]);
  });

  test("Deve funcionar com números negativos", () => {
    expect(quadradosFuncional([-1, -2, 3])).toEqual([1, 4, 9]);
  });

  test("Deve funcionar com zero e números decimais", () => {
    expect(quadradosFuncional([0, 1.5, -0.5])).toEqual([0, 2.25, 0.25]);
  });

  test("Não deve alterar a quantidade de elementos", () => {
    const arr = [10, 20, 30, 40];
    const resultado = quadradosFuncional(arr);

    expect(resultado).toHaveLength(arr.length);
  });
  
  test("Não deve alterar a ordem dos elementos", () => {
    expect(quadradosFuncional([3, 1, 2])).toEqual([9, 1, 4]);
  });

  test("Deve haver indício de abordagem funcional", () => {
    const mapSpy = vi.spyOn(Array.prototype, "map");
    const arr = [1, 2, 3];

    quadradosFuncional(arr);

    expect(mapSpy).toHaveBeenCalled();
    mapSpy.mockRestore();
  });
});
