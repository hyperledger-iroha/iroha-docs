---
translation_locale: es
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Lanzamiento Iroha 3 {#launch-iroha-3}

Esta página recorre el flujo actual de red local para Iroha 3 utilizando los activos predeterminados del espacio de trabajo en el repositorio upstream.

## 1. Generar una red local de múltiples pares {#_1-generate-a-local-multi-peer-network}

Generar una red local de cuatro pares a partir del código actual Kagami:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

El directorio de salida contiene las configuraciones de pares correspondientes, `genesis.json`, `genesis.signed.nrt`, `client.toml` y script auxiliar.

Para una prueba de humo local nativa, comience directamente con los pares generados:

```bash
./localnet/start.sh
```

Para una ejecución en contenedores, genere Compose desde el mismo directorio localnet:

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

La pila generada por defecto expone:

- de igual edad P2P Los puertos `1337` para `1340`
- Los puertos Torii y HTTP de `8080` a `8083`
- una configuración de cliente lista en `./localnet/client.toml`

## 2. Compruebe si la red está activada {#_2-verify-that-the-network-is-up}

Compruebe el punto final de estado en el primer par:

```bash
curl http://127.0.0.1:8080/status
```

Las verificaciones de salud por defecto también utilizan:

```bash
curl http://127.0.0.1:8080/status/blocks
```

Puede señalar inmediatamente el CLI a la configuración del cliente en paquete:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Perfil Nexus {#_3-nexus-profile}

El repositorio también enviará un perfil de configuración orientado a SORA Nexus en el `defaults/nexus/`.

Para ejecutar una comparación nativa con el perfil Nexus:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

Utilice `defaults/nexus/client.toml` para acceder a CLI al perfil.

## 4. Detener la red local {#_4-stop-the-local-network}

Para un localnet generado nativo:

```bash
./localnet/stop.sh
```

Para la pila de composición generada:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

Después de que la red esté en funcionamiento, continúe con [Operar Iroha 3 a través de CLI](/es/get-started/operate-iroha-via-cli.md).
