---
translation_locale: es
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Cadenas de bloques públicas y privadas {#public-and-private-blockchains}

Iroha puede ejecutarse en una variedad de configuraciones. Como administrador de su propia red, usted decide qué ejecutor y política de permisos determinan si se acepta una transacción.

Los perfiles comunes son redes privadas con permisos y redes públicas más abiertas. Ambos se configuran a través del estado génesis de la blockchain y la política del ejecutor, no a través de binarios de nodo separados.

A continuación, describimos las principales diferencias en estos dos casos de uso.

## Permisos {#permissions}

En una blockchain pública, la mayoría de las cuentas tienen el mismo conjunto de permisos. En una blockchain privada, cada cuenta recibe solo sus permisos explícitos.

::: info

Consulte el [sección dedicada a los permisos](/es/blockchain/permissions.md) para más detalles.

:::

## pares de red {#peers}

En una cadena pública, la admisión de pares forma parte de la política de la cadena. En una cadena privada, los despliegues suelen fijar el conjunto de pares de confianza en la configuración y el génesis.

::: info

Consulte [gestión de pares de red](peer-management.md) para más detalles.

:::

## Registrando cuentas {#registering-accounts}

Dependiendo de cómo decidas configurar tu [bloque génesis de blockchain (`genesis.json`)](genesis.md), El proceso para registrar una cuenta podría seguir uno de dos caminos. Para entender por qué, hablemos primero sobre permisos.

El ejecutor seleccionado define qué verificaciones de permisos se aplican. Puedes otorgar el [tokens de permiso](/es/blockchain/permissions.md) predeterminado en el génesis de la blockchain para configurar una red privada administrada por un administrador o una red más abierta. Una vez que esos permisos están activos, el proceso de registro de cuentas es diferente.

Las políticas de registro públicas y privadas suelen diferir:

- Una política de registro público acepta registros de cuenta de cualquier usuario elegible[^1]. El usuario necesita un cliente adecuado, una clave privada para un algoritmo compatible y una solicitud de registro aceptada por la política.

- Una política de registro privado puede autorizar a una cuenta o a un contrato inteligente a enviar registros. Una política personalizada puede limitar el registro a una ventana de tiempo. También puede requerir que el remitente gaste un token cuya oferta es fija porque ningún principal de autorización tiene permiso para emitir más.

- Con el patrón de red privada predeterminado, una cuenta existente envía el registro para cada nueva cuenta.

Los validadores de permisos predeterminados cubren el caso de uso típico de una blockchain privada.

::: info

Los modos público y privado son elecciones de política de ejecutor y génesis de blockchain. Ambos utilizan el mismo binario de nodo. Revise los permisos del ejecutor y del génesis de blockchain seleccionados antes de ejecutar una red abierta.

:::

Consulte la sección sobre [instrucciones](/es/blockchain/instructions.md#un-register) para más detalles acerca de las instrucciones de `Register<Account>`.

[^1]: `Register<Account>` crea el estado del libro mayor de blockchain para un `AccountId` canónico y sin dominio; el enrutamiento de dominios y los alias se gestionan por separado.
