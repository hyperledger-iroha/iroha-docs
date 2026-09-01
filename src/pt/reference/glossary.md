---
translation_locale: pt
translation_source: /reference/glossary.md
translation_source_hash: ab484310e7e0b0662c1d4bb133e7ae337c71b09b5fdc8e678581234d74ee9b29
translation_status: machine-validated
translation_engine: bing-translator-llm
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

Um par de rede em Iroha significa uma instância de processo Iroha à qual outros processos Iroha e aplicativos clientes podem se conectar. Uma única máquina pode hospedar vários pares de rede Iroha. os pares da rede são iguais em relação aos seus recursos e capacidades, com uma exceção importante: apenas um dos pares da rede executa o bloco gênese da blockchain na fase de inicialização da rede Iroha.

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

A propriedade de ser capaz de funcionar adequadamente em uma rede contendo uma certa porcentagem de agentes maliciosos. Iroha é capaz de funcionar com até 33% de agentes maliciosos em sua rede ponto a ponto.

## Iroha Componentes {#iroha-components}

Rust módulos contendo funcionalidade Iroha.

### Sumeragi (Imperador) {#sumeragi-emperor}

O módulo Iroha responsável pelo consenso.

### Torii (Portão) {#torii-gate}

Módulo com a lógica de manipulação de solicitações recebidas para o [par de rede](#peer). É usado para receber, aceitar e direcionar instruções recebidas e consultas HTTP, bem como atualizações de configuração em tempo de execução.

### Kura (Armazém) {#kura-warehouse}

Armazenamento persistente de blocos. Kura guarda em disco os blocos assinados, os hashes, os índices de altura, os anexos de recuperação e os metadados da lista de confirmação. A [Visão do Estado Mundial](#world-state-view-wsv) é reconstruída a partir dos blocos de Kura quando não há um instantâneo do estado ou quando ele está atrasado em relação ao armazenamento local. Consulte [Armazenamento Kura](/pt/blockchain/world.md#kura-storage).

### Kagami(Professor e Exemplar e/ou espelho) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Gerador de dados comumente usados. Ele pode gerar pares de chaves criptográficas, blocos gênesis de blockchain, documentação, etc.

### Árvore Merkle (árvore de hash criptográfica) {#merkle-tree-hash-tree}

Uma estrutura de dados usada para validar e verificar o estado em cada altura de bloco. A implementação atual do Iroha é uma árvore binária. Veja [Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree) para mais detalhes.

### Contratos inteligentes {#smart-contracts}

Contratos inteligentes são programas baseados em blockchain que são executados quando um conjunto específico de condições é atendido. Em Iroha, contratos inteligentes são implementados usando [operações de instrução núcleo Iroha](#core-iroha-special-instructions).

### Gatilhos {#triggers}

Um tipo de evento que permite invocar uma instrução especial Iroha em commit de bloco específico, tempo (com algumas ressalvas), etc. Mais sobre gatilhos [aqui](/pt/blockchain/triggers.md).

### Versionamento {#versioning}

Cada solicitação é rotulada com a versão API à qual pertence. Isso permite uma combinação de diferentes versões binárias do software cliente/par Iroha para interoperar, o que por sua vez permite atualizações de software na rede Iroha.

### Hijiri (sistema de reputação de pares na rede) {#hijiri-peer-reputation-system}

Sistema de reputação do Iroha. Ele permite priorizar a comunicação com [pares de rede](#peer) que têm um bom histórico e reduzir o dano que pode ser causado por [pares de rede](#peer) maliciosos.

## Iroha Módulos {#iroha-modules}

Extensões de terceiros para Iroha que fornecem funcionalidade personalizada.

## Iroha Operações de instrução (ISI) {#iroha-special-instructions-isi}

Uma biblioteca de contratos inteligentes fornecida com Iroha. Eles podem ser invocados por meio de transações ou ouvintes de eventos registrados. Mais sobre ISI [aqui](/pt/blockchain/instructions.md).

#### Operações de instrução de utilitário Iroha {#utility-iroha-special-instructions}

Este conjunto de [isi](#iroha-special-instructions-isi) contém instruções lógicas como `If`, relacionadas a E/S como `Notify` e composições como `Sequence`. Elas são usadas principalmente como [instruções personalizadas](#custom-iroha-special-instruction).

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

Em uma rede Iroha, um par de rede é selecionado aleatoriamente e concedido o privilégio especial de formar o próximo bloco. Este privilégio pode ser revogado em redes que atingem [Tolerância a falhas bizantinas](#byzantine-fault-tolerance-bft) por meio de [alteração de visualização](#view-change).
