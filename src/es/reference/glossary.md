---
translation_locale: es
translation_source: /reference/glossary.md
translation_source_hash: ab484310e7e0b0662c1d4bb133e7ae337c71b09b5fdc8e678581234d74ee9b29
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Glosario <!-- omit in toc --> {#glossary}

Aquí puedes encontrar definiciones de todas las entidades relacionadas con Iroha.

- [par de red](#peer)
- [Activo](#asset)
- [Tolerancia a fallos bizantina (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha Componentes](#iroha-components)
  - [Sumeragi (Emperador)](#sumeragi-emperor)
  - [Torii (Puerta)](#torii-gate)
  - [Kura (Almacén)](#kura-warehouse)
  - [Kagami(Maestro y Ejemplar y/o espejo)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Árbol de Merkle (árbol hash criptográfico)](#merkle-tree-hash-tree)
  - [Contratos inteligentes](#smart-contracts)
  - [Desencadenantes](#triggers)
  - [Control de versiones](#versioning)
  - [Hijiri (sistema de reputación de pares en la red)](#hijiri-peer-reputation-system)
- [Iroha Módulos](#iroha-modules)
- [Iroha Operaciones de instrucción (ISI)](#iroha-special-instructions-isi)
  - [Operaciones de instrucciones de utilidad Iroha](#utility-iroha-special-instructions)
  - [Operaciones de instrucción núcleo Iroha](#core-iroha-special-instructions)
  - [Operaciones de instrucción específicas del dominio Iroha](#domain-specific-iroha-special-instructions)
  - [Instrucción Especial Personalizada Iroha](#custom-iroha-special-instruction)
- [Iroha Consulta](#iroha-query)
- [Ver cambio](#view-change)
- [Vista del estado mundial (WSV)](#world-state-view-wsv)
- [Líder](#leader)

## Libros contables de blockchain {#blockchain-ledgers}

Los libros mayores de blockchain son sistemas digitales de registro que utilizan la tecnología blockchain para mantener registros financieros. Estos reciben su nombre de los libros tradicionales que se usaban para registros financieros como precios, noticias e información de transacciones.

Durante la época medieval, los libros de contabilidad en blockchain estaban abiertos para la visualización pública y la verificación de su exactitud. Esta idea se refleja en los sistemas basados en blockchain que pueden verificar la validez de los datos almacenados.

## par de red {#peer}

Un par de red en Iroha significa una instancia de proceso Iroha a la que otros procesos Iroha y aplicaciones cliente pueden conectarse. Una sola máquina puede albergar varios pares de red Iroha. Los pares de la red son iguales en cuanto a sus recursos y capacidades, con una excepción importante: solo uno de los pares de la red ejecuta el bloque génesis de la cadena de bloques en la etapa de arranque de la red Iroha.

Otras cadenas de bloques pueden referirse al mismo concepto como un nodo o un validador.

Un par de red puede ser un proceso en su sistema host. También puede estar contenido en un contenedor Docker y en un pod de Kubernetes.

## Activo {#asset}

En el contexto de las cadenas de bloques, un activo es la representación de un objeto valioso en la cadena de bloques.

Información adicional sobre los activos está disponible [aquí](/es/blockchain/assets.md).

### Activos fungibles {#fungible-assets}

Tales activos pueden ser fácilmente intercambiados por otros activos del mismo tipo porque son intercambiables.

Como ejemplo, todas las unidades de la misma moneda son iguales en su valor y pueden usarse para comprar bienes. Normalmente, los activos fungibles son idénticos en apariencia, aparte del desgaste de los billetes y monedas.

### Activos no fungibles {#non-fungible-assets}

Los activos no fungibles son únicos y valiosos debido a sus características específicas y rareza; su valor no se puede comparar con el de otros activos.

- El valor de una pintura puede variar según el artista, el período de tiempo en que fue pintada y el interés del público en ella.
- Dos casas en la misma calle pueden tener diferentes niveles de mantenimiento.
- Los fabricantes de joyas suelen ofrecer una variedad de diseños diferentes.

### Activos acuñables {#mintable-assets}

Un activo es acuñable si se puede emitir más del mismo tipo.

### Activos no acuñables {#non-mintable-assets}

Si la cantidad inicial de un activo se especifica una vez y no cambia, se considera no acuñable.

El [bloque génesis de blockchain](/es/guide/configure/genesis.md) establece esta información para la configuración Iroha.

## Tolerancia a fallos bizantina (BFT) {#byzantine-fault-tolerance-bft}

La propiedad de poder funcionar correctamente con una red que contiene un cierto porcentaje de actores maliciosos. Iroha es capaz de funcionar con hasta un 33% de actores maliciosos en su red peer-to-peer.

## Iroha Componentes {#iroha-components}

Rust módulos que contienen la funcionalidad de Iroha.

### Sumeragi (Emperador) {#sumeragi-emperor}

El módulo Iroha responsable del consenso.

### Torii (Puerta) {#torii-gate}

Módulo con la lógica de manejo de solicitudes entrantes para el [par de red](#peer). Se utiliza para recibir, aceptar y enrutar instrucciones entrantes, y consultas HTTP, así como actualizaciones de configuración en tiempo de ejecución.

### Kura (Almacén) {#kura-warehouse}

Almacenamiento persistente de bloques. Kura guarda en disco los bloques firmados, sus hashes, los índices de altura, los archivos auxiliares de recuperación y los metadatos de la lista de confirmación. La [Vista del Estado Mundial](#world-state-view-wsv) se reconstruye a partir de los bloques de Kura cuando no hay una instantánea de estado o esta está retrasada con respecto al almacén local de bloques. Consulte [Almacenamiento Kura](/es/blockchain/world.md#kura-storage).

### Kagami(Maestro y Ejemplar y/o espejo) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Generador de datos de uso común. Puede generar pares de claves criptográficas, bloques génesis de blockchain, documentación, etc.

### Árbol de Merkle (árbol hash criptográfico) {#merkle-tree-hash-tree}

Una estructura de datos utilizada para validar y verificar el estado en cada altura de bloque. La implementación actual de Iroha es un árbol binario. Consulte [Wikipedia](https://en.wikipedia.org/wiki/Merkle_tree) para más detalles.

### Contratos inteligentes {#smart-contracts}

Los contratos inteligentes son programas basados en blockchain que se ejecutan cuando se cumple un conjunto específico de condiciones. En Iroha los contratos inteligentes se implementan utilizando [operaciones de instrucciones centrales Iroha](#core-iroha-special-instructions).

### Desencadenantes {#triggers}

Un tipo de evento que permite invocar una instrucción especial Iroha en un commit de bloque específico, en un momento determinado (con algunas advertencias), etc. Más sobre disparadores [aquí](/es/blockchain/triggers.md).

### Control de versiones {#versioning}

Cada solicitud está etiquetada con la versión de la API a la que pertenece. Esto permite que distintas versiones binarias del software cliente y de pares de Iroha interoperen, lo que a su vez permite actualizar el software de la red Iroha.

### Hijiri (sistema de reputación de pares en la red) {#hijiri-peer-reputation-system}

El sistema de reputación de Iroha. Permite priorizar la comunicación con [pares de red](#peer) que tienen un buen historial y reducir el daño que puede ser causado por [pares de red](#peer) malintencionados.

## Iroha Módulos {#iroha-modules}

Extensiones de terceros para Iroha que proporcionan funcionalidad personalizada.

## Iroha Operaciones de instrucción (ISI) {#iroha-special-instructions-isi}

Una biblioteca de contratos inteligentes proporcionada con Iroha. Estos se pueden invocar mediante transacciones o mediante escuchas de eventos registrados. Más información en ISI [aquí](/es/blockchain/instructions.md).

#### Operaciones de instrucciones de utilidad Iroha {#utility-iroha-special-instructions}

Este conjunto de [isi](#iroha-special-instructions-isi) contiene instrucciones lógicas como `If`, relacionadas con E/S como `Notify` y composiciones como `Sequence`. Se utilizan principalmente como [instrucciones personalizadas](#custom-iroha-special-instruction).

### Operaciones de instrucción núcleo Iroha {#core-iroha-special-instructions}

[Instrucciones especiales](#iroha-special-instructions-isi) proporcionado con cada despliegue de Iroha. Estos incluyen algunos [específico del dominio](#domain-specific-iroha-special-instructions) así como [instrucciones de utilidad](#utility-iroha-special-instructions).

### Operaciones de instrucción específicas del dominio Iroha {#domain-specific-iroha-special-instructions}

Instrucciones relacionadas con actividades específicas del dominio: activos, cuentas, dominios, gestión de pares de red). Estas proporcionan las herramientas necesarias para realizar cambios en el [Vista del Estado Mundial](#world-state-view-wsv) de manera segura y protegida.

### Instrucción Especial Personalizada Iroha {#custom-iroha-special-instruction}

Instrucciones proporcionadas en [Iroha Módulos](#iroha-modules), por clientes o terceros. Estas solo pueden ser construidas utilizando [las Instrucciones Principales](#core-iroha-special-instructions). No se recomienda bifurcar y modificar el código fuente de Iroha. Las operaciones de instrucción que no sean acordadas por [pares de red](#peer) en un despliegue de Iroha serán tratadas como fallos, por lo que [pares de red](#peer) que ejecute una instancia modificada tendrá su acceso revocado.

## Iroha Consulta {#iroha-query}

Una solicitud para leer la Vista del Estado Mundial sin modificar dicha vista. Más sobre consultas [aquí](/es/blockchain/queries.md).

## Cambiar vista {#view-change}

Un proceso que tiene lugar en caso de un intento fallido de consenso. Por lo general, esto implica la elección de un nuevo [Líder](#leader).

## Vista del estado mundial (WSV) {#world-state-view-wsv}

Representación en memoria del estado actual de la cadena de bloques. El WSV contiene el `World`, los hashes criptográficos de los bloques comprometidos, los índices de transacciones, topología de consenso y los índices derivados utilizados por las consultas. Se actualiza solo a través de bloques comprometidos y puede reconstruirse a partir de [Kura](#kura-warehouse). Véase [Vista del Estado Mundial](/es/blockchain/world.md#world-state-view-wsv).

## Líder {#leader}

En una red Iroha, un par de la red se selecciona al azar y se le concede el privilegio especial de formar el siguiente bloque. Este privilegio puede ser revocado en redes que logran [Tolerancia a fallos bizantinos](#byzantine-fault-tolerance-bft) a través de [cambio de vista](#view-change).
