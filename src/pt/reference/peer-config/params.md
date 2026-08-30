---
translation_locale: pt
translation_source: /reference/peer-config/params.md
translation_source_hash: 027486a17e7624cc301f939429baf9ea9ed1259564c3b99b8dc63cce17a7b26e
translation_status: machine-validated
translation_engine: nllb-200-ct2

outline: [ 2, 3 ]
---

<script setup>
import ParamTable from './ParamTable.vue';
</script>

# Parâmetros de configuração {#configuration-parameters}

[toc]

## Nível de raiz {#root}

### `chain` <Badge text="required" /> {#param-chain-id}

Cadeia ID que deve ser incluída em cada transação.

Um ataque de repetição é uma tentativa de submeter uma transação válida a uma rede diferente daquela para a qual foi destinada. Como o `chain` faz parte da carga útil das transações assinadas, uma transação assinada para uma cadeia é rejeitada por pares que usam outra cadeia ID.

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

Chave pública do peer. Os pares de validadores de consenso devem usar chaves BLS-Normal.

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

Chave privada do peer. Deve corresponder a `public_key`; os pares validadores de consenso devem usar chaves normais BLS-

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

Lista de colegas de confiança pré-definidos.

Os validadores de consenso devem usar BLS-Chaves peer normais. Para cada validador, também forneça uma entrada correspondente [`trusted_peers_pop`](#param-trusted-peers-pop).

<param-table env="TRUSTED_PEERS">
<template #type>

Array of peer strings. Use `PUBLIC_KEY@ADDRESS` quando o endereço P2P é conhecido; também é aceito `PUBLIC_KEY` nu e permite que o endereçamento de pares seja descoberto a partir de fofocas.

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

BLS entradas de prova de posse para os pares confiáveis do validador.

<param-table env="TRUSTED_PEERS_POP">
<template #type>

Array de objetos com campos `public_key` e `pop_hex`

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

## Gênesis {#genesis}

### `genesis.file` {#param-genesis-file}

Caminho de arquivo para a carga útil do bloco genesis assinado gerada por `kagami genesis sign`. Os perfis gerados normalmente escrevem isso como um arquivo Norito `.nrt`.

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

A chave pública do par de chaves da Gênesis.

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

Endereço para comunicação p2p para efeitos de consenso (sumeragi) e sincronização de blocos (bloco_sync).

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

Endereço peer-to-peer (externo, como visto por outros pares).

Serão fofocas para colegas ligados para que eles possam fofocar isso para outros colegas.

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

A quantidade de blocos que podem ser enviados em uma única mensagem de sincronização.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[network]
block_gossip_size = 256
```

:::

### `network.block_gossip_period_ms` {#param-network-block-gossip-period-ms}

O intervalo de tempo entre os pedidos aos pares para o bloco mais recente.

Os fofocas mais frequentes reduzem o tempo de sincronização, mas podem sobrecarregar a rede.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[network]
block_gossip_period_ms = 1_000
```

:::

### `network.transaction_gossip_size` {#param-network-transaction-gossip-size}

Número máximo de transações em uma mensagem de boatos.

Um tamanho menor leva a um tempo de sincronização mais longo, mas útil se tiver uma alta perda de pacotes.

<param-table type=number default-value=500 />

::: code-group

```toml [Config File]
[network]
transaction_gossip_size = 256
```

:::

### `network.transaction_gossip_period_ms` {#param-network-transaction-gossip-period-ms}

Período de fofocas pendentes a transacção entre pares.

Os fofocas mais frequentes reduzem o tempo de sincronização, mas podem sobrecarregar a rede.

<param-table type=millis default-value=1_000 default-note="1 second" />

::: code-group

```toml [Config File]
[network]
transaction_gossip_period_ms = 5_000
```

:::

### `network.idle_timeout_ms` {#param-network-idle-timeout-ms}

Duração do tempo após o qual a conexão com os pares é interrompida se os pares estiverem inactivos.

<param-table type=millis default-value=300_000 default-note="5 minutes" />

::: code-group

```toml [Config File]
[network]
idle_timeout_ms = 300_000
```

:::

## Torii {#torii}

### `torii.address` <Badge text="required" /> {#param-torii-address}

Endereço ao qual o servidor Torii deve prestar ouvidos e ao qual os clientes (((s) fazem as suas solicitações.

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

O número máximo de bytes em um corpo de solicitação bruto aceito pelos pontos finais [Torii ](/pt/reference/torii-endpoints.md).

Este limite é utilizado para prevenir os ataques DOS.

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

O tempo que uma consulta pode permanecer na loja se não for acessada.

<param-table type=millis default-value=10_000 default-note="10 seconds" />

::: code-group

```toml [Config File]
[torii]
query_idle_time_ms = 10_000
```

:::

### `torii.query_store_capacity` {#param-torii-query-store-capacity}

O limite superior do número de consultas ao vivo.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity = 128
```

:::

### `torii.query_store_capacity_per_user` {#param-torii-query-store-capacity-per-user}

O limite máximo do número de consultas ao vivo para um único utilizador.

<param-table type=number default-value=128 />

::: code-group

```toml [Config File]
[torii]
query_store_capacity_per_user = 128
```

:::

## Loja de madeira {#logger}

### `logger.level` {#param-logger-level}

Verbosidade geral de registro (ver [ `logger.filter`](#param-logger-filter) para a configuração refinada).

<param-table default-value=INFO env=LOG_LEVEL>
<template #type>

String, valores possíveis:

- `TRACE`: Todos os eventos, incluindo as operações de baixo nível.
- `DEBUG`: Mensagens de nível de depuração, úteis para diagnóstico.
- `INFO`: Mensagens de informação gerais.
- `WARN`: Avisos que indicam problemas potenciais.
- `ERROR`: Erros que perturbam a função normal, mas permitem uma continuação da operação.

Escolha o nível que mais se adapte ao seu caso de uso. Consulte [Stack Overflow](https://stackoverflow.com/questions/2031163/when-to-use-the-different-log-levels) para obter detalhes adicionais sobre como usar diferentes níveis de registro.

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

::: tip Atualização do tempo de execução

Este parâmetro está sujeito a uma atualização da configuração de tempo de execução através dos pontos finais do operador Torii.

:::

### `logger.filter` {#param-logger-filter}

Filtros de registro refinados além do [`logger.level`](#param-logger-level). Permite personalizar a verbosidade de registro por alvo.

<param-table type=string env=LOG_FILTER>
<template #type>

Cada directiva pode ter um nível máximo de verbosidade correspondente que permita (por exemplo, selecionar) intervalos e eventos correspondentes. O Iroha considera que os níveis menos exclusivos (como `trace` ou `info`) são mais verbosos do que os mais exclusivos (tais como `error` ou `warn`).

A nível elevado, a sintaxe das directivas consiste em várias partes:

```
target[span{field=value}]=level
```

Para mais informações, veja a documentação [`tracing-subscriber` ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html).

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

`logger.filter` trabalha em conjunto com [`logger.level` ](#param-logger-level) e nenhum dos dois superscreve o outro.

Por exemplo, se o `logger.level` for definido em `INFO` e o `logger.filter` é definido em`iroha_core=debug`, o conjunto de filtros resultante será `info,iroha_core=debug` (ou seja, `info` para todos os módulos, `debug` para `iroha_core`).

:::

::: tip Atualização do tempo de execução

Este parâmetro está sujeito a uma atualização da configuração de tempo de execução através dos pontos finais do operador Torii.

:::

### `logger.format` {#param-logger-format}

Formatos de registos.

<param-table default-value=full env=LOG_FORMAT>
<template #type>

String, valores possíveis:

- `full`: O formatador padrão. Este emite registros de uma única linha, legíveis por humanos para cada evento que ocorre, com o contexto do período atual exibido antes da representação formata do evento.
- `compact`: Uma variante do formatador padrão, otimizada para comprimentos de linhas curtas. Os campos do contexto de span atual são anexados aos campos do evento formatado e os nomes de span não são mostrados; o nível de verbosidade é abreviado para um único caracter.
- `pretty`: Emite registros muito bonitos e de várias linhas, otimizados para a legibilidade humana. Debugging, ou para aplicações de linha de comando, em que a análise automática e o armazenamento compacto dos registos sejam menos prioritários do que a legibilidade e a atração visual.
- `json`: Saídas de registros JSON com linha nova e limitada. Esta é destinada à utilização em produção em sistemas onde registros estruturados são consumidos como JSON por ferramentas de análise e visualização. A saída JSON não é otimizada para a legibilidade humana.

Para obter mais detalhes e resultados da amostra, ver a documentação [`tracing-subscriber` ](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/fmt/format/index.html).

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

O Kura é o motor de armazenamento persistente do Iroha (japonês para armazém).

### `kura.blocks_in_memory` {#param-kura-blocks-in-memory}

No máximo, N últimos blocos serão armazenados na memória.

Os blocos mais antigos serão retirados da memória e carregados do disco se forem necessários.

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

Kura modo de inicialização. `strict` é o modo normal e padrão: valida histórico canônico, artefatos de recuperação, índices auxiliares e contabilidade de armazenamento antes do nó se tornar ativo.

`fast` é um modo de serviço degradado de emergência para restaurar a visibilidade operacional quando uma A auditoria completa de inicialização arriscaria uma interrupção. `strict` e uma geração atual de imagens instantâneas contendo exatamente cinco artefatos: `snapshot.data`, `snapshot.sha256`, `snapshot.sig`, `snapshot.fast.norito`, e `snapshot.merkle.json`. A assinatura do operador separada por domínio liga o digesto da carga útil anunciado e o manifesto delimitado; O manifesto liga o comprimento da carga útil, a identidade da cadeia/rede, a altura do terminal/hash; SCCP A política de hash, e a presença da linhagem do bootstrap. linhagem e requer o mesmo limite exato de marcador/contagem/ponta do durável. Kura. Os nós de primeiro lançamento aceitam exatamente esses cinco artefatos e rejeitam todos os outros conteúdos ou conjuntos de nomes de arquivos.

Inventários rápidos esses cinco nomes e metadados-liga a carga útil e os arquivos Merkle, mas não lê, hash, análise ou decodificação de seu conteúdo. Ele constrói um mundo mínimo / Nexus do manifesto assinado, mapeia o prefixo hash exato Kura somente leitura, e deixa o snapshot Mundo, bloco-hash array, histórico de transações, índices derivados e diários de recuperação duradoura não abertos. Merkle, auditorias canônicas e semânticas de instantâneos, reconciliação de blocos históricos/finalidade/SCCP, recuperação de altura ativa Sumeragi, diários de fusão e consulta, manifestos de vias/fontes de conformidade, Os arquivos SoraFS, a contabilidade de armazenamento recursivo e os reconciliadores opcionais de serviços apoiados pela Kura continuam a ser adiados. A própria Kura rejeita a inicialização do escritor e as mutações duradouras; as filas de pipeline e persistência FASTPQ rejeitam o trabalho imediatamente em vez de retê-lo ou codificá-lo. Kura ler APIs também desativar o comportamento de reparo e sincronização da durabilidade: carros temporários não são promovidos, artefatos de faixa faltantes não são publicados e barreiras ao progresso não são synchronizadas. Sumeragi e fofocas de transação não são lançadas. Torii expõe apenas saúde, vitalidade, prontidão, peer e operações de configuração; API-versão, status, métricas e todas as rotas ordinárias de estado / história permanecem indisponíveis.

Usar `fast` apenas para um incidente. Uma vez que o serviço é estável, pare o nó, restabeleça `strict` e reinicie para que cada verificação adiada e reconstrução de índice seja executada antes da retomada da produção. O modo rápido não requer o registro de fusão diferido e não cria, repara, truncata ou importa armazenamento canônico; sufixos inéditos e estágios de recuperação auxiliar pendentes são ignorados sem serem lidos ou mutados, em seguida, deixados para a recuperação estritamente. A linhagem de snapshot importada apenas com hash permanece indisponível. Um snapshot atual faltante ou inválido falha imediatamente; Fast nunca retorna a um mundo vazio ou reconstrução histórica de repetição.

<param-table default-value=strict>
<template #type>

String, valores possíveis:

- `strict`: validação completa e produção normal
- `fast`: inicialização de emergência limitada com a produção em quarentena até uma reinicialização rigorosa

</template>
</param-table>

::: code-group

```toml [Config File]
[kura]
init_mode = "fast"
```

:::

### `kura.store_dir` {#param-kura-store-dir}

Indica o diretório [^paths] no qual os blocos são armazenados.

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

Bandeira para permitir a impressão de novos blocos no console.

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

## Cotação {#queue}

### `queue.capacity` {#param-queue-capacity}

O limite superior do número de transações à espera na fila.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity = 1_048_576
```

:::

### `queue.capacity_per_user` {#param-queue-capacity-per-user}

O limite superior do número de transacções à espera na fila para um único utilizador.

Utilize esta opção para aplicar o estrogamento.

<param-table type=number default-value=65_536 />

::: code-group

```toml [Config File]
[queue]
capacity_per_user = 1_048_576
```

:::

### `queue.transaction_time_to_live_ms` {#param-queue-transaction-time-to-live-ms}

A transacção será cancelada após este período, se ainda estiver na fila.

<param-table type=millis default-value=86_400_000 default-note="24 hours" />

::: code-group

```toml [Config File]
[queue]
transaction_time_to_live_ms = 43_200_000
```

:::

## Sumeragi {#sumeragi}

### `sumeragi.debug.force_soft_fork` <Badge type="warning" text="debug" /> {#param-sumeragi-debug-force-soft-fork}

O interruptor de depuração apenas para exercer os caminhos de manuseio da forca macia Sumeragi. Deixe isso desativado fora dos testes controlados; mudá-lo em uma rede de produção em execução pode fazer com que os pares discordem sobre o comportamento de consenso.

<param-table type=bool default-value=false />

::: code-group

```toml [Config File]
[sumeragi.debug]
force_soft_fork = true
```

:::

## Nexus Resolução privada atômica {#nexus-atomic-private-settlement}

`[nexus.atomic_private_settlement]` rege o caminho separado `AtomicPrivateSettlementV1`. Ele é desativado por padrão. A configuração `enabled = true` também requer um `activation_height`; a admissão ainda não é fechada, a menos que a capacidade na cadeia, o período de aviso, o perfil de prova fixa e a governação do pool/audit sejam ativos.

Os limites principais são: `max_participants`, `max_expiry_blocks`, `audit_timeout_blocks`, `prepare_timeout_blocks`, `commit_timeout_blocks`, `max_proof_bytes`, `max_capsule_bytes`, `max_carrier_bytes`, `sidecar_retention_blocks`, `sidecar_max_records`, e `sidecar_max_total_bytes`. `capsule_padding_classes_bytes` Deve ser um subconjunto estritamente crescente do V1 Aulas de acondicionamento. `permitted_policy_versions` Só aceita V1.

O `max_capsule_bytes` mede os bytes canônicos Norito do `PrivateSettlementAuditCapsuleV1` completo, incluindo AAD, nonce, texto cifrado, enquadramento de vetores e cada linha revestida com DEK; não é um limite apenas para o texto cifrada. Cada classe de engarrafamento habilitada deve caber no envelope total conservador para pelo menos os auditores `default_min_auditor_approvals`. Essa configuração de aprovação é também um piso regido: Torii rejeita uma política recém-admitida com um valor `min_approvals` mais baixo e rejeita qualquer cápsula real acima do limite canônico de bytes.

Estas configurações não têm contorno de ativação variável do ambiente de produção. Veja [Run Atomic Private Cross-Dataspace Settlement](/pt/get-started/atomic-private-settlement) para o exemplo completo de configuração e requisitos operacionais. O caminho não é qualificado para a produção até que os portões de liberação externos documentados passem.

## Imagem instantânea {#snapshot}

Este módulo é responsável pela leitura e escrita de instantâneos do [World State View](/pt/blockchain/world#world-state-view-wsv).

Snapshots armazenam um ponto de verificação serializado do World State View para que um peer possa reiniciar sem repetição de todos os blocos a partir de Kura. Kura permanece o histórico duradouro dos blocos e a fonte de verdade para repetição; snapshots são uma via de aceleração. Na inicialização, Iroha verifica os metadados de snapshot contra a cadeia configurada e os blocos armazenados antes de decidir se deve carregar um snapshot ou voltar à reprodução.

::: tip Esfolar imagens instantâneas

Caso algo esteja errado com o sistema de instantâneos, e você queira começar a partir de uma página em branco (em termos de instantâneas), você pode remover o diretório especificado por [`snapshot.store_dir`](#param-snapshot-store-dir).

:::

### `snapshot.mode` {#param-snapshot-mode}

O modo no qual o sistema Snapshot funciona.

<param-table default-value=read_write env=SNAPSHOT_MODE>
<template #type>

String, valores possíveis:

- `read_write`: Iroha cria snapshots com um período especificado por [`snapshot.create_every_ms`](#param-snapshot-create-every-ms). Ao iniciar, Iroha lê uma snapshot existente (se houver) e verifica que está atualizada com o armazenamento de blocos.
- `readonly`: Semelhante a `read_write` mas Iroha não cria nenhuma instantânea.
- `disabled`: Iroha não cria novos instantâneos nem lê um existente no início.

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

Frequência de instantâneos.

<param-table type=millis default-value=600_000 default-note="10 minutes" />

::: code-group

```toml [Config File]
[snapshot]
create_every_ms = 60_000
```

:::

### `snapshot.store_dir` {#param-snapshot-store-dir}

Directório onde armazenar instantâneos.

Ver também: [`kura.store_dir`](#param-kura-store-dir)

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

A telemetria exporta o diagnóstico de pares para um coletor externo de telemetria. Configure tanto `telemetry.name` como `telemetry.url` quando um peer deve relatar a um coleccionador; omita a seção quando a telemetria não é utilizada.

O `name` e o `url` devem ser emparelhados.

Todas as secções `telemetry` são opcionais.

### `telemetry.name` {#param-telemetry-name}

O nome do nó deve ser exibido na telemetria.

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

O período mínimo de espera antes da reconexão.

<param-table type=millis default-value=1_000  default-note="1 second" />

::: code-group

```toml [Config File]
[telemetry]
min_retry_period_ms = 5_000
```

:::

### `telemetry.max_retry_delay_exponent` {#param-telemetry-max-retry-delay-exponent}

O exponente máximo de 2 utilizado para aumentar o atraso entre as reconexões.

<param-table type=number default-value=4 />

::: code-group

```toml [Config File]
[telemetry]
max_retry_delay_exponent = 4
```

:::

### `dev_telemetry.out_file` {#param-dev-telemetry-out-file}

O caminho de arquivo para escrever dev-telemetria para

<param-table type=file-path />

::: code-group

```toml [Config File]
[dev_telemetry]
out_file = "/path/to/file.json"
```

:::
