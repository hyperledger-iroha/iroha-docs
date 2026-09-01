---
translation_locale: pt
translation_source: /cookbook/index.md
translation_source_hash: 58f5247ece30d3755c38d4d24ae4553a35e0d0437476092d568a1be5c8a2ed28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha 3 Manual de Aplicação {#iroha-3-application-cookbook}

Construir contra Iroha 3 com receitas pequenas e verificáveis que começam no Taira testnet e manter Minamoto mainnet somente leitura. Cada receita indica se é uma leitura pública, uma escrita de conta financiada normal, ou uma operação com permissão restrita. Os comandos usam o atual I105 IDs de conta, seleção explícita de taxa e o comportamento verificado em Iroha comprometer [`0010c5a70039eac101a4846499ba9ceaf43eb65c`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c).

Comece com [Conectar-se a Taira](./connect-to-taira.md). Ele cria a configuração do cliente e os metadados de taxa reutilizados pelas instruções da linha de comando. Nunca copie um ID de ativo de taxa desta documentação: derive-o a partir da resposta atual do serviço de financiamento do testnet Taira.

## Níveis de acesso {#access-levels}

- Público — não é necessário nenhum signatário criptográfico ou permissão de rede.
- Pronto para escrever — use uma conta de teste financiada na Taira, um pagador de taxa explícito e o ativo de taxa atual devolvido pelo dispensador.
- Permissão necessária — Taira deve conceder permissão ao tempo de execução do software nomeado ou ao namespace governado. Use uma rede local gerada quando essa concessão não estiver disponível; o sucesso local não confere ao principal de autorização Taira.

Nenhuma receita de livro de receitas envia uma escrita para Minamoto.

## Iniciar e enviar {#start-and-submit}

|Receita| Taira acesso |Com o que você termina|
| --------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| [Conectar-se a Taira](./connect-to-taira.md)                             |Pronto para escrever|Um signatário I105 financiado, um ativo de taxa vigente e uma transação canário aplicada|
| [Enviar e verificar transações](./submit-and-verify-transactions.md) |Pronto para escrever|Uma transação com cotação, o resultado terminal do pipeline e um recibo armazenado|

## estado do livro razão da blockchain {#ledger-state}

|Receita| Taira acesso|Com o que você termina|
| ------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| [Contas e apelidos](./accounts-and-aliases.md) |Permissão necessária|Uma conta I105 mais um alias legível por humanos que pode ser resolvido|
| [Ativos fungíveis](./fungible-assets.md)           |Permissão necessária|Uma definição registrada, saldo emitido e transferência verificada|
| [NFTs](./nfts.md)                                 |Permissão necessária|Um NFT registrado, transferiu a propriedade e consulta pós-estado|
| [Metadados](./metadata.md)                         |Pronto para escrita em objetos próprios; permissão necessária caso contrário|Uma gravação de metadados seguida por uma leitura exata|
| [Consultar o estado do livro-razão da blockchain](./query-ledger-state.md)     |Público para estado público|Resultados paginados e filtrados sem uma escrita|

## Acesso e automação {#access-and-automation}

|Receita| Taira acesso        |Com o que você termina|
| --------------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| [Permissões e funções](./permissions-and-roles.md) |Permissão necessária|Uma permissão com escopo coletada em um papel reutilizável|
| [Transmitir eventos](./stream-events.md)                 |Público|Um consumidor SSE que se reconecta após uma desconexão|
| [Gatilhos](./triggers.md)                           |Permissão necessária|Um gatilho por chamada, registro de resultado do protocolo de execução e evento de conclusão|
| [Multisig](./multisig.md)                           |Pronto para escrever|Uma conta multissig ponderada e proposta aprovada por quórum|

## Padrões de aplicação {#application-patterns}

|Receita| Taira acesso|Com o que você termina|
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Contratos inteligentes](./smart-contracts.md) |Permissão necessária|Verificado Kotodama bytecode, artefatos de implantação e uma chamada de contrato|
| [Wallet Connect](./wallet-connect.md)   |Pronto para escrita quando o Connect estiver habilitado|Uma transferência aprovada pela carteira e um hash reconciliado da transação|
| [Depósito em garantia nativo](./native-escrow.md)     |Pronto para escrita para proprietários de ativos; resolução de disputas requer permissão|Um bloqueio nativo ou escrow de mercado com estado final consultado|

## Exemplos verificados de superfícies {#verified-example-surfaces}

As marcas abaixo descrevem exemplos executáveis em cada receita, não todos os SDK que podem acessar o recurso.

|Receita| HTTP / curl | CLI | Rust | JavaScript | Python | Kotodama |
| --------------------- | :---------: | :-: | :--: | :--------: | :----: | :------: |
|Conectar-se ao Taira|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Enviar e verificar|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Contas e apelidos|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Ativos fungíveis|      ✓      |  ✓  |  —   |     ✓      |   —    |    —     |
| NFTs                  |      ✓      |  ✓  |  —   |     —      |   —    |    ✓     |
|Metadados|      ✓      |  ✓  |  —   |     —      |   —    |    —     |
|Consultar o estado do livro razão da blockchain|      ✓      |  ✓  |  ✓   |     ✓      |   —    |    —     |
|Permissões e funções|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Eventos de transmissão|      ✓      |  —  |  —   |     ✓      |   —    |    —     |
|Gatilhos|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Multisig|      —      |  ✓  |  ✓   |     —      |   —    |    —     |
|Contratos inteligentes|      —      |  ✓  |  —   |     —      |   —    |    ✓     |
|Conectar Carteira|      ✓      |  —  |  ✓   |     ✓      |   —    |    —     |
|Depósito em garantia nativo|      —      |  —  |  ✓   |     ✓      |   ✓    |    ✓     |

Cada receita está vinculada à arquitetura de produção, operações, SDK e API de orientação. A própria receita mostra um caminho bem-sucedido. Ela também inclui as verificações necessárias para comprovar o resultado.
