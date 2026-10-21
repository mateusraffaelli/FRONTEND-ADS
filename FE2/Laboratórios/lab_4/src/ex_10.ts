interface Carro{
    ano: number,
    modelo: string,
    marca: string,
    andar(): string, 
    buzinar(): string,
    virar(direção: string): string;
}

class CarroClass implements Carro{
    ano: number;
    modelo: string;
    marca: string;

    constructor(ano: number, modelo: string, marca: string){
        this.ano = ano;
        this.modelo = modelo;
        this.marca = marca;
    }

    andar(): string {
        return 'Andando';
    }

    buzinar(): string {
        return 'Buzinando';
    }

    virar(direção: string): string {
        return `Virando para ${direção}`;
    }

}
    
const fabricaCarro  = (ano: number, modelo: string, marca: string) => {
    return new CarroClass(ano, modelo, marca);
}

const carro1 = fabricaCarro(2021, "Renegade", "Jeep");
console.log(carro1.andar());
console.log(carro1.buzinar());
console.log(carro1.virar('direita'));

const carro2 = fabricaCarro(2018, "Sandero", "Renault");
console.log(carro2.andar());
console.log(carro2.buzinar());
console.log(carro2.virar('esquerda'));