---
translation_locale: pt
translation_source: /blockchain/triggers.md
translation_source_hash: 9443b139623544fd3c54b324e54b7e06f57820c70ffd0856f05aacac9f7591a3
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Gatilhos {#triggers}

Os gatilhos vinculam um filtro de evento a uma ação executável. Quando um evento corresponde ao filtro do gatilho, Iroha avalia a ação do gatilho como parte da execução do bloco.

## Estrutura {#structure}

Um `Trigger` registrado contém:

- `id`: um `TriggerId` encapsulando um `Name`
- `action`: o executável, o principal de autorização, o filtro, a política de repetição, a política de tentativa e os metadados

A ação contém:

- `executable`: `Instructions`, `ContractCall`, `Ivm` ou `IvmProved`
- `repeats`: `Indefinitely` ou `Exactly(n)`
- `authority`: a conta que invoca o executável
- `filter`: um `EventFilterBox`
- `retry_policy`: comportamento de nova tentativa opcional para gatilhos de horário agendados
- `metadata`: metadados de gatilho arbitrário

## Filtros de Evento {#event-filters}

As condições de gatilho usam o mesmo modelo de filtro de eventos que as assinaturas. O filtro de eventos de nível superior pode corresponder a:

- eventos do pipeline de processamento
- eventos de dados
- eventos de tempo
- disparar eventos de execução
- disparar eventos de conclusão

Prefira o filtro mais estreito que corresponda ao fluxo de trabalho. Filtros amplos são úteis para diagnóstico, mas aumentam o trabalho durante a execução do bloco.

Veja [Filtros](/pt/blockchain/filters.md) para as famílias de filtros atuais.

## Gatilhos de Tempo {#time-triggers}

Os gatilhos de tempo utilizam um filtro de evento de tempo. Quando a visualização do estado do mundo atinge uma condição de tempo correspondente, Iroha executa a ação do gatilho sob o principal de autorização do gatilho. Os gatilhos de tempo são o tipo de gatilho que pode usar a política de reintento descrita abaixo.

## Repetição {#repetition}

`Repeats::Indefinitely` mantém um gatilho ativo até que ele seja desregistrado.

`Repeats::Exactly(n)` permite que o gatilho dispare um número fixo de vezes. Quando a contagem se esgota, registre um novo gatilho se o mesmo comportamento for necessário novamente.

## autorização principal e permissões {#authority-and-permissions}

O principal de autorização do gatilho é a conta usada para invocar o executável. Use uma conta técnica dedicada para gatilhos de longa duração, para que as permissões necessárias sejam explícitas e isoladas da conta pessoal de um operador.

O principal de autorização precisa das permissões exigidas pelas instruções executáveis ou pela chamada de contrato. A conta que registra o gatilho também precisa de permissão para registrar gatilhos sob o validador de tempo de execução de software ativo.

## Política de Repetição {#retry-policy}

Gatilhos de tempo podem optar por uma política de nova tentativa. Uma política de nova tentativa define:

- `max_retries`: quantas tentativas de repetição são permitidas após uma falha inicial de disparo
- `retry_after_ms`: quanto tempo Iroha espera antes que uma nova tentativa se torne elegível

Quando o orçamento de tentativas é esgotado, o acionador é desregistrado.

## Consultas {#queries}

Use as consultas de gatilho atuais para inspecionar o estado do gatilho:

- [`FindTriggers`](/pt/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindActiveTriggerIds`](/pt/reference/queries.md#triggers-contracts-transactions-and-blocks)
- [`FindTriggerById`](/pt/reference/queries.md#triggers-contracts-transactions-and-blocks)

Veja também:

- [Exemplo de acionamento de evento](/pt/blockchain/trigger-examples.md)
- [Eventos](/pt/blockchain/events.md)
- [Instruções](/pt/blockchain/instructions.md)
- [Permissões](/pt/blockchain/permissions.md)
