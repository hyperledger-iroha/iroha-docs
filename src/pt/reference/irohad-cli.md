---
translation_locale: pt
translation_source: /reference/irohad-cli.md
translation_source_hash: 184b15bb99f4be90c1f2ae6980d480bf1170590a2febf80f4b92fe9dfd76f7c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `irohad` CLI {#irohad-cli}

`irohad` começa um Iroha 3 daemon de pares.

```shell
irohad --config path/to/config.toml
```

## `--config` {#arg-config}

- Tipo: Caminho de arquivo
- Alias: `-c`

Caminho para o arquivo de configuração [ ](/pt/reference/peer-config/index.md).

```shell
irohad --config path/to/iroha.toml
```

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tipo: Caminho de arquivo

Caminho opcional para um arquivo do manifesto de gênese JSON. Use isso quando a implantação valida o início em relação a um manifesto gerado por Kagami

```shell
irohad --config path/to/iroha.toml --genesis-manifest-json path/to/genesis.manifest.json
```

## `--trace-config` {#arg-trace-config}

Permite rastrear registros de leitura e análise de configurações. Pode ser útil para solucionar problemas de configuração.

- Tipo: bandeira
- ENV: `TRACE_CONFIG`

```shell
irohad --trace-config
```

## `--terminal-colors` {#arg-terminal-colors}

- Tipo: Boolean, `--terminal-colors=false` ou `--terminal-colors=true`
- Default: suporte de terminal de detecção automática
- ENV: `TERMINAL_COLORS`

Ativar ou não a saída de cor ANSI.

De forma padrão, Iroha determina se o terminal suporta ou não a saída de cores.

Para desativar explícitamente as cores:

```shell
irohad --terminal-colors=false

# or via env

export TERMINAL_COLORS=false
irohad
```

## `--language` {#arg-language}

- Tipo: cordas

Anula a linguagem do sistema usada para mensagens de demônios.

```shell
irohad --language en-US
```

## `--sora` {#arg-sora}

- Tipo: bandeira

Ativar o perfil de características Sora Nexus para SoraFS, o aperto de mão SoraNet e fluxos de consenso em várias linhas.

```shell
irohad --config path/to/iroha.toml --sora
```

## `--fastpq-execution-mode` {#arg-fastpq-execution-mode}

- Tipo: `auto`, `cpu`, ou `gpu`

Fornecer o modo de execução do provedor FASTPQ.

```shell
irohad --fastpq-execution-mode auto
```

## `--fastpq-poseidon-mode` {#arg-fastpq-poseidon-mode}

- Tipo: `auto`, `cpu`, ou `gpu`

Oficinar FASTPQ modo de oleoduto Poseidon.

```shell
irohad --fastpq-poseidon-mode cpu
```

## `--fastpq-device-class` {#arg-fastpq-device-class}

- Tipo: cordas

Anula-se o rótulo da classe FASTPQ de dispositivos de telemetria.

```shell
irohad --fastpq-device-class apple-m4
```

## `--fastpq-chip-family` {#arg-fastpq-chip-family}

- Tipo: cordas

Analisar o rótulo da família de chips telemétricos FASTPQ.

```shell
irohad --fastpq-chip-family m4
```

## `--fastpq-gpu-kind` {#arg-fastpq-gpu-kind}

- Tipo: cordas

O rótulo FASTPQ de telemetria GPU é revogado.

```shell
irohad --fastpq-gpu-kind integrated
```
