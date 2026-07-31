---
translation_locale: pt
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: dfd2d4196827da3563e377baae2fb823871d7a2c293dfafb6dc4de37f9ddbc61
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Teste de Caos com Izanami {#chaos-testing-with-izanami}

Izanami é o orquestador de chaosnet no espaço de trabalho Iroha upstream. Ele inicia um cluster local descartável Iroha, envia uma carga de trabalho configurável e injeta falhas em pares selecionados para que os operadores possam verificar se a rede continua fazendo progresso sob falha controlada.

Use Izanami para verificações de resiliência pré-produção, reprodução de regressão e sintonização de consenso. Não aponte para uma rede de produção: a ferramenta é projetada para possuir os pares que inicia, incluindo reinicializações de pares, toalhas de armazenamento, perda artificial de pacotes e pressão local CPU ou disco.

## Pré-requisitos {#prerequisites}

Execute Izanami a partir do repositório fonte [Iroha ](https://github.com/hyperledger-iroha/iroha), não deste repositório de documentação:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

O binário deve ser explicitamente autorizado a criar e manipular pares em rede. Passe `--allow-net` para cada execução não-TUI, ou ativar `allow_net` no TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Para uma configuração de execução interativa:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami persiste as configurações TUI e CLI no diretório de configuração do usuário, por isso verifique as configurações exibidas antes de reutilizar um perfil anterior.

## Execução de linha de base {#baseline-run}

Comece com uma linha de base reprodutível antes da adição de falhas graves:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --target-blocks 100 \
  --progress-interval 15s \
  --progress-timeout 120s \
  --latency-p95-threshold 2s \
  --tps 15 \
  --max-inflight 32 \
  --submitters 1 \
  --seed 42
```

Esta execução só é bem-sucedida se o cluster atingir a meta de bloco solicitada, continuar a progredir dentro do tempo limite e permanecer abaixo do limiar de intervalo opcional de blocos p95.

Registre o comando, seed, Iroha commit, peer count, faulty-peer count, workload profile, target TPS e limiar de latência com os logs. Sem esses valores, outro operador não pode reproduzir o mesmo padrão de falha.

## Perfis de carga de trabalho {#workload-profiles}

Izanami tem dois perfis de carga de trabalho:

|Perfil .|Usá-lo para |Notas|
| -------- | -------------------------------------------------- | -------------------------------------- |
|`stable` |Longas corridas de remoção e verificações de desempenho reprodutíveis |Favorece receitas seguras de execução |
|`chaos` |Cobertura do caminho de falhas |Inclui receitas intencionalmente inválidas |

Primeiro, use o perfil estável:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Passe para o perfil do caos quando a linha de base já é compreendida:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

As receitas de implantação de contratos são desativadas em corridas estáveis, a menos que sejam expressamente permitidos:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Utilize `--nexus` quando a execução deve utilizar as configurações padrão embutidas SORA Nexus do espaço de trabalho upstream.

## Controles de falhas {#fault-controls}

Quando `--faulty` Se for superior a zero, deve ser habilitado pelo menos um cenário de falha. Falsa toggles padrão para habilitado, e bandeiras booleanas podem ser desativadas com: `=false`.

|Culpa .|CLI bandeira |O que exerce .|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Crash e reinicialização .|`--fault-enable-crash-restart` |Perda e recuperação do processo de peer |
|Esvaziar armazenamento e reiniciar |`--fault-enable-wipe-storage` |Recuperação do estado local desaparecido |
|Spam de transações inválidas |`--fault-enable-spam-invalid-transactions` |Percurso de admissão e rejeição |
|Latência da rede |`--fault-enable-network-latency` |O boato lento e as mensagens de consenso atrasadas .|
|Partilha de rede |`--fault-enable-network-partition` |Isolamento temporário entre pares de confiança .|
|P2P perda de pacotes |`--fault-enable-network-packet-loss` |Tráfego do quadro de aplicativos foi reduzido |
|CPU tensão |`--fault-enable-cpu-stress` |Pressão de validação local e agendamento |
|Saturação de disco |`--fault-enable-disk-saturation` |Pressão local de armazenamento |

Para uma corrida com apenas perda de pacotes:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 20 \
  --faulty 5 \
  --duration 800s \
  --fault-window-start 133s \
  --fault-window-end 266s \
  --tps 200 \
  --submitters 20 \
  --max-inflight 512 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=false \
  --fault-enable-network-packet-loss=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --fault-network-packet-loss-percent 75 \
  --seed 42
```

Usar `--fault-window-start` e `--fault-window-end` para manter um período de estado estável controlado antes e depois da falha injetada. Isso facilita a distinção entre o ruído de inicialização e o efeito da falha.

## Formas de cenário {#scenario-shapes}

O catálogo Izanami upstream mapeia as formas comuns de falhas de comunicação blockchain para perfis CLI. Podem ser modeladas com as mesmas bandeiras:

|O cenário |Forma típica .|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|Carga direcionada |`--faulty 0`, elevado `--tps`, um apresentador, alto `--max-inflight` |
|Falha transitória .|Habilitar o crash/reinicialização apenas dentro de uma janela de falha limitada |
|Perda de pacotes |Permitir somente a perda de pacotes, geralmente com a taxa padrão de perda de 75% |
|Paragem e recuperação .|Use uma grande população de pares defeituosos com crash/reinicialização |
|Isolamento do líder |Utilize exatamente um peer defeituoso com apenas falhas de partição de rede ou perda de pacotes; Izanami segue a telemetria líder Sumeragi |

Mantenha uma variável fixa de cada vez. Se você alterar a contagem de pares, o perfil da carga de trabalho, a janela de falhas e TPS na mesma execução, o resultado é difícil de interpretar.

## O que observar {#what-to-watch}

Durante a corrida, observe os mesmos sinais utilizados para a validação do desempenho:

- Progresso de altura de bloco em cada peer correndo
- Transações submetidas, aceitas, rejeitadas e terminadas
- profundidade da fila, saturação da fila e contrapressão do ponto final
- alterações de visualização, caminhos de recuperação, blocos faltantes e certificados de quórum faltantes.
- RBC atrasos, sessões pendentes e tráfego de consenso diminuído ou retardado.
- CPU, memória, disco e saturação da rede no host executando os pares

Para a análise da latência de validação, habilite os registos de depuração do circuito principal:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Cada bloco deve emitir `block validation timings` com `stateless_ms`, `execution_ms` e `total_ms`. Comparar esses tempos com intervalos de blocos p95, contadores de mudança de visão e pressão na fila antes de mudar os temporizadores de consenso.

## Interpretação dos resultados {#interpreting-results}

Trate uma corrida como saudável quando todos os pares selecionados continuem a cometer blocos, o backlog não cresce sem limites e as falhas param de causar nova atividade de recuperação após a janela configurada terminar.

Tratar uma corrida como um fracasso quando:

- Blocos de progressos mais longos que `--progress-timeout`
- As alturas de pares divergem e não se reconvergem.
- a latência de p95 excede `--latency-p95-threshold`
- As filas crescem para o resto da corrida após a fechadura de uma janela de falha
- Transações rejeitadas ou com prazo não são explicadas pela carga de trabalho selecionada.
- Reinicialização por pares, limpeza do armazenamento ou recuperação de perda de pacotes requer limpeza manual

Após um fracasso, repete com a mesma semente e um tipo de falha menos. Isto mantém a carga de trabalho e o cronograma reprodutíveis, ao mesmo tempo que restringe a superfície da falha.

## Páginas relacionadas {#related-pages}

- [Desempenho e métricas](./metrics.md)
- [Correndo Iroha em Bare Metal](./running-iroha-on-bare-metal.md)
- [Pontos finais Torii](../../reference/torii-endpoints.md)
