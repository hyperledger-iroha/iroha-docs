---
translation_locale: pt
translation_source: /blockchain/world.md
translation_source_hash: 61657e1736d3163965063c38e347ed7dbfe040633ddf24eb1a37904922cb354d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Mundo {#world}

`World` é a entidade global que contém outras entidades. O `World` consiste em:

- Iroha [parâmetros de configuração](/pt/guide/configure/client-configuration.md)
- pares de rede registrados
- domínios registrados
- registrado [gatilhos](/pt/blockchain/triggers.md)
- registrado [papéis](/pt/blockchain/permissions.md#permission-groups-roles)
- registrado [definições de token de permissão](/pt/blockchain/permissions.md#permission-tokens)
- tokens de permissão para todas as contas
- [a cadeia de validadores de tempo de execução de software](/pt/blockchain/permissions.md#runtime-validators)

Quando domínios, pares de rede ou funções são registrados ou cancelados, o `World` é o alvo do (des)registro [instrução](/pt/blockchain/instructions.md).

## Visão do Estado Mundial (WSV) {#world-state-view-wsv}

A Visualização do Estado do Mundo é a representação em memória do estado atual da blockchain. Ela inclui os `World`, os hashes criptográficos dos blocos confirmados, os índices de transações e os pares de rede eleitos para a época atual. As cargas completas de blocos são fornecidas a partir de Kura em vez de serem duplicadas como dados mutáveis WSV.

O WSV é o estado que consultas leem e que bloqueia a execução de mutações. Ele não é a fonte durável da verdade por si só. O histórico durável é armazenado em [Kura](#kura-storage), e o WSV pode ser reconstruído a partir de blocos Kura ou carregado a partir de uma visão de dados de estado pontual e, em seguida, atualizado reproduzindo blocos Kura mais recentes.

### Quais são as faixas WSV {#what-the-wsv-tracks}

O WSV é mais amplo do que o objeto `World`. Na prática, ele contém:

- os `World`: parâmetros, pares de rede, domínios, contas, ativos, NFTs, funções, permissões, gatilhos, dados do executor e outros objetos do modelo de dados registrados
- hashes criptográficos de blocos comprometidos e a última altura comprometida
- índices de transação-para-bloco usados por consultas e registros de resultados de protocolo
- a topologia do commit atual e anterior usada pelo consenso
- índices em memória derivados de blocos confirmados, como compromissos de disponibilidade de dados, cursores de registro de resultados de protocolo, intenções de fixação e marcadores de projeção de consulta
- instantâneos da configuração do ambiente de execução necessários à execução determinística dos blocos, como as configurações de criptografia, governança, pipeline, conteúdo, liquidação e Nexus

As consultas normalmente recebem um `StateView` apenas de leitura sobre essas estruturas. Uma visão é uma visão de dados consistente em um ponto no tempo para execução de consultas; ela não permite a mutação direta do WSV.

### Como o WSV Muda {#how-the-wsv-changes}

WSV as alterações são preparadas antes de serem confirmadas. A execução do bloco cria uma sobreposição de estado com escopo de bloco, e cada transação aceita aplica suas instruções em um sobreposição com escopo de transação. Gatilhos de dados invocados por essas transações são executados no mesmo contexto de bloco. Gatilhos de tempo são avaliados após os efeitos da transação para o bloco.

Após o consenso confirmar um bloco, o nó da rede primeiro enfileira o bloco confirmado em Kura. Se esta etapa de enfileiramento falhar, o WSV não é avançado e o loop de consenso tenta novamente ou reencaminha o payload do bloco. Quando o bloco é aceito na fila de Kura, Iroha aplica os efeitos do bloco pós-execução, atualiza os índices derivados e confirma as alterações em estágio WSV sob um bloqueio de visualização de estado. Isso impede que os leitores observem um bloco parcialmente confirmado.

A regra crítica de consenso é que os pares da rede devem alcançar o mesmo WSV a partir dos mesmos blocos comprometidos. Edições locais diretas nos dados de WSV contornam instruções e farão com que os pares da rede discordem durante a validação ou reprodução.

### Inicializar e Repetir {#startup-and-replay}

Na inicialização, Iroha inicializa Kura primeiro e aprende a altura do bloco armazenada. Em seguida, tenta carregar uma captura de estado. Se não houver uma visão de dados em um ponto do tempo disponível, ou se uma visão de dados em um ponto do tempo for rejeitada como recuperável, Iroha cria um estado inicial e reproduz blocos comprometidos de Kura. Se uma visualização de dados pontual for válida, mas estiver atrás de Kura, apenas o intervalo de altura ausente é reproduzido.

A reprodução valida cada bloco armazenado, reconstrói a lista de commits para essa altura, aplica os efeitos do bloco ao WSV e confirma o estado resultante. Isso significa que Kura é o caminho de recuperação para o WSV, enquanto as visualizações de dados em ponto no tempo são uma otimização que evita a reprodução de toda a cadeia.

## Kura Armazenamento {#kura-storage}

Kura é o armazenamento persistente de blocos de Iroha. Ele armazena blocos assinados e metadados de recuperação. Ele não armazena uma segunda cópia mutável do WSV.

Kura o armazenamento está enraizado em [`kura.store_dir`](/pt/reference/peer-config/params.md#param-kura-store-dir). Dentro dessa raiz, os dados de bloco são divididos por via de execução ou segmento. Os arquivos principais de um segmento são:

|Caminho|Propósito|
| --- | --- |
| `blocks/<segment>/blocks.data` |Carga útil de blocos assinados contíguos enquadrados Norito.|
| `blocks/<segment>/blocks.index` |Entradas de tamanho fixo `(start, length)` que mapeiam a altura do bloco para bytes em `blocks.data`.|
| `blocks/<segment>/blocks.hashes` |Bloquear hashes criptográficos por altura para consulta rápida e validação na inicialização.|
| `blocks/<segment>/blocks.count.norito` |Marcador de commit durável registrando quantas entradas de índice de bloco são seguras para uso.|
| `blocks/<segment>/da_blocks/` |Cargas úteis de blocos despejados mantidas fora `blocks.data` quando a aplicação do orçamento de disco move corpos antigos para fora do arquivo quente.|
| `blocks/<segment>/pipeline/sidecars.norito` e `sidecars.index` |registro auxiliar de recuperação do pipeline de processamento indexado pela altura do bloco.|
| `blocks/<segment>/pipeline/roster_sidecars.norito` e `roster_sidecars.index` | Registros auxiliares recentes do quadro de commits usados pela sincronização de blocos e reprodução. |
| `merge_ledger/<segment>.log` |Entradas do livro-razão da fusão alinhadas com blocos comprometidos.|
| `commit-rosters.norito` |Certificados de compromisso retidos e pontos de verificação do validador para blocos recentes.|

Kura mantém um vetor compacto na memória para a cadeia: cada altura possui o hash criptográfico do bloco e, opcionalmente, o corpo do bloco. O bloco gênese da blockchain permanece em cache, e o mais recente [`kura.blocks_in_memory`](/pt/reference/peer-config/params.md#param-kura-blocks-in-memory) blocos não gênesis mantêm seus corpos na memória. Corpos de blocos mais antigos são descartados da memória e recarregados de Kura arquivos quando necessário.

Durante a inicialização, o modo `strict` valida os blocos armazenados a partir dos payloads de bloco e reescreve o arquivo de hash criptográfico se necessário. O modo `fast` inicia a partir dos dados armazenados metadados de hash/índice e recorre à inicialização rígida se esses metadados forem inconsistentes. Se Kura detectar uma cauda corrompida, ele poda o armazenamento até o último bloco validado.

Kura escreve novos blocos por meio de um gravador em segundo plano. O gravador adiciona cargas úteis de blocos, hashes criptográficos e entradas de índice, e então avança o marcador de contagem durável de acordo com a política de fsync configurada. Quando a aplicação do orçamento de disco está ativa, Kura pode limpar segmentos descomissionados ou expulsar corpos de blocos mais antigos para `da_blocks/` enquanto mantém os hashes criptográficos e entradas de índice disponíveis para validação e consulta.
