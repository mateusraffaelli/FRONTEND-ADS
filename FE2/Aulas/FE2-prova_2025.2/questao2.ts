/*
a) Uma classe abstrata ContaBancaria
• propriedades (protegidas):
– saldo (number)
– titular (string)

• construtor: deve inicializar as propriedades saldo e titular

• métodos:

– depositar
* parâmetro: valor (number)
* retorno: nenhum
* comportamento: adiciona o valor ao saldo

– sacar (abstrato)
*parâmetro: valor (number)
* retorno: boolean

– exibirSaldo
* parâmetro: nenhum
* retorno: string no formato "Titular: [titular], Saldo: [saldo]"
*/

abstract class ContaBancaria {
    protected saldo: number
    protected titular: string

    constructor(saldo: number, titular: string){
        this.saldo = saldo
        this.titular = titular
    }

    depositar(valor: number): void{
        this.saldo += valor
    }

    abstract sacar(valor: number): boolean

    exibirSaldo(): string{
        return `Titular: ${this.titular}, Saldo: ${this.saldo}`
    }
}


/*
b) A classe ContaCorrente que estende ContaBancaria
• propriedade (privada):
– limiteChequeEspecial (number)
• construtor: deve inicializar as propriedades herdadas e a propriedade limiteChequeEspecial

• métodos:
– implementar o método sacar
*comportamento: permite sacar se o valor for menor ou igual ao saldo mais o limite do cheque especial, de $ 500,00;
* retorno: do tipo booleano para indicar se a operação foi bem sucedida ou não.
*/

class ContaCorrente extends ContaBancaria{
    private limiteChequeEspecial: number

    constructor(saldo: number, titular: string){
        super(saldo, titular)
        this.limiteChequeEspecial = 500
    }

    sacar(valor: number): boolean {
        if(valor <= this.saldo + this.limiteChequeEspecial){
            this.saldo -= valor
            return true
        }

        return false
    }

}

/*

c) A classe ContaPoupanca que estende ContaBancaria

• métodos:
– implementar o método sacar
*comportamento: permite sacar se o valor for menor ou igual ao saldo;
*retorno: do tipo booleano para indicar se a operação foi bem sucedida ou não.

*/

class ContaPoupanca extends ContaBancaria {
    sacar(valor: number): boolean {
        if(valor <= this.saldo){
            this.saldo -= valor
            return true
        }

        return false
    }
}

/*
d) A interface Banco para permitir adicionar múltiplas contas bancárias. A chave deve ser o CPF do
titular e o valor deve ser uma instância de ContaBancaria.
*/

interface Banco{
    [cpf: string]: ContaBancaria
}

