---
translation_locale: pt
translation_source: /guide/advanced/metrics.md
translation_source_hash: 868481b9f7482e936d6c7013557c7ff5334c7bb93fabf74d6eb726e526fb4e43
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Performance e métricas {#performance-and-metrics}

O desempenho de Iroha depende da carga de trabalho, topologia do validador, condições da rede e configurações de consenso. Um único número TPS é, portanto, útil apenas quando está vinculado a uma execução de referência com uma configuração fixa.

Para o planejamento da capacidade, considerar o desempenho como um envelope operacional:

- A rede aceita a taxa de transação solicitada.
- Comprometo de permanência de latência dentro do orçamento-alvo
- As filas de transações permanecem limitadas.
- Consenso não depende de mudanças repetidas de visão ou caminhos de recuperação

Use esta página para estimar se uma implementação está em um estado de alto, médio ou baixo desempenho para um dado número de nós, limiar de latência da rede e alvo TPS.

## O que medir {#what-to-measure}

Em primeiro lugar, as superfícies do operador expostas por Torii:

```bash
export TORII=http://127.0.0.1:8180

curl -s "$TORII/status" | jq .
curl -s -H 'Accept: application/json' "$TORII/v1/sumeragi/status" | jq .
curl -s "$TORII/v1/sumeragi/phases" | jq .
curl -s "$TORII/v1/sumeragi/rbc" | jq .
curl -s "$TORII/v1/sumeragi/params" | jq .
curl -s "$TORII/metrics" > metrics.prom
```

Você pode tentar o mesmo padrão de somente leitura contra público Taira:

```bash
TAIRA=https://taira.sora.org

curl -fsS "$TAIRA/status" \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS "$TAIRA/v1/time/status" \
  | jq '{healthy: .health.healthy, peers, samples_used, rtt_count: .rtt.count}'

curl -fsS "$TAIRA/metrics" \
  | grep -E '^(block_height|queue_size|sumeragi_tx_queue_depth|txs|view_changes)' \
  | head -n 20
```

As métricas públicas Taira são úteis para aprender os nomes dos sinais. Não os utilize como números de capacidade de produção para a sua própria implantação.

Os mesmos snapshots de consenso estão disponíveis através do CLI:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi status
iroha --config ./localnet/client.toml --output-format text ops sumeragi phases
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
iroha --config ./localnet/client.toml ops sumeragi params
```

A visibilidade da telemetria depende do perfil configurado. Use `extended` quando precisar de `/metrics`, e use `full` durante as corridas de teste quando também precisar das rotas detalhadas do operador Sumeragi.

```toml
telemetry_enabled = true
telemetry_profile = "full"
```

## Banda de desempenho {#performance-bands}

Usar estas bandas para uma corrida observada na capacidade de transmissão alvo `Y` TPS e orçamento de atraso `L` milissegundos. Execute a carga de trabalho durante tempo suficiente para incluir aquecimento, estado estável e pelo menos um período de expectativa de pico de carga.

|Banda .|Condições |Que significa ?|
| --- | --- | --- |
|Muito alto .|O rendimento aceito é igual ou superior a `Y`, a latência de compromisso p95 é inferior a `0.8 * L`, as filas permanecem abaixo de 10% da capacidade e os contadores de mudança de visão/recuperação são planos |A implantação tem espaço para a carga de trabalho solicitada |
|Médio |O desempenho aceito é próximo de `Y`, a latência de compromissos p95 é inferior a `L`, as filas são estáveis abaixo de 50% da capacidade e as alterações na visão são raras |A implantação funciona, mas há uma tolerância limitada à explosão.|
|Baixo .|O desempenho aceito é inferior a `Y`, a latência de compromissos p95 excede `L`, as filas crescem durante a corrida ou os contadores de mudança de visão/retrassação aumentam continuamente |A carga de trabalho solicitada excede, pelo menos, um gargalo de engarrafamento|

A regra-chave é a direcção da fila. Se o TPS submetido for maior do que o TPS comprometido e a fila continuar a crescer, a implantação será sobrecarregada mesmo se as amostras curtas parecerem saudáveis.

## Número de nós e quórum {#node-count-and-quorum}

Mais validadores melhoram a tolerância às falhas, mas aumentam os custos de coordenação, assinatura e criação da rede. Sumeragi Execução:

- O conteúdo do validador `n` deriva o orçamento da falha `f = floor((n - 1) / 3)`
- Para `n >= 4`, o quórum de autorização é `2f + 1`
- Para `n <= 3`, são necessários todos os validadores para o compromisso
- Os pares observadores sincronizam blocos, mas não votam, propõem ou coletam

|Validadores |Orçamento de falha |Cometer quorum |Nota de capacidade |
| --- | --- | --- | --- |
|1 a 3 |0 prático desconexão offline |todos os validadores |Úteis para desenvolvimento e pequenos testes; qualquer validador faltante pode atrasar compromissos |
| 4 | 1 | 3 |Mínimo comum para a tolerância de falha única |
| 7 | 2 | 5 |Mais resiliente, com mais votação e tráfego de propagação |
| 10 | 3 | 7 |Mais alto custo de coordenação; mais importante é a sintonização da rede e do colector |

Ao avaliar "nodos X", separar os validadores de votação dos observadores. Adicionar observadores geralmente custa menos do que adicionar validadores, mas os observadores ainda consomem fofocas de blocos, sincronização de bloco, disco e largura de banda de rede.

## Fatores que influenciam o desempenho {#factors-that-influence-performance}

### Forma da carga de trabalho {#workload-shape}

O mesmo TPS pode ser barato ou caro, dependendo do que cada transacção faz.

- Número de instruções por transacção
- Contagem de assinaturas e algoritmos de assinatura
- Tamanho de byte da transação e tamanho da carga útil descomprimida
- Relação leitura/escritura
- Tamanho dos metadados e operações de activos
- Contracto inteligente, desencadeador e custo de execução IVM
- carga de consulta correndo contra os mesmos pares

As pequenas transacções de transferência não constituem uma alternativa para cargas de trabalho pesadas em contratos ou metadados.

### Tempo de consenso {#consensus-timing}

O tempo Sumeragi é controlado pelos parâmetros efetivos Sumeragi:

- `block_time_ms`
- `commit_time_ms`
- `min_finality_ms`
- `pacing_factor_bps`
- Timeouts de fase NPoS quando o modo NPoS estiver habilitado

Inspectá-los com:

```bash
iroha --config ./localnet/client.toml ops sumeragi params
curl -s "$TORII/v1/sumeragi/params" | jq .
```

As metas de cronometragem mais baixas só podem melhorar a latência enquanto as camadas de rede, armazenamento e execução podem acompanhar. Uma vez que se veem mudanças, cargas perdidas ou contrapressões aparecem, diminuir os tempos geralmente piora o desempenho.

### Colecionador Fanout {#collector-fanout}

As configurações do colector afetam a rapidez com que os votos de compromissos convergem:

- `sumeragi.collectors.k` controla quantos colecionadores juntam votos por altura.
- `sumeragi.collectors.redundant_send_r` controla a votação adicional após um tempo limite local
- `sumeragi.collectors.parallel_topology_fanout` adiciona a topologia fanout ao lado dos colectores

O aumento da disponibilidade pode reduzir a latência de cauda em redes maiores ou menos confiáveis, mas também aumenta o tráfego. Comparar a disponibilidade agregada e telemetria do colector com as métricas de latência e contrapressão antes de alterar estes valores:

```bash
iroha --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

### Condições da rede {#network-conditions}

O desempenho do consenso é sensível a:

- RTT entre os validadores
- nervosismo e perda de pacotes
- Largura de banda para cargas úteis de bloco e peças RBC
- ligações assimétricas entre as regiões
- NAT, firewall, ou comportamento de relaxe que retarda a conectividade entre pares

Como regra de planejamento, definir o orçamento de latência alto o suficiente para cobrir várias viagens de ida e volta do validador mais execução e tempo de compromisso no disco. Se a rede p95 RTT já está perto da latença de compromisso p95 desejada, o objetivo não é realista.

### As filas e os limites de entrada {#queues-and-admission-limits}

As configurações de admissão e fila definem a quantidade de pressão da explosão que um peer pode absorver:

- `queue.capacity`
- `queue.capacity_per_user`
- `queue.transaction_time_to_live_ms`
- limites de transações genesis, tais como assinaturas máximas, instruções, bytes e bytes descomprimidos
- Limites de fila p2p e limites de entrada por consenso

A alta capacidade de fila pode ocultar a sobrecarga por um tempo, mas não aumenta o rendimento sustentável. Uma fila estável é saudável; uma fila crescente é um atraso.

### Hardware e armazenamento {#hardware-and-storage}

Mita todos os validadores, não só o líder:

- CPU saturação durante a validação, a verificação da assinatura e a execução
- Pressão de memória de filas, instantâneas e sessões ativas RBC
- latência de gravação do disco para armazenamento de blocos e instantâneos
- Saturação da rede de transmissão/receita
- Configurações opcionais de aceleração de hardware quando utilizadas pela carga de trabalho

O validador de votação mais lento pode determinar a latência da rede.

## Sinais de Prometheus {#prometheus-signals}

Os nomes métricos podem variar de acordo com o perfil da construção e o conjunto de recursos. Inscreva `/metrics` no seu nó primeiro, em seguida, crie painéis em torno das séries disponíveis.

Os sinais comuns incluem:

|O sinal .|Exemplos de Prometheus |O que ver ?|
| --- | --- | --- |
|Produto aceito |`sum(rate(txs{type="accepted"}[5m]))` |Deverão atingir ou exceder a meta TPS em estado estável |
|Rejeções |`sum(rate(txs{type="rejected"}[5m]))` |Deve ser explicável pelo plano de ensaio |
|Comprometer a latência |`histogram_quantile(0.95, sum(rate(commit_time_ms_bucket[5m])) by (le))` |Comparar p95/p99 com o orçamento de latência |
|A profundidade da fila .|`queue_size`, `sumeragi_tx_queue_depth` |Devem manter-se confinados durante o pico de carga .|
|Saturação da fila |`sumeragi_tx_queue_saturated` |Valores não-zero sustentados média sobrecarga |
|Veja as alterações |`view_changes`, `sumeragi_view_change_suggest_total`, `sumeragi_view_change_install_total` |Os valores crescentes indicam o tempo, a topologia, a carga útil ou problemas de rede |
|Mensagens retiradas |`dropped_messages`, `sumeragi_consensus_message_handling_total` |As quedas durante a carga normalmente explicam os picos de latência .|
|Pressão RBC |`sumeragi_rbc_store_pressure`, `sumeragi_rbc_backpressure_deferrals_total` |Pontos de pressão não-zero para gargalos de recuperação ou armazenamento de cargas úteis |
|Cometer quorum |`sumeragi_commit_signatures_counted`, `sumeragi_commit_signatures_required` |As assinaturas contadas devem chegar rapidamente ao quórum exigido .|

Quando uma métrica existe apenas em `/v1/sumeragi/status`, capture a imagem instantânea JSON na mesma corrida de artefatos que o raspado Prometheus.

## Estimação do fluxo de trabalho {#estimation-workflow}

1. Define o cenário:
   - Número de validadores e número de observadores
   - modo de consenso
   - alvo TPS
   - Prestações orçamentais de compromissos p95 e p99
   - Mix de transacções
   - Rede esperada RTT, jitter e largura de banda
2. Registrar a configuração efetiva:

   ```bash
   iroha --config ./localnet/client.toml --output-format json ops sumeragi params \
     > artifacts/sumeragi-params.json
   curl -s "$TORII/v1/sumeragi/collectors" \
     > artifacts/sumeragi-collectors.json
   ```

3. Executa a carga de trabalho no alvo TPS.
4. Capture status e métricas no começo, meio e final da corrida.
5. Classificar a corrida com a tabela de banda de desempenho.
6. Se a banda for média ou baixa, altere um fator por vez e repita.

## Modelo de relatório de referência {#benchmark-report-template}

Publicar os números de desempenho apenas com contexto suficiente para as reproduzir:

- Iroha bandeiras de compromisso, libertação e características
- Contagem de validador e observador
- Modo de consenso e parâmetros Sumeragi
- colector `k`, redundante enviar `r`, e topologia fanout
- Profil de telemetria
- Detalhes do hardware, armazenamento e OS
- Presunções de rede RTT, jitter, perda e largura de banda
- Mix de transações e tamanhos da carga útil
- Oferecida TPS e duração da corrida
- Aceito/recusado TPS
- P50/p95/p99 Latência de comitamento
- profundidade da fila e saturação
- visualização de alterações, mensagens retiradas, pressão RBC e contadores de carga útil faltante
- CPU, memória, disco e utilização da rede por validador

Sem estes pormenores, um número TPS deve ser tratado como anedótico.

## Páginas relacionadas {#related-pages}

- [Teste de Caos com Izanami](./chaos-testing.md)
- [Pontos finais Torii](../../reference/torii-endpoints.md)
- [Operar Iroha 3 através de CLI](../../get-started/operate-iroha-via-cli.md)
- [Referência de configuração entre pares ](../../reference/peer-config/params.md)
