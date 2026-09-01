---
translation_locale: es
translation_source: /guide/security/generating-cryptographic-keys.md
translation_source_hash: f3d08a8e7fe7569ef783b93bccdc900ca74b85179a749b48b96c32028c749233
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Generando Claves Criptográficas {#generating-cryptographic-keys}

Utilice `kagami keys` para generar material clave de cliente, par de red y validador para Iroha 3.

## Uso básico {#basic-usage}

Desde la copia de trabajo del código fuente Iroha:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --out-dir ./client-key
```

El directorio principal ya debe existir. El destino debe ser nuevo o ya pertenecer al usuario actual, con modo `0700`, libre de enlaces simbólicos y vacío. `kagami` escribe `public.key` y `private.key` con modo `0600` y no imprime material clave. Con `--pop`, también escribe `pop.hex`.

`--out-dir` falla al cerrarse en plataformas donde Kagami no puede hacer cumplir estas reglas del sistema de archivos solo para el propietario. El archivo de clave privada es una exportación sin cifrar, no un firmware o firmante criptográfico de producción no exportable. Imprórtelo al límite de custodia aprobado y elimine la exportación de acuerdo con el procedimiento de implementación.

## Algoritmos {#algorithms}

Los algoritmos comunes son:

- `ed25519` para cuentas de clientes e identidades de transmisión.
- `secp256k1` cuando una cuenta de cliente requiere una identidad secp256k1.
- `bls_normal` para cada nodo o identidad de consenso de par en la red.

Comprueba los algoritmos exactos compatibles con tu compilación con:

```bash
cargo run --bin kagami -- keys --help
```

## Claves de Desarrollo Determinísticas {#deterministic-development-keys}

Para artefactos de prueba reproducibles, pase una semilla de 32 bytes codificada como 64 caracteres hexadecimales. Se acepta un prefijo opcional `0x`:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --seed-hex 1111111111111111111111111111111111111111111111111111111111111111 \
  --out-dir ./fixture-client-key
```

La semilla es material de clave privada. Use semillas deterministas únicamente para desarrollo local y pruebas. Omita `--seed-hex` para generar una clave de producción a partir de la aleatoriedad del sistema operativo.

## BLS Claves de Consenso y Pruebas de Posesión {#bls-consensus-keys-and-proofs-of-possession}

Iroha 3 las identidades de consenso de nodos y pares de red usan claves normales BLS. Genere una clave normal BLS y una prueba de posesión (PoP) con:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

`--pop` es válido únicamente con `bls_normal`; añade `pop.hex` al directorio de custodia. La génesis de blockchain firmada requiere un PoP coincidente para cada validador votante. En la configuración de pares de red, un mapa `trusted_peers_pop` no vacío selecciona el subconjunto de validadores; los pares de red de confianza omitidos de ese mapa no vacío son observadores. Si el mapa está vacío, todos los pares de red confiables BLS-normales entran en el conjunto de candidatos a bootstrap, con el votante PoPs aún suministrado por el génesis de blockchain firmado.

## Salida de custodia {#custody-output}

`kagami keys` requiere `--out-dir` y nunca escribe material de clave privada en la salida estándar. Lea `public.key`, `private.key` y opcionalmente `pop.hex` desde el directorio generado. Cada archivo contiene un valor canónico seguido de un salto de línea, lo que facilita la automatización basada en archivos de manera explícita:

```bash
PUBLIC_KEY=$(tr -d '\n' < ./client-key/public.key)
```

Para obtener ayuda completa de Kagami:

```bash
cargo run -p iroha_kagami -- advanced markdown-help > crates/iroha_kagami/CommandLineHelp.md
```
