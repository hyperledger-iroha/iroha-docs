---
translation_locale: es
translation_source: /guide/best-practices/data-modeling.md
translation_source_hash: 423f8c17d5d7072d1733ccac2337d70243f6e725f7786e9f2fc7052b0dc7444d
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Modelado de datos {#data-modeling}

Los datos del libro mayor de blockchain deben modelarse en torno a la propiedad, el comportamiento de transferencia, los límites de permisos y los patrones de consulta. Elija la representación más pequeña en cadena que pueda soportar la verificabilidad y la ejecución determinista.

## Dominios y Cuentas {#domains-and-accounts}

- Usa dominios para representar límites administrativos y de políticas. Mantén los nombres de los dominios estables porque aparecen en los identificadores de cuentas y activos.
- Evite sobrecargar una sola cuenta con responsabilidades no relacionadas. Utilice cuentas separadas para usuarios, servicios, disparadores, operadores y patrocinadores de tarifas.
- Use identificadores canónicos de cuenta y dominio en la configuración y pruebas. Los nombres Iroha distinguen entre mayúsculas y minúsculas después del análisis canónico.
- Mantenga las identidades de prueba y de producción visiblemente distintas en nombres, dominios y rutas de archivos de configuración.

Vea [Dominios](/es/blockchain/domains.md), [Cuentas](/es/blockchain/accounts.md) y [Nombrando](/es/reference/naming.md).

## Activos y NFTs {#assets-and-nfts}

- Utilice activos numéricos para saldos fungibles y cantidades transferibles.
- Use NFTs u objetos específicos del dominio para registros de propiedad única.
- Evite codificar el estado con valor únicamente en los metadatos. Los activos y NFTs proporcionan eventos del ciclo de vida, semántica de transferencia y verificaciones de permisos que los metadatos no ofrecen.
- Define precisión, política de suministro, responsabilidad del emisor y principio de autorización de quema/mint antes de exponer un activo a aplicaciones.

Vea [Activos](/es/blockchain/assets.md), [NFTs](/es/blockchain/nfts.md) y [RWAs](/es/blockchain/rwas.md).

## Metadatos {#metadata}

- Utilice metadatos para atributos compactos de los objetos del libro mayor de la blockchain, como etiquetas, ID de integración, banderas de políticas, hashes criptográficos, URIs o referencias direccionadas por contenido.
- Mantenga las claves de metadatos estables y documentadas. Cambiar los nombres de las claves después de que los clientes dependen de ellas crea un problema de migración.
- No almacene documentos grandes, registros, datos privados de usuarios ni el estado de aplicaciones de alta rotación directamente en los metadatos.
- Cuando los metadatos apuntan a datos fuera de la cadena, almacena una referencia verificable, como un hash criptográfico de contenido, URI, SoraFS ruta, referencia de manifiesto técnico o compromiso compacto.

Vea [Opciones de almacenamiento de metadatos y libro mayor blockchain](/es/guide/configure/metadata-and-store-assets.md) y [Metadatos](/es/blockchain/metadata.md).

## Permisos por modelo {#permissions-by-model}

- Diseña los roles en torno a las operaciones comerciales, no en torno a las conveniencias de implementación. Un rol nombrado según un trabajo o servicio es más fácil de auditar que un rol nombrado según una capacidad técnica amplia.
- Limita los tokens de permiso al objeto más pequeño que satisfaga el flujo de trabajo.
- Trata los permisos para emitir, quemar, gestión de pares de red, cambios de ejecutores, gestión de desencadenadores y mutación de metadatos como permisos de alto impacto.
- Agregue procedimientos explícitos de revocación y rotación para permisos temporales.

Vea [Permisos](/es/blockchain/permissions.md) y [Tokens de permiso](/es/reference/permissions.md).

## Forma de consulta {#query-shape}

- Elija identificadores y claves de metadatos que respalden las consultas que su aplicación necesitará con más frecuencia.
- Paginación de conjuntos de resultados amplios y evitar interfaces de usuario que requieran escaneos sin restricciones de todo el libro mayor para acciones normales.
- Mantenga los índices fuera de la cadena reconstruibles a partir de los datos del libro mayor de blockchain y de los eventos siempre que se utilicen para el comportamiento crítico de la aplicación.
