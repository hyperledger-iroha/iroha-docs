---
translation_locale: pt
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Trigas {#triggers}

Os gatilhos ligam um filtro de evento a uma ação executável. Quando um evento corresponde ao filtro do gatilho, Iroha avalia a ação de gatilho como parte da execução do bloco.

## Estrutura {#structure}

Um `Trigger` registado contém:

- `id`: um `TriggerId` envolvendo um `Name`
- `action`: executável, autoridade, filtro, política de repetição, política de retest e metadados.

A acção contém:

- `executable`: `Instructions`, `ContractCall`, `Ivm` ou `IvmProved`
- `repeats`: `Indefinitely` ou `Exactly(n)`
- `authority`: a conta que invoca o executável
- `filter`: um `EventFilterBox`
- `retry_policy`: comportamento opcional de retest para os gatilhos de tempo programados
- `metadata`: metadados de gatilho arbitrários

## Filtros de eventos {#event-filters}

As condições de desencadeamento usam o mesmo modelo de filtro de eventos que as assinaturas. O filtro de evento de nível superior pode corresponder:

- acontecimentos do gasoduto
- Eventos de dados
- acontecimentos do tempo
- desencadear eventos de execução
- desencadear eventos de conclusão

Preferimos o filtro mais estreito que corresponda ao fluxo de trabalho. Os filtros largos são úteis para diagnóstico, mas aumentam o trabalho durante a execução do bloco.

Ver [Filtros ](/pt/blockchain/filters.md) para as famílias de filtros atuais.

## Os gatilhos do tempo {#time-triggers}

Os gatilhos de tempo usam um filtro de evento de tempo. Quando a visão do estado mundial atinge uma condição de tempo correspondente, Iroha executa a ação de gatilho sob a autoridade do gatilho. Os gatilhas de tempo são o tipo de gatilha que pode usar a política de retoma descrita abaixo.

## Repetição {#repetition}

`Repeats::Indefinitely` mantém ativo um gatilho até que não seja registado.

`Repeats::Exactly(n)` permite que o gatilho disparar um número fixo de vezes. Quando a contagem é esgotada, registre um novo gatilho se for necessário o mesmo comportamento novamente.

## Autoridade e Permissões {#authority-and-permissions}

A autoridade do gatilho é a conta usada para invocar o executável. Use uma conta técnica dedicada para gatilhos de longa duração para que as permissões exigidas sejam explícitas e isoladas da conta pessoal de um operador.

A autoridade precisa das permissões exigidas pelas instruções executáveis ou por uma chamada de contrato.

## Política de Reprovação {#retry-policy}

Os gatilhos de tempo podem optar por uma política de retentagem.

- `max_retries`: quantas tentativas de retomada são permitidas após um lançamento inicial falhado
- `retry_after_ms`: quanto tempo Iroha espera antes de uma nova prova ser elegível;

Quando o orçamento da nova tentativa é esgotado, o gatilho não está registrado.

## Questões {#queries}

Use as consultas de gatilho atuais para inspecionar o estado do gatilho:

- [`FindTriggers`](/pt/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/pt/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/pt/reference/queries.md#triggers-contracts-transactions-and-blocks)

Veja também:

- [Exemplo de gatilho de evento](/pt/blockchain/trigger-examples.md)
- [Eventos](/pt/blockchain/events.md)
- [Instruções ](/pt/blockchain/instructions.md)
- [Permissões](/pt/blockchain/permissions.md)
