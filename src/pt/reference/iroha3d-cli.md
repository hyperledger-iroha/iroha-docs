---
translation_locale: pt
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

Use a versão do perfil canônico do Taira preenchida pelo operador; o modelo incluído no repositório ainda contém campos reservados para a implantação. Não a substitua pelas configurações genéricas do SORA Nexus ou de produção do SoraFS ao testar no Taira.

## `--config` {#arg-config}

- Tipo: caminho do arquivo
- Apelido: `-c`

Caminho para o [configuração de par de rede](/pt/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- Tipo: caminho do arquivo

Manifesto técnico opcional de gênese de blockchain JSON usado para validação de consenso.

## `--check-config` {#arg-check-config}

Valide a configuração resolvida e o material gênese disponível da blockchain, então saia sem vincular os sockets de rede.

## `--json` {#arg-json}

- **Tipo:** flag
- **Exige:** `--check-config`

Imprime os valores de compatibilidade desta compilação e da configuração como um único objeto JSON Norito, em vez da linha `Ready` ou `Pending`.

## `--check-storage` {#arg-check-storage}

- **Tipo:** flag
- **Conflita com:** `--check-config`

Inspeciona o armazenamento Kura e o snapshot mais recente do nó parado, em modo somente leitura, com os decodificadores desta compilação; imprime o resultado como um único objeto JSON Norito e encerra com código diferente de zero em caso de falha. A verificação adquire o bloqueio da raiz do armazenamento Kura e, portanto, recusa um armazenamento em uso por um nó em execução. Nunca altera o armazenamento nem abre segredos exclusivos do ambiente de execução.

## `--check-replay` {#arg-check-replay}

- **Tipo:** flag
- **Conflita com:** `--check-config`, `--check-storage`

Reexecuta uma cópia do armazenamento do nó parado com esta compilação e imprime o resultado como um único objeto JSON Norito. O comando copia os blocos para um diretório temporário, restaura ali o snapshot mais recente ou reexecuta a gênese assinada, e reexecuta todos os blocos posteriores. Encerra com código diferente de zero quando um bloco não reproduz seu resultado certificado ou quando falta o corpo de um bloco necessário; nunca grava no armazenamento original nem abre segredos exclusivos do ambiente de execução.

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **Tipo:** ID de conta
- **Exige:** `--check-config`

Durante a validação offline, exige que esta conta registrada mantenha a autoridade de implantação do SoraCloud após a execução da gênese assinada exata.

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **Tipo:** flag

Afirma, apenas nesta inicialização, que as chaves de consenso do nó nunca assinaram nesta cadeia. Sumeragi mantém um registro de segurança por chave e, sem esse registro, não assina nada até obter prova de que ele não foi perdido. Passe esta flag uma única vez, na primeira inicialização de uma chave nova, e nunca após perda de dados.

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

Habilita o perfil SORA Nexus usado pelo SoraFS, pelo handshake do SoraNet e pelo consenso com múltiplas faixas de execução. O inicializador do Taira é sempre invocado com esta flag.

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

O resumo das opções acima segue as definições dos argumentos de `iroha3d` no commit fixado do Iroha. Para inspecionar a ajuda exata do seu checkout, execute:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
