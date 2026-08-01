---
translation_locale: es
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: ccbb076ef3e2ba45d074ad3394ac354d0c2233cdd4286c5fa7a77f0d1c413988
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# La generación de claves criptográficas {#generating-cryptographic-keys}

Utilice `kagami keys` para generar el material de claves de clientes, pares y validadores de Iroha 3.

## Uso básico {#basic-usage}

Desde una copia del código fuente de Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519
```

Por lo general, la salida JSON es más fácil de copiar en TOML o automatizar:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

El comando imprime una clave pública y una clave privada expuesta. Trate la clave privada como material secreto; no incorpore al repositorio las claves de producción generadas.

Para una exportación local segura o una transferencia a custodia en una plataforma Unix compatible, escriba un nuevo par de claves en un directorio vacío accesible únicamente por el propietario, en lugar de imprimir la clave privada:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

El directorio padre debe existir. El directorio de destino debe ser nuevo o pertenecer ya al usuario actual, tener el modo `0700`, no contener enlaces simbólicos y estar vacío. `kagami` escribe `public.key` y `private.key` con el modo `0600` y no imprime la clave privada. Con `--pop`, también escribe `pop.hex`.

`--out-dir` falla de forma segura en las plataformas donde Kagami no puede aplicar estas reglas del sistema de archivos que limitan el acceso al propietario. El archivo de clave privada es una exportación sin cifrar, no un firmante de producción respaldado por hardware o no exportable. Impórtelo en el entorno de custodia aprobado y elimine la exportación conforme al procedimiento de despliegue.

## Algoritmos {#algorithms}

Los algoritmos comunes son:

- `ed25519` para cuentas de clientes e identidades de transmisión.
- `secp256k1` cuando una cuenta de cliente requiere una identidad secp256k1.
- `bls_normal` para la identidad de consenso de cada nodo o par cuando la compilación incluya compatibilidad con BLS.

Compruebe los algoritmos exactos que admite su compilación con:

```bash
cargo run --bin kagami -- keys --help
```

## Claves de desarrollo deterministas {#deterministic-development-keys}

Para fixtures reproducibles, proporcione una semilla de 32 bytes codificada como 64 caracteres hexadecimales. Se acepta un prefijo `0x` opcional:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --json
```

La semilla es material de clave privada. Utilice semillas deterministas únicamente para el desarrollo local y las pruebas. Omita `--seed-hex` para generar una clave de producción con la aleatoriedad del sistema operativo.

## Claves de consenso BLS y pruebas de posesión {#bls-consensus-keys-and-proofs-of-possession}

Las identidades de consenso de los nodos y pares de Iroha 3 usan claves BLS normales. Genere una clave BLS normal y una prueba de posesión (PoP) con:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

`--pop` solo es válido con `bls_normal`. La salida JSON incluye `pop_hex`. El bloque génesis firmado requiere una PoP coincidente para cada validador con derecho a voto. En la configuración de pares, un mapa `trusted_peers_pop` no vacío selecciona el subconjunto de validadores; los pares de confianza omitidos de ese mapa no vacío son observadores. Si el mapa está vacío, todos los pares de confianza con claves BLS normales entran en el conjunto de candidatos inicial, y las PoPs de los validadores con voto siguen procediendo del bloque génesis firmado.

## Formatos de salida {#output-formats}

Utilice la salida predeterminada para la inspección de terminales, `--json` para automatización y `--compact` cuando otro script necesite valores orientados a líneas simples:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --compact
```

Para la ayuda Kagami de generación completa:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
