---
translation_locale: pt
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 7d6f8e1a0316b312b43c278b377e08382dbb2bff538a7bca4c43b585d12567ca
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Contratos inteligentes {#smart-contracts}

As transacções Iroha executam cargas úteis de `Executable`.

- `Executable::Instructions`: um conjunto ordenado de instruções especiais de Iroha
- `Executable::ContractCall`: uma chamada de referência para uma instância de contrato implantada
- `Executable::Ivm`: código de byte Iroha VM
- `Executable::IvmProved`: código de byte Iroha VM com uma sobreposição de instruções pré-computada e compromissos de prova.

Kotodama é a linguagem de contratos inteligentes de alto nível da Iroha. Um arquivo-fonte `.ko` é compilado em bytecode IVM determinístico, convencionalmente armazenado como um artefato `.to` para implantação. Kotodama tem como único alvo a IVM. Não tem como alvo RISC-V nem WebAssembly.

A primeira versão oferece suporte apenas à versão 1 da ABI. A política de syscall e pointer-ABI é aplicada incondicionalmente na admissão e execução de contratos; não existe um seletor de compatibilidade em tempo de execução.

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

## Aplicações de contrato implantadas {#deployed-contract-calls}

`Executable::ContractCall` invoca uma instância de contrato implantada por endereço. Use-a quando o código do contrato é registado separadamente e as transacções devem chamá-lo por referência em vez de carregar o código de byte sempre.

## Ciclo de vida do contrato e propriedade {#contract-lifecycle-and-ownership}

Cada endereço implantado mantém um registo `ContractLifecycleControlV1`, inclusive enquanto o contrato estiver inativo. O registo contém a proveniência imutável da primeira implantação, o proprietário atual e pendente, qualquer delegação do Parlamento revogável, o hash de código ativo, uma revisão de comparação e troca não-zero, Uma implantação direta registra a conta de implantação. uma implantação do Parlamento registra o seu proponente, o conteúdo da proposta ID e a tentativa de governança bem-sucedida ID.

O proprietário do ciclo de vida é uma conta ou o Parlamento.As alterações na propriedade da conta utilizam uma oferta e aceitação separadas; a aceitação de uma oferta autoriza qualquer delegação do Parlamento. Um proprietário de conta pode permitir que o Parlamento ative ou desative o contrato, revogando em seguida essa delegação, mas a delegação nunca permite que o Parlamento transfira a propriedade.

Cereais `ActivateContractInstance` e `DeactivateContractInstance` As instruções só estão disponíveis para o titular da conta corrente. `expected_revision`; As revisões obsoletas ou de zero não conseguem ser fechadas. Registo do ciclo de vida, que valida o artefato registado, o manifesto e ABI antes da mudança `active_code_hash`. A desativação limpa o hash do código ativo, mas mantém a propriedade e a proveniência. Cada transição bem-sucedida do ciclo de vida avança na revisão e emite o estado pós-completo.

Uma proposta do Parlamento de nível de emergência pode impor uma suspensão para um máximo de 3.600 blocos quando vincula a revisão atual, o hash de código e uma digestão de incidentes não nula. A expiração restabelece a execução, mas não elimina a retenção. Uma ação certificada `CompleteEmergencyHoldRetrospective` deve posteriormente ligar a retenção exata IDs e digerir mais uma raiz de localização não-zero antes que o registro seja limpo; outra retenção não pode ser imposta enquanto essa retrospectiva permanece pendente.

Quando o aplicativo API estiver ativado, leia o estado retido com `GET /v1/gov/contracts/{contract_address}`. Seu campo `found` significa que existe um registro do ciclo de vida, não que o endereço tenha atualmente código ativo.

## Orientações operacionais {#operational-guidance}

- Mantenha os contratos deterministas. O comportamento do contrato não deve depender do tempo local do relógio de parede, estado do sistema de arquivos hospedado, chamadas de rede ou outras entradas peer-local.
- Mantenha as cargas úteis compactas. Um grande código de byte aumenta o tamanho da transação e os custos de propagação do bloco.
- Prefere-se a instruções digitadas para mudanças simples no livro, que são mais fáceis de verificar e mais baratas de executar.
- Tratar a atualização dos contratos e as autorizações de registo como controles operacionais de alto risco.

Veja também:

- [Instruções ](/pt/blockchain/instructions.md)
- [Trigores](/pt/blockchain/triggers.md)
- [Permissões](/pt/blockchain/permissions.md)
- [Esquema de modelo de dados](/pt/reference/data-model-schema.md)
