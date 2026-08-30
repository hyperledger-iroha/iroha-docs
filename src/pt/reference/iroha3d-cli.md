---
translation_locale: pt
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` é o padrão Iroha 3 peer daemon. O pacote Cargo tem o nome de `irohad`, por isso invoque o binário a partir de uma caixa fonte:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Para a rede de teste pública Taira, a imagem de liberação utiliza `iroha3d_taira`. Aceita o mesmo CLI. Além disso, impõe a cadeia canónica Taira, o conjunto de validadores, as configurações de armazenamento e as chaves de assinatura do tempo de execução. Validar uma configuração Taira sem abrir credenciais de tempo de execução, como a seguinte:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

O operador deve apresentar o perfil canônico Taira antes da utilização. O modelo inscrito tem configurações de exemplo. O operador deve substituir todas as configurações de exemplo. Não utilize configurações genéricas Nexus ou de produção SoraFS no ensaio contra o Taira.

## `--config` {#arg-config}

- Tipo: caminho de arquivo
- Alias: `-c`

Caminho para a configuração [ peer ](/pt/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tipo: caminho de arquivo

Manifesto de gênese opcional JSON utilizado para validação por consenso.

## `--check-config` {#arg-check-config}

Validar a configuração resolvida e o material de gênese disponível, em seguida, sair sem amarras de rede vinculativas.

## Selo de qualificação Kagemusha {#kagemusha-qualification-seals}

Estas opções de file-path exigem `--check-config` e executam a qualificação completa Kagemusha antes de escrever um selo canônico:

- O `--write-kagemusha-catalog-qualification-seal <PATH>` qualifica o catálogo.
- O `--write-kagemusha-validator-qualification-seal <PATH>` qualifica o validador local para a reserva de promoção assinada configurada.

As duas opções de vedação entram em conflito entre si.

## `--trace-config` {#arg-trace-config}

- Tipo: bandeira
- Meio ambiente: `TRACE_CONFIG`

Ativar os registos de rastreamento enquanto as camadas de configuração são lidas e analisadas.

## `--config-blake3` {#arg-config-blake3}

- Tipo: Digestão hexadecimal de 64 dígitos BLAKE3
- Requisitos: `--config`

Exigir que os bytes do arquivo de configuração correspondam ao digest fornecido. Um arquivo ligado à integridade deve ser achatado; não pode conter `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- Tipo: Booleano, emitido como `--terminal-colors=true` ou `--terminal-colors=false`
- Default: detecção da capacidade do terminal
- Meio ambiente: `TERMINAL_COLORS`

Controle da saída de cor ANSI.

## `--language` {#arg-language}

- Tipo: cadeia

Anula a linguagem do sistema usada para mensagens de demônios.

## `--sora` {#arg-sora}

- Tipo: bandeira
- Meio ambiente: `IROHA_SORA_PROFILE`

Ativar o perfil Sora Nexus. Este perfil configura o SoraFS, o aperto de mão do SoraNet e o consenso em várias pistas. Sempre invoque o lançador Taira com esta bandeira.

## FastPQ sobreposição {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` e `--fastpq-poseidon-mode <MODE>` aceitar apenas `cpu` ou `gpu`. As opções restantes substituem os rótulos de telemetria:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

Por exemplo:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## Ajuda gerada {#generated-help}

A saída completa abaixo é gerada a partir do código-fonte Iroha fixado.

<<< @/snippets/iroha3d-help.md
