---
translation_locale: es
translation_source: /reference/genesis.md
translation_source_hash: ac6bad693ed382dede0818132b8649fe14726283508da897a32eea417e5bbb28
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Referencia del génesis de blockchain {#genesis-reference}

En el flujo de trabajo actual Iroha 3, un manifiesto técnico `genesis.json` describe las primeras transacciones y parámetros que se aplicarán cuando la red comience.

El artefacto firmado distribuido a los pares de la red es un archivo `.nrt` codificado en Norito producido por `kagami genesis sign`.

## Campos principales {#main-fields}

Un manifiesto técnico de génesis de blockchain puede definir:

- `chain` para el identificador de la cadena
- `executor` para una ruta de bytecode de actualización de ejecutor opcional
- `ivm_dir` para IVM bibliotecas utilizadas por disparadores y actualizaciones
- `consensus_mode` para el modo inicial anunciado por el manifiesto técnico
- `transactions` para actualizaciones de parámetros ordenadas, instrucciones, disparadores y topología
- `crypto` para la vista de datos de criptomonedas en un momento inicial

Dentro de `transactions`, las entradas de topología emparejan los identificadores de pares de red y PoPs juntos:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Generar un manifiesto técnico {#generate-a-manifest}

Usa Kagami para generar una plantilla:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Para el espacio de datos público SORA Nexus, `npos` es el modo de consenso esperado. Otros despliegues Iroha 3 pueden usar permissioned o NPoS dependiendo del perfil objetivo.

## Firmar el manifiesto técnico {#sign-the-manifest}

Después de editar y validar el JSON, fírmalo en un bloque `.nrt` desplegable:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lee la clave pública génesis de la blockchain desde el manifiesto técnico y utiliza la clave privada de un archivo regular de enlace único en posesión del propietario para producir el bloque firmado desplegable. El archivo debe contener un multihash de clave privada canónica seguido de un salto de línea; Kagami rechaza enlaces simbólicos y modos distintos a `0600`. No se aceptan claves privadas en crudo en la línea de comandos. El resultado es el archivo al que los pares de la red deben hacer referencia desde su configuración.

## Configurar `iroha3d` {#configure-iroha3d}

Apunta el demonio al bloque génesis de la cadena de bloques firmado:

```toml
[genesis]
file = "genesis.signed.nrt"
public_key = "<PUBLIC_KEY>"
```

## Herramientas relacionadas {#related-tools}

- `kagami genesis validate`
- `kagami genesis normalize`
- `kagami genesis embed-pop`
- `kagami localnet`
- `cargo xtask kagami-profiles`

Para la implementación del generador y los detalles del comando, consulte el [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
