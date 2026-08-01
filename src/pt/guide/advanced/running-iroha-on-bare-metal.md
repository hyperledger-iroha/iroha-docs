---
translation_locale: pt
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 77780600fa59ba353e2aa79fb339adb6a02f7ac731e04cd0d5f51821ec54e794
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Correndo Iroha em Bare Metal {#running-iroha-on-bare-metal}

Use este fluxo de trabalho quando quiser executar pares diretamente em hosts em vez de através de Docker Compose. A árvore fonte atual fornece geradores Kagami que escrevem gênese correspondente, configurações de pares, configuração do cliente e scripts start/stop.

## 1. Construir os binários {#_1-build-the-binaries}

A partir do espaço de trabalho ascendente Iroha:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Isto produz:

- `target/release/irohad` para o demônio de pares
- `target/release/iroha` para o CLI
- `target/release/kagami` para a geração de chaves, gênese e rede local

## 2. Gerar uma rede local {#_2-generate-a-local-network}

Gerar uma rede local de quatro pares Iroha 3:

```bash
target/release/kagami localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

O diretório de saída contém os arquivos gerados `genesis.json`, `genesis.signed.nrt`, peer `config.toml`, `client.toml`, scripts auxiliares e um `README.md` gerado com comandos exatos para esse pacote.

## 3. Comece com os pares {#_3-start-peers}

Para uma rede local descartável gerada, use o script gerado:

```bash
./localnet/start.sh
```

Se você precisar ligar cada peer para um gerenciador de processos, como systemd, use o comando de lançamento registrado em `./localnet/README.md` para cada peer. Mantenha separados os `config.toml`, a chave privada, o diretório de armazenamento e as portas de cada peer

## 4. Operar a rede {#_4-operate-the-network}

Use a configuração do cliente gerada:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Parar a rede local gerada com:

```bash
./localnet/stop.sh
```

## 5. Notas de produção {#_5-production-notes}

- Gerar novas chaves privadas para produção e armazená-las fora do repositório.
- Faça com que todos os pares concordam sobre a mesma transação genética assinada, topologia, colegas de confiança e validador PoPs.
- Os endereços do ouvinte devem ser vinculados a interfaces host-local somente quando o peer não for acessível a partir de outras máquinas.
- Use um proxy inverso ou firewall para a exposição Torii, auth básico, TLS e limitação de taxa.
- Trate as mudanças na topologia da gênese ou do consenso como migrações coordenadas, não como edições de arquivo único.

Para o desenvolvimento local em contêineres, utilize o fluxo de trabalho [Lanzamento Iroha 3](../../get-started/launch-iroha.md) Docker Compose.
