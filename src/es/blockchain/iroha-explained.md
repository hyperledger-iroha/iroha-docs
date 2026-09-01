---
translation_locale: es
translation_source: /blockchain/iroha-explained.md
translation_source_hash: ba591b2c1aa819837177625b1ae457b5fa492197576dc690b19ca2897562a436
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Iroha Explicado {#iroha-explained}

Iroha 3 es la plataforma Hyperledger Iroha de primera versión. El mismo núcleo soporta redes autoalojadas y el modelo de ejecución SORA Nexus para espacios de datos y enrutamiento de múltiples carriles.

## Bloques de Construcción Básicos {#core-building-blocks}

- `iroha3d` ejecuta pares de red
- Torii es la puerta de enlace del cliente y del operador
- Sumeragi maneja el consenso
- Norito es el [formato binario canónico](/es/reference/norito.md)
- IVM ejecuta contratos inteligentes portátiles y bytecode
- Kotodama compila contratos `.ko` de alto nivel a IVM bytecode `.to`
- Kagami prepara claves, génesis de la blockchain, perfiles y redes locales
- SORA Nexus los planos de servicio agregan Soracloud, Inrou, SoraNet, SoraFS y SoraDNS para hospedaje de aplicaciones, transporte de privacidad, almacenamiento y denominación

## Modelo de ejecución {#execution-model}

Cada cambio en el estado del mundo todavía ocurre a través de transacciones. Las transacciones llevan instrucciones o código byte IVM, y Torii es la forma principal en que los clientes las envían o observan sus efectos.

- Las configuraciones conscientes de Nexus pueden definir múltiples carriles de ejecución
- los espacios de datos aíslan las cargas de trabajo sin dejar de formar parte del mismo modelo de libro mayor
- La política de enrutamiento decide qué carril de ejecución y espacio de datos manejan una clase de trabajo

## Arquitectura Multi-Espacio de Datos {#multi-dataspace-architecture}

Un espacio de datos es un límite de enrutamiento y de espacio de nombres, no una blockchain separada. El entorno de ejecución sigue teniendo un solo `World`, un modelo de transacción y un canal de consenso. Nexus añade catálogos que indican al nodo cómo repartir el trabajo entre las vías de ejecución y cómo denominar los espacios de datos atendidos por ellas.

En tiempo de ejecución del software, un espacio de datos se representa mediante un `DataSpaceId` numérico y metadatos del catálogo. `DataSpaceId::UNIVERSAL` está reservado como `0`; el catálogo predeterminado contiene el espacio de datos `universal`. Cada espacio de datos configurado tiene:

- un ID numérico único
- un alias único como `universal`, `governance` o `zk`
- una descripción opcional para las superficies del operador
- un valor `fault_tolerance` distinto de cero usado para dimensionar comités de relevos

las vías de ejecución son las rutas de ejecución y almacenamiento vinculadas a esos espacios de datos. Una entrada de vía de ejecución lleva un `LaneId`, el `DataSpaceId` que sirve, un alias, visibilidad (`public` o `restricted`), perfil de almacenamiento (`full_replica`, `commitment_only` o `split_replica`), esquema de prueba y gobernanza opcional, liquidación y metadatos del programador. El tiempo de ejecución del software deriva la geometría de almacenamiento por carril a partir de este catálogo, incluidos los nombres de segmentos Kura y los prefijos de clave deterministas.

La ruta de enrutamiento es:

1. La configuración construye un `DataSpaceCatalog`, `LaneCatalog` y `LaneRoutingPolicy` validados. Varios carriles de ejecución, múltiples espacios de datos o enrutamiento no predeterminado requieren `nexus.enabled = true`.
2. La cola de transacciones solicita al enrutador de carril de ejecución activo un `RoutingDecision` que contiene un ID de carril de ejecución y un ID de espacio de datos.
3. Las reglas de enrutamiento explícitas pueden coincidir por autoridad/cuenta o por etiqueta de instrucción. Sin una regla coincidente, el enrutador puede derivar el espacio de datos a partir de IDs de dominio, proyecciones de definición de activos, permisos con alcance de espacio de datos, partes de transferencia de liquidación o el alcance de cuenta vinculado del principal de autorización.
4. La ruta resuelta se verifica contra ambos catálogos. Carriles de ejecución desconocidos, espacios de datos desconocidos y desajustes entre carriles y espacios de datos son errores de enrutamiento determinísticos. Si una transacción escribe en dos objetivos de espacio de datos diferentes, se rechaza como una ruta en conflicto; la liquidación entre espacios de datos DVP/PVP se enruta a través del carril de ejecución del coordinador universal.
5. Sumeragi y la telemetría mantienen la asignación visible como carril de ejecución y actividad del espacio de datos, instantáneas de acumulación y compromiso.

Por eso importan los identificadores de objetos. Los dominios incluyen el alias del espacio de datos en su ID, por ejemplo `payments.universal`, por lo que las escrituras con alcance de dominio se pueden enrutar. Las cuentas permanecen canónicas y sin dominio, de modo que la misma cuenta puede vincularse en diferentes ámbitos de aplicación sin cambiar su `AccountId`. Las definiciones de activos pueden llevar una proyección de dominio/espacio de datos, lo que permite que las operaciones de activos hereden la ruta correcta del espacio de datos.

Sin las anulaciones de Nexus, el nodo usa una única vía de ejecución y el espacio de datos `universal`. El perfil empaquetado SORA lo reemplaza con un catálogo de tres vías: `core` para el carril de ejecución pública universal, `governance` para el tráfico de gobernanza, y `zk` para el tráfico de adjuntos de conocimiento cero y despliegue de contratos.

Esos tres valores predeterminados existen para separar las clases de carga de trabajo:

|Espacio de datos|carril de ejecución|Por qué existe|
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal`  | `core`       |Espacio de datos predeterminado reservado (`DataSpaceId::UNIVERSAL == 0`) para el tráfico normal del libro mayor público y el enrutamiento de reserva.|
| `governance` | `governance` |Carril de ejecución restringido para el tráfico de gobernanza y parlamento, de modo que la actividad del plano de control no se mezcle con las escrituras generales de la aplicación.|
| `zk`         | `zk`         |Carril de ejecución restringido para pruebas de conocimiento cero, adjuntos y enrutamiento de despliegue de contratos, manteniendo los flujos de trabajo intensivos en pruebas separados de las escrituras normales.|

Solo `universal` es la línea base reservada. `governance` y `zk` son opciones de perfil SORA codificadas en el catálogo y la política de enrutamiento incluidos; los operadores pueden definir un catálogo diferente cuando necesiten diferentes límites de espacio de datos.

Sumeragi siempre utiliza la disponibilidad de datos y la transmisión confiable. Estos caminos forman parte del protocolo de consenso Iroha 3 y no se pueden desactivar mediante un perfil de implementación.

El comportamiento en tiempo de ejecución del software se origina a partir de archivos de configuración y parámetros en la cadena. Las variables de entorno no son puertas de función de producción.

## Leer siguiente {#read-next}

- [SORA Nexus servicios](/es/blockchain/sora-nexus-services.md)
- [Lanzar Iroha 3](/es/get-started/launch-iroha.md)
- [Mundo, WSV, y almacenamiento Kura](/es/blockchain/world.md)
- [referencia de génesis de blockchain](/es/reference/genesis.md)
- [Torii API puntos finales](/es/reference/torii-endpoints.md)
