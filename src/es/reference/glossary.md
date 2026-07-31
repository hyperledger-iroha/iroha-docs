---
translation_locale: es
translation_source: /reference/glossary.md
translation_source_hash: fe3bc2d62ca81b5e6e30023407f3c900eb4026b6668f0d422728a8eedd436148
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Glosario <!-- omit in toc --> {#glossary}

Aquí se pueden encontrar las definiciones de todas las entidades relacionadas con Iroha.

- [Peer](#peer)
- [Propiedad ](#asset)
- [Tolerancia por fallos bizantina (BFT) ](#byzantine-fault-tolerance-bft)
- [Iroha Componentes](#iroha-components)
  - [Sumeragi (emperador)](#sumeragi-emperor)
  - [Torii (puerta) ](#torii-gate)
  - [Kura (deposito) ](#kura-warehouse)
  - [Kagami(Maestro y ejemplar y/o espejo de observación)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Árbol de Merkle (árbol de hasch) ](#merkle-tree-hash-tree)
  - [Los contratos inteligentes ](#smart-contracts)
  - [Los desencadenantes ](#triggers)
  - [Versión ](#versioning)
  - [Hijiri (sistema de reputación entre pares) ](#hijiri-peer-reputation-system)
- [Iroha Modulos](#iroha-modules)
- [Iroha Instrucciones especiales (ISI) ](#iroha-special-instructions-isi)
  - [Utilidad Iroha Instrucciones especiales](#utility-iroha-special-instructions)
  - [Núcleo Iroha Instrucciones especiales](#core-iroha-special-instructions)
  - [Específico de dominio Iroha Instrucciones especiales](#domain-specific-iroha-special-instructions)
  - [Alcanzado Iroha Instrucción especial](#custom-iroha-special-instruction)
- [Iroha Pregunta](#iroha-query)
- [Cambios de vista](#view-change)
- [Vista del estado mundial (WSV) ](#world-state-view-wsv)
- [Líder](#leader)

## Registros de bloques {#blockchain-ledgers}

Los libros de contabilidad Blockchain son sistemas digitales de registro que utilizan la tecnología blockchain para mantener registros financieros. Estos tienen el nombre de los libros antiguos que se usaron para registros financiarios como precios, noticias e información de transacciones.

Durante la Edad Media, los libros de contabilidad estaban abiertos para su visualización pública y verificación de exactitud.

## Compañero {#peer}

Un peer en Iroha significa una instancia de proceso Iroha a la que pueden conectarse otros procesos y aplicaciones del cliente Iroha. Una sola máquina puede alojar varios pares Iroha. Los pares son iguales en cuanto a sus recursos y capacidades, con una importante excepción: sólo uno de los pares ejecuta el bloque genético en la etapa de arranque de la red Iroha.

Otras cadenas de bloques pueden referirse al mismo concepto que un nodo o un validador.

Un peer puede ser un proceso en su sistema de hospedaje. También puede contenerse en un recipiente Docker y una cápsula Kubernetes.

## Activos {#asset}

En el contexto de las cadenas blockchain, un activo es la representación de un objeto valioso en la cadena de bloques.

Información adicional sobre los activos está disponible en [en ](/es/blockchain/assets.md).

### Activos funcionales {#fungible-assets}

Estos activos pueden ser fácilmente intercambiados por otros activos del mismo tipo, ya que son intercambiables.

Por ejemplo, todas las unidades de la misma moneda son iguales en valor y se pueden utilizar para comprar bienes.

### Activos no fungibles {#non-fungible-assets}

Los activos no fungibles son únicos y valiosos debido a sus características específicas y su rareza; su valor no puede compararse con otros activos.

- El valor de una pintura puede variar según el artista, el período de tiempo en que fue pintada y el interés del público por ella.
- Dos casas en una misma calle pueden tener diferentes niveles de mantenimiento.
- Los fabricantes de joyas suelen ofrecer una variedad de diseños diferentes.

### Activos de mantenimiento {#mintable-assets}

Un activo es mintable si se pueden emitir más del mismo tipo.

### Activos no rentables {#non-mintable-assets}

Si el importe inicial de un activo se especifica una vez y no cambia, se considera que no es rentable.

El bloque [Genesis](/es/guide/configure/genesis.md) establece esta información para la configuración Iroha.

## Tolerancia por fallas bizantina (BFT) {#byzantine-fault-tolerance-bft}

Propiedad de poder funcionar correctamente con una red que contiene un cierto porcentaje de actores maliciosos. Iroha es capaz de funcionar con hasta 33% de actores malintencionados en su red peer-to-peer.

## Componentes Iroha {#iroha-components}

Los módulos Rust que contienen la funcionalidad de Iroha.

### Sumeragi (emperador) {#sumeragi-emperor}

El módulo Iroha responsable del consenso.

### Torii (puerta) {#torii-gate}

Modulo con la lógica de manejo de las solicitudes entrantes para el [peer](#peer). Se utiliza para recibir, aceptar y encaminar instrucciones entrantes y consultas HTTP, así como actualizaciones de configuración en tiempo de ejecución.

### Kura (almacén) {#kura-warehouse}

Almacenamiento de bloques persistentes. Kura almacenan bloques firmados, hashes de bloques, índices de altura, carros laterales de recuperación y metadatos de commit-roster en el disco. [La visión del mundo](#world-state-view-wsv) se reconstruye a partir de Kura bloquea cuando una instantánea del estado no está disponible o detrás de la tienda local. Ver [Kura almacenamiento](/es/blockchain/world.md#kura-storage).

### Kagami(Enseñador y Ejemplo y/o espejo) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Generador de datos comúnmente utilizados. Puede generar pares de claves criptográficas, bloques de génesis, documentación, etc.

### Árbol de Merkle (árbol de hasch) {#merkle-tree-hash-tree}

Una estructura de datos utilizada para validar y verificar el estado en cada altura del bloque. La implementación actual de Iroha es un árbol binario. Ver [ Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree) para más detalles.

### Los contratos inteligentes {#smart-contracts}

Los contratos inteligentes son programas basados en la cadena de bloques que se ejecutan cuando se cumplen un conjunto específico de condiciones. En Iroha los contratos inteligentes se implementan utilizando el [core Iroha instrucciones especiales](#core-iroha-special-instructions).

### Los desencadenantes {#triggers}

Un tipo de evento que permite invocar una instrucción especial Iroha en un bloque específico, tiempo (con algunas advertencias), etc. Más información sobre los desencadenantes [ aquí ](/es/blockchain/triggers.md).

### Edición de versiones {#versioning}

Cada solicitud está etiquetada con la versión API a la que pertenece. Permite que una combinación de diferentes versiones binarias del software cliente/peer Iroha funcione entre sí, lo que a su vez permite actualizaciones de software en la red Iroha.

### Hijiri (sistema de reputación entre pares) {#hijiri-peer-reputation-system}

Iroha El sistema de reputación permite priorizar la comunicación [los pares](#peer) que tienen un buen historial, y la reducción del daño que puede ser causada por maliciosos [los pares](#peer).

## Los módulos Iroha {#iroha-modules}

Extensiones de terceros a Iroha que proporcionan funcionalidades personalizadas.

## Instrucciones especiales Iroha (ISI) {#iroha-special-instructions-isi}

Una biblioteca de contratos inteligentes proporcionada con Iroha. Estos pueden ser invocados a través de transacciones o oyentes registrados de eventos. Más información en ISI [aquí](/es/blockchain/instructions.md).

#### Utilidad Iroha Instrucciones especiales {#utility-iroha-special-instructions}

Este conjunto de [de la misma](#iroha-special-instructions-isi) contiene instrucciones lógicas como: `If`, Relacionados con la entrada y salida `Notify` y composiciones como `Sequence`. Se utilizan principalmente como [instrucciones personalizadas](#custom-iroha-special-instruction).

### Núcleo Iroha Instrucciones especiales {#core-iroha-special-instructions}

[Instrucciones especiales](#iroha-special-instructions-isi) con todas las Iroha En la actualidad, los Estados miembros han puesto en marcha una serie de [Específico de dominio](#domain-specific-iroha-special-instructions) así como [instrucciones de utilidad](#utility-iroha-special-instructions).

### Instrucciones especiales específicas del dominio Iroha {#domain-specific-iroha-special-instructions}

Instrucciones relacionadas con las actividades específicas de los dominios: activos, cuentas, dominios, gestión entre pares). Estos proveen las herramientas necesarias para hacer cambios a la [La visión del mundo](#world-state-view-wsv) de una manera segura y segura.

### Artículo 1o Iroha Instrucción especial {#custom-iroha-special-instruction}

Las instrucciones proporcionadas en: [Iroha Los módulos](#iroha-modules), Los clientes o terceros pueden construirlos sólo utilizando [Las instrucciones básicas](#core-iroha-special-instructions). Forjación y modificación de la Iroha No se recomienda el código fuente, ya que las instrucciones especiales no están acordadas por [los pares](#peer) en un Iroha el despliegue se tratará como fallos, por lo que [los pares](#peer) ejecutar una instancia modificada tendrá su acceso revocado.

## Encuesta Iroha {#iroha-query}

Una solicitud para leer la Vista del estado mundial sin modificar dicha vista. Más información sobre consultas [en ](/es/blockchain/queries.md).

## Vea el cambio {#view-change}

Un proceso que se lleva a cabo en caso de un intento fallido de consenso. Por lo general, esto implica la elección de un nuevo [líder](#leader).

## Vista del estado mundial (WSV) {#world-state-view-wsv}

Representación en memoria del estado actual de la cadena de bloques. El WSV contiene los `World`, hashes de bloque comprometidos, índices de transacciones, topología de consenso e índices derivados utilizados por consultas. Se actualiza solo a través de bloques comprometidos y se puede reconstruir desde [Kura](#kura-warehouse). Ver [ World State View](/es/blockchain/world.md#world-state-view-wsv).

## Líder {#leader}

En una red iroha, se selecciona al azar a un par y se le otorga el privilegio especial de formar el siguiente bloque. Este privilegio puede ser revocado en las redes que logren [Torencia de fallas bizantina](#byzantine-fault-tolerance-bft) a través de [cambio de vista](#view-change).
