---
translation_locale: pt
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Mundo {#world}

`World` é a entidade global que contém outras entidades. A `World` consiste em:

- Iroha [parâmetros de configuração](/pt/guide/configure/client-configuration.md)
- pares registados
- Domínios registados
- Trigadores registados [ ](/pt/blockchain/triggers.md)
- Papéis registados [](/pt/blockchain/permissions.md#permission-groups-roles)
- registado [definições de tokens de permissão](/pt/blockchain/permissions.md#permission-tokens)
- Tokens de permissão para todas as contas
- [a cadeia de validadores de tempo de execução](/pt/blockchain/permissions.md#runtime-validators)

Quando os domínios, pares ou funções são registados ou não registrados, o `World` é o alvo da instrução de (un) registro [ ](/pt/blockchain/instructions.md).

## World State View (WSV) {#world-state-view-wsv}

World State View é a representação na memória do estado atual da blockchain. Inclui o `World`, hashes de blocos comprometidos, índices de transações e pares eleitos para a época atual. Cargas úteis de blocos completos são servidas a partir de Kura em vez de duplicadas como dados mutáveis WSV.

A Comissão WSV Não é a fonte duradoura da verdade por si só. O histórico duradouro é armazenado em [Kura](#kura-storage), e o WSV pode ser reconstruída a partir de Kura Blocos ou carregados a partir de um snapshot de estado e, em seguida, capturado por replaying mais novo Kura Blocos.

### O que é o WSV Tracks {#what-the-wsv-tracks}

O WSV é mais amplo do que o objeto `World`. Na prática contém:

- O `World`: parâmetros, pares, domínios, contas, ativos, NFTs, funções, permissões, gatilhos, dados do executor e outros objectos de modelo de dados registados
- hashes de bloco comprometidos e a mais recente altura comprometida
- índices de transação a bloqueio utilizados em consultas e recibos
- A topologia de compromissos atual e anterior utilizada por consenso
- Indices de memória derivados de blocos comprometidos, tais como compromissos de disponibilidade de dados, cursores de recepção, intenções de pin e marcadores de projecção de consulta
- Impressões de configuração do tempo de execução necessárias para a execução determinista de blocos, tais como criptografia, governança, pipeline, conteúdo, liquidação e configurações Nexus

As consultas normalmente recebem uma `StateView` de somente leitura sobre essas estruturas. Uma visão é um instantâneo consistente para a execução da consulta; não permite uma mutação direta do WSV.

### Como o WSV muda {#how-the-wsv-changes}

As alterações WSV são encenadas antes de serem cometidas. A execução do bloco cria uma sobreposição de estado com escala de blocos, e cada transação aceita aplica suas instruções em uma superposição com escala de transação. Os dados desencadeados invocados por essas operações executam-se no mesmo contexto do bloco. Os gatilhos de tempo são avaliados após os efeitos da transação para o bloco.

Após o consenso cometer um bloco, o peer primeiro encaminha o bloco comprometido em Kura. Se esse passo de encomenda falhar, o WSV não é avançado e o ciclo de consenso retrata ou requie a carga útil do bloco. Quando o bloco é aceito na fila de Kura, Iroha aplica os efeitos do bloco pós-execução, atualiza índices derivados e compromete as mudanças em fase WSV sob um bloqueio de visão de estado. Isso impede que os leitores observem um bloco parcialmente comprometido.

A regra crítica do consenso é que os pares devem alcançar o mesmo WSV dos mesmos blocos comprometidos. Edições locais diretas para as instruções de contorno de dados WSV e farão com que os pares discordem durante a validação ou reprodução.

### Começo e repetição {#startup-and-replay}

Ao iniciar, Iroha inicializa primeiro o Kura e aprende a altura do bloco armazenado. Em seguida, tenta carregar um snapshot de estado. Se nenhum snapshot estiver disponível ou se um snapshot for rejeitado como recuperável, Iroha cria um estado inicial e repete blocos comprometidos a partir de Kura. Se um snapshot for válido, mas atrás de Kura, só será reproduzido o intervalo de altura que falta.

Replay valida cada bloco armazenado, reconstrói a lista de compromissos para essa altura, aplica os efeitos do bloco ao WSV e compromete o estado resultante. Isso significa que Kura é o caminho de recuperação para o WSV, enquanto snapshots são uma otimização que evita repetição de toda a cadeia.

## Kura Armazenamento {#kura-storage}

O Kura é o armazenamento de blocos persistente do Iroha. Ele armazena blocos assinados e metadados de recuperação. Não armazena uma segunda cópia mutável do WSV.

O armazenamento Kura é enraizado em [`kura.store_dir`](/pt/reference/peer-config/params.md#param-kura-store-dir). Dentro dessa raiz, os dados do bloco são divididos por faixa ou segmento. Os arquivos primários para um segmento são:

|Caminho .|Propósito |
| --- | --- |
|`blocks/<segment>/blocks.data` |Cargas úteis de blocos assinados em quadros Norito contínuos. |
|`blocks/<segment>/blocks.index` |Entradas de tamanho fixo `(start, length)` que mostram a altura do bloco de mapa em bytes em `blocks.data`. |
|`blocks/<segment>/blocks.hashes` |Bloquear hashes por altura para rápida busca e validação de inicialização. |
|`blocks/<segment>/blocks.count.norito` |Marqueiro de compromisso duradouro que registra quantas entradas do índice de blocos são seguras para uso. |
|`blocks/<segment>/da_blocks/` |Cargas úteis bloqueadas mantidas fora de `blocks.data` quando a aplicação do orçamento de disco remove corpos antigos do arquivo quente. |
|`blocks/<segment>/pipeline/sidecars.norito` e `sidecars.index` |Caminhões de recuperação do oleoduto por altura de bloco. |
|`blocks/<segment>/pipeline/roster_sidecars.norito` e `roster_sidecars.index` |Recentes carros laterais de commit-roster usados pela sincronização e repetição de blocos. |
|`merge_ledger/<segment>.log` |As entradas no registo de fusões alinhadas com blocos comprometidos. |
|`commit-rosters.norito` |Manter certificados de compromisso e pontos de verificação de validador para blocos recentes. |

Kura mantém um vetor compacto de memória para a cadeia: cada altura tem o hash do bloco e, opcionalmente, o corpo do bloco. O bloco genético permanece guardado em cache, e o mais recente [`kura.blocks_in_memory`](/pt/reference/peer-config/params.md#param-kura-blocks-in-memory) Os blocos não genéticos mantêm os seus corpos na memória. Kura Arquivos, quando necessário.

Durante a inicialização, o modo `strict` valida os blocos armazenados das cargas úteis do bloco e reescreve o arquivo hash se necessário. O modo `fast` começa com os metadados de hash / índice armazenados e retorna à inicialização rigorosa se esses metadados forem inconsistentes. Caso Kura detecte uma cauda corrompida, o armazenamento é pruned até ao último bloco validado.

Kura escreve novos blocos através de um escritor de fundo. O escritor aponta cargas úteis de blocos, hashes e entradas de índice, em seguida, avança o marcador de contagem durável de acordo com a política fsync configurada. Quando a aplicação do orçamento de disco estiver ativa, Kura pode purgar segmentos aposentados ou expulsar corpos de blocos mais antigos para `da_blocks/`, mantendo os hashes e as entradas de índice disponíveis para validação e busca.
