---
translation_locale: es
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: 61f25e27550682f54e713c2512b25809bde21d53ea43cd1a5d5bfe13283af297
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# La generación de claves criptográficas {#generating-cryptographic-keys}

Utilice `kagami keys` para generar el material clave de cliente, par y validador de Iroha 3.

## El uso básico {#basic-usage}

De la caja de origen Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

Por lo general, la salida JSON es más fácil de copiar en TOML o automatizar:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

El comando imprime una clave pública y una llave privada expuesta.

## Algorithms {#algorithms}

Los algoritmos comunes son:

- `ed25519` para las cuentas de clientes, las identidades de transmisión y la mayoría de redes de desarrollo.
- `secp256k1` cuando necesites una identidad de cuenta secp256k1.
- `bls_normal` para las claves de consenso del validador cuando la configuración permita el soporte de BLS.

Compruebe los algoritmos exactos apoyados por su construcción con:

```bash
cargo run --bin kagami -- keys --help
```

## Las claves del desarrollo determinista {#deterministic-development-keys}

En el caso de los accesorios reproducibles, pase una semilla:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --seed "dev-alice" --json
```

Las semillas son materiales de llave privada, sólo se usan para el desarrollo local y pruebas.

## BLS Pruebas de posesión {#bls-proofs-of-possession}

Los perfiles de validador NPoS y Nexus requieren que las llaves de validador BLS y PoPs:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

El JSON incluye `pop_hex` cuando se utiliza `--pop`. Utilice ese valor con la topología generada o las entradas `trusted_peers_pop` requeridas por el perfil.

## Formatos de salida {#output-formats}

Utilice la salida predeterminada para la inspección de terminales, `--json` para automatización y `--compact` cuando otro script necesite valores orientados a líneas simples:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Para la ayuda Kagami de generación completa:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
