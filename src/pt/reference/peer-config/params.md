---
translation_locale: pt
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: bing-translator-llm

outline: [2, 3]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Parâmetros de Configuração {#configuration-parameters}

[[toc]]

## Nível Raiz {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

ID da cadeia que deve ser incluído em cada transação. Usado para prevenir ataques de repetição.

Um ataque de repetição é uma tentativa de enviar uma transação válida para uma rede diferente daquela para a qual foi destinada. Como o `chain` faz parte da carga útil da transação assinada, uma transação assinada para uma cadeia é rejeitada pelos pares da rede que utilizam outro ID de cadeia.

<param-table type=string env=CHAIN />

::: code-group

```toml [Config File]
chain = "00000000-0000-0000-0000-000000000000"
```

```shell [Environment]
CHAIN="00000000-0000-0000-0000-000000000000"
```

:::

### `public_key` <Badge text="required" /> {#param-public-key}

Chave pública do par de rede. Os pares de rede do validador de consenso devem usar chaves BLS-Normal.

<param-table type="public-key" env="PUBLIC_KEY" />

::: code-group

```toml [Config File]
public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

```shell [Environment]
PUBLIC_KEY="ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2"
```

:::

### `private_key` <Badge text="required" /> {#param-private-key}

Chave privada do par de rede. Ela deve corresponder a `public_key`; os pares validadores de consenso devem usar chaves BLS-Normais.

<param-table type="private-key" env="PRIVATE_KEY" />

::: code-group

```toml [Config File]
private_key = "8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

```shell [Environment]
PRIVATE_KEY="8926201CA347641228C3B79AA43839DEDC85FA51C0E8B9B6A00F6B0D6B0423E902973F"
```

:::

### `trusted_peers` {#param-trusted-peers}

Lista de pares de rede confiáveis predefinidos.

Os validadores de consenso devem usar BLS-Chaves de pares de rede normais. Para cada validador, forneça também uma correspondente [`trusted_peers_pop`](#param-trusted-peers-pop) entrada.

<param-table env="TRUSTED_PEERS">
<template #type>

Matriz de strings de pares de rede. Use `PUBLIC_KEY@ADDRESS` quando o endereço P2P for conhecido; `PUBLIC_KEY` isolado também é aceito e permite descobrir o endereço do par por gossip.

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers = [
    "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
    "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338",
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS='[
  "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2@127.0.0.1:1337",
  "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77@127.0.0.1:1338"
]'
```

:::

### `trusted_peers_pop` {#param-trusted-peers-pop}

BLS entradas de prova de posse para pares confiáveis da rede do validador.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Array de objetos com os campos `public_key` e `pop_hex`

</template>
</param-table>

::: code-group

```toml [Config File]
trusted_peers_pop = [
  { public_key = "ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2", pop_hex = "8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08" },
  { public_key = "ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77", pop_hex = "a14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913" },
]
```

```shell [Environment]
# as JSON
TRUSTED_PEERS_POP='[
  {"public_key":"ea01309060D021340617E9554CCBC2CF3CC3DB922A9BA323ABDF7C271FCC6EF69BE7A8DEBCA7D9E96C0F0089ABA22CDAADE4A2","pop_hex":"0x8515da750f81182aaba5c22fc9f03a01e81ed85e4495a2ca6b29a71c0c8549537e31e79cddf6ff285b9e22d0d9dc17ce0f46e7d0cf78b2ef9feab50c849a1ea8e1e4f07e966f6113faa8a999317545d9f111b8e08a7273913710b43a20b19c08"},
  {"public_key":"ea0130A7E9D016D723F72942FCF4B988FB599EA0E092F73C8B68E69F4E8B3FE542A3F7E48AD6CD15F3EB484E45F79399071F77","pop_hex":"0xa14eb180f0d78c55d2c034e91ccf691378e9c3ceed8e0b81d3e4b7c215c0dbb633bb9f1c5063911c31af4610016c164015f0f93db3c7df6a2ad0c39338fe7695b976a59fd13797615f229fbd77276a8bb2842e4e44fadcafdb7b37f4a143b913"}
]'
```

:::

## gênese da blockchain {#genesis}

### `genesis.file` {#param-genesis-file}

Caminho do arquivo para o payload do bloco gênese da blockchain assinado gerado por `kagami genesis sign`. Perfis gerados comumente escrevem isso como um arquivo Norito `.nrt`.

<param-table type="file-path" env="GENESIS" />

::: code-group

```toml [Config File]
[genesis]
file = "./genesis.signed.nrt"
```

```shell [Environment]
GENESIS="./genesis.signed.nrt"
```

:::

### `genesis.public_key` <Badge text="required" /> {#param-genesis-public-key}

Chave pública do par de chaves gênese da blockchain.

<param-table type="public-key" env="GENESIS_PUBLIC_KEY" />

::: code-group

```toml [Config File]
[genesis]
public_key = "ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

```shell [Environment]
GENESIS_PUBLIC_KEY="ed01208BA62848CF767D72E7F7F4B9D2D7BA07FEE33760F79ABE5597A51520E292A0CB"
```

:::

## Rede {#network}

### `network.address` <Badge text="required" /> {#param-network-address}

Endereço para comunicação p2p para fins de consenso (sumeragi) e sincronização de blocos (block_sync).

<param-table type="socket-addr" env="P2P_ADDRESS" />

::: code-group

```toml [Config File]
[network]
address = "0.0.0.0:1337"
```

```shell [Environment]
P2P_ADDRESS=0.0.0.0:1337
```

:::

### `network.public_address` <Badge text="required" /> {#param-network-public-address}

Endereço ponto a ponto (externo, como visto por outros pares da rede).

Será repassado por gossip aos pares conectados da rede para que eles possam repassá-lo a outros pares da rede.

<param-table type="socket-addr" env="P2P_PUBLIC_ADDRESS" />

::: code-group

```toml [Config File]
[network]
public_address = "0.0.0.0:5000"
```

```shell [Environment]
P2P_PUBLIC_ADDRESS=0.0.0.0:5000
```

:::

### `network.block_gossip_size` {#param-network-block-gossip-size}

A quantidade de blocos que pode ser enviada em uma única mensagem de sincronização.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

O intervalo de tempo entre solicitações aos pares da rede pelo bloco mais recente.

Fofocas mais frequentes encurtam o tempo para sincronizar, mas podem sobrecarregar a rede.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Número máximo de transações em uma mensagem de lote de fofoca.

Tamanho menor leva a um tempo maior para sincronizar, mas é útil se você tiver alta perda de pacotes.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Período de fofoca sobre transação pendente entre pares da rede.

Fofocas mais frequentes encurtam o tempo para sincronização, mas podem sobrecarregar a rede.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Duração de tempo após a qual a conexão com o par de rede é encerrada se o par de rede estiver inativo.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Endereço ao qual o servidor Torii deve escutar e ao qual os clientes fazem suas requisições.

<param-table type=socket-addr env=API_ADDRESS />

::: code-group

```toml [Config File]
[torii]
address = "0.0.0.0:8080"
```

```shell [Environment]
API_ADDRESS=0.0.0.0:8080
```

:::

### `torii.max_content_len` {#param-torii-max-content-len}

O número máximo de bytes em um corpo de requisição bruto aceito pelo [Torii API pontos de extremidade](/pt/reference/torii-endpoints.md).

Este limite é usado para prevenir ataques DOS.

<param-table>
<template #type>

Número (de bytes)

</template>
<template #default-value>

`64_000_000` (64 milhões de bytes)

</template>
</param-table>

::: code-group

```toml [Config File]
[torii]
max_content_len = 64_000_000
```

:::

### `torii.query_idle_time_ms` {#param-torii-query-idle-time-ms}

O tempo que uma consulta pode permanecer no armazenamento se não for acessada.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

O limite máximo do número de consultas ativas.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

O limite máximo do número de consultas ativas para um único usuário.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Lenhador {#logger}

### `logger.level` {#param-logger-level}

Verbosidade geral de registro (veja [`logger.filter`](#param-logger-filter) para configuração refinada).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

String, valores possíveis:

- `TRACE`: Todos os eventos, incluindo operações de baixo nível.
- `DEBUG`: Mensagens em nível de depuração, úteis para diagnósticos.
- `INFO`: Mensagens informativas gerais.
- `WARN`: Avisos que indicam problemas potenciais.
- `ERROR`: Erros que interrompem a função normal, mas permitem a operação contínua.

Escolha o nível que melhor se adequa ao seu caso de uso. Consulte [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) para obter detalhes adicionais sobre como usar diferentes níveis de log.

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
level = "INFO"
```

```shell [Environment]
LOG_LEVEL=INFO
```

:::

::: tip atualização do tempo de execução do software

Este parâmetro está sujeito à atualização de configuração em tempo de execução do software através dos endpoints do operador API Torii.

:::

### `logger.filter` {#param-logger-filter}

Filtros de log refinados além de [`logger.level`](#param-logger-level). Permite personalizar a verbosidade de registro por alvo.

<param-table type=string env=LOG_FILTER>
<template #type>

String, consiste em uma ou mais diretivas separadas por vírgulas. Cada diretiva pode ter um nível máximo de verbosidade correspondente que habilita (por exemplo, seleciona) spans e eventos que correspondem. Iroha considera que níveis menos exclusivos (como `trace` ou `info`) são mais verbosos do que níveis mais exclusivos (como `error` ou `warn`).

Em um nível alto, a sintaxe para diretivas consiste em várias partes:

```
target[span{field=value}]=level
```

Para mais detalhes, veja [`tracing-subscriber` documentação](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

</template>

</param-table>

::: code-group

```toml [Config File]
[logger]
filter = "iroha_core=debug,iroha_p2p=debug"
```

```shell [Environment]
LOG_FILTER=iroha_core=debug,iroha_p2p=debug
```

:::

::: info Composição com [`logger.level`](#param-logger-level)

`logger.filter` trabalha junto com [`logger.level`](#param-logger-level) e nenhum deles substitui o outro.

Por exemplo, se `logger.level` for definido como `INFO` e `logger.filter` for definido como `iroha_core=debug`, o conjunto de filtros resultante será `info,iroha_core=debug` (ou seja, `info` para todos os módulos, `debug` para `iroha_core`).

:::

::: tip atualização do tempo de execução do software

Este parâmetro está sujeito à atualização de configuração em tempo de execução do software através dos endpoints do operador API Torii.

:::

### `logger.format` {#param-logger-format}

Formato de logs.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

String, valores possíveis:

- `full`: O formatador padrão. Ele emite logs de uma única linha, legíveis por humanos, para cada evento que ocorre, com o contexto do span atual exibido antes da representação formatada do evento.
- `compact`: Uma variante do formatador padrão, otimizada para comprimentos curtos de linha. Campos do contexto de span atual são adicionados aos campos do evento formatado, e os nomes de span não são exibidos; o nível de verbosidade é abreviado para um único caractere.
- `pretty`: Emite logs excessivamente bonitos e multilinha, otimizados para legibilidade humana. Isso é destinado principalmente para ser usado no desenvolvimento local e depuração, ou para aplicações de linha de comando, onde a análise automatizada e o armazenamento compacto de logs têm menos prioridade do que a legibilidade e o apelo visual.
- `json`: Gera logs JSON separados por quebras de linha. Isso é destinado para uso em produção com sistemas onde logs estruturados são consumidos como JSON por ferramentas de análise e visualização. A saída JSON não é otimizada para legibilidade humana.

Para mais detalhes e exemplos de resultados, veja [`tracing-subscriber` documentação](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

</template>
</param-table>

::: code-group

```toml [Config File]
[logger]
format = "json"
```

```shell [Environment]
LOG_FORMAT=json
```

:::

## Kura {#kura}

Kura é o mecanismo de armazenamento persistente de Iroha (japonês para armazém).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

No máximo N últimos blocos serão armazenados na memória.

Blocos mais antigos serão descartados da memória e carregados do disco se forem necessários.

<param-table type=number default-value=1024 env=KURA_BLOCKS_IN_MEMORY />

::: code-group

```toml [Config File]
[kura]
blocks_in_memory = 1024
```

```shell [Environment]
KURA_BLOCKS_IN_MEMORY=1024
```

:::

### `kura.init_mode` {#param-kura-init-mode}

Kura modo de inicialização. `strict` é o modo normal e padrão: ele valida o histórico canônico, artefatos de recuperação, índices auxiliares e contabilidade de armazenamento antes que o nó se torne ativo.

`fast` é um modo de serviço degradado de emergência para restaurar a visibilidade operacional quando uma auditoria completa de inicialização apresentaria risco de interrupção. Ele requer armazenamento previamente inicializado por `strict` e uma geração de visualização de dados em ponto no tempo atual contendo exatamente cinco artefatos: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito` e `snapshot.merkle.json`. Uma assinatura de operador separada por domínio vincula o valor do resumo criptográfico da carga útil anunciada e o manifesto técnico limitado; o manifesto técnico vincula comprimento da carga útil, identidade da cadeia/rede, altura/hash do terminal, hash criptográfico da política SCCP e presença da linhagem de inicialização. O Fast rejeita a linhagem bootstrap e requer o mesmo marcador/contagem/limite de ponta exato do durável Kura. Os nós da primeira versão aceitam exatamente esses cinco artefatos e rejeitam qualquer outro conjunto de contagem ou nome de arquivo de artefatos.

O Fast inventaria esses cinco nomes e vincula os metadados ao payload e aos arquivos Merkle, mas não lê, faz hash criptográfico, analisa ou decodifica seus conteúdos. Ele constrói um World/Nexus mínimo a partir do manifesto técnico assinado, mapeia o prefixo de hash criptográfico exato Kura como somente leitura e deixa a visualização de dados em ponto no tempo World, o array de hash de blocos, o histórico de transações, os índices derivados e os diários de recuperação duráveis não abertos. Merkle, auditorias de visualização de dados pontuais canônicos e semânticos, reconciliação histórica de blocos/finalidade/SCCP, recuperação de altura ativa Sumeragi, fusão e consultas de diários, manifesto/lotes de execução de fontes de conformidade, arquivos SoraFS respaldados por Kura, contabilidade de armazenamento recursiva, e os conciliadores de serviço opcionais permanecem adiados. A admissão de transações locais, propostas, votação, gravações canônicas e produtores auxiliares permanecem desativados. Kura rejeita por si só a inicialização do gravador e mutações duráveis; o pipeline de processamento e as filas de persistência FASTPQ rejeitam o trabalho imediatamente em vez de retê-lo ou codificá-lo. Kura leia APIs também desativa o comportamento de reparo e sincronização de durabilidade: registros auxiliares temporários não são promovidos, artefatos de lane de execução ausentes não são publicados, e barreiras de progresso não são fsyncadas. Sumeragi e gossip de transação não são iniciados. Torii expõe apenas operações de saúde, vigência, prontidão, pares de rede e configuração; API-versão, status, métricas e todas as rotas de estado/histórico comuns permanecem indisponíveis. A prontidão permanece indisponível até a reinicialização Strict.

Use `fast` apenas para um incidente. Uma vez que o serviço esteja estável, pare o nó, restaure `strict` e reinicie para que todas as verificações adiadas e a reconstrução de índices sejam executadas antes que a produção seja retomada. O modo rápido não requer o log de mesclagem diferida e não cria, repara, trunca ou importa o armazenamento canônico; sufixos não publicados e estágios de recuperação auxiliar pendentes são ignorados sem serem lidos ou modificados, e então deixados para a recuperação Estrita. A linhagem de visualização de dados pontual apenas com hash importada permanece indisponível. Uma visualização de dados pontual atual ausente ou inválida falha imediatamente; o Fast nunca recorre a uma reconstrução de replay histórico ou mundo vazio.

<param-table default-value=strict>
<template #type>

String, valores possíveis:

- `strict`: validação completa e produção normal
- `fast`: inicialização de emergência limitada com produção quarentenada até uma reinicialização rigorosa

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Especifica o diretório[^paths] onde os blocos são armazenados.

Veja também: [`snapshot.store_dir`](#param-snapshot-store-dir).

<param-table env=KURA_STORE_DIR type=file-path default-value=./storage />

::: code-group

```toml [Config File]
[kura]
store_dir = "/path/to/storage"
```

```shell [Environment]
KURA_STORE_DIR=/path/to/storage
```

:::

### `kura.debug.output_new_blocks` <Badge type="warning" text="debug" /> {#param-kura-debug-output-new-blocks}

Flag para habilitar a impressão de novos blocos no console.

<param-table env=KURA_DEBUG_OUTPUT_NEW_BLOCKS type=bool default-value=false />

::: code-group

```toml [Config File]
[kura.debug]
output_new_blocks = true
```

```shell [Environment]
KURA_DEBUG_OUTPUT_NEW_BLOCKS=true
```

:::

## Fila {#queue}

### `queue.capacity` {#param-queue-capacity}

O limite máximo do número de transações aguardando na fila.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

O limite máximo do número de transações esperando na fila para um único usuário.

Use esta opção para aplicar limitação.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

A transação será descartada após esse tempo se ainda estiver na fila.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

Interruptor apenas para depuração para exercitar os caminhos de manuseio de soft-fork Sumeragi. Deixe isso desativado fora de testes controlados; alterá-lo em uma rede de produção em execução pode fazer com que os pares da rede discordem sobre o comportamento de consenso.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Liquidação Privada Atômica {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` governa o caminho separado `AtomicPrivateSettlementV1`. Ele está desativado por padrão. Configurar `enabled = true` também requer um `activation_height`; a admissão ainda falha fechada, a menos que a capacidade na cadeia, o período de notificação, o perfil de prova fixo e a governança do pool/auditoria estejam ativos.

Os limites principais são `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records` e `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` deve ser um subconjunto estritamente crescente das classes de preenchimento V1. `permitted_policy_versions` aceita apenas V1.

`max_capsule_bytes` mede os Norito bytes canônicos do `PrivateSettlementAuditCapsuleV1` completo, incluindo AAD, valor de nonce criptográfico, cifra, enquadramento de vetor e cada linha DEK envolta por auditor; não é um limite apenas para cifra. Cada classe de espaçamento ativada deve se ajustar ao contêiner de dados de cápsula inteira conservador para pelo menos `default_min_auditor_approvals` auditores. Essa configuração de aprovação também é um limite regulamentado: Torii rejeita uma política recém-admitida com um valor `min_approvals` inferior e rejeita qualquer cápsula real acima do limite canônico de bytes.

Essas configurações não têm bypass de ativação de variável de ambiente em produção. Veja [Executar Liquidação Atômica Privada entre Espaços de Dados](/pt/get-started/atomic-private-settlement) para o exemplo completo de configuração e requisitos operacionais. O caminho não é qualificado para produção até que os portões de liberação externa documentados sejam aprovados.

## visualização de dados em um ponto no tempo {#snapshot}

Este módulo é responsável por ler e escrever visualizações de dados pontuais do [Visão do Estado Mundial](/pt/blockchain/world#world-state-view-wsv).

Os instantâneos armazenam um ponto de verificação serializado da Visão do Estado Mundial, permitindo que um par reinicie sem reproduzir todos os blocos de Kura. Kura continua sendo o histórico durável de blocos e a fonte de verdade para reprodução; os instantâneos apenas aceleram a recuperação. Na inicialização, a Iroha compara os metadados do instantâneo com a cadeia configurada e os blocos armazenados antes de decidir entre carregar o instantâneo e reproduzir o histórico.

::: tip Limpar visualizações de dados em ponto no tempo

Caso haja algum problema com o sistema de visualização de dados em ponto no tempo, e você quer começar a partir de uma página em branco (em termos de visualizações de dados pontuais), você poderia remover o diretório especificado por [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

O modo em que o sistema de visualização de dados em um ponto no tempo funciona.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

String, valores possíveis:

- `read_write`: o Iroha cria instantâneos no intervalo definido por [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Na inicialização, o Iroha lê o instantâneo existente, se houver, e verifica se ele está atualizado em relação ao armazenamento de blocos.
- `readonly`: semelhante a `read_write`, mas o Iroha não cria nenhum instantâneo.
- `disabled`: o Iroha não cria instantâneos nem lê um instantâneo existente na inicialização.

</template>
</param-table>

::: code-group

```toml [Config File]
[snapshot]
mode = "readonly"
```

```shell [Environment]
SNAPSHOT_MODE=readonly
```

:::

### `snapshot.create_every_ms` {#param-snapshot-create-every-ms}

Frequência de snapshots.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Diretório onde armazenar snapshots.

Veja também: [`kura.store_dir`](#param-kura-store-dir)

<param-table type=file-path default-value=./storage/snapshot env=SNAPSHOT_STORE_DIR />

::: code-group

```toml [Config File]
[snapshot]
store_dir = "/path/to/storage"
```

```shell [Environment]
SNAPSHOT_STORE_DIR="/path/to/storage"
```

:::

## Telemetria {#telemetry}

A telemetria exporta diagnósticos de pares de rede para um coletor de telemetria externo. Configure tanto `telemetry.name` quanto `telemetry.url` quando um par de rede deve relatar a um coletor; omita a seção quando a telemetria não for usada.

`name` e `url` devem ser emparelhados.

Toda a seção `telemetry` é opcional.

### `telemetry.name` {#param-telemetry-name}

O nome do nó a ser exibido na telemetria.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
name = "iroha"
```

:::

### `telemetry.url` {#param-telemetry-url}

O WebSocket URL do coletor de telemetria.

<param-table type=string />

::: code-group

```toml [Config File]
[telemetry]
url = "ws://telemetry.example.com/submit"
```

:::

### `telemetry.min_retry_period_ms` {#param-telemetry-min-retry-period-ms}

O período mínimo de tempo para esperar antes de reconectar.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

O expoente máximo de 2 que é usado para aumentar o intervalo entre reconexões.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

O caminho do arquivo para escrever dev-telemetry

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
