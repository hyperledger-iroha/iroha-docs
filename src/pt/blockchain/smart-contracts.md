---
translation_locale: pt
translation_source: /blockchain/smart-contracts.md
translation_source_hash: c69237ded68aee4d663b00f1aa13d400c4763682af9bd5b5a49ca0edb5905dd2
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

Cada endereço implementado mantém um `ContractLifecycleControlV1` O registo contém a proveniência imutável da primeira implantação. o titular atual e pendente, qualquer delegação do Parlamento que possa ser revogada, o hash de código ativo, uma revisão de comparação e troca não-zero; Uma implantação direta atribui a conta enviadora como proprietária e registra-a como a implantação Uma delegação do Parlamento atribui o Parlamento como proprietário e registra o seu proponente, ID, e uma tentativa de governança bem-sucedida ID Apenas como proveniência.

Os espaços de nome protegidos configurados são reservados à utilização pelo Parlamento Europeu. `CanRegisterSmartContractCode` Permitir o registo de artefatos, mas não autorizar a implantação direta ou a ativação em bruto num espaço de nome protegido O registro inicial do ciclo de vida deve ser criado pelo caminho de implantação certificado pelo Parlamento.

O proprietário do ciclo de vida é uma conta ou o Parlamento. As alterações de propriedade da conta utilizam `OfferContractOwnership` seguidas pela posse pendente `AcceptContractOwnership`; o titular atual pode retirar um Proposta não aceite com `CancelContractOwnershipOffer`. A aceitação autoriza qualquer delegação do Parlamento. A remoção da conta é rejeitada enquanto a conta possui um contrato ou se encontra no titular pendente de uma oferta pendente.

Um titular de conta pode permitir ao Parlamento atualizar, activar ou desactivar o contrato e revogar essa delegação. As alterações de propriedade do Parlamento e a aceitação pelo Parlamento são promulgadas através de efeitos certificados de governança.

Cereais `ActivateContractInstance` e `DeactivateContractInstance` As instruções só estão disponíveis para o titular da conta corrente. `expected_revision`; As revisões obsoletas ou de zero não conseguem ser fechadas. Registo do ciclo de vida, que valida o artefato registado, o manifesto e ABI antes da mudança `active_code_hash`. A desativação limpa o hash do código ativo, mas mantém a propriedade e a proveniência. Cada transição bem-sucedida do ciclo de vida avança na revisão e emite o estado pós-completo.

Uma proposta parlamentar de nível de emergência só pode impor uma retenção através da linha completa do Parlamento e com os votos "Yes" a partir de pelo menos dois terços dos assentos originais do júri de políticas. Ele só pode suspender as chamadas e desencadear a execução: não pode ser estendido ou mudar o código, propriedade ou delegação. As chamadas e execuções de desencadeamento correspondentes são bloqueadas desde a altura da imposição até, mas sem incluir, a altura de expiração. Uma ação certificada `CompleteEmergencyHoldRetrospective` deve posteriormente ligar a retenção exata IDs e digerir mais uma raiz de localização não zero antes do registro ser limpo; outra retenção não pode ser imposta até que essa retrospectiva seja completa.

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
