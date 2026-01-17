# Quiz Java (Prova de Conceito)

## Questão 1 (Fundamentos)
Em Java, a diferença central é que array tem tamanho fixo e pode armazenar tipos primitivos diretamente, enquanto ArrayList tem tamanho dinâmico e oferece métodos prontos para manipulação (como inserção e remoção). Escolheria array quando o tamanho da coleção já estiver definido e precisar de uma estrutura mais simples e eficiente para acesso por índice; quando precisar de flexibilidade e operações de lista no dia a dia, ArrayList é mais adequado.

## Questão 2 (Arquitetura & Spring)
No Spring Boot, @Autowired permite que o Spring injete automaticamente as dependências que a classe precisa, evitando instanciar objetos manualmente. No NestJS, a ideia é equivalente: @Injectable() define providers que o framework injeta, normalmente via construtor.

## Questão 3 (Leitura de Código)
O risco é comparar double diretamente, porque ponto flutuante pode ter imprecisões de representação e um valor calculado que deveria ser 100 pode não ser exatamente 100.00.

## Questão 4 (Tratamento de Erros)
Checked exceptions precisam ser tratadas (try/catch) ou declaradas (throws) e geralmente envolvem falhas previsíveis, como operações de I/O. Unchecked exceptions (RuntimeException) não exigem tratamento obrigatório e normalmente indicam erro de lógica/uso do código ou falhas inesperadas em runtime.
