---
translation_locale: es
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Modelado de datos {#data-modeling}

Los datos del libro mayor deben ser modelados en torno a la propiedad, el comportamiento de transferencia, los límites de permisos y los patrones de consulta. Elige la representación más pequeña en cadena que pueda apoyar la auditabilidad y la ejecución determinista.

## Dominio y cuentas {#domains-and-accounts}

- Utilice dominios para representar los límites administrativos y políticos. Mantenga los nombres de dominio estables porque aparecen en los identificadores de cuentas y activos.
- Evite sobrecargar una sola cuenta con responsabilidades no relacionadas. Use cuentas separadas para usuarios, servicios, activadores, operadores y patrocinadores de tarifas.
- Utilice los identificadores de cuenta y dominio canónicos en configuración y pruebas. Los nombres Iroha son sensibles al caso después del análisis canónico.
- Mantenga las identidades de prueba y producción visiblemente distintas en los nombres, dominios y vías de archivos de configuración.

Véase [Domaines](/es/blockchain/domains.md), [Cuentas](/es/blockchain/accounts.md) y [Nombre ](/es/reference/naming.md).

## Activos y NFTs {#assets-and-nfts}

- Utilice activos numéricos para los saldos fungibles y las cantidades transferibles.
- Usar NFTs o objetos específicos del dominio para registros de propiedad exclusiva.
- Los activos y NFTs proporcionan eventos del ciclo de vida, la semántica de transferencia y las verificaciones de permisos que los metadatos no hacen.
- Definir la precisión, la política de suministro, la responsabilidad del emisor y la autoridad de quemaduras antes de exponer un activo a las aplicaciones.

Véase [Activos](/es/blockchain/assets.md), [,NFTs](/es/blockchain/nfts.md) y [RWAs](/es/blockchain/rwas.md).

## Metadatos {#metadata}

- Utilice metadatos para los atributos compactos de los objetos del libro mayor, como etiquetas, integración IDs, banderas de políticas, hashes, URIs o referencias dirigidas al contenido.
- Mantener las claves de metadatos estables y documentadas. Cambiar los nombres de las claves después de que los clientes dependen de ellas crea un problema de migración.
- No almacenar documentos grandes, registros, datos de usuarios privados o estados de aplicaciones de alta frecuencia directamente en metadatos.
- Cuando los metadatos apunten a datos fuera de la cadena, almacenar una referencia verificable como un hash de contenido, URI, SoraFS camino, referencia manifiesta o compromiso compacto.

Véase [Metadatos y opciones de almacenamiento del libro mayor](/es/guide/configure/metadata-and-store-assets.md) y [Metadatos ](/es/blockchain/metadata.md).

## Permisos por modelo {#permissions-by-model}

- Los roles de diseño se centran en las operaciones comerciales, no en las comodidades de implementación. Una función nombrada en honor a un trabajo o servicio es más fácil de auditar que una función nombrada por una amplia capacidad técnica.
- Obtenga los tokens de permiso para el objeto más pequeño que satisfaga el flujo de trabajo.
- Trate los permisos para minar, quemar, gestión de pares, cambios de ejecutores, gestión de disparos y mutación de metadatos como permisos de alto impacto.
- Añadir procedimientos de revocación y rotación explícitos para permisos temporales.

Véase [Permisos](/es/blockchain/permissions.md) y [Tokens de permiso ](/es/reference/permissions.md).

## Forma de la consulta {#query-shape}

- Seleccione identificadores y claves de metadatos que respalden las consultas que su aplicación necesitará con mayor frecuencia.
- Paginar conjuntos de resultados amplios y evitar interfaces de usuario que requieren escaneos sin restricciones en todo el libro mayor para las acciones normales.
- Mantenga los índices fuera de la cadena reconstruibles a partir de los datos y eventos del libro mayor siempre que se usen para el comportamiento crítico de las aplicaciones.
