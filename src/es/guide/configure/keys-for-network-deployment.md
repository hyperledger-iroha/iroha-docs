---
translation_locale: es
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Claves para el Despliegue de la Red {#keys-for-network-deployment}

Cada red necesita material de clave distinto para clientes, pares de red, firma del génesis de la blockchain y, para NPoS o perfiles Nexus, identidades de validadores BLS.

## Dónde se usan las llaves {#where-keys-are-used}

- Las claves de firma del cliente se almacenan en `client.toml` bajo `[account]`.
- Las claves de identidad de los pares de la red se almacenan en cada par de la red `config.toml` como `public_key` y `private_key`.
- El descubrimiento de pares de red utiliza la clave pública de cada par de red en `trusted_peers`.
- BLS los validadores Pruebas-de-Posesión se almacenan en `trusted_peers_pop` para perfiles NPoS.
- La firma del génesis de la blockchain utiliza el `[genesis].public_key` en la configuración del par de red y la clave privada correspondiente al firmar el manifiesto técnico.

Para implementaciones locales o de prueba, deja que Kagami genere todos estos archivos juntos:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Para una red o perfil existente, utilice el flujo guiado:

```bash
cargo run --bin kagami -- wizard
```

## Generar Parejas de Claves Individuales {#generate-individual-key-pairs}

Utilice `kagami keys` para material de clave independiente:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

Para el material del validador BLS, incluya una Prueba de Posesión:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` solo con un secreto hexadecimal exacto de 32 bytes para reproducir configuraciones de desarrollo. Para el despliegue en producción, omítalo para que Kagami use la aleatoriedad del sistema operativo, y luego mueva la exportación de la clave privada no encriptada hacia el límite de custodia aprobado. El comando nunca imprime claves privadas.

## Consistencia de par de red {#peer-consistency}

Todos los validadores deben estar de acuerdo en la misma transacción génesis de la blockchain, topología, claves públicas de pares confiables de la red y validador PoPs. La falta de una clave de par de red o una coincidencia incorrecta puede impedir que la red se inicie o alcance el consenso.

Para un despliegue mínimo tolerante a fallos bizantinos, use al menos cuatro pares de red. Cada par de red debe tener su propia clave privada, pero cada configuración de par de red necesita el mismo conjunto de pares de red de confianza.

## Cuentas de clientes {#client-accounts}

La cuenta del cliente en `client.toml` ya debe existir en la cadena. Puede ser registrada por el manifiesto técnico génesis de la blockchain o por una transacción posterior. Evite usar la identidad de firma del génesis de la blockchain como una cuenta de aplicación de larga duración; los privilegios del génesis de la blockchain solo se aplican durante la ronda de génesis de la blockchain, y los clientes de producción deben usar sus propias cuentas y roles.
