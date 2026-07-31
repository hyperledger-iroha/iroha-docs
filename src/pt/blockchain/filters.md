---
translation_locale: pt
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Filtros {#filters}

Filtros estreitos fluxos de eventos e condições de desencadeamento. O filtro atual de eventos de nível superior é `EventFilterBox`, que pode corresponder a estas famílias de eventos:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Use o filtro mais estreito que corresponda ao fluxo de trabalho. Filtros largos como `DataEventFilter::Any` são úteis para diagnóstico, mas fazem com que cada evento pague o custo do gatilho ou da correspondência dos assinantes.

## Filtros de Eventos de Dados {#data-event-filters}

`DataEventFilter` corresponde a eventos de dados do livro. As suas variantes atuais incluem:

|Variante .|Família de eventos |
| --- | --- |
|`Any` |Qualquer evento de dados |
|`Peer` |Eventos do ciclo de vida dos pares |
|`Domain` |Ciclo de vida do domínio e eventos de metadados |
|`Account` |Ciclo de vida da conta, metadados, alias e eventos de identidade |
|`Asset` |Eventos de balanço dos ativos e metadados |
|`AssetDefinition` |Ciclo de vida, política e eventos de metadados |
|`Nft` |NFT eventos do ciclo de vida e dos metadados |
|`Rwa` |Eventos do ciclo de vida dos ativos no mundo real |
|`Trigger` |Eventos do ciclo de vida e dos metadados desencadeadores |
|`Role` |Eventos do ciclo de vida dos papéis |
|`Configuration` |Eventos de configuração na cadeia |
|`Executor` |Eventos executores de tempo de execução |
|`Proof` |Eventos do ciclo de vida da verificação de provas |
|`Confidential` |Eventos de activos confidenciais |
|`VerifyingKey` |Eventos de registo de chave de verificação |
|`RuntimeUpgrade` |Eventos de atualização do tempo de execução |
|`Soradns` |Resolver eventos de governação do diretório |
|`Sorafs` |SoraFS Eventos de conformidade do gateway |
|`SpaceDirectory` |Directório Espacial manifesta eventos do ciclo de vida |
|`Escrow` |Eventos transparentes do ciclo de vida dos activos nativos em custódia |
|`Offline` |Eventos de liquidação offline |
|`Oracle` |Eventos de alimentação Oracle |
|`Social` |Eventos de incentivo viral |
|`Bridge` |Eventos da ponte |
|`Governance` |Eventos de governança quando o recurso de governança estiver habilitado |

A maioria dos filtros de concreto também permite um combinador opcional ID e uma máscara de conjunto de eventos. Por exemplo, um filtro de ativos pode corresponder a um ativo ou uma classe de eventos de ativos, enquanto um filtro gatilho pode corresponsar a um gatilho ID e um conjunto de eventos gatilhos.

## Filtros de oleodutos {#pipeline-filters}

Os filtros de pipeline correspondem a eventos de processamento, como blocos, transações, fusões e eventos de testemunhas.

## Filtros de desencadeamento {#trigger-filters}

Os gatilhos armazenam a sua condição como um `EventFilterBox`.

- um executável
- uma política de repetição
- uma conta da autoridade
- uma política opcional de retestamento do time-trigger
- Metadados

A autoridade de desencadeamento deve ter as permissões exigidas pelo executável.

## Filtros de consulta {#query-filters}

Os filtros de consulta são separados dos filtros de eventos. As consultas iteráveis podem expor o suporte de predicado e selector. Use filtros tipados específicos da consulta a partir do SDK para que a entrada do filtro coincida com o tipo de saída da pergunta.

Veja também:

- [Eventos](/pt/blockchain/events.md)
- [Escrow de ativos nativos ](/pt/blockchain/escrow.md#queries-and-events)
- [Trigores](/pt/blockchain/triggers.md)
- [Questões](/pt/blockchain/queries.md)
- [Referência à consulta](/pt/reference/queries.md)
