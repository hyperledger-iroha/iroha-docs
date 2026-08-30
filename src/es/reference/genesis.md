---
translation_locale: es
translation_source: /reference/genesis.md
translation_source_hash: 1312e80d9e662cc3e8cf4d0668ff4bb9e6ce3f74a60bb5287205aeeb5afd5de8
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Referencia de Génesis {#genesis-reference}

en la actualidad Iroha 3 flujo de trabajo, un `genesis.json` manifiesto describe la primera
transacciones y parámetros que se aplicarán cuando se inicie la red.

El artefacto firmado distribuido a los pares es un Norito-codificado `.nrt` archivo
producido por `kagami genesis sign`.

## Campos principales {#main-fields}

Un manifiesto de génesis puede definir:

- `chain` para el identificador de cadena
- `executor` para una ruta de código de bytes de actualización de ejecutor opcional
- `ivm_dir` para IVM bibliotecas utilizadas por activadores y actualizaciones
- `consensus_mode` para el modo inicial anunciado por el manifiesto
- `transactions` para actualizaciones ordenadas de parámetros, instrucciones, activadores y topología
- `crypto` para la instantánea criptográfica inicial

Dentro `transactions`, Las entradas de topología emparejan ID de pares y PoPs juntos:

```json
{
  "peer": "ea0130...",
  "pop_hex": "0xabcd..."
}
```

## Generar un manifiesto {#generate-a-manifest}

Usar Kagami para generar una plantilla:

```bash
cargo run -p iroha_kagami -- genesis generate \
  --consensus-mode npos \
  --ivm-dir defaults \
  --genesis-public-key <PUBLIC_KEY> > genesis.json
```

para el publico SORA Nexus espacio de datos, `npos` es el modo de consenso esperado.
Otro Iroha 3 Las implementaciones pueden utilizar permisos o NPoS según el objetivo.
perfil.

## Firma el manifiesto {#sign-the-manifest}

Después de editar y validar el JSON, firmarlo en un desplegable `.nrt` bloquear:

```bash
cargo run -p iroha_kagami -- genesis sign genesis.json \
  --private-key-file <MODE_0600_PRIVATE_KEY_FILE> \
  --out-file genesis.signed.nrt
```

`kagami genesis sign` lee la clave pública de génesis del manifiesto y usa
la clave privada de un archivo regular de enlace único propiedad del propietario para producir la
bloque firmado desplegable.El archivo debe contener una clave privada canónica
multihash seguido de una nueva línea; Kagami rechaza vínculos simbólicos y modos otros
que `0600`. Las claves privadas sin procesar no se aceptan en la línea de comando.El resultado
es el archivo al que los pares deben hacer referencia desde su configuración.

## Configurar `iroha3d` {#configure-iroha3d}

Apunta el demonio al bloque de génesis firmado:

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

Para conocer la implementación del generador y los detalles del comando, consulte la
[Kagami README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami/README.md).
