---
translation_locale: pt
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 886da937d92563cea49355fdccd411fc74d397fea28b521711e9089c8b047280
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Executando Iroha em Hardware Nativo {#running-iroha-on-bare-metal}

Use este fluxo de trabalho para executar pares de rede diretamente nos hosts, em vez de usar o Docker Compose. A árvore de código-fonte atual fornece geradores do Kagami que gravam a gênese correspondente, as configurações dos pares e do cliente e os scripts de inicialização e parada.

## 1. Construa os Binários {#_1-build-the-binaries}

Do espaço de trabalho Iroha a montante:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Isso produz:

- `target/release/iroha3d` para o daemon de pares da rede
- `target/release/iroha` para o CLI
- `target/release/kagami` para chave, gênese da blockchain e geração de rede local

## 2. Gerar uma Rede Local {#_2-generate-a-local-network}

Gerar uma localnet de quatro pares Iroha 3:

```bash
target/release/kagami localnet generate --peers 4 --out-dir ./localnet
```

O diretório de saída contém os arquivos gerados `genesis.json`, `genesis.signed.nrt` e `genesis.expected_hash`, um `peerN.toml` por validador, `client.toml`, os scripts `start.sh` e `stop.sh` e um `README.md` gerado com comandos exatos para esse pacote.

## 3. Iniciar pares de rede {#_3-start-peers}

Para uma localnet descartável gerada, use o script gerado:

```bash
./localnet/start.sh
```

Se você precisar conectar cada par de rede a um gerenciador de processos como systemd, siga o comando por par em `./localnet/start.sh`: execute `iroha3d --config <bundle>/peerN.toml` a partir de `<bundle>/state/peerN` e passe `--sumeragi-assert-fresh-key` somente na primeira inicialização desse par. Mantenha o `peerN.toml`, a chave privada, o diretório de armazenamento e as portas de cada par de rede separados.

## 4. Operar a Rede {#_4-operate-the-network}

Use a configuração de cliente gerada:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list --all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Pare a localnet gerada com:

```bash
./localnet/stop.sh
```

## 5. Notas de Produção {#_5-production-notes}

- Gere chaves particulares novas para produção e armazene-as fora do repositório.
- Faça todos os pares concordarem com a mesma transação de gênese assinada, a topologia, os pares confiáveis e as PoPs dos validadores.
- Vincule os endereços do ouvinte apenas às interfaces locais do host quando o par de rede não deve ser acessível a partir de outras máquinas.
- Use um proxy reverso ou firewall para exposição Torii, autenticação básica, TLS e limitação de taxa.
- Trate mudanças na gênese ou na topologia de consenso como migrações coordenadas, não como edições de arquivos de um único par.

Para desenvolvimento local com contêiner, use o fluxo de trabalho [Iniciar Iroha 3](../../get-started/launch-iroha.md) Docker Compose.
