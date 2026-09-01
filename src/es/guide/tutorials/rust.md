---
translation_locale: es
translation_source: /guide/tutorials/rust.md
translation_source_hash: 98b0c3a193c6dfe8b266bcc498d7016426cf2f838a7bf7ebfbef145ffdcc7944
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Rust {#rust}

La implementación de Rust se encuentra en el espacio de trabajo principal y sigue siendo la forma más directa de trabajar con la base de código de Iroha 3.

## Lo que obtienes {#what-you-get}

El repositorio ascendente actualmente expone:

- el paquete de software cliente `iroha` Rust
- el `iroha` CLI como el cliente de referencia más completo
- modelo de datos compartido, criptografía y paquetes de software Norito utilizados por la capa SDK

## Punto de partida recomendado {#recommended-starting-point}

Para el estado actual del proyecto, comienza con la referencia CLI y el propio espacio de trabajo:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Ejecute el cliente de referencia con la configuración de cliente predeterminada registrada:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

## Probar Taira Solo lectura {#try-taira-read-only}

Desde la misma verificación de espacio de trabajo, prueba el asistente de diagnósticos público Taira:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Para las verificaciones a nivel de ruta, use directamente Torii JSON API:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

Después de crear `taira.client.toml`, el mismo binario puede ejecutar comandos de canario firmados contra Taira. Mantén esos separados de las pruebas unitarias ordinarias porque requieren una cuenta financiada en la red de prueba y la disponibilidad de la red de prueba en vivo.

## Usando el paquete de software cliente Rust {#using-the-rust-client-crate}

Fija la revisión Git Iroha utilizada por tu red:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Si necesita los ejemplos más completos de cómo se utilizan en la práctica las superficies Rust, consulte:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Para los flujos de trabajo de depósito en garantía gestionados por libro mayor, consulte [Custodia de Activos Nativos](/es/blockchain/escrow.md#rust-sdk). El modelo de datos Rust actualmente tiene la cobertura tipada más completa para depósitos en garantía de mercado, bloqueos de activos genéricos, depósitos en garantía anónimos, consultas y eventos.

Puede regenerar una captura local de la ayuda de la CLI con:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Notas {#notes}

- El CLI actualmente proporciona mejor cobertura que los documentos del paquete de software independiente.
- Para los flujos de estilo operador, la documentación CLI es la fuente más actual.
