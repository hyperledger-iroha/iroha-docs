---
translation_locale: es
translation_source: /guide/configure/modes.md
translation_source_hash: 141e640a596b419627c21dd4b22690f6ef97efe6ad2fc21ea5f806d0e262227f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Las cadenas de bloques públicas y privadas {#public-and-private-blockchains}

Iroha puede ejecutarse en una variedad de configuraciones. Como administrador de su propia red, usted decide qué ejecutor y la política de permisos determina si se acepta una transacción.

Los perfiles comunes son redes privadas con permisos y redes públicas más abiertas. Ambos se configuran a través del estado de génesis y la política de ejecutor, no a través de binarios de nodos separados.

A continuación presentamos las principales diferencias en estos dos casos de uso.

## Las autorizaciones {#permissions}

En una cadena de bloques pública, la mayoría de las cuentas tienen el mismo conjunto de permisos. En una cadena privada, se supone que la mayoría de los cuentas no pueden hacer nada fuera de la autoridad otorgada a ellos a menos que se les conceda explícitamente el permiso pertinente.

::: Información

Consulte la sección [ dedicada a los permisos ](/es/blockchain/permissions.md) para más detalles.

:::

## Los compañeros {#peers}

En una cadena de bloques pública, la admisión de pares es parte de la política de cadena. Para una cadena privada, las implementaciones suelen fijar el conjunto de pares de confianza en configuración y génesis.

::: Información

Para más detalles, consulte el [ Gestión de pares ](peer-management.md).

:::

## Cuentas de registro {#registering-accounts}

Dependiendo de cómo decida configurar su bloque genético [ (`genesis.json`) ](genesis.md), el proceso para registrar una cuenta puede ir en uno de dos sentidos. Para entender por qué, hablemos primero del permiso.

El ejecutor seleccionado define qué controles de permisos se aplican. Puede otorgar los tokens de permiso predeterminados [ ](/es/blockchain/permissions.md) en génesis para dar forma a una red privada, administrada por el administrador o una red más abierta. Una vez que esos permisos están activos, el proceso de registro de cuentas es diferente.

Cuando se trata de registrar cuentas, la cadena de bloques pública y privada tienen las siguientes diferencias:

- En una cadena de bloques pública, cualquiera debería ser capaz de registrar una cuenta[^1]. Así que, en teoría, todo lo que necesitas es un cliente adecuado, una forma de generar una clave privada para un algoritmo soportado y una política de permisos que acepte el registro.

- En una cadena de bloques privada, puedes tener cualquier proceso para crear una cuenta: podría ser que la instrucción de registro tenga que ser presentada por una cuenta específica, o por un contrato inteligente que pide otros detalles. Podría ser que en una cadena de bloques privada el registro de nuevas cuentas sólo sea posible en fechas específicas, o limitado por un token no contable (finito).

- En una cadena de bloques privada típica, es decir, sin procesos únicos para el registro de cuentas, se necesita una cuenta para registrar otra.

Los validadores de permisos predeterminados cubren el caso típico de uso privado de blockchain.

::: Información

Los modos público y privado son perfiles de políticas en lugar de binarios de nodos separados. Revise los permisos de ejecución y génesis que envíe antes de ejecutar una red abierta.

:::

Consulte la sección sobre las instrucciones [](/es/blockchain/instructions.md#un-register) para más detalles acerca de las instrucciones de `Register<Account>`.

[^1]: `Register<Account>` crea un estado de libro mayor para una canónica, sin dominio `AccountId`; el enrutamiento de dominio y los alias se gestionan por separado.
