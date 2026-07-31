---
translation_locale: es
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 17ffd2979e2ff7a0e0c3f5c9f1457a5eb630713bba40fca0246afc0c2f7fd5e4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Claves para el despliegue de la red {#keys-for-network-deployment}

Cada red necesita un material clave distinto para clientes, pares, firma de génesis y, para perfiles NPoS o Nexus, identidades de validador BLS.

## Dónde se usan las llaves {#where-keys-are-used}

- Las claves de firma del cliente se almacenarán en `client.toml` bajo `[account]`.
- Las claves de identidad entre pares se almacenan en cada par `config.toml` como `public_key` y `private_key`.
- El descubrimiento de pares utiliza la clave pública de cada uno en `trusted_peers`.
- BLS Validador Las pruebas de posesión se almacenan en `trusted_peers_pop` para los perfiles de NPOS.
- La firma de Génesis utiliza el `[genesis].public_key` en configuración por pares y la clave privada correspondiente al firmar el manifiesto.

Para las implementaciones locales o de prueba, permita a Kagami generar todos estos archivos juntos:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Para una red o perfil existente, utilice el flujo guiado:

```bash
cargo run --bin kagami -- wizard --profile nexus
```

## Generar pares de claves individuales {#generate-individual-key-pairs}

Utilizar `kagami keys` para el material de llave independiente:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 --json
```

Para el material de validación BLS incluya una prueba de posesión:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop --json
```

Utilice `--seed` únicamente para dispositivos de desarrollo reproducibles. Para el despliegue en producción, genera llaves nuevas y almacena las llaves privadas fuera del repositorio.

## Consistencia entre pares {#peer-consistency}

Todos los validadores deben estar de acuerdo en la misma transacción genésica, topología, claves públicas confiables y validador PoPs. Una sola llave incompleta o incompatible puede evitar que la red inicie o alcance un consenso.

Para un despliegue mínimo de tolerancia a errores bizantinos, use al menos cuatro pares. Cada igual debe tener su propia clave privada, pero cada configuración de pares necesita el mismo conjunto de pares confiables.

## Cuentas de los clientes {#client-accounts}

La cuenta de cliente en `client.toml` debe ya existir en la cadena. Puede registrarse mediante el manifiesto de génesis o por una transacción posterior. Evite utilizar la identidad de firma de génesis como una cuenta de aplicación de larga duración; Los privilegios genesis sólo se aplican durante la ronda genesis, y los clientes de producción deben usar sus propias cuentas y roles.
