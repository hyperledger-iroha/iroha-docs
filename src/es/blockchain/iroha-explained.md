---
translation_locale: es
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 3fdd22338e826b1ce335ebf5e4e850cf3deb9415c36a0c8d21ad63c397cec8c0
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha Explicado {#iroha-explained}

Iroha 3 es la plataforma Hyperledger Iroha de primera versión. El mismo núcleo admite redes auto-alojadas y el modelo de ejecución SORA Nexus para espacios de datos y enrutamiento multilaneal.

## Bloques de construcción centrales {#core-building-blocks}

- `irohad` ejecuta compañeros
- Torii es la puerta de entrada del cliente y el operador
- Sumeragi maneja el consenso
- Norito es el formato binario canónico de [](/es/reference/norito.md)
- IVM ejecuta contratos inteligentes portátiles y código de byte
- Kotodama recopila los contratos de alto nivel `.ko` con el código byte IVM `.to`.
- Kagami prepara las llaves, la genesis, los perfiles y las redes locales
- SORA Nexus añadir aviones de servicio Soracloud, En el interior, SoraNet, SoraFS, y SoraDNS para el alojamiento de aplicaciones, transporte de privacidad, almacenamiento y denominación

## Modelo de ejecución {#execution-model}

Cada cambio en el estado del mundo todavía ocurre a través de las transacciones. Las transacciones llevan instrucciones o IVM código de byte, y Torii es la principal forma en que los clientes envían o observan sus efectos.

- Las configuraciones Nexus-consciente pueden definir múltiples carriles
- Los espacios de datos aislan las cargas de trabajo mientras se mantienen parte del mismo modelo de libro mayor
- la política de enrutamiento decide qué carril y espacio de datos manejan una clase de trabajo

## Arquitectura del espacio de datos múltiple {#multi-dataspace-architecture}

Un espacio de datos es un límite de enrutamiento y espacio de nombres, no una cadena de bloques separada. El tiempo de ejecución todavía tiene uno `World`, un modelo de transacción y un pipeline de consenso. Nexus agrega catálogos que le dicen al nodo cómo particionar el trabajo a través de carriles y cómo nombrar los espacios de datos que sirven esos carriles.

En el momento de ejecutar, un espacio de datos es representado por un metadatos numérico `DataSpaceId` y catálogo. `DataSpaceId::UNIVERSAL` se reserva como `0`; el catálogo predeterminado contiene el espacio de datos `universal`. Cada espacio de datos configurado tiene:

- un número único ID
- un alias único, como `universal`, `governance` o `zk`
- una descripción opcional de las superficies del operador
- un valor no cero `fault_tolerance` utilizado para medir los comités de relevo

Los carriles son las rutas de ejecución y almacenamiento vinculadas a esos bancos de datos. `LaneId`, el `DataSpaceId` que sirve, un alias, visibilidad (`public` o `restricted`), perfil de almacenamiento (`full_replica`, `commitment_only`, o `split_replica`), el esquema de prueba y la gestión opcional, la liquidación y los metadatos del programador. El tiempo de ejecución se deriva de la geometría del almacenamiento por vía de este catálogo, incluyendo: Kura los nombres de segmentos y los prefijos de claves deterministas.

El camino de ruta es:

1. La configuración construye un `DataSpaceCatalog`, `LaneCatalog` y `LaneRoutingPolicy` validados. Se requieren múltiples carriles, múltiples espacios de datos o enrutamiento no predeterminado `nexus.enabled = true`.
2. En la cola de transacciones se solicita al enrutador del carril activo un `RoutingDecision` que contenga un carril ID y espacio de datos ID.
3. Las reglas explícitas de enrutamiento pueden coincidir por autoridad/cuenta o por etiqueta de instrucciones. Sin una regla de coincidencia, el router puede derivar el espacio de datos del dominio IDs, las proyecciones de definición de activos, los permisos ampliados por espacio de datos, las patas de liquidación o el alcance de la cuenta vinculada de la autoridad.
4. La ruta resuelta se verifica con ambos catálogos. carriles desconocidos, espacios de datos desconocidos y desajustes de carriles/espacios de datos son errores deterministas de enrutamiento. Si una transacción se dirige a dos objetivos diferentes del espacio de datos, será rechazada como una ruta conflictiva; la liquidación entre el espacio de datos DVP/PVP será enrutada a través del carril de coordinación universal.
5. Sumeragi y telemetría mantienen la asignación visible como actividad de carril y espacio de datos, recuentos y instantáneas de compromiso.

Esta es la razón por la que los identificadores de objetos importan. Los dominios incluyen el alias del espacio de datos en su ID, por ejemplo `payments.universal`, por lo que se pueden enrutar las escrituras a escala de dominio. Las cuentas siguen siendo canónicas y sin dominio, por lo que la misma cuenta puede estar vinculada a diferentes ámbitos de aplicación sin cambiar su `AccountId`. Las definiciones de activos pueden llevar una proyección de dominio/espacio de datos, lo que permite a las operaciones de activos heredar la ruta correcta del espacio de datos.

Sin superposición Nexus, el nodo utiliza un solo carril y el espacio de datos `universal`. El perfil SORA agrupado lo reemplaza por un catálogo de tres carriles: `core` para el carril público universal, `governance` para el tráfico de gobernanza y `zk` para el tráfico con acceso a conocimientos cero y el tráfico de despliegue por contrato.

Estos tres valores predeterminados existen para las clases de carga de trabajo separadas:

|Espacio de datos |La calle .|¿ Por qué existe ?|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
|`universal` |`core` |Espacio de datos predeterminado (`DataSpaceId::UNIVERSAL == 0`) reservado para el tráfico ordinario del libro mayor público y el enrutamiento fallback. |
|`governance` |`governance` |Líneas restringidas para la gobernanza y el tráfico parlamentario, por lo que la actividad del plano de control no se mezcla con las aplicaciones generales. |
|`zk` |`zk` |Carril restringido para pruebas de conocimiento cero, adjuntos y enrutamiento de implementación de contratos, manteniendo los flujos de trabajo pesados en prueba separados de las escrituras normales. |

Sólo `universal` es la línea de base reservada. `governance` y `zk` son opciones de perfil SORA codificadas en el catálogo combinado y en la política de enrutamiento; los operadores pueden definir un catálogo diferente cuando necesitan límites diferentes del espacio de datos.

Sumeragi siempre utiliza disponibilidad de datos y difusión confiable. Estos caminos forman parte del protocolo de consenso Iroha 3 y no pueden ser desactivados por un perfil de implementación.

El comportamiento del tiempo de ejecución se obtiene a partir de archivos de configuración y parámetros en cadena.

## Leer más adelante {#read-next}

- [Servicios SORA Nexus](/es/blockchain/sora-nexus-services.md)
- [Lanzamiento Iroha 3](/es/get-started/launch-iroha.md)
- [El mundo, WSV y el almacenamiento Kura ](/es/blockchain/world.md)
- [Referencia de Génesis](/es/reference/genesis.md)
- [Puntos finales Torii](/es/reference/torii-endpoints.md)
