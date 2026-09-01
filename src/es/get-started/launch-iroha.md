---
translation_locale: es
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Lanzar Iroha 3 {#launch-iroha-3}

Esta página explica el flujo actual de la red local para Iroha 3 utilizando los recursos del espacio de trabajo predeterminados del repositorio ascendente.

## 1. Generar una red local de múltiples pares {#_1-generate-a-local-multi-peer-network}

Genera una red local de cuatro pares a partir del código actual Kagami:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

El directorio de salida contiene configuraciones de pares de red coincidentes, `genesis.json`, `genesis.signed.nrt`, `client.toml`, y scripts de ayuda.

Para una prueba rápida local nativa, inicie directamente los pares de red generados:

```bash
./localnet/start.sh
```

Para una ejecución en contenedores, genere Compose desde el mismo directorio localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

La pila generada por defecto expone:

- puertos P2P de los pares de red `1337` a `1340`
- Torii HTTP puertos `8080` a `8083`
- una configuración de cliente lista en `./localnet/client.toml`

## 2. Verifique que la red esté activa {#_2-verify-that-the-network-is-up}

Verifica el estado del endpoint API en el primer nodo de la red:

```bash
curl http://127.0.0.1:8080/status
```

Las comprobaciones de salud predeterminadas también utilizan:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Puedes apuntar inmediatamente el CLI a la configuración del cliente incluida:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Perfil {#_3-nexus-profile}

El repositorio también incluye un perfil de configuración orientado a SORA Nexus bajo `defaults/nexus/`.

Para ejecutar un par de red nativo con el perfil Nexus:

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Use `defaults/nexus/client.toml` para acceder a ese perfil mediante la CLI.

## 4. Detener la red local {#_4-stop-the-local-network}

Para una red local generada de forma nativa:

```bash
./localnet/stop.sh
```

Para la pila de Compose generada:

```bash
docker compose -f ./docker-compose.yml down
```

Después de que la red esté en funcionamiento, continúe con [Operar Iroha 3 a través de CLI](/es/get-started/operate-iroha-via-cli.md).
