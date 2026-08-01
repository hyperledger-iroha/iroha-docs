---
translation_locale: es
translation_source: /guide/tutorials/rust.md
translation_source_hash: 2044ca68337afb2663b4ab5fda63cb72b5c90ce850d028d09ef8569897e315cd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Rust {#rust}

La implementación Rust se desarrolla en el espacio de trabajo principal y sigue siendo la forma más directa de trabajar con la base de código Iroha 3.

## Lo que se obtiene {#what-you-get}

En la actualidad, el repositorio upstream expone:

- la caja del cliente `iroha` Rust
- el `iroha` CLI como cliente de referencia más completo.
- Modelo de datos compartido, criptografía y cajas Norito utilizadas por la capa SDK

## Punto de partida recomendado {#recommended-starting-point}

Para el estado actual del proyecto, comience por la referencia CLI y el propio espacio de trabajo:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Ejecutar el cliente de referencia con la configuración del cliente predeterminado registrada:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Prueba Taira Sólo para lectura {#try-taira-read-only}

A partir de la misma caja del espacio de trabajo, pruebe el asistente público de diagnóstico Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Para los controles a nivel de ruta, utilice directamente el JSON API de Torii:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Después de crear `taira.client.toml`, el mismo binario puede ejecutar comandos canarios firmados contra Taira. Manténgalos separados de los ensayos unitarios ordinarios porque requieren una cuenta financiada por un grifo y disponibilidad en vivo de la red de prueba.

## Utilización de la caja del cliente Rust {#using-the-rust-client-crate}

Aplique la revisión de Git Iroha que utiliza su red:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Si necesita los ejemplos más completos de cómo se utilizan las superficies Rust en la práctica, inspeccione:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Para los flujos de trabajo de garantía gestionados en un libro mayor, véase [Aseguración de activos nativos](/es/blockchain/escrow.md#rust-sdk). El Consejo Rust el modelo de datos cuenta actualmente con la cobertura tipográfica más completa para las garantías de mercado, bloqueos genéricos de activos, garantías anónimas, consultas, y acontecimientos.

Se puede regenerar una instantánea de ayuda local CLI con:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Notas {#notes}

- El CLI ofrece actualmente una mejor cobertura que los documentos de cajas independientes.
- Para los flujos de tipo operador, la documentación CLI es la fuente más actual.
