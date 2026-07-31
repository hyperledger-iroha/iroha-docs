---
translation_locale: pt
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Eventos {#events}

Os eventos são emitidos quando certas coisas acontecem dentro da blockchain, por exemplo, uma nova conta é criada ou um bloco é comprometido. Há diferentes tipos de eventos:

- acontecimentos do gasoduto
- Eventos de dados
- acontecimentos do tempo
- desencadear eventos de execução

## Eventos do gasoduto {#pipeline-events}

Eventos de pipeline são emitidos quando transações são enviadas, executadas ou comprometidas com um bloco. Um evento de pipeline contém as seguintes informações: o tipo de entidade que causou um evento (transação ou bloco), seu hash e status. O estatuto pode ser `Validating` (validação em andamento), `Rejected` ou `Committed`. Se uma entidade foi rejeitada, é indicado o motivo da rejeição.

### Tente em Taira {#try-it-on-taira}

Verifique se o fluxo de eventos do pipeline público está montado:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Para uma imagem instantânea que você pode inspecionar sem manter um fluxo aberto, leia transações recentes do explorador:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Abre a rota SSE em um terminal quando precisar de eventos ao vivo:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Se nenhuma transação for enviada enquanto o fluxo está aberto, o comando pode ficar quieto mesmo que a rota seja saudável.

## Eventos de dados {#data-events}

Os eventos de dados são emitidos quando houver uma alteração relacionada aos dados do livro-razão, tais como pares, domínios, contas, ativos, definições de ativos, NFTs, gatilhos, papéis, configuração na cadeia, estado do executor, provas, ativos confidenciais, pontes ou objetos específicos de SORA/Nexus. Esses tipos de eventos são utilizados nos filtros de eventos de dados [ ](./filters.md#data-event-filters).

## Eventos do Tempo {#time-events}

Os eventos do tempo são emitidos quando a visão do estado mundial está pronta para lidar com os gatilhos do tempo [ ](./triggers.md#time-triggers).

## Eventos de Execução Trigger {#trigger-execution-events}

Os eventos de execução do gatilho são emitidos quando a instrução [`ExecuteTrigger`](./instructions.md#executetrigger) é executada.
