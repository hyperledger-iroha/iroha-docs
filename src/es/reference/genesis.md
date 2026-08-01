---
translation_locale: es
translation_source: /reference/genesis.md
translation_source_hash: 6710e76508e6a38a6b68d274247cc1383de2472e74f10be85000b30f74cb04a6
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Referencia del Génesis {#genesis-reference}

En el flujo de trabajo actual Iroha 3, un manifiesto `genesis.json` describe las primeras transacciones y parámetros que se aplicarán cuando la red se inicie.

El artefacto firmado distribuido entre pares es un archivo `.nrt` codificado en Norito producido por `kagami genesis sign`.

## Principales campos {#main-fields}

Un manifiesto de génesis puede definir:

- `chain` para el identificador de cadena
- `executor` para un ejecutor opcional que actualice el recorrido del código de byte
- `ivm_dir` para las bibliotecas IVM utilizadas por los disparadores y actualizaciones
- `consensus_mode` para el modo inicial anunciado en el manifiesto.
- `transactions` para las actualizaciones de parámetros ordenadas, instrucciones, desencadenantes y topología
- `crypto` para la instantánea inicial de criptografía

Dentro de `transactions`, las entradas topológicas parejas de identificación de pares y PoPs juntas:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Generar un manifiesto {#generate-a-manifest}

Para generar una plantilla, utilice Kagami:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

Para el espacio de datos público SORA Nexus, `npos` es el modo esperado de consenso. Otras implementaciones Iroha 3 pueden utilizar permisos o NPoS dependiendo del perfil objetivo.

## Firmar el Manifiesto {#sign-the-manifest}

Después de editar y validar el JSON, firmarlo en un bloque `.nrt` desplegable:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key <PRIVATE_KEY> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lee la clave pública genesis del manifiesto y utiliza la clave privada proporcionada, la semilla y el algoritmo para producir el bloque firmado desplegable. El resultado es el archivo que los pares deben consultar desde su configuración.

## Configuración `irohad` {#configure-irohad}

Apuntar al demonio en el bloque de Génesis firmado:

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

Para obtener detalles sobre la implementación y el comando del generador, véase el [Kagami README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_kagami/README.md).
