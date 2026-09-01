---
translation_locale: pt
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iniciar Iroha 3 {#launch-iroha-3}

Esta página explica o fluxo atual da rede local para Iroha 3 usando os recursos padrão do espaço de trabalho do repositório upstream.

## 1. Gerar uma rede local com vários pares {#_1-generate-a-local-multi-peer-network}

Gere uma rede local de quatro pares a partir do código atual Kagami:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

O diretório de saída contém configurações de pares de rede correspondentes, `genesis.json`, `genesis.signed.nrt`, `client.toml`, e scripts auxiliares.

Para um teste rápido nativo local, inicie diretamente os pares de rede gerados:

```bash
./localnet/start.sh
```

Para uma execução em contêiner, gere o Compose a partir do mesmo diretório localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

A pilha gerada por padrão expõe:

- par de rede P2P portas `1337` para `1340`
- Torii HTTP portas `8080` para `8083`
- uma configuração de cliente pronta em `./localnet/client.toml`

## 2. Verifique se a rede está ativa {#_2-verify-that-the-network-is-up}

Verifique o endpoint de status no primeiro par da rede:

```bash
curl http://127.0.0.1:8080/status
```

As verificações de saúde padrão também usam:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Você pode apontar imediatamente o CLI para a configuração do cliente incluída:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Perfil {#_3-nexus-profile}

O repositório também fornece um perfil de configuração orientado para SORA Nexus sob `defaults/nexus/`.

Para executar um par de rede nativo com o perfil Nexus:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Use `defaults/nexus/client.toml` para acessar esse perfil pela CLI.

## 4. Pare a Rede Local {#_4-stop-the-local-network}

Para uma localnet gerada nativamente:

```bash
./localnet/stop.sh
```

Para a pilha Compose gerada:

```bash
docker compose -f ./docker-compose.yml down
```

Depois que a rede estiver funcionando, continue com [Operar Iroha 3 via CLI](/pt/get-started/operate-iroha-via-cli.md).
