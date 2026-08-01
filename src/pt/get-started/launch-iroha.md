---
translation_locale: pt
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Lançamento Iroha 3 {#launch-iroha-3}

Esta página percorre o fluxo de rede local atual para Iroha 3 usando os ativos padrão do espaço de trabalho do repositório upstream.

## 1. Gerar uma rede local multi-peer {#_1-generate-a-local-multi-peer-network}

Gerar uma rede local de quatro pares a partir do código Kagami atual:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

O diretório de saída contém configurações de pares correspondentes, `genesis.json`, `genesis.signed.nrt`, `client.toml` e scripts auxiliares.

Para um teste de fumo local nativo, iniciar diretamente os pares gerados:

```bash
./localnet/start.sh
```

Para uma execução contêinerizada, gerar Compose a partir do mesmo diretório localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

A pilha gerada por padrão expõe:

- Os portos P2P a `1337` para `1340`
- Os portos Torii HTTP `8080` a `8083`
- Uma configuração de cliente pronta em `./localnet/client.toml`

## 2. Verifique se a rede está ativada {#_2-verify-that-the-network-is-up}

Verifique o ponto final do status no primeiro peer:

```bash
curl http://127.0.0.1:8080/status
```

Os controlos de saúde padrão também utilizam:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Você pode apontar imediatamente o CLI para a configuração do cliente em conjunto:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Profisso Nexus {#_3-nexus-profile}

O repositório também envia um perfil de configuração orientado para SORA Nexus em `defaults/nexus/`.

Para executar um peer native com o perfil Nexus:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

Utilize `defaults/nexus/client.toml` para o acesso a esse perfil CLI.

## 4. Parar a rede local {#_4-stop-the-local-network}

Para uma rede local nativa gerada:

```bash
./localnet/stop.sh
```

Para a pilha de Compose gerada:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

Após a operação da rede, continue com [Operar Iroha 3 através de CLI](/pt/get-started/operate-iroha-via-cli.md).
