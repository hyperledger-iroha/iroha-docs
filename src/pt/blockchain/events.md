---
translation_locale: pt
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# Eventos {#events}

Eventos são emitidos quando certas coisas acontecem dentro da blockchain, por exemplo, quando uma nova conta é criada ou um bloco é confirmado. Existem diferentes tipos de eventos:

- eventos do pipeline de processamento
- eventos de dados
- eventos de tempo
- disparar eventos de execução

## Eventos do pipeline de processamento {#pipeline-events}

Eventos do pipeline de processamento são emitidos à medida que transações e blocos avançam pelo pipeline. Um evento de transação contém o hash da transação, a altura do bloco, os IDs da faixa e do espaço de dados e um status: `Queued`, `Expired`, `Approved` ou `Rejected` com o motivo da rejeição. Um evento de bloco contém o cabeçalho do bloco e um status: `Created`, `Approved`, `Rejected` com o motivo, `Committed` ou `Applied`.

### Experimente em Taira {#try-it-on-taira}

Verifique se o fluxo de eventos do pipeline de processamento público está montado:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Para inspecionar um instantâneo sem manter um fluxo aberto, leia as transações recentes do explorador:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

Abra a rota SSE em um terminal quando precisar de eventos ao vivo:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Se nenhuma transação for enviada enquanto o fluxo estiver aberto, o comando pode permanecer silencioso mesmo que a rota esteja saudável.

## Eventos de Dados {#data-events}

Eventos de dados são emitidos quando há uma mudança relacionada aos dados do registro blockchain, como pares de rede, domínios, contas, ativos, definições de ativos, NFTs, gatilhos, funções, configuração on-chain, estado do executor, provas, ativos confidenciais, pontes ou objetos específicos de SORA Nexus. Esses tipos de eventos são usados em [filtros de evento de dados](./filters.md#data-event-filters).

## Eventos de Tempo {#time-events}

Eventos de tempo são emitidos quando a visualização do estado do mundo está pronta para lidar com [gatilhos de tempo](./triggers.md#time-triggers).

## Eventos de Execução de Disparo {#trigger-execution-events}

Eventos de execução de gatilho são emitidos quando o [`ExecuteTrigger`](./instructions.md#executetrigger) a instrução é executada. Eventos de conclusão de gatilho são emitidos após uma ação de gatilho ser concluída.
