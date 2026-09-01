---
translation_locale: pt
translation_source: /blockchain/filters.md
translation_source_hash: 36c99c1db78e357ea9fe0ca8ab9b79c9e2b20da08d329c563f1f33ff2bf8c288
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Filtros {#filters}

Filtros restringem fluxos de eventos e acionam condições. O filtro de eventos de nível superior atual é `EventFilterBox`, que pode corresponder a estas famílias de eventos:

- `Pipeline`
- `Data`
- `Time`
- `ExecuteTrigger`
- `TriggerCompleted`

Use o filtro mais estreito que corresponda ao fluxo de trabalho. Filtros amplos como `DataEventFilter::Any` são úteis para diagnósticos, mas fazem com que cada evento pague o custo da correspondência de gatilho ou assinante.

## Filtros de Evento de Dados {#data-event-filters}

`DataEventFilter` corresponde aos eventos de dados do livro-razão da blockchain. Suas variantes atuais incluem:

|Variante|Família de eventos|
| --- | --- |
| `Any` |Qualquer evento de dado|
| `Peer` |eventos do ciclo de vida de pares de rede|
| `Domain` |Ciclo de vida de domínio e eventos de metadados|
| `Account` |Ciclo de vida da conta, metadados, alias e eventos de identidade|
| `Asset` |Eventos de saldo de ativos e metadados|
| `AssetDefinition` |Ciclo de vida da definição de ativo, política e eventos de metadados|
| `Nft` |NFT eventos de ciclo de vida e metadados|
| `Rwa` |Eventos do ciclo de vida de ativos do mundo real|
| `Trigger` |Acionar eventos de ciclo de vida e metadados|
| `Role` |Eventos do ciclo de vida da função|
| `Configuration` |Eventos de configuração na blockchain|
| `Executor` |eventos do executor de tempo de execução de software|
| `Proof` |Eventos do ciclo de vida de verificação de prova|
| `Confidential` |Eventos de ativos confidenciais|
| `VerifyingKey` |Eventos do registro da chave de verificação|
| `RuntimeUpgrade` |eventos de atualização de tempo de execução de software|
| `Soradns` |Resolver eventos de governança de diretório|
| `Sorafs` |SoraFS eventos de conformidade do gateway|
| `SpaceDirectory` |Eventos do ciclo de vida do manifesto técnico do Diretório Espacial|
| `Escrow` |Eventos do ciclo de vida de custódia de ativos nativos transparentes|
| `Offline` |Eventos de liquidação offline|
| `Oracle` |Eventos de feed do Oracle|
| `Social` |Eventos de incentivo viral|
| `Bridge` |Eventos de bridge|
| `Governance` |Eventos de governança quando o recurso de governança está ativado|

A maioria dos filtros concretos também permite um correspondedor de ID opcional e uma máscara de conjunto de eventos. Por exemplo, um filtro de ativo pode corresponder a um ativo ou a uma classe de eventos de ativos, enquanto um filtro de gatilho pode corresponder a um ID de gatilho e a um conjunto de eventos de gatilho.

## filtros do pipeline de processamento {#pipeline-filters}

Filtros do pipeline de processamento correspondem a eventos de processamento, como bloco, transação, merge e testemunha. Use-os para assinaturas operacionais, painéis de processamento de blocos e gatilhos que reagem ao estado do pipeline de processamento em vez de objetos de dados do livro razão da blockchain.

## Filtros de Gatilho {#trigger-filters}

Os gatilhos armazenam sua condição como um `EventFilterBox`. Uma ação de gatilho também armazena:

- um executável
- uma política de repetição
- uma conta principal de autorização
- uma política de tentativa opcional com acionamento por tempo
- metadados

O principal de autorização do gatilho deve ter as permissões exigidas pelo executável. Prefira contas técnicas dedicadas para gatilhos de longa duração.

## Filtros de Consulta {#query-filters}

Os filtros de consulta são separados dos filtros de eventos. Consultas iteráveis podem expor suporte a predicado e seletor. Use filtros tipados específicos da consulta do SDK para que a entrada do filtro corresponda ao tipo de saída da consulta.

Veja também:

- [Eventos](/pt/blockchain/events.md)
- [Escrow de Ativo Nativo](/pt/blockchain/escrow.md#queries-and-events)
- [Gatilhos](/pt/blockchain/triggers.md)
- [Consultas](/pt/blockchain/queries.md)
- [Referência de consulta](/pt/reference/queries.md)
