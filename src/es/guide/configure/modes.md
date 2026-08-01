---
translation_locale: es
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# Las cadenas de bloques públicas y privadas {#public-and-private-blockchains}

Iroha puede ejecutarse en una variedad de configuraciones. Como administrador de su propia red, usted decide qué ejecutor y la política de permisos determina si se acepta una transacción.

Los perfiles comunes son redes privadas con permisos y redes públicas más abiertas. Ambos se configuran a través del estado de génesis y la política de ejecutor, no a través de binarios de nodos separados.

A continuación presentamos las principales diferencias en estos dos casos de uso.

## Las autorizaciones {#permissions}

En un blockchain público, la mayoría de las cuentas tienen el mismo conjunto de permisos. En una cadena de bloques privada, cada cuenta solo recibe sus permisos explícitos.

::: info

Consulte la sección [ dedicada a los permisos ](/es/blockchain/permissions.md) para más detalles.

:::

## Los compañeros {#peers}

En una cadena de bloques pública, la admisión de pares es parte de la política de cadena. Para una cadena privada, las implementaciones suelen fijar el conjunto de pares de confianza en configuración y génesis.

::: info

Para más detalles, consulte el [ Gestión de pares ](peer-management.md).

:::

## Cuentas de registro {#registering-accounts}

Dependiendo de cómo decida configurar su bloque genético [ (`genesis.json`) ](genesis.md), el proceso para registrar una cuenta puede ir en uno de dos sentidos. Para entender por qué, hablemos primero del permiso.

El ejecutor seleccionado define qué controles de permisos se aplican. Puede otorgar los tokens de permiso predeterminados [ ](/es/blockchain/permissions.md) en génesis para dar forma a una red privada, administrada por el administrador o una red más abierta. Una vez que esos permisos están activos, el proceso de registro de cuentas es diferente.

Las políticas de registro público y privado generalmente difieren:

- Una política de registro público acepta los registros de cuentas de cualquier usuario elegible[^1]. El usuario necesita un cliente adecuado, una clave privada para un algoritmo soportado y una solicitud de registro aceptada por la política.

- Una política de registro privado puede autorizar a una cuenta o un contrato inteligente para presentar registros. Una política personalizada puede limitar el registro a una ventana de tiempo. También puede requerir que el remitente gaste un token cuyo suministro está fijo porque ninguna autoridad tiene permiso para acuñar más.

- Con el patrón de red privada por defecto, una cuenta existente presenta el registro para cada nueva cuenta.

Los validadores de permisos predeterminados cubren el caso típico de uso privado de blockchain.

::: info

Los modos público y privado son ejecutor y genesis políticas opciones. Ambos utilizan el mismo nodo binario. revisar los ejecutores seleccionados y genesis permisos antes de ejecutar una red abierta.

:::

Consulte la sección sobre las instrucciones [](/es/blockchain/instructions.md#un-register) para más detalles acerca de las instrucciones de `Register<Account>`.

[^1]: `Register<Account>` crea un estado de libro mayor para una canónica, sin dominio `AccountId`; el enrutamiento de dominio y los alias se gestionan por separado.
