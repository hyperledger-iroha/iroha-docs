---
translation_locale: es
translation_source: /help/deployment-issues.md
translation_source_hash: 6f35ac59053e312f56a716810c8f0b625752500d1fc64b27d93cbd8317b6cc19
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Resolución de problemas en el despliegue {#troubleshooting-deployment-issues}

Esta sección ofrece consejos de resolución de problemas para los despliegues Iroha 3. Si el problema que está experimentando no se describe aquí, póngase en contacto con nosotros a través de [Telegram](https://t.me/hyperledgeriroha).

## Comience con los artefactos generados . {#start-with-generated-artifacts}

Para las implementaciones locales y de ensayo, se prefieren los artefactos generados por Kagami en lugar de los archivos escritos a mano:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

El directorio generado contiene configuraciones de pares, material de génesis, guiones de inicio y un README para la línea de construcción Iroha 3.

## Peer no comienza {#peer-does-not-start}

Compruebe estos artículos primero:

- `irohad --config <path>` puntos en el expediente propio del mismo TOML.
- `public_key` y `private_key` en la configuración de pares pertenecen al mismo par de teclas.
- `genesis.public_key` coincide con la llave utilizada para firmar la transacción de génesis.
- las identidades de pares del validador utilizan claves BLS-Normales, y `trusted_peers_pop` contiene entradas de prueba de posesión para la clave local y sus pares de confianza.
- Los puertos de Torii y P2P ya no están sujetos a otro proceso.
- el directorio de almacenamiento Kura pertenece a la misma cadena y no fue copiado desde un perfil de red diferente.

Utilice el seguimiento de configuración cuando el daemon lea más de una capa TOML:

```bash
cargo run --bin irohad -- --config ./config.toml --trace-config
```

## Docker y Composición {#docker-and-compose}

Generar Componer a partir de la salida localnet actual Kagami para que los argumentos de línea de comandos y archivos de configuración coincidan con el código eliminado:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

Si un despliegue de composiciones comienza y luego se detiene, inspeccione los registros del daemon para:

- sin coincidir `chain`
- Una pareja que utiliza una transacción o manifiesto de génesis diferente
- direcciones publicitadas P2P que solo funcionan dentro de la red de contenedores
- reutilización del volumen local después de la regeneración genética

Al probar una genesis fresca, retire los volúmenes antiguos Kura antes de reiniciar la pila. Mantener el antiguo almacenamiento de bloques con una nueva génesis hará que la repetición fracase.

## Los Kubernetes {#kubernetes}

Para Kubernetes, tratar a cada validador como una infraestructura de estado:

- dar a cada igual una clave de identidad estable y un volumen persistente estable
- exponer las direcciones P2P que otros pares puedan resolver desde el interior del grupo
- montar los archivos de configuración y genesis como configuración inmutable para un despliegue
- Implementar todos los cambios de génesis o topología deliberadamente, no como una actualización automática del mapa de configuración

Si una cápsula se reinicia repetidamente, comparar la configuración renderizada en la cápsula con la esperada [`peer.template.toml`](/es/reference/peer-config/index.md#template) y comprobar si el peer está reproduciendo los datos antiguos Kura.

## Perfil de Sora {#sora-profile}

Las instalaciones Iroha 3 que utilicen Nexus, SoraFS o flujos de varias vías deben iniciar el daemon con el perfil Sora habilitado:

```bash
cargo run --bin irohad -- --config ./config.toml --sora
```

Utilice el mismo perfil de manera consistente entre validadores en la misma red.
