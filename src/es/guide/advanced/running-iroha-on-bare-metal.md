---
translation_locale: es
translation_source: /guide/advanced/running-iroha-on-bare-metal.md
translation_source_hash: 648e69f2a572a0bb3e88919831774d21c1a17438b8bde742224a1457880539c1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Corriendo Iroha en metal desnudo {#running-iroha-on-bare-metal}

Utilice este flujo de trabajo cuando quiera ejecutar pares directamente en hosts en lugar de a través de Docker Compose. El árbol fuente actual proporciona generadores Kagami que escriben génesis coincidente, configuración de pares, configuración del cliente y guiones de inicio / parada.

## 1. Construir los binarios {#_1-build-the-binaries}

Desde el espacio de trabajo ascendente Iroha:

```bash
cargo build --release \
  -p irohad --bin iroha3d \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

Esto produce:

- `target/release/iroha3d` para el demonio de la pareja
- `target/release/iroha` para el CLI
- `target/release/kagami` para la generación de llaves, genesis y localnet.

## 2. Generar una red local {#_2-generate-a-local-network}

Generar una red local Iroha 3 de cuatro pares:

```bash
target/release/kagami localnet --peers 4 --out-dir ./localnet
```

El directorio de salida contiene los archivos generados `genesis.json`, `genesis.signed.nrt`, peer`config.toml`, `client.toml`, scripts auxiliares y un generado `README.md` con comandos exactos para ese paquete.

## 3. Comience con sus compañeros {#_3-start-peers}

Para una red local desechable generada, utilice el script generado:

```bash
./localnet/start.sh
```

Si necesita cablear cada peer en un gestor de procesos como systemd, utilice el comando de lanzamiento registrado en `./localnet/README.md` para cada peer. Mantenga separados el `config.toml`, la clave privada, el directorio de almacenamiento y los puertos de cada peer .

## 4. Operar la red {#_4-operate-the-network}

Utilice la configuración del cliente generada:

```bash
target/release/iroha --config ./localnet/client.toml ledger domain list all
target/release/iroha --config ./localnet/client.toml --output-format text ops sumeragi status
```

Detenga la red local generada con:

```bash
./localnet/stop.sh
```

## 5. Notas de producción {#_5-production-notes}

- Generar llaves privadas frescas para la producción y almacenarlas fuera del repositorio.
- Haga que todos los pares coincidan en la misma transacción de génesis firmada, topología, compañeros de confianza y validador PoPs.
- Bind el oyente se dirige a interfaces locales del anfitrión sólo cuando no debe ser accesible desde otras máquinas.
- Utilice un proxy inverso o un firewall para la exposición a Torii, auth básico, TLS y limitación de tasa.
- Tratar los cambios en la génesis o topología de consenso como migraciones coordinadas, no ediciones de archivos individuales.

Para el desarrollo local en contenedores, utilice el flujo de trabajo [Launch Iroha 3](../../get-started/launch-iroha.md) Docker Compose.
