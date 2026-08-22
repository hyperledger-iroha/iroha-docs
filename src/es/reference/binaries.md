---
translation_locale: es
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# Trabajando con Iroha binarios {#working-with-iroha-binaries}

El Iroha 3 El flujo de trabajo del operador gira en torno a tres binarios principales:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) para ejecutar un demonio par
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) para CLI y comandos del operador
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) para claves, génesis, redes locales y perfiles

## Construir desde la fuente {#build-from-source}

Desde la raíz del espacio de trabajo ascendente:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

Los binarios de lanzamiento estarán disponibles en `target/release/`.

Para inspeccionar la superficie de comando:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## Ejecutar directamente desde el repositorio {#run-directly-from-the-repository}

Si no desea instalar nada globalmente, utilice `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker Imagen {#docker-image}

El espacio de trabajo ascendente utiliza `kagami localnet` y `kagami docker` generar
Docker Compose archivos que coinciden con el código extraído.El `hyperledger/iroha:dev`
La imagen se puede utilizar con esos archivos generados.

Ejecute el CLI en un contenedor:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

Correr Kagami en un contenedor:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

Para el inicio entre pares, primero genere una red local y un archivo Compose:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## ¿Qué binario debo usar? {#which-binary-should-i-use}

- Usar `irohad` cuando está iniciando u operando pares.
- Usar `iroha` cuando necesite consultar el libro mayor, enviar transacciones o inspeccionar los puntos finales del operador.
- Usar `kagami` cuando necesite claves, manifiestos de génesis, paquetes de perfiles o activos de red local.

## Publicación e implementación del lanzamiento de Kagemusha {#kagemusha-release-publication-and-rollout}

Kagemusha V4 la publicación y la activación cruzan fronteras protegidas separadas:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` es el
  Editor solo para macOS y solo root.Autentica el fijado Kagami binario y
  el candidato exacto de dieciséis archivos, publica el ausente
  `promotion-record-v4.norito` sin reemplazo y solo informa el éxito
  después de que se verifique la versión promocionada exacta de diecisiete archivos.
- `iroha offline kagemusha rollout-v4 create-expectations` verifica el firmado
  reserva, cuatro sellos de calificación de validador ordenados, el exacto
  transferencia bancaria ya autorizada y el ancla finalizada de confianza antes
  publicación de expectativas firmadas sin reemplazo.
- `iroha offline kagemusha rollout-v4 submit` requiere explícito
  `--write-authorized` consentir.Registra de forma duradera y vuelve a verificar la exactitud
  expectativas antes de que una red escriba o reintente.Un `Applied` el estado no es
  suficiente: el comando también verifica el bloque comprometido, sucesor de finalidad
  cadena y transferencia bancaria completa con autorización.
- `iroha offline kagemusha rollout-v4 finalize-receipt` recopila la misma
  evidencia anclada en pruebas solo después de que se vuelva a verificar el
  diario exacto de envío, la firma con el emisor independiente del recibo y
  publica el recibo canónico sin reemplazarlo.

El flujo de trabajo de preparación para la producción de Kagemusha registrado es solo de verificación.
No llama al editor autenticado, publica la calificación del validador.
sellar, enviar una activación o crear un recibo de finalidad.Un flujo de trabajo exitoso
Por lo tanto, la ejecución no demuestra ni una promoción ni un lanzamiento en vivo.

Estas órdenes son primitivas locales, no sustitutos de la evidencia viva.A
el lanzamiento de producción permanece bloqueado sin una certificación de aplicación física real y
artefactos candidatos, los cuatro sellos de host protegidos, gobernanza en tiempo de ejecución y
firma de entradas, presentación de cuatro validadores en vivo y evidencia de finalidad, y el
proyección canónica de configuración efectiva.Mantener claves privadas,
material de autenticación e identificadores específicos de la promoción en formato protegido.
custodia en tiempo de ejecución;no los copie en documentación de fuente controlada ni
billetes de operador.
