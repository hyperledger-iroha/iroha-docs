---
translation_locale: pt
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Glosário <!-- omit in toc --> {#glossary}

Aqui encontram-se definições de todas as entidades relacionadas com Iroha.

- [Peer](#peer)
- [Ativos ](#asset)
- [Tolerança em falhas bizantina (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha Componentes](#iroha-components)
  - [Sumeragi (Imperador)](#sumeragi-emperor)
  - [Torii (Porta) ](#torii-gate)
  - [Kura (Armazém)](#kura-warehouse)
  - [Kagami(Ensinador e Exemplar e/ou espelho de olho)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Árvore de Merkle (árvore de hass) ](#merkle-tree-hash-tree)
  - [Contratos inteligentes](#smart-contracts)
  - [Trigas](#triggers)
  - [Versão ](#versioning)
  - [Hijiri (sistema de reputação entre pares) ](#hijiri-peer-reputation-system)
- [Modulos Iroha ](#iroha-modules)
- [Iroha Instruções especiais (ISI)](#iroha-special-instructions-isi)
  - [Utilidade Iroha Instruções especiais](#utility-iroha-special-instructions)
  - [Núcleo Iroha Instruções especiais](#core-iroha-special-instructions)
  - [Específico de domínio Iroha Instruções especiais](#domain-specific-iroha-special-instructions)
  - [Alfandegário Iroha Instrução especial](#custom-iroha-special-instruction)
- [Iroha Questão](#iroha-query)
- [Mudança de visualização](#view-change)
- [Vista do estado mundial (WSV) ](#world-state-view-wsv)
- [Líder](#leader)

## Registros de blocos de dados {#blockchain-ledgers}

Os registros blockchain são sistemas digitais de manutenção de registros que usam a tecnologia blockchain para manter registros financeiros. Estes são nomeados após livros antigos que foram utilizados para registros financeiros, como preços, notícias e informações sobre transações.

Durante a Idade Média, os livros de contabilidade estavam abertos para visualização pública e verificação da precisão. Esta ideia é refletida nos sistemas baseados em blockchain que podem verificar a validade dos dados armazenados.

## Companheiros {#peer}

Um colega Iroha significa um Iroha instância de processo para a qual outras Iroha Os processos e as aplicações do cliente podem ser conectados. Iroha Os pares são iguais em termos de recursos e capacidades, com uma excepção importante: Só um dos pares executa o bloco de gênese na fase de arranque do Iroha rede.

Outras cadeias de blocos podem referir-se ao mesmo conceito que um nó ou um validador.

Um peer pode ser um processo em seu sistema hospedeiro. Também pode ser contido em um recipiente Docker e uma cápsula Kubernetes.

## Ativos {#asset}

No contexto de blockchains, um ativo é a representação de um objeto valioso no blockchain.

Informações adicionais sobre ativos estão disponíveis [ aqui ](/pt/blockchain/assets.md).

### Ativos funcionais {#fungible-assets}

Estes ativos podem ser facilmente trocados por outros ativos do mesmo tipo, uma vez que são intercambiáveis.

Por exemplo, todas as unidades da mesma moeda são iguais em seu valor e podem ser usadas para comprar bens. Normalmente, os ativos fungíveis são idênticos em aparência, exceto o desgaste de notas e moedas.

### Ativos não fúngicos {#non-fungible-assets}

Os ativos não fúngicos são únicos e valiosos devido às suas características específicas e à sua raridade; o seu valor não pode ser comparado com outros activos.

- O valor de uma pintura pode variar com base no artista, no período de tempo em que foi pintada e no interesse do público.
- Duas casas na mesma rua podem ter diferentes níveis de manutenção.
- Os fabricantes de jóias normalmente oferecem uma variedade de designs diferentes.

### Ativos mantidos {#mintable-assets}

Um ativo pode ser emitido se mais do mesmo tipo possam ser emitidos.

### Ativos não em circulação {#non-mintable-assets}

Se o montante inicial de um ativo for especificado uma vez e não for alterado, é considerado inválido.

O bloco [Genesis](/pt/guide/configure/genesis.md) define esta informação para a configuração Iroha.

## Tolerança em falhas bizantina (BFT) {#byzantine-fault-tolerance-bft}

A propriedade de ser capaz de funcionar adequadamente com uma rede que contenha uma certa percentagem de agentes maliciosos. Iroha é capaz de funcionar com até 33% de agentes maliçosos em sua rede peer-to-peer.

## Componentes Iroha {#iroha-components}

Os módulos Rust que contêm a funcionalidade Iroha.

### Sumeragi {#sumeragi-emperor}

O módulo Iroha responsável pelo consenso.

### Torii (Porta) {#torii-gate}

Módulo com a lógica de manuseio de solicitações recebidas para o [peer](#peer). É usado para receber, aceitar e encaminhar instruções recebidos e consultas HTTP, bem como atualizações de configuração no tempo de execução.

### Kura (Armazém) {#kura-warehouse}

Armazenamento de blocos persistentes. Kura Os blocos assinados, os hashes de bloco, os índices de altura, os sidecars de recuperação e os metadados do commit-roster no disco. [Vista do Estado Mundial](#world-state-view-wsv) é reconstruída a partir de Kura bloqueios quando uma snapshot de estado não está disponível ou atrás da loja block local. Veja: [Kura armazenamento](/pt/blockchain/world.md#kura-storage).

### Kagami(Mestre e Exemplar e/ou espelho de olho) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Gerador para dados comumente usados. Pode gerar pares de chaves criptográficas, blocos de gênese, documentação, etc.

### Árvore Merkle (árvore de hasse) {#merkle-tree-hash-tree}

Uma estrutura de dados usada para validar e verificar o estado em cada altura do bloco. A implementação atual da Iroha é uma árvore binária. Veja a [ Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree) para mais detalhes.

### Contratos inteligentes {#smart-contracts}

Os contratos inteligentes são programas baseados em cadeia de blocos que executam quando um conjunto específico de condições é cumprido. Iroha Os contratos inteligentes são implementados utilizando [núcleo Iroha instruções especiais](#core-iroha-special-instructions).

### Trigas {#triggers}

Um tipo de evento que permite invocar uma instrução especial Iroha em um bloco específico, hora (com algumas advertências), etc. Mais sobre os gatilhos [ aqui ](/pt/blockchain/triggers.md).

### A versão {#versioning}

Cada pedido é rotulado com a versão API à qual pertence. Permite que uma combinação de diferentes versões binárias do software cliente/peer Iroha interoperem, o que por sua vez permite atualizações de software na rede Iroha.

### Hijiri (sistema de reputação entre pares) {#hijiri-peer-reputation-system}

Iroha O sistema de reputação permite priorizar a comunicação com os [Companheiros](#peer) que tenham um bom histórico e reduzem os danos que podem ser causados por [Companheiros](#peer).

## Módulos Iroha {#iroha-modules}

Extensões de terceiros para Iroha que fornecem funcionalidades personalizadas.

## Instruções especiais Iroha (ISI) {#iroha-special-instructions-isi}

Uma biblioteca de contratos inteligentes Iroha. Estes podem ser invocados através de transacções ou ouvintes registados de eventos. ISI [Aqui está.](/pt/blockchain/instructions.md).

#### Utilidade Iroha Instruções especiais {#utility-iroha-special-instructions}

Este conjunto de [(a)](#iroha-special-instructions-isi) contém instruções lógicas como: `If`, Relacionados com I/O como: `Notify` e composições como `Sequence`. São utilizados principalmente como [instruções personalizadas](#custom-iroha-special-instruction).

### Núcleo Iroha Instruções especiais {#core-iroha-special-instructions}

[Instruções especiais ](#iroha-special-instructions-isi) fornecidas com cada implantação Iroha. Estes incluem algumas [domínio-específico ](#domain-specific-iroha-special-instructions) bem como [ utilidade instruções ](#utility-iroha-special-instructions).

### Instruções especiais específicas de domínio Iroha {#domain-specific-iroha-special-instructions}

Instruções relativas a actividades específicas de domínios: activos, contas, domínios, gestão entre pares). Estes fornecem as ferramentas necessárias para fazerem alterações ao [Vista do Estado Mundial](#world-state-view-wsv) De maneira segura e segura.

### Instrução especial da Alfândega Iroha {#custom-iroha-special-instruction}

Instruções fornecidas em [Iroha Módulos](#iroha-modules), A construção de um sistema é feita por clientes ou por terceiros. [As instruções essenciais](#core-iroha-special-instructions). Forcagem e modificação do Iroha O código-fonte não é recomendado, uma vez que as instruções especiais não são acordadas pelo [Companheiros](#peer) em um Iroha a implantação será tratada como falhas, portanto [Companheiros](#peer) A execução de uma instância modificada terá o seu acesso revogado.

## Iroha Pergunta {#iroha-query}

Uma solicitação para ler o World State View sem modificar essa visão. Mais informações sobre consultas [em ](/pt/blockchain/queries.md).

## Visualização de mudança {#view-change}

Um processo que ocorre em caso de uma tentativa fracassada de consenso. Geralmente isso implica a eleição de um novo [Líder](#leader).

## Visão do estado mundial (WSV) {#world-state-view-wsv}

Representação na memória do estado atual da blockchain. O WSV contém o `World`, hashes de blocos comprometidos, índices de transações, topologia de consenso e índices derivados usados por consultas. Ele é atualizado apenas através de blocos comprometidos e pode ser reconstruído a partir de [Kura](#kura-warehouse). Veja [ World State View](/pt/blockchain/world.md#world-state-view-wsv).

## Líder {#leader}

Em uma rede iroha, um peer é selecionado aleatoriamente e concedeu o privilégio especial de formar o próximo bloco. Este privilégio pode ser revogado nas redes que atingem [Torrença de falhas bizantina](#byzantine-fault-tolerance-bft) por via [mudança de visão](#view-change).
