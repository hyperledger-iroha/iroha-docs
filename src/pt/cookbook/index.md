---
translation_locale: pt
translation_source: /cookbook/index.md
translation_source_hash: aceef9f4e42462614a5cdf41a89f55e26e0399503a48d4b50c08359e7bd7532e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 Manual de aplicação {#iroha-3-application-cookbook}

Construir contra Iroha 3 com receitas pequenas e verificáveis, que começam no Taira testnet e manter Minamoto Cada receita indica se é uma leitura pública. uma escrita normal de conta financiada, ou uma operação com limite de permissão. I105 Conta IDs, seleção explícita de taxas, e o comportamento verificado no Iroha Compromissar [`0010c5a70039eac101a4846499ba9ceaf43eb65c`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c).

Comece com [Conecte-se a Taira](./connect-to-taira.md). Ele cria a configuração do cliente e os metadados de taxas reutilizados pelas receitas da linha de comando. Nunca copie um ativo de taxa ID desta documentação: derive-o da resposta atual do torneio Taira.

## Níveis de acesso {#access-levels}

- Público  Não é necessária autorização de assinatura ou de rede.
- Preparação para escrever  utilizar uma conta de ensaio Taira financiada, um pagador explícito de taxas e o ativo da taxa corrente devolvido pela torneira.
- Permissão necessária  Taira deve conceder a licença de execução nomeada ou espaço de nomes governado. Use uma rede local gerada quando essa concessão não estiver disponível; o sucesso local não confere autoridade à Taira.

Nenhuma receita do livro de cozinha envia um texto para Minamoto.

## Começar e submeter {#start-and-submit}

|Receita .|Acesso Taira |O que acabas com ?|
| --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [Conectar a Taira](./connect-to-taira.md) |Pronto para escrever|Uma assinante I105 financiada, um ativo de taxa real e uma transacção canária aplicada |
| [Presentação e verificação de transações ](./submit-and-verify-transactions.md)|Pronto para escrever|Uma transacção cotada, resultado do pipeline terminal e recibo armazenado |

## Estado do Ledger {#ledger-state}

|Receita .|Acesso Taira |O que acabas com ?|
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| [Contas e pseudónimos](./accounts-and-aliases.md) |Permissão exigida |Uma conta I105 mais um alias resolvivel para leitura humana |
| [Ativos funcionais ](./fungible-assets.md) |Permissão exigida |Definição registada, saldo bancário e transferência verificada |
| [NFTs](./nfts.md)|Permissão exigida |Um NFT registado, a propriedade transferida e uma consulta pós-estado |
| [Metadados](./metadata.md) |Pronto para escrita para objetos de propriedade; autorização exigida em caso contrário |Um metadados escrever seguido por uma leitura exata |
| [Estado do livro-razão de consulta](./query-ledger-state.md) |Público para Estado público |Resultados em páginas e filtros sem inscrição |

## Acesso e automação {#access-and-automation}

|Receita .|Acesso Taira |O que acabas com ?|
| --------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| [Permissões e funções ](./permissions-and-roles.md) |Permissão exigida |Uma autorização com escopo recolhida em um papel reutilizável |
| [Eventos de transmissão](./stream-events.md) |Público |Um consumidor reconnectante SSE que se reconcilia depois de uma desconexão |
| [Trigers](./triggers.md) |Permissão exigida |Um gatilho de chamada, recibo de execução e evento de conclusão |
| [Multisig](./multisig.md) |Pronto para escrever|Uma conta ponderada multisig e uma proposta aprovada por quórum |

## Padrões de aplicação {#application-patterns}

|Receita .|Acesso Taira |O que acabas com ?|
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Contratos inteligentes](./smart-contracts.md) |Permissão exigida |Verificado Kotodama código de byte, artefatos de implantação e um contrato de chamada |
| [Wallet Connect](./wallet-connect.md) |Pronto para escrever quando o Connect estiver habilitado |Transferência de ativos aprovada por carteira e hash de transacção reconciliado |
| [Reservatório nacional ](./native-escrow.md) |Preparada para a escrita dos proprietários de activos; resolução de litígios requer permissão |Uma fechadura nativa ou garantia de mercado com o estado final solicitado |

## Superfícies de exemplo verificadas {#verified-example-surfaces}

As marcas abaixo descrevem exemplos executáveis em cada receita, e não todos os SDK que podem acessar o recurso.

|Receita .|HTTP / curl |CLI |Rust |JavaScript |Python |Kotodama |
| --------------------- | :---------: | :-: | :--: | :--------: | :----: | :------: |
|Ligação a Taira |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Submeter e verificar |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Contas e pseudónimos |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Ativos funcionais |      ✓      |  ✓  |  —   |     ✓      |   —    |    —     |
|NFTs |      ✓      |  ✓  |  —   |     —      |   —    |    ✓     |
|Metadados |      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Estado do livro-razão de consulta |      ✓      |  ✓  |  ✓   |     ✓      |   —    |    —     |
|Permissões e funções |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Eventos de transmissão |      ✓      |  —  |  —   |     ✓      |   —    |    —     |
|Os gatilhos .|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Multisig |      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Contratos inteligentes |      —      |  ✓  |  —   |     —      |   —    |    ✓     |
|Portfólio Conectar |      ✓      |  —  |  ✓   |     ✓      |   —    |    —     |
|Native escrow |      —      |  —  |  ✓   |     ✓      |   ✓    |    ✓     |

Cada receita liga-se à arquitetura de produção, às operações, às orientações SDK e API. A própria receita mostra um caminho de sucesso. Inclui também os controlos necessários para provar o resultado.
