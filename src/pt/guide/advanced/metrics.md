---
translation_locale: pt
translation_source: /guide/advanced/metrics.md
translation_source_hash: fc62efbb6100308bb7a929e18c9c8b6860372abd6d0009616ea63d7c77b6b1eb
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Desempenho e Métricas {#performance-and-metrics}

O desempenho do Iroha depende da carga de trabalho, da topologia do validador, das condições da rede e das configurações de consenso. Um único número TPS é, portanto, útil apenas quando está vinculado a uma execução de benchmark com uma configuração fixa.

Para planejamento de capacidade, trate o desempenho como um contêiner de dados operacionais:

- a rede aceita a taxa de transação solicitada
- a latência de commit permanece dentro do orçamento alvo
- as filas de transação permanecem limitadas
- o consenso não depende de mudanças repetidas de visão ou caminhos de recuperação

Use esta página para estimar se uma implantação está em um estado de alto, médio ou baixo desempenho para um determinado número de nós, limite de latência de rede e TPS alvo.

## O que medir {#what-to-measure}

Comece com a visualização de dados de ponto no tempo do nó público e coleta do Prometheus, então use o CLI para o estado de consenso autenticado pelo operador. A chave do operador deve ser permitida pelo nó de destino e é carregada apenas em tempo de execução do software:

```bash
export TORII=http://127.0.0.1:8180
export OPERATOR_KEY_FILE=./secrets/operator.key

curl -s -H 'Accept: application/json' "$TORII/status" | jq .
curl -s "$TORII/metrics" > metrics.prom

iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi status
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi qc
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

O público Taira é útil para aprender a forma de instantâneos de nós anônimos. Seus diagnósticos de operador estão intencionalmente indisponíveis sem uma chave de operador Taira:

```bash
TAIRA=https://taira.sora.org

curl -fsS -H 'Accept: application/json' "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/now" \
  | jq '{now_ms, offset_ms}'
```

Não use observações de testnet pública como números de capacidade de produção para sua própria implantação.

A visibilidade da telemetria depende do perfil configurado. `operator` habilita o status e snapshots de diagnósticos. `extended` adiciona `/metrics` e tempos de execução custosos, enquanto `developer` adiciona visualizações de dados de ponto no tempo do desenvolvedor, como líder, QC, parâmetros e evidências, sem habilitar `/metrics`. Use `full` quando uma execução precisar de ambos os conjuntos. `telemetry_profile` é o único interruptor de telemetria da primeira versão.

```toml
telemetry_profile = "full"
```

## Faixas de Desempenho {#performance-bands}

Use essas faixas para uma execução observada na taxa de transferência alvo `Y` TPS e no orçamento de latência `L` milissegundos. Execute a carga de trabalho por tempo suficiente para incluir aquecimento, estado estável e pelo menos um período de carga máxima esperada.

|Banda|Condições|Significado|
| --- | --- | --- |
|Alto|O throughput aceito está em ou acima de `Y`, a latência de commit p95 está abaixo de `0.8 * L`, as filas permanecem abaixo de 10% da capacidade, e os contadores de mudança de visualização/recuperação estão estáveis|A implantação tem capacidade para a carga de trabalho solicitada|
|Médio|O rendimento aceito está próximo de `Y`, a latência de commit p95 está abaixo de `L`, as filas estão estáveis abaixo de 50% da capacidade, e as mudanças de visualização são raras|A implementação funciona, mas há uma tolerância limitada a picos|
|Baixo|A taxa de transferência aceita está abaixo de `Y`, a latência de commit p95 excede `L`, as filas crescem durante a execução ou os contadores de alteração de visualização/retropressão aumentam continuamente|A carga de trabalho solicitada excede pelo menos um gargalo|

A regra principal é a direção da fila. Se o TPS enviado for maior que o TPS comprometido e a fila continuar crescendo, a implantação está sobrecarregada, mesmo que amostras curtas pareçam saudáveis.

## Contagem de Nós e Quórum {#node-count-and-quorum}

Mais validadores melhoram a tolerância a falhas, mas aumentam os custos de coordenação, assinatura e dispersão na rede. O protocolo da primeira versão Sumeragi exige:

- um comitê de votação exato `n = 3f + 1`
- `4 <= n <= 31`, então os tamanhos válidos são 4, 7, 10 e assim por diante
- um quórum de votação de `2f + 1`
- os nós da rede observadora sincronizam blocos, mas não votam, não propõem nem coletam

|Validadores|Orçamento de falhas|Quórum de commit|Nota de capacidade|
| --- | --- | --- | --- |
| 4 | 1 | 3 |Mínimo comum para tolerância a uma falha|
| 7 | 2 | 5 |Mais resiliente, com mais votação e tráfego de propagação|
| 10 | 3 | 7 |Custo de coordenação mais alto; a rede e o ajuste de entrada importam mais|
| 31 | 10 | 21 |Comitê de primeira liberação máxima; coordenação de referência e custo de assinatura cuidadosamente|

A geração gênese da blockchain e a validação de inicialização rejeitam tamanhos de comitê não conformes; não faça benchmarking de uma topologia que a versão não possa admitir.

Ao avaliar "nós X", separe os validadores que votam dos observadores. Adicionar observadores geralmente custa menos do que adicionar validadores, mas os observadores ainda consomem gossip de blocos, sincronização de blocos, disco e largura de banda da rede.

## Fatores Que Influenciam o Desempenho {#factors-that-influence-performance}

### Formato da carga de trabalho {#workload-shape}

O mesmo TPS pode ser barato ou caro dependendo do que cada transação faz. Registro:

- número de instruções por transação
- contagem de assinaturas e algoritmos de assinatura
- tamanho do byte da transação e tamanho da carga útil descomprimida
- relação leitura/escrita
- tamanho de metadados e operações de ativos
- contrato inteligente, gatilho e custo de execução IVM
- consulta de carga sendo executada contra os mesmos pares de rede

Pequenas transações de transferência não são um substituto para cargas de trabalho pesadas em contratos ou metadados.

### Cadência de Consenso {#consensus-cadence}

A visualização de dados em ponto no tempo do parâmetro eficaz Sumeragi contém a cadência do bloco assinado imutável e o limite de desvio do relógio:

- `block_cadence_ms`
- `max_clock_drift_ms`

Inspecione-os com:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi params
```

`block_cadence_ms` é comprometido pelo gênese da blockchain assinado e congelado na inicialização; não é um botão de ajuste ativo. Compare redes com diferentes entradas de gênese da blockchain assinadas apenas como cenários de benchmark separados. Uma vez que mudanças de visualização, buscas de payload ausentes ou retropressão aparecem, uma cadência mais curta geralmente torna a sobrecarga mais visível em vez de aumentar o throughput sustentável.

### Candidatos e Limites de Ingresso {#candidate-and-ingress-bounds}

Os limites locais do nó Sumeragi determinam quanto trabalho de candidato e de recuperação um validador pode reter:

- `sumeragi.block.max_transactions`
- `sumeragi.block.max_payload_bytes`
- `sumeragi.block.proposal_queue_scan_multiplier`
- `sumeragi.queues.commands`
- `sumeragi.queues.bodies` e `sumeragi.queues.body_bytes`
- `sumeragi.queues.body_source_bytes`, `sumeragi.queues.chunks` e `sumeragi.queues.ready_bodies`

Limites muito pequenos criam pressão na fila ou na recuperação de carga útil; limites grandes demais aumentam a memória retida e a quantidade de trabalho disponível para uma rede abusiva par. Compare a visualização dos dados de diagnóstico em um dado momento com a memória do processo, o manuseio de mensagens e as métricas de corpo ausente antes de alterar um limite de cada vez:

```bash
iroha --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format json ops sumeragi diagnostics
```

### Condições da Rede {#network-conditions}

O desempenho do consenso é sensível a:

- RTT entre validadores
- oscilação e perda de pacotes
- largura de banda para cargas de blocos e RS16 fragmentos assinados
- ligação assimétrica entre regiões
- NAT, comportamento de firewall ou de retransmissão que atrasa a conectividade com pares de rede

Como regra de planejamento, defina o orçamento de latência alto o suficiente para cobrir várias viagens de ida e volta do validador, além do tempo de execução e de gravação no disco. Se a rede p95 RTT já estiver próxima da latência de commit p95 desejada, o alvo não é realista.

### Filas e Limites de Admissão {#queues-and-admission-limits}

As configurações de admissão e fila definem quanto pressão de surto um par de rede pode absorver:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.max_retained_bytes`
- `queue.transaction_time_to_live_ms`
- limites de transação gênesis da blockchain, como máximo de assinaturas, instruções, bytes e bytes descomprimidos
- limites de fila p2p e limites de ingresso de consenso

Alta capacidade da fila pode ocultar sobrecarga por um tempo, mas não aumenta a taxa de processamento sustentável. Uma fila estável é saudável; uma fila crescente é um acúmulo de tarefas.

### Hardware e Armazenamento {#hardware-and-storage}

Meça cada validador, não apenas o líder:

- CPU saturação durante validação, verificação de assinatura e execução
- pressão de memória de filas, visualizações de dados em ponto no tempo e buffers de recuperação de carga
- latência de gravação em disco para armazenamento em blocos e visualizações de dados em ponto no tempo
- saturação de transmissão/recepção de rede
- configurações opcionais de aceleração de hardware quando usadas pela carga de trabalho

O validador de votação mais lento pode determinar a latência final da rede.

## Sinais de Prometeu {#prometheus-signals}

Os nomes das métricas vêm do catálogo de telemetria registrado. A disponibilidade das séries e a amostragem ainda dependem dos recursos de compilação e de `telemetry_profile`, portanto, inspecione `/metrics` no nó de destino antes de criar um painel.

Sinais comuns incluem:

|Sinal|Exemplos do Prometheus|O que assistir|
| --- | --- | --- |
|Taxa de transferência aceita| `sum(rate(txs{type="accepted"}[5m]))` |Deve atender ou exceder a meta TPS em estado estacionário|
|Rejeições| `sum(rate(txs{type="rejected"}[5m]))` |Deve ser explicável pelo plano de teste|
|Latência de commit| `histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |Compare p95/p99 com o orçamento de latência|
|Profundidade da fila| `queue_size`, `sumeragi_tx_queue_depth` |Deve permanecer limitado durante a carga máxima|
|Saturação da fila| `sumeragi_tx_queue_saturated` |Valores sustentados diferentes de zero significam sobrecarga|
|Ver alterações| `view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |Valores crescentes indicam problemas de temporização, topologia, carga útil ou rede|
|Mensagens perdidas| `dropped_messages`, `sumeragi_consensus_message_handling_total` |Quedas durante a carga geralmente explicam picos de latência|
|Carga útil e recuperação DA| `sumeragi_missing_block_requests`, `sumeragi_missing_block_oldest_ms`, `sumeragi_missing_block_fetch_total`, `sumeragi_da_gate_block_total`, `sumeragi_da_gate_satisfied_total` |Pedidos persistentes, idade crescente ou portões DA repetidos indicam problemas na aquisição de corpo ou bloco|
|Quórum de commit| `sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |As assinaturas contadas devem alcançar rapidamente o quórum necessário|

Quando uma métrica existir apenas em `/v1/sumeragi/status`, capture o instantâneo JSON nos mesmos artefatos de execução que a coleta do Prometheus.

## Fluxo de Trabalho de Estimativa {#estimation-workflow}

1. Defina o cenário:
   - contagem de validadores e contagem de observadores
   - modo de consenso
   - alvo TPS
   - orçamentos de latência de commit p95 e p99
   - mistura de transações
   - rede esperada RTT, jitter e largura de banda
2. Registre a configuração efetiva:

   ```bash
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi status \
     > artifacts/sumeragi-status.json
   iroha --config ./localnet/client.toml \
     --operator-private-key-file "$OPERATOR_KEY_FILE" \
     --output-format json ops sumeragi diagnostics \
     > artifacts/sumeragi-diagnostics.json
   ```

3. Execute a carga de trabalho no alvo TPS.
4. Capture o status e as métricas no início, no meio e no final da execução.
5. Classifique a corrida com a tabela de desempenho.
6. Se a faixa for Média ou Baixa, mude um fator de cada vez e repita.

## Modelo de Relatório de Benchmark {#benchmark-report-template}

Publique os números de desempenho apenas com contexto suficiente para reproduzi-los:

- commit da Iroha, versão e sinalizadores de recursos
- contagens de validadores e observadores
- modo de consenso, cadência de blocos assinados e layout DA
- comitê `3f + 1` exato, quórum e lista de observadores
- `sumeragi.block`, `sumeragi.queues`, `sumeragi.limits`, limites de entrada de rede e de fila de transações
- perfil de telemetria
- hardware, armazenamento e detalhes OS
- rede RTT, jitter, perda e suposições de largura de banda
- mix de transações e tamanhos de carga
- oferecido TPS e duração de execução
- aceito/rejeitado TPS
- latência de commit p50/p95/p99
- profundidade da fila e saturação
- ver alterações, mensagens descartadas, buscas de blocos ausentes e contadores DA-gate
- CPU, utilização de memória, disco e rede por validador

Sem esses detalhes, um número TPS deve ser tratado como anedótico.

## Páginas Relacionadas {#related-pages}

- [Teste de Caos com Izanami](./chaos-testing.md)
- [Torii API pontos de extremidade](../../reference/torii-endpoints.md)
- [Operar Iroha 3 via CLI](../../get-started/operate-iroha-via-cli.md)
- [referência de configuração de pares de rede](../../reference/peer-config/params.md)
