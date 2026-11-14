---
translation_locale: es
translation_source: /reference/genesis.md
translation_source_hash: 340921f59a6f8788f559190d520f046ea2473d65154f57a1c54212840c027bc0
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Referencia del génesis de blockchain {#genesis-reference}

En el flujo de trabajo actual Iroha 3, un manifiesto técnico `genesis.json` describe las primeras transacciones y parámetros que se aplicarán cuando la red comience.

El artefacto firmado distribuido a los pares de la red es un archivo `.nrt` codificado en Norito producido por `kagami genesis sign`.

## Campos principales {#main-fields}

Un manifiesto técnico de génesis de blockchain puede definir:

- `chain` para el identificador de la cadena
- `chain_discriminant` para el prefijo de red I105 utilizado al codificar las representaciones literales de las cuentas en el manifiesto
- `executor` para una ruta de bytecode de actualización de ejecutor opcional
- `ivm_dir` para IVM bibliotecas utilizadas por disparadores y actualizaciones
- `consensus_mode` para el modo inicial anunciado por el manifiesto técnico
- `transactions` para actualizaciones de parámetros ordenadas, instrucciones, disparadores y topología
- `sumeragi_context` para los parámetros firmados de contexto de altura de Sumeragi
- `crypto_admission_policy` para los algoritmos exactos de firma y de controlador que admite la cadena, enumerados en `allowed_algorithms`

Dentro de `transactions`, las entradas de topología emparejan los identificadores de pares de red y PoPs juntos:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Generar un manifiesto técnico {#generate-a-manifest}

Utilice Kagami para generar una plantilla. Repita `--allowed-signing` para cada algoritmo admitido, en orden canónico ascendente; Kagami no añade los algoritmos omitidos:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> \
  --allowed-signing ed25519 > genesis.json
```

Para el espacio de datos público de SORA Nexus, el modo de consenso esperado es `npos`. Otros despliegues de Iroha 3 pueden utilizar consenso con permisos o NPoS, según el perfil de destino.

## Firmar el manifiesto técnico {#sign-the-manifest}

Después de editar y validar el JSON, fírmalo en un bloque `.nrt` desplegable:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lee la clave pública génesis de la blockchain desde el manifiesto técnico y utiliza la clave privada de un archivo regular de enlace único en posesión del propietario para producir el bloque firmado desplegable. El archivo debe contener un multihash de clave privada canónica seguido de un salto de línea; Kagami rechaza enlaces simbólicos y modos distintos a `0600`. No se aceptan claves privadas en crudo en la línea de comandos. El resultado es el archivo al que los pares de la red deben hacer referencia desde su configuración.

## Configurar `iroha3d` {#configure-iroha3d}

Configure el demonio para que utilice el bloque de génesis firmado y el archivo que fija su hash esperado. `kagami genesis sign --expected-hash-out` genera ese archivo, y el nodo lo requiere tanto en el primer arranque como en los reinicios:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
expected_hash_file = "genesis.expected_hash"
```

## Herramientas relacionadas {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet generate`
- `cargo xtask kagami-profiles`

Para la implementación del generador y los detalles del comando, consulte el [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_kagami/README.md).
