---
translation_locale: pt
translation_source: /blockchain/smart-contracts.md
translation_source_hash: ed622cdb1d6a47635d0753c98f80aaa903b916133f43bc9fdab268512d0ace69
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Contratos inteligentes {#smart-contracts}

As transacções Iroha executam cargas úteis de `Executable`.

- `Executable::Instructions`: um conjunto ordenado de instruções especiais de Iroha
- `Executable::ContractCall`: uma chamada de referência para uma instância de contrato implantada
- `Executable::Ivm`: código de byte Iroha VM
- `Executable::IvmProved`: código de byte Iroha VM com uma sobreposição de instruções pré-computada e compromissos de prova.

Kotodama é Iroha É uma linguagem de alto nível para contratos inteligentes. `.ko` arquivo de origem compila para determinista IVM código de byte, conservado convencionalmente como um `.to` Artifacto para implantação. Kotodama Objectivos IVM; Não é um sistema independente. RISC-V ou WebAssembly O alvo.

A primeira versão suporta apenas a versão ABI 1. A política de syscall e pointer-ABI é aplicada incondicionalmente pela admissão e execução do contrato; não há computação para o tempo de execução.

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
