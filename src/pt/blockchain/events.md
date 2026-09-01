---
translation_locale: pt
translation_source: /blockchain/events.md
translation_source_hash: 16b8cacc9bdf156d4b1e1a93b720085adcabb0002a34b9dc564a9926f573de63
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Eventos {#events}

Eventos são emitidos quando certas coisas acontecem dentro da blockchain, por exemplo, quando uma nova conta é criada ou um bloco é confirmado. Existem diferentes tipos de eventos:

- eventos do pipeline de processamento
- eventos de dados
- eventos de tempo
- disparar eventos de execução

## Eventos do pipeline de processamento {#pipeline-events}

Eventos do pipeline de processamento são emitidos quando transações são enviadas, executadas ou confirmadas em um bloco. Um evento do pipeline de processamento contém as seguintes informações: o tipo de entidade que causou o evento (transação ou bloco), seu hash criptográfico e status. O status pode ser `Validating` (validação em andamento), `Rejected` ou `Committed`. Se uma entidade foi rejeitada, o motivo da rejeição é fornecido.

### Experimente em Taira {#try-it-on-taira}

Verifique se o fluxo de eventos do pipeline de processamento público está montado:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

Para inspecionar um instantâneo sem manter um fluxo aberto, leia as transações recentes do explorador:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?page=1&per_page=5' \
  | jq '{pagination, txs: [.items[] | {hash, block, status, executable}]}'
```

Abra a rota SSE em um terminal quando precisar de eventos ao vivo:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

Se nenhuma transação for enviada enquanto o fluxo estiver aberto, o comando pode permanecer silencioso mesmo que a rota esteja saudável.

## Eventos de Dados {#data-events}

Eventos de dados são emitidos quando há uma mudança relacionada aos dados do registro blockchain, como pares de rede, domínios, contas, ativos, definições de ativos, NFTs, gatilhos, funções, configuração on-chain, estado do executor, provas, ativos confidenciais, pontes ou objetos específicos de SORA/Nexus. Esses tipos de eventos são usados em [filtros de evento de dados](./filters.md#data-event-filters).

## Eventos de Tempo {#time-events}

Eventos de tempo são emitidos quando a visualização do estado do mundo está pronta para lidar com [gatilhos de tempo](./triggers.md#time-triggers).

## Eventos de Execução de Disparo {#trigger-execution-events}

Eventos de execução de gatilho são emitidos quando o [`ExecuteTrigger`](./instructions.md#executetrigger) a instrução é executada. Eventos de conclusão de gatilho são emitidos após uma ação de gatilho ser concluída.
