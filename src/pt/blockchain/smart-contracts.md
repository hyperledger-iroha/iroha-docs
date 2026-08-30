---
translation_locale: pt
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Contratos inteligentes {#smart-contracts}


As transacções Iroha executam cargas úteis de `Executable`.

- `Executable::Instructions`: um conjunto ordenado de instruções especiais de Iroha
- `Executable::ContractCall`: uma chamada de referência para uma instância de contrato implantada
- `Executable::Ivm`: código de byte Iroha VM
- `Executable::IvmProved`: código de byte Iroha VM com uma sobreposição de instruções pré-computada e compromissos de prova.

Kotodama é Iroha É uma linguagem de alto nível para contratos inteligentes. `.ko` arquivo de origem compila para determinista IVM código de byte, conservado convencionalmente como um `.to` Artifacto para implantação. Kotodama Objectivos IVM Não se destina a RISC-V ou WebAssembly.

O primeiro lançamento suporta apenas a versão ABI. A política de syscall e pointer-ABI é um contrato incondicional V1 imposto pela admissão e execução; não há modo de execução alternativo.

## Quando usar contratos inteligentes {#when-to-use-smart-contracts}

Usar instruções normais quando a transacção puder ser expressa diretamente:

- Objetos de registo ou não registados
- Activos de menta, queimadura ou transferência
- atualização de metadados
- conceder ou revogar permissões
- executar um gatilho
- Parâmetros definidos na cadeia

Usar um contrato inteligente quando a transação precisa de lógica embalada que é difícil expressar como uma sequência de instruções estáticas, ou quando uma instância de contrato implantada deve ser chamada por referência.

## IVM Executáveis {#ivm-executables}

`Executable::Ivm` carrega código de byte bruto IVM. Os nós executam esse código dentro dos limites de tempo de execução configurados para a cadeia. Mantenha o código de bytes pequeno e determinista; os contratos fazem parte da execução das transações e, portanto, afetam o consenso.

O `Executable::IvmProved` é destinado a fluxos transportadores de prova e transporta:

- Código de byte IVM
- uma sobreposição de instruções deterministas
- um compromisso de execução de eventos
- um compromisso em matéria de política de gás

A prova liga a sobreposição ao bytecode executado. Dependendo da política de pipeline, os validadores podem verificar a execução da prova e reproduzir como uma verificação de segurança adicional.

## As chamadas de contrato implantadas {#deployed-contract-calls}

`Executable::ContractCall` invoca uma instância de contrato implantada por endereço. Use-a quando o código do contrato é registado separadamente e as transacções devem chamá-lo por referência em vez de carregar o código de byte sempre.

## Ciclo de vida do contrato e propriedade {#contract-lifecycle-and-ownership}

Cada endereço implantado mantém um registo `ContractLifecycleControlV1`, inclusive enquanto o contrato estiver inativo. O registo contém a proveniência imutável da primeira implantação, o proprietário atual e pendente, qualquer delegação do Parlamento revogável, o hash de código ativo, uma revisão de comparação e troca não-zero, Uma implantação direta registra a conta de implantação. uma implantação do Parlamento registra o seu proponente, o conteúdo da proposta ID e a tentativa de governança bem-sucedida ID.

O proprietário do ciclo de vida é uma conta ou o Parlamento.As alterações na propriedade da conta utilizam uma oferta e aceitação separadas; a aceitação de uma oferta autoriza qualquer delegação do Parlamento. Um proprietário de conta pode permitir que o Parlamento ative ou desative o contrato, revogando então essa delegação, mas a delegação nunca permite que o Parlamento transfira a propriedade.

Cereais `ActivateContractInstance` e `DeactivateContractInstance` As instruções só estão disponíveis para o titular da conta corrente. `expected_revision`; O tempo de execução rejeita as revisões obsoletas ou zero. Registo do ciclo de vida, que valida o artefato registado, o manifesto e ABI antes da mudança `active_code_hash`. A desativação limpa o hash do código ativo, mas mantém a propriedade e a proveniência. Cada transição bem-sucedida do ciclo de vida avança na revisão e emite o estado pós-completo.

A ativação também pode ser realizada em um gancho de ciclo de vida declarado por manifesto. Uma primeira ativação cujo manifesto contém um ponto de entrada `EntryPointKind::Hajimari` (`hajimari`/`始まり`) estágios `Hajimari`. Reincorporar um endereço ativo em código cujo manifesto contém um ponto de entrada `EntryPointKind::Kaizen` (`kaizen`/`改善`) estágios `Kaizen`. A vinculação muda imediatamente, Mas o contrato não está pronto: todas as chamadas de `Kotoage` e `View` são rejeitadas até que o gancho em fase exata seja bem sucedido.

Invocar o gancho escalonado com `Executable::ContractCall` no mesmo endereço do contrato e em um novo código hash, usando o ponto de entrada exato `hajimari` ou `kaizen` e os argumentos declarados no seu manifesto. O runtime fornece a permissão `CanInvokeContractEntrypoint` de endereço e selector; os chamadores não devem criar ou conceder essa permissão. O marcador pendente contém um determinista gerado pelo runtime `transition_id` e o novo `code_hash`; um marcador `Kaizen` também contém `previous_code_hash`. Os clientes não calculam nem enviam `transition_id`. Um gancho bem sucedido consome o marcador atomicamente, enquanto um gancho falhado deixa pendente para uma nova tentativa posterior.

Uma proposta do Parlamento de nível de emergência pode impor uma suspensão para um máximo de 3.600 blocos quando vincula a revisão atual, o hash de código e uma digestão de incidentes não nula. A expiração restabelece a execução, mas não elimina a retenção. Uma ação certificada `CompleteEmergencyHoldRetrospective` deve posteriormente vincular a retenção exata IDs e digerir mais uma raiz de localização não zero antes que o registro seja limpo; outra retenção não pode ser imposta enquanto essa retrospectiva permanece pendente.

Quando o aplicativo API estiver habilitado, leia o estado retido com `GET /v1/gov/contracts/{contract_address}`. O campo `found` significa que existe um registro do ciclo de vida, não que o endereço atualmente tenha código ativo

## Orientações operacionais {#operational-guidance}

- Mantenha os contratos deterministas. O comportamento do contrato não deve depender do tempo local do relógio de parede, estado do sistema de arquivos hospedado, chamadas de rede ou outras entradas peer-local.
- Mantenha as cargas úteis compactas. Um grande código de byte aumenta o tamanho da transação e os custos de propagação do bloco.
- Prefere-se a instruções digitadas para mudanças simples no livro, que são mais fáceis de verificar e mais baratas de executar.
- Tratar a atualização de contratos e as autorizações de registo como controles operacionais de alto risco.

Veja também:

- [Instruções ](/pt/blockchain/instructions.md)
- [Trigores](/pt/blockchain/triggers.md)
- [Permissões](/pt/blockchain/permissions.md)
- [Esquema de modelo de dados](/pt/reference/data-model-schema.md)
