---
translation_locale: pt
translation_source: /guide/advanced/chaos-testing.md
translation_source_hash: 5ceee448217a42e4f8bbae9595486b79019e7a880dfd0f2c71bf580409d0e4b9
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Teste de Caos com Izanami {#chaos-testing-with-izanami}

Izanami é o orquestrador chaosnet no workspace upstream Iroha. Ele inicia um cluster local descartável Iroha, envia uma carga de trabalho configurável e injeta falhas em pares de rede selecionados para que os operadores possam verificar se a rede continua progredindo sob falhas controladas.

Use o Izanami para verificações de resiliência em pré-produção, reprodução de regressões e ajuste de consensos. Não aponte para uma rede de produção: a ferramenta é projetada possuir os pares de rede que ele inicia, incluindo reinicializações de pares de rede, limpeza de armazenamento, partições temporárias de pares confiáveis e pressão local de CPU ou disco.

## Pré-requisitos {#prerequisites}

Execute o Izanami a partir do [Iroha repositório de origem](https://github.com/hyperledger-iroha/iroha), não a partir deste repositório de documentação:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build -p izanami
```

O binário deve ser explicitamente permitido criar e manipular pares de rede em rede. Passe `--allow-net` para cada execução não-TUI, ou habilite `allow_net` no TUI.

```bash
cargo run -p izanami -- --allow-net --peers 4 --faulty 1 --duration 120s
```

Para uma configuração de execução interativa:

```bash
cargo run -p izanami -- --tui --allow-net
```

Izanami persiste as configurações TUI e CLI no diretório de configuração do usuário. O arquivo da primeira versão possui um byte de layout V1 explícito; configurações pré-lançamento ou não versionadas são rejeitadas e devem ser recriadas em vez de migradas. Revise as configurações exibidas antes de reutilizar um perfil atual.

## Execução de Referência {#baseline-run}

Comece com uma linha de base reproduzível antes de adicionar falhas graves:

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

Esta execução só é bem-sucedida se o cluster atingir a meta de blocos solicitada, continuar progredindo dentro do tempo limite e permanecer abaixo do limite opcional do intervalo de blocos p95.

Registre o comando, semente, commit Iroha, contagem de pares da rede, contagem de pares com falha, perfil de carga de trabalho, alvo TPS e limite de latência com os logs. Sem esses valores, outro operador não poderá reproduzir o mesmo padrão de falha.

## Perfis de Carga de Trabalho {#workload-profiles}

Izanami tem dois perfis de carga de trabalho:

|Perfil|Use para|Notas|
| -------- | -------------------------------------------------- | -------------------------------------- |
| `stable` |Longos testes contínuos e verificações de desempenho reproduzíveis|Favorece receitas seguras para execução|
| `chaos`  |Cobertura de caminhos de falha|Inclui receitas intencionalmente inválidas|

Use o perfil estável primeiro:

```bash
cargo run -p izanami -- --allow-net --workload-profile stable --seed 42
```

Mude para o perfil de caos quando a linha de base já for compreendida:

```bash
cargo run -p izanami -- --allow-net --workload-profile chaos --seed 42
```

As receitas de implantação de contratos estão desativadas em execuções estáveis, a menos que explicitamente permitidas:

```bash
cargo run -p izanami -- \
  --allow-net \
  --workload-profile stable \
  --allow-contract-deploy-in-stable
```

Use `--nexus` quando a execução deve usar os padrões incorporados SORA Nexus do espaço de trabalho upstream.

## Controles de Falha {#fault-controls}

Quando `--faulty` for maior que zero, pelo menos um cenário de falha deve ser ativado. Alternâncias de falha padrão estão ativadas, e flags booleanas podem ser desativadas com `=false`.

|Falha| CLI bandeira                                   |O que ele exercita|
| ------------------------ | ------------------------------------------ | ------------------------------------------ |
|Falhar e reiniciar| `--fault-enable-crash-restart`             |perda e recuperação do processo de par de rede|
|Apagar armazenamento e reiniciar| `--fault-enable-wipe-storage`              |Recuperação de estado local ausente|
|Spam de transação inválida| `--fault-enable-spam-invalid-transactions` |Caminhos de admissão e rejeição|
|Latência de rede| `--fault-enable-network-latency`           |Fofoqueiros lentos e mensagens de consenso atrasadas|
|Partição de rede| `--fault-enable-network-partition`         |Isolamento temporário de par confiável|
| CPU estresse               | `--fault-enable-cpu-stress`                |Validação local e pressão de agendamento|
|Saturação do disco| `--fault-enable-disk-saturation`           |Pressão de armazenamento local|

Para uma execução apenas com partição de rede:

```bash
cargo run -p izanami -- \
  --allow-net \
  --peers 4 \
  --faulty 1 \
  --duration 5m \
  --fault-window-start 60s \
  --fault-window-end 180s \
  --tps 15 \
  --submitters 1 \
  --max-inflight 32 \
  --fault-enable-crash-restart=false \
  --fault-enable-wipe-storage=false \
  --fault-enable-spam-invalid-transactions=false \
  --fault-enable-network-latency=false \
  --fault-enable-network-partition=true \
  --fault-enable-cpu-stress=false \
  --fault-enable-disk-saturation=false \
  --seed 42
```

Use `--fault-window-start` e `--fault-window-end` para manter um período de estado estacionário controlado antes e depois da falha injetada. Isso facilita a distinção do ruído de inicialização do efeito da falha.

## Formas de Cenário {#scenario-shapes}

O catálogo upstream Izanami mapeia formas comuns de falha de comunicação em blockchain para perfis CLI. Você pode modelá-los com os mesmos flags:

| Cenário              |Forma típica|
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
|Carga direcionada| `--faulty 0`, alto `--tps`, um remetente, alto `--max-inflight`|
|Falha transitória|Ativar falha/reinício apenas dentro de uma janela de falha limitada|
|Parada e recuperação|Use uma grande população de pares com falha com crash/restart|
|Isolamento do líder|Use exatamente um par de rede com falha apenas com o defeito de partição de rede; Izanami segue a telemetria do líder Sumeragi|

Mantenha uma variável fixa por vez. Se você alterar a contagem de nós da rede, o perfil de carga de trabalho, a janela de falha e TPS na mesma execução, o resultado será difícil de interpretar.

## O que assistir {#what-to-watch}

Durante a execução, observe os mesmos sinais usados para validação de desempenho:

- progresso da altura do bloco em todos os pares de rede em execução
- transações submetidas, aceitas, rejeitadas e expiradas
- profundidade da fila, saturação da fila e retropressão do endpoint API
- visualizar alterações, caminhos de recuperação, blocos ausentes e certificados de quórum ausentes
- assinou RS16 atraso de disponibilidade, sessões pendentes e tráfego de consenso atrasado
- CPU, saturação de memória, disco e rede no host que executa os pares de rede

Para análise de latência de validação, habilite os logs de depuração do loop principal:

```bash
RUST_LOG=iroha_core::sumeragi::main_loop=debug \
  cargo run -p izanami -- --allow-net --seed 42
```

Cada bloco deve emitir `block validation timings` com `stateless_ms`, `execution_ms` e `total_ms`. Compare esses tempos com os intervalos de bloco p95, contadores de mudança de visualização e pressão da fila antes de alterar os temporizadores de consenso.

## Interpretando Resultados {#interpreting-results}

Considere uma execução como saudável quando todos os pares de rede selecionados continuam a confirmar blocos, o acúmulo não cresce indefinidamente e falhas deixam de causar novas atividades de recuperação após o término da janela configurada.

Considere uma corrida como um fracasso quando:

- o progresso do bloco estagna por mais de `--progress-timeout`
- as alturas dos pares de rede divergem e não se reconvergem
- latência p95 excede `--latency-p95-threshold`
- as filas crescem pelo resto da execução após a janela de falha ser fechada
- transações rejeitadas ou expiradas não são explicadas pela carga de trabalho selecionada
- reinício do par de rede, limpeza de armazenamento ou recuperação de partição requer limpeza manual

Após uma falha, execute novamente com a mesma semente e um tipo de falha a menos. Isso mantém a carga de trabalho e o tempo reproduzíveis enquanto reduz a superfície de falha.

## Páginas Relacionadas {#related-pages}

- [Desempenho e Métricas](./metrics.md)
- [Executando Iroha em Hardware Nativo](./running-iroha-on-bare-metal.md)
- [Torii API pontos de extremidade](../../reference/torii-endpoints.md)
