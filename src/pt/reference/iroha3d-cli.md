---
translation_locale: pt
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` é o daemon padrão de par de rede Iroha 3. O pacote Cargo é chamado `irohad`, então execute o binário a partir de uma cópia de trabalho do código-fonte com:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

Para a testnet pública Taira, a imagem de lançamento usa `iroha3d_taira`. Ela aceita a mesma CLI, mas também aplica o perfil canônico da Taira para cadeia, validador, armazenamento e assinante do ambiente de execução. Valide uma configuração da Taira sem abrir as credenciais desse ambiente da seguinte forma:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

Use a forma do perfil canônico Taira fornecida pelo operador; o modelo registrado ainda contém espaços reservados para implantação. Não substitua as configurações genéricas Nexus ou de produção SoraFS ao testar contra Taira.

## `--config` {#arg-config}

- Tipo: caminho do arquivo
- Apelido: `-c`

Caminho para o [configuração de par de rede](/pt/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tipo: caminho do arquivo

Manifesto técnico opcional de gênese de blockchain JSON usado para validação de consenso.

## `--check-config` {#arg-check-config}

Valide a configuração resolvida e o material gênese disponível da blockchain, então saia sem vincular os sockets de rede.

## Selos de qualificação Kagemusha {#kagemusha-qualification-seals}

Essas opções de caminho de arquivo requerem `--check-config` e realizam a qualificação completa do Kagemusha antes de escrever um selo canônico:

- `--write-kagemusha-catalog-qualification-seal <PATH>` qualifica o catálogo.
- `--write-kagemusha-validator-qualification-seal <PATH>` qualifica o validador local em relação à reserva de promoção assinada configurada.

As duas opções de selo entram em conflito uma com a outra.

## `--trace-config` {#arg-trace-config}

- Tipo: bandeira
- Ambiente: `TRACE_CONFIG`

Ative os registros de rastreamento enquanto as camadas de configuração são lidas e analisadas.

## `--config-blake3` {#arg-config-blake3}

- Tipo: valor de resumo criptográfico hexadecimal de 64 dígitos BLAKE3
- Requer: `--config`

Exigir que os bytes do arquivo de configuração correspondam ao valor de resumo criptográfico fornecido. Um arquivo vinculado à integridade deve ser achatado; ele não pode conter `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- Tipo: Booleano, passado como `--terminal-colors=true` ou `--terminal-colors=false`
- Padrão: detecção de capacidade do terminal
- Ambiente: `TERMINAL_COLORS`

Controlar a saída de cor ANSI.

## `--language` {#arg-language}

- Tipo: string

Substitua o idioma do sistema usado para mensagens do daemon.

## `--sora` {#arg-sora}

- Tipo: bandeira
- Ambiente: `IROHA_SORA_PROFILE`

Ative o perfil Sora Nexus usado por SoraFS, o handshake SoraNet e o consenso multi-faixa. O lançador Taira é sempre iniciado com esta flag.

## FastPQ substituições {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` e `--fastpq-poseidon-mode <MODE>` aceitam apenas `cpu` ou `gpu`. As opções restantes substituem os rótulos de telemetria:

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

O resumo da opção acima é verificado em relação às definições de argumento atuais `iroha3d`. A visualização de dados gerada do ponto no tempo, que foi registrada, não é renderizada intencionalmente enquanto seu status de origem estiver pendente. Para inspecionar a ajuda exata do seu checkout, execute:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
