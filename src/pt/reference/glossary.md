---
translation_locale: pt
translation_source: /reference/glossary.md
translation_source_hash: 4d3a8e3aa88291edbaac5b52039d2aad160d89fb83c085c21030a531c93258f4
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta+reviewed-first-release-source-amendment
---
# Glossário <!-- omit in toc --> {#glossary}

Aqui você pode encontrar definições de todas as entidades relacionadas a Iroha.

- [par de rede](#peer)
- [Ativo](#asset)
- [Tolerância a falhas bizantinas (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha Componentes](#iroha-components)
  - [Sumeragi (Imperador)](#sumeragi-emperor)
  - [Torii (Portão)](#torii-gate)
  - [Kura (Armazém)](#kura-warehouse)
  - [Kagami(Professor e Exemplar e/ou espelho)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Árvore Merkle (árvore de hash criptográfica)](#merkle-tree-hash-tree)
  - [Contratos inteligentes](#smart-contracts)
  - [Gatilhos](#triggers)
  - [Versionamento](#versioning)
  - [Hijiri (sistema de reputação de pares na rede)](#hijiri-peer-reputation-system)
- [Iroha Módulos](#iroha-modules)
- [Iroha Operações de instrução (ISI)](#iroha-special-instructions-isi)
  - [Operações de instrução de utilitário Iroha](#utility-iroha-special-instructions)
  - [Operações de instrução núcleo Iroha](#core-iroha-special-instructions)
  - [Operações de instrução específicas de domínio Iroha](#domain-specific-iroha-special-instructions)
  - [Instrução Especial Personalizada Iroha](#custom-iroha-special-instruction)
- [Iroha Consulta](#iroha-query)
- [Alterar visualização](#view-change)
- [Visão do estado mundial (WSV)](#world-state-view-wsv)
- [Líder](#leader)

## Registros contábeis de blockchain {#blockchain-ledgers}

Os livros-razão de blockchain são sistemas digitais de registro que usam a tecnologia blockchain para manter registros financeiros. Eles são chamados assim por causa dos livros antigos que eram usados para registros financeiros, como preços, notícias e informações de transações.

Durante a época medieval, os livros de registros em blockchain eram abertos à visualização pública e à verificação de precisão. Essa ideia se reflete nos sistemas baseados em blockchain que podem verificar a validade dos dados armazenados.

## par de rede {#peer}

Um nó par é um processo de nó Iroha que aceita conexões de outros nós pares e de aplicações cliente. Uma máquina pode hospedar vários nós pares com configuração e armazenamento separados. Cada nó par que inicia o consenso a partir de um estado vazio autentica e aplica o gênese assinado da rede; nós pares restaurados de instantâneos autenticados retomam a operação a partir desse estado.

Outras blockchains podem se referir ao mesmo conceito como um nó ou um validador.

Um par de rede pode ser um processo em seu sistema host. Ele também pode estar contido em um contêiner Docker e em um pod do Kubernetes.

## Ativo {#asset}

No contexto das blockchains, um ativo é a representação de um objeto valioso na blockchain.

Informações adicionais sobre os ativos estão disponíveis [aqui](/pt/blockchain/assets.md).

### Ativos fungíveis {#fungible-assets}

Tais ativos podem ser facilmente trocados por outros ativos do mesmo tipo porque são intercambiáveis.

Como exemplo, todas as unidades da mesma moeda são iguais em seu valor e podem ser usadas para comprar bens. Normalmente, ativos fungíveis são idênticos em aparência, exceto pelo desgaste de notas e moedas.

### Ativos não fungíveis {#non-fungible-assets}

Ativos não fungíveis são únicos e valiosos devido às suas características específicas e raridade; seu valor não pode ser comparado a outros ativos.

- O valor de uma pintura pode variar dependendo do artista, do período em que foi pintada e do interesse do público nela.
- Duas casas na mesma rua podem ter níveis diferentes de manutenção.
- Os fabricantes de joias normalmente oferecem uma variedade de designs diferentes.

### Ativos mintáveis {#mintable-assets}

Um ativo é cunhável se mais do mesmo tipo puder ser emitido.

### Ativos não mineráveis {#non-mintable-assets}

Se a quantidade inicial de um ativo for especificada uma vez e não mudar, é considerada não cunhável.

O [bloco gênese da blockchain](/pt/guide/configure/genesis.md) define essas informações para a configuração Iroha.

## Tolerância a falhas bizantinas (BFT) {#byzantine-fault-tolerance-bft}

A propriedade de ser capaz de funcionar adequadamente em uma rede contendo uma certa porcentagem de agentes maliciosos. Um comitê do Sumeragi tem exatamente `3f + 1` validadores e tolera até `f` validadores bizantinos, menos de um terço do comitê.

## Iroha Componentes {#iroha-components}

Rust módulos contendo funcionalidade Iroha.

### Sumeragi (Imperador) {#sumeragi-emperor}

O módulo Iroha responsável pelo consenso.

### Torii (Portão) {#torii-gate}

Módulo com a lógica de tratamento das solicitações recebidas pelo [par](#peer). Ele recebe, aceita e encaminha instruções, consultas HTTP e solicitações de inspeção da configuração pelo operador.

### Kura (Armazém) {#kura-warehouse}

Armazenamento persistente de blocos. Kura guarda em disco os blocos assinados, os hashes, os índices de altura, os anexos de recuperação e os metadados da lista de confirmação. A [Visão do Estado Mundial](#world-state-view-wsv) é reconstruída a partir dos blocos de Kura quando não há um instantâneo do estado ou quando ele está atrasado em relação ao armazenamento local. Consulte [Armazenamento Kura](/pt/blockchain/world.md#kura-storage).

### Kagami(Professor e Exemplar e/ou espelho) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Gerador de dados comumente usados. Ele pode gerar pares de chaves criptográficas, blocos gênesis de blockchain, documentação, etc.

### Árvore Merkle (árvore de hash criptográfica) {#merkle-tree-hash-tree}

Uma estrutura de dados usada para validar e verificar o estado em cada altura de bloco. A implementação atual do Iroha é uma árvore binária. Veja [Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree) para mais detalhes.

### Contratos inteligentes {#smart-contracts}

Contratos inteligentes são programas baseados em blockchain que são executados quando um conjunto específico de condições é atendido. No Iroha 3, contratos inteligentes são escritos em Kotodama e compilados para bytecode IVM (`.to`); um contrato altera o estado emitindo [instruções especiais do Iroha](#core-iroha-special-instructions) por meio de chamadas ao host.

### Gatilhos {#triggers}

Um tipo de evento que permite invocar uma instrução especial Iroha em commit de bloco específico, tempo (com algumas ressalvas), etc. Mais sobre gatilhos [aqui](/pt/blockchain/triggers.md).

### Versionamento {#versioning}

A primeira versão do Iroha 3 oferece suporte a uma única versão canônica do formato de transmissão de blocos. O endpoint `/v1/api/version` informa `SignedBlock::WIRE_VERSION` após a aplicação do gênese e retorna uma resposta de indisponibilidade antes disso. Essa informação descreve o formato de transmissão suportado; não negocia compatibilidade entre diferentes estruturas de protocolo nem autoriza uma atualização da rede.

### Hijiri (sistema de reputação de pares na rede) {#hijiri-peer-reputation-system}

Sistema de reputação de pares de rede e contas do Iroha. Seus parâmetros, controlados pelo consenso, contêm a política de taxas do Hijiri e os registros de risco de contas, e registros governados de observadores emitem atestações de contas que ajustam a pontuação de risco de uma conta.

## Iroha Módulos {#iroha-modules}

Extensões de terceiros para Iroha que fornecem funcionalidade personalizada.

## Iroha Operações de instrução (ISI) {#iroha-special-instructions-isi}

Uma biblioteca de contratos inteligentes fornecida com Iroha. Eles podem ser invocados por meio de transações ou ouvintes de eventos registrados. Mais sobre ISI [aqui](/pt/blockchain/instructions.md).

#### Operações de instrução de utilitário Iroha {#utility-iroha-special-instructions}

Este conjunto de [isi](#iroha-special-instructions-isi) contém instruções que não alteram uma entidade específica de um domínio, como `Log`, `ExecuteTrigger`, `SetParameter` e `Upgrade`. O Iroha 3 não tem instruções `If`, `Notify` ou `Sequence`.

### Operações de instrução do Core Iroha {#core-iroha-special-instructions}

[Instruções especiais](#iroha-special-instructions-isi) fornecido com cada implantação de Iroha. Estes incluem alguns [específico de domínio](#domain-specific-iroha-special-instructions) assim como [instruções de utilidade](#utility-iroha-special-instructions).

### Operações de instrução específicas de domínio Iroha {#domain-specific-iroha-special-instructions}

Instruções relacionadas a atividades específicas do domínio: ativos, contas, domínios, gerenciamento de pares de rede). Estas fornecem as ferramentas necessárias para fazer alterações no [Visão do Estado Mundial](#world-state-view-wsv) de maneira segura e protegida.

### Instrução Especial Personalizada Iroha {#custom-iroha-special-instruction}

Instruções fornecidas em [Iroha Módulos](#iroha-modules), por clientes ou terceiros. Estas só podem ser construídas usando [as Instruções Principais](#core-iroha-special-instructions). Não é recomendada a bifurcação e modificação do código-fonte Iroha. as operações de instrução não acordadas por [pares de rede](#peer) em uma implantação Iroha serão tratadas como falhas, portanto [pares de rede](#peer) executando uma instância modificada terá seu acesso revogado.

## Iroha Consulta {#iroha-query}

Uma solicitação para ler a Visão do Estado Mundial sem modificar essa visão. Mais sobre consultas [aqui](/pt/blockchain/queries.md).

## Alterar visualização {#view-change}

Um processo que ocorre em caso de tentativa frustrada de consenso. Normalmente, isso implica a eleição de um novo [Líder](#leader).

## Visão do estado mundial (WSV) {#world-state-view-wsv}

Representação na memória do estado atual da blockchain. O WSV contém os `World`, hashes criptográficos dos blocos confirmados, índices de transações, topologia de consenso e índices derivados usados por consultas. Ela é atualizada apenas por meio de blocos confirmados e pode ser reconstruída a partir de [Kura](#kura-warehouse). Veja [Visão do Estado Mundial](/pt/blockchain/world.md#world-state-view-wsv).

## Líder {#leader}

Para cada altura e visão, o Sumeragi determina o proponente de forma determinística a partir do comitê, da semente autenticada de seleção do líder e do histórico confirmado de líderes ignorados. Uma [mudança de visão](#view-change) passa a vez ao próximo membro elegível do comitê sob as mesmas regras de [tolerância a falhas bizantinas](#byzantine-fault-tolerance-bft).
