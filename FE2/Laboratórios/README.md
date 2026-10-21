# Laboratórios

Neste repositório devem ser incluídas as atividades de laboratórios propostas na desciplina Programação Frontent 2

## Orientações para as atividades

1. Clone o repositório da atividade na sua máquina local
2. Para cada laboratório, crie uma pasta `lab_n`, onde `n` é o número do laboratório; todos os arquivos do laboratório devem estar dentro da pasta
3. Crie um arquivo JavaScript para cada um dos exercícios do laboratório com o nome `ex_n.js`, onde `n` é o número do exercício
4. É importante que os nomes das pastas e arquivos sigam exatamente os modelos acima para que os testes possam encontrá-los
5. Cada exercício/arquivo deve ser registrada em _commits_ separados (pelo menos um por exercício)
6. Empurre as alterações para o repositório remoto no GitHub
7. Siga as boas práticas de programação!

## Sobre os testes

1. Os testes são opcionais e a resolução dos exercícios não depende deles; no entanto, eles podem ser usados para validar suas soluções e garantir que estão corretas
2. É necessário ter o Node.js com mpn instalado para rodar os testes
3. Caso os testes para algum laboratório não estejam disponíveis na pasta `./testes`, verifique se há algum _pull request_ aberto no repositório do GitHub com os testes para este laboratório
4. Após clonar o repositório, execute o comando `npm install` para instalar as dependências necessárias para rodar os testes
5. Para rodar todos os testes, utilize o comando `npm test`;
6. Para rodar os testes de um exercício específico, utilize o comando `npm run test:m-n`, onde `m` é o número do laboratório e `n` é o número do exercício
7. Para que os testes sejam executados corretamente, é necessário que as funções estejam exportadas corretamente no arquivo JavaScript de cada exercício, incluindo a seguinte linha no final do arquivo: `export { funcao1, funcao2 }`, onde `funcao1` e `funcao2` são os nomes das funções exportadas