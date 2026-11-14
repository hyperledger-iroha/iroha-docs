---
translation_locale: es
translation_source: /blockchain/iroha-explained.md
translation_source_hash: 426adbea88da36cd92da17d8665c956a57b9d4cebfa0d2f35bc75469cccf84ee
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
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

- los espacios de datos proporcionan entornos para los datos institucionales, la autoridad, las políticas y las aplicaciones
- los carriles proporcionan capacidad de enrutamiento y certificación dentro de esos entornos
- una raíz de espacio de datos firmada de forma independiente es titular de su propio State y de su finalidad local

## Espacios de datos y raíces de ejecución {#multi-dataspace-architecture}

Una entrada del catálogo de espacios de datos define un entorno y su identidad. Una entrada del catálogo por sí sola no establece una raíz de ejecución independiente. Los carriles públicos certifican lotes de transacciones para su ejecución en la cadena global; una raíz de espacio de datos firmada de forma independiente tiene su propio State, comité y finalidad local.

`DataSpaceCatalog` define espacios de datos, mientras que `LaneCatalog` define carriles. Cada carril hace referencia a exactamente un espacio de datos mediante `dataspace_id`; un espacio de datos puede contener varios carriles. `DataSpaceId` y `LaneId` son identidades distintas, y un alias de carril no crea otro espacio de datos.

Durante la ejecución, un espacio de datos se representa mediante un `DataSpaceId` numérico y metadatos del catálogo. `DataSpaceId::UNIVERSAL` está reservado como `0`; el catálogo predeterminado contiene el espacio de datos `universal`. Cada espacio de datos configurado tiene:

- un ID numérico único
- un alias único como `universal` o un nombre institucional registrado explícitamente
- una descripción opcional para las superficies del operador
- un valor `fault_tolerance` distinto de cero usado para dimensionar comités de relevos

Los carriles son los recursos de enrutamiento y certificación vinculados a esos espacios de datos. Una entrada de carril contiene un `LaneId`, el `DataSpaceId` al que sirve, un alias, la visibilidad (`public` o `restricted`), el perfil de almacenamiento (`full_replica`, `commitment_only` o `split_replica`), el esquema de prueba y, opcionalmente, metadatos de gobernanza, liquidación y planificación. El entorno de ejecución deriva de este catálogo la geometría de almacenamiento de cada carril, incluidos los nombres de segmentos de Kura y los prefijos deterministas de claves.

La ruta de enrutamiento es:

1. La configuración construye un `DataSpaceCatalog`, un `LaneCatalog` y una `LaneRoutingPolicy` validados. El enrutamiento de SORA Nexus es obligatorio. Para utilizar varios espacios de datos, varios carriles o un enrutamiento distinto del predeterminado, se emplean el perfil de SORA Nexus (`--sora`) y NPoS.
2. La cola de transacciones determina un `RoutingPlan` a partir de la transacción y del estado confirmado. Cada ruta de coordinador o participante contiene un identificador de carril y otro de espacio de datos; los planes de AMX nativo conservan el conjunto completo de participantes.
3. Para la ejecución global, los lotes completos del plano de control y los coordinadores entre espacios de datos utilizan el carril `0`. Los destinos concretos no universales de instrucciones o direcciones de contratos seleccionan un carril fijo admitido con el espacio de datos y el comité correspondientes, antes de aplicar las reglas de cuentas o de etiquetas de instrucciones. El resto del trabajo sigue las reglas explícitas confirmadas y el particionado predeterminado; los destinos universales concretos permanecen en carriles universales.
4. Cada ruta se comprueba frente a los catálogos y al estado activo de los carriles. Se rechazan los identificadores desconocidos y las discrepancias entre carriles y espacios de datos; un destino privado no disponible no puede recurrir a la ejecución universal. Los destinos en varios espacios de datos pueden generar un plan de AMX nativo. Si el metadato de transacción `amx_policy` se establece en `reject_cross_dataspace`, se rechazan los planes entre espacios de datos. Un plan de enrutamiento por sí solo no autoriza ni completa la liquidación entre raíces independientes.
5. Sumeragi y la telemetría mantienen visible la asignación mediante la actividad, el trabajo pendiente y las instantáneas de compromisos de los carriles y espacios de datos.

Por eso importan los identificadores de objetos. Los dominios incluyen el alias del espacio de datos en su ID, por ejemplo `payments.universal`, por lo que las escrituras con alcance de dominio se pueden enrutar. Las cuentas permanecen canónicas y sin dominio, de modo que la misma cuenta puede vincularse en diferentes ámbitos de aplicación sin cambiar su `AccountId`. Las definiciones de activos pueden llevar una proyección de dominio/espacio de datos, lo que permite que las operaciones de activos hereden la ruta correcta del espacio de datos.

Sin ajustes específicos de SORA Nexus, el nodo utiliza un único carril y el espacio de datos `universal`. El perfil incluido de SORA Nexus lo sustituye por un catálogo de tres carriles: `core` para el carril público universal, `governance` para el tráfico de gobernanza y `zk` para el tráfico de adjuntos de conocimiento cero y de despliegue de contratos.

Los tres carriles incluidos son públicos y hacen referencia al mismo espacio de datos `universal`. Separan las clases de cargas de trabajo:

| Espacio de datos | Carril | Por qué existe |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `universal` | `core` | Tráfico habitual del libro mayor público y enrutamiento predeterminado. |
| `universal` | `governance` | Gobernanza pública y tráfico de SORA Parliament. |
| `universal` | `zk` | Tráfico público de adjuntos de conocimiento cero y de despliegue de contratos. |

`DataSpaceId::UNIVERSAL == 0` es el valor de referencia reservado. Los nombres `governance` y `zk` anteriores identifican carriles, no espacios de datos independientes. Para establecer límites institucionales distintos se necesitan entradas explícitas de espacios de datos; la ejecución independiente requiere además una raíz autenticada de forma independiente.

Estas relaciones están definidas por los [constructores de perfiles](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_config/src/parameters/actual.rs), la [implementación de carriles](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_core/src/sumeragi/lanes/mod.rs) y el [contrato de raíces independientes](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/specs/sumeragi.md) de la revisión fijada.

Sumeragi siempre utiliza la disponibilidad de datos y la transmisión confiable. Estos caminos forman parte del protocolo de consenso Iroha 3 y no se pueden desactivar mediante un perfil de implementación.

El comportamiento en tiempo de ejecución del software se origina a partir de archivos de configuración y parámetros en la cadena. Las variables de entorno no son puertas de función de producción.

## Leer siguiente {#read-next}

- [SORA Nexus servicios](/es/blockchain/sora-nexus-services.md)
- [Lanzar Iroha 3](/es/get-started/launch-iroha.md)
- [Mundo, WSV, y almacenamiento Kura](/es/blockchain/world.md)
- [referencia de génesis de blockchain](/es/reference/genesis.md)
- [Torii API puntos finales](/es/reference/torii-endpoints.md)
