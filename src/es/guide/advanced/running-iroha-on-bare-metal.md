---
translation_locale: es
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ejecutando Iroha en hardware físico {#running-iroha-on-bare-metal}

Utilice este flujo de trabajo cuando desee ejecutar pares de red directamente en los hosts en lugar de a través de Docker Compose. El árbol de código fuente actual proporciona generadores Kagami que escriben la génesis de blockchain correspondiente, configuraciones de pares de red, configuración del cliente y scripts de inicio/detención.

## 1. Construir los binarios {#_1-build-the-binaries}

Desde el espacio de trabajo Iroha aguas arriba:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Esto produce:

- `target/release/iroha3d` para el demonio del par de red
- `target/release/iroha` para el CLI
- `target/release/kagami` para clave, génesis de blockchain y generación de red local

## 2. Generar una red local {#_2-generate-a-local-network}

Generar una red local Iroha 3 de cuatro pares:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

El directorio de salida contiene los archivos generados `genesis.json`, `genesis.signed.nrt`, `config.toml` del par de red, `client.toml`, scripts auxiliares y un `README.md` generado con comandos exactos para ese paquete.

## 3. Iniciar pares de red {#_3-start-peers}

Para una red local desechable generada, use el script generado:

```bash
./localnet/start.sh
```

Si necesitas conectar cada par de red a un administrador de procesos como systemd, utiliza el comando de lanzamiento registrado en `./localnet/README.md` para cada par de red. Mantén separados el `config.toml`, la clave privada, el directorio de almacenamiento y los puertos de cada par de red.

## 4. Operar la red {#_4-operate-the-network}

Usa la configuración del cliente generada:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Detén la red local generada con:

```bash
./localnet/stop.sh
```

## 5. Notas de Producción {#_5-production-notes}

- Genera claves privadas nuevas para producción y guárdalas fuera del repositorio.
- Haga que todos los pares de la red estén de acuerdo en la misma transacción génesis de blockchain firmada, topología, pares de red confiables y validador PoPs.
- Vincule las direcciones del oyente a las interfaces locales del host solo cuando el par de red no deba ser accesible desde otras máquinas.
- Utilice un proxy inverso o firewall para la exposición de Torii, autenticación básica, TLS y limitación de velocidad.
- Trata los cambios en el génesis de la blockchain o en la topología de consenso como migraciones coordinadas, no como ediciones de archivos por un solo nodo.

Para el desarrollo local con contenedores, utilice el flujo de trabajo [Lanzar Iroha 3](../../get-started/launch-iroha.md) Docker Compose.
