// • Implemente uma função para formatar valores monetários em reais;
// • Esta função deve ser usada em pelo menos um outro módulo do projeto;
// • Utilize uma exportação default.

const formatarValores = (valor: number): string => {
    const opcoes: Intl.NumberFormatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }

    const valorFormatado = valor.toLocaleString('pt-BR', opcoes)

    return `R$ ${valorFormatado}`
}

export default formatarValores