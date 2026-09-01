---
translation_locale: es
translation_source: /help/deployment-issues.md
translation_source_hash: c220e127bc8081c9b457dfd67101aa44fb80d79c461cc7a7eda99584d74a8f19
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Solución de problemas de implementación {#troubleshooting-deployment-issues}

Esta sección ofrece consejos para la solución de problemas de las implementaciones de Iroha 3. Si el problema que está experimentando no se describe aquí, contáctenos a través de [Telegram](https://t.me/hyperledgeriroha).

## Comenzar con artefactos generados {#start-with-generated-artifacts}

Para implementaciones locales y de prueba, prefiera artefactos generados por Kagami en lugar de archivos de pares de red escritos a mano:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

El directorio generado contiene configuraciones de pares de red, material de génesis de la blockchain, scripts de inicio y un README para la línea de construcción Iroha 3.

## el par de red no arranca {#peer-does-not-start}

Verifica estos artículos primero:

- `iroha3d --config <path>` apunta al propio archivo TOML del par de la red.
- `public_key` y `private_key` en la configuración de pares de la red pertenecen al mismo par de claves.
- `genesis.public_key` coincide con la clave utilizada para firmar la transacción génesis de la blockchain.
- Las identidades de los pares de la red de validadores usan claves BLS-Normal, y `trusted_peers_pop` contiene entradas de prueba de posesión para la clave local y los pares de red de confianza.
- los puertos para Torii y P2P no están ya vinculados por otro proceso.
- el directorio de la tienda Kura pertenece a la misma cadena y no fue copiado de un perfil de red diferente.

Use el seguimiento de configuración cuando el demonio lea más de una capa TOML:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --trace-config
```

## Docker y Docker Compose {#docker-and-compose}

Genera Compose a partir de la salida actual de Kagami localnet para que los argumentos de la línea de comandos y los archivos de configuración coincidan con el código revisado:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

Si un despliegue de compose comienza y luego se detiene, inspeccione los registros del daemon para:

- desajustado `chain`
- un par de red que usa una transacción génesis de blockchain diferente o un manifiesto técnico
- direcciones P2P anunciadas que solo funcionan dentro de la red del contenedor
- reutilización del volumen local después de regenerar el génesis de la blockchain

Al probar un génesis de blockchain nuevo, elimine los volúmenes antiguos Kura antes de reiniciar la pila. Mantener el almacenamiento de bloques antiguo con un génesis de blockchain nuevo hará que la reproducción falle.

## Kubernetes {#kubernetes}

Para Kubernetes, trate cada validador como infraestructura con estado:

- dar a cada par de red una clave de identidad estable y un volumen persistente estable
- exponer direcciones P2P que otros nodos de la red pueden resolver desde dentro del clúster
- montar archivos de configuración y de génesis de blockchain como configuración inmutable para una implementación
- desplegar todos los cambios de génesis o topología de blockchain deliberadamente, no como una actualización automática del config-map

Si un pod se reinicia repetidamente, compare la configuración generada en el pod con la prevista en [`peer.template.toml`](/es/reference/peer-config/index.md#template) y compruebe si el par está reproduciendo datos antiguos de Kura.

## Perfil de Sora {#sora-profile}

Los despliegues privados o locales Iroha 3 que usan Nexus, SoraFS o flujos de múltiples carriles deben iniciar el daemon estándar con el perfil Sora habilitado:

```bash
cargo run -p irohad --bin iroha3d -- --config ./config.toml --sora
```

Usa el mismo perfil de forma constante en los validadores de la misma red.

Los validadores públicos Taira utilizan el lanzador dedicado, que aplica la cadena exacta de Taira, la lista, el almacenamiento incorporado deshabilitado SoraFS y el perfil de firmante en tiempo de ejecución. Valide la configuración renderizada de Taira antes de iniciarla:

```bash
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

No inicies un público Taira validador con genérico `iroha3d`; ver el [`iroha3d` CLI referencia](/es/reference/iroha3d-cli.md) para el perfil impuesto.
