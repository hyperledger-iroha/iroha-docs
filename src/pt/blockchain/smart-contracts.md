---
translation_locale: pt
translation_source: /blockchain/smart-contracts.md
translation_source_hash: 4281cb307762443c85b67659310da69f1f1ea5b99926bad43b90abe36e87075e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Contratos Inteligentes {#smart-contracts}

Iroha transações executam `Executable` cargas úteis. O modelo de dados atual suporta:

- `Executable::Instructions`: um conjunto ordenado de operações de Instrução Iroha
- `Executable::ContractCall`: uma chamada por referência para uma instância de contrato implantada
- `Executable::Ivm`: bytecode da VM Iroha
- `Executable::IvmProved`: Iroha VM bytecode com uma sobreposição de instrução pré-computada e compromissos de prova

Kotodama é a linguagem de contrato inteligente de alto nível de Iroha. Um arquivo fonte `.ko` é compilado em bytecode determinístico IVM, normalmente armazenado como um artefato `.to` para implantação. Kotodama visa apenas IVM. Não visa RISC-V nem WebAssembly.

O primeiro lançamento suporta apenas a versão 1 do ABI. A política de syscall e ponteiro-ABI é um único contrato incondicional V1 aplicado pela admissão e execução; não há modo alternativo de tempo de execução de software.

## Quando Usar Contratos Inteligentes {#when-to-use-smart-contracts}

Use instruções normais quando a transação puder ser expressa diretamente:

- registrar ou cancelar o registro de objetos
- emitir, queimar ou transferir ativos
- atualizar metadados
- conceder ou revogar permissões
- executar um gatilho
- definir parâmetros na blockchain

Use um contrato inteligente quando a transação precisar de lógica empacotada que seja difícil de expressar como uma sequência de instruções estática, ou quando uma instância de contrato implantada deva ser chamada por referência.

## IVM Executáveis {#ivm-executables}

`Executable::Ivm` carrega bytecode bruto IVM. Os nós executam esse bytecode dentro dos limites de tempo de execução do software configurados para a cadeia. Mantenha o bytecode pequeno e determinístico; contratos fazem parte da execução da transação e, portanto, afetam o consenso.

`Executable::IvmProved` destina-se a fluxos que carregam comprovação. Ele transporta:

- IVM bytecode
- uma sobreposição de instrução determinística
- um compromisso com eventos de execução
- um compromisso com a política de gás

A prova vincula a sobreposição ao bytecode executado. Dependendo da política do pipeline de processamento, os validadores podem verificar a prova e reproduzir a execução como uma verificação de segurança adicional.

## Chamadas de Contrato Implantado {#deployed-contract-calls}

`Executable::ContractCall` invoca uma instância de contrato implantado pelo endereço. Use isso quando o código do contrato estiver registrado separadamente e as transações devem chamá-lo por referência em vez de carregar o bytecode toda vez.

## Ciclo de Vida e Propriedade do Contrato {#contract-lifecycle-and-ownership}

Todo endereço implantado mantém um registro `ContractLifecycleControlV1`, inclusive enquanto o contrato está inativo. O registro contém a procedência imutável da primeira implantação, o proprietário atual e pendente, qualquer delegação revogável do Parlamento, o hash criptográfico do código ativo, uma revisão compare-and-swap não zero, e qualquer retenção de emergência mantida. Um despacho direto registra a conta que está realizando o despacho. Um despacho do Parlamento registra seu proponente, o ID do conteúdo da proposta e o ID da tentativa de governança bem-sucedida.

O proprietário do ciclo de vida é ou uma conta ou o Parlamento. Mudanças na propriedade da conta usam uma oferta e aceitação separadas; aceitar uma oferta limpa qualquer delegação do Parlamento. Um proprietário de conta pode permitir que o Parlamento ative ou desative o contrato, e então revogar essa delegação, mas a delegação nunca permite que o Parlamento transfira a propriedade. Alterações de propriedade do Parlamento e a aceitação pelo Parlamento são realizadas por meio de efeitos de governança certificados.

As instruções brutas `ActivateContractInstance` e `DeactivateContractInstance` estão disponíveis apenas para o proprietário da conta atual. Elas devem conter o `expected_revision` exato do registro; revisões antigas ou zeradas falham ao fechar. A ativação bruta não pode criar um registro de ciclo de vida, e ela valida o artefato registrado, o manifesto técnico e ABI antes de alterar `active_code_hash`. A desativação limpa o hash criptográfico do código ativo, mas mantém a propriedade e a proveniência. Cada transição de ciclo de vida bem-sucedida avança a revisão e emite o estado completo posterior.

A ativação também pode preparar um gancho de ciclo de vida declarado no manifesto de estágio um. Uma primeira ativação cujo manifesto técnico contém um ponto de entrada `EntryPointKind::Hajimari` (`hajimari`/`始まり`) prepara `Hajimari`. Reassociar um endereço ativo ao código cujo manifesto técnico contém um ponto de entrada `EntryPointKind::Kaizen` (`kaizen`/`改善`) estágios `Kaizen`. A associação muda imediatamente, mas o contrato não está pronto: toda chamada `Kotoage` e `View` é rejeitada até que o hook em estágio exato seja bem-sucedido. Outra ativação também é rejeitada enquanto um hook está pendente.

Invoque o hook em estágio com `Executable::ContractCall` no mesmo endereço de contrato e novo hash criptográfico do código, usando exatamente o ponto de entrada `hajimari` ou `kaizen` e os argumentos declarados pelo seu manifesto técnico. O tempo de execução do software fornece a permissão `CanInvokeContractEntrypoint` com escopo de endereço e seletor; os chamadores não devem criar ou conceder essa permissão. O marcador pendente contém um `transition_id` determinístico gerado em tempo de execução e o novo `code_hash`; um marcador `Kaizen` também contém `previous_code_hash`. Os clientes não calculam nem enviam `transition_id`. Um hook bem-sucedido consome o marcador de forma atômica, enquanto um hook que falha o deixa pendente para uma nova tentativa posterior.

Uma proposta de Parlamento de nível de emergência pode impor uma suspensão por no máximo 3.600 blocos quando vincula a revisão atual, o hash criptográfico do código e um valor de digest criptográfico de incidente diferente de zero. As chamadas são bloqueadas desde a altura de imposição até, mas não incluindo, a altura de expiração. O vencimento restaura a execução, mas não apaga a retenção. Uma ação certificada `CompleteEmergencyHoldRetrospective` deve posteriormente vincular os IDs de retenção exatos e o valor do resumo criptográfico, além de uma raiz de constatação diferente de zero antes que o registro seja liberado; outro bloqueio não pode ser imposto enquanto essa retrospectiva permanecer pendente.

Quando o aplicativo API está habilitado, leia o estado retido com `GET /v1/gov/contracts/{contract_address}`. Seu campo `found` significa que existe um registro de ciclo de vida, não que o endereço atualmente tenha código ativo.

## Orientação Operacional {#operational-guidance}

- Mantenha os contratos determinísticos. O comportamento do contrato não deve depender do tempo do relógio local, do estado do sistema de arquivos do host, de chamadas de rede ou de outras entradas locais de pares.
- Mantenha os payloads compactos. Bytecode grande aumenta o tamanho da transação e o custo de propagação do bloco.
- Prefira instruções digitadas para alterações simples no livro-razão da blockchain. Elas são mais fáceis de auditar e mais baratas de executar.
- Trate as permissões de atualização e registro de contrato como controles operacionais de alto risco.

Veja também:

- [Instruções](/pt/blockchain/instructions.md)
- [Gatilhos](/pt/blockchain/triggers.md)
- [Permissões](/pt/blockchain/permissions.md)
- [Esquema do modelo de dados](/pt/reference/data-model-schema.md)
