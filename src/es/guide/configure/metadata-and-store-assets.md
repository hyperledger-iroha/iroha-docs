---
translation_locale: es
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Metadatos y opciones de almacenamiento en contabilidad {#metadata-and-ledger-storage-choices}

El modelo de datos Iroha 3 no tiene ningún tipo de activo separado `Store` para los datos arbitrarios sobre el valor clave.

## Metadatos {#metadata}

Utilizar [metadatos](/es/blockchain/metadata.md) para campos pequeños JSON que pertenecen a un objeto de libro mayor:

- muestra nombres y etiquetas
- integración IDs
- pequeñas banderas políticas
- los hashes URIs, CIDs o SoraFS que apuntan a cargas útiles más grandes;

Los metadatos son parte del estado mundial y se devuelven con el objeto que los posee. Mantenga las claves estables, los valores compactos y los permisos explícitos. No almacene documentos grandes, registros o estados de aplicaciones de alta frecuencia directamente en los metadatos.

## Activos numéricos y NFTs {#numeric-assets-and-nfts}

Utilizar los activos [](/es/blockchain/assets.md) y [NFTs](/es/blockchain/nfts.md) cuando el estado sea valioso:

- Activos numéricos para saldos fungibles
- NFTs para los registros de propiedad única
- [RWAs](/es/blockchain/rwas.md) y otros objetos específicos del dominio cuando el modelo de datos activo los expone.

Los activos y NFTs tienen sus propios IDs, eventos del ciclo de vida, comportamiento de transferencia y verificaciones de permisos. Son mejores que los metadatos cuando la propiedad, la escasez o el historial de transferencias son importantes.

## Datos fuera de la cadena {#off-chain-data}

Usar almacenamiento fuera de la cadena para cargas útiles grandes o mutables.

- un hash de contenido
- a URI
- un camino SoraFS o una referencia manifiesta
- un compromiso compacto utilizado por una prueba de solicitud

Esto mantiene el WSV pequeño mientras que permite a las aplicaciones verificar si la carga útil fuera de la cadena coincide con la referencia en la cadena.

## Escogiendo un lugar {#choosing-a-location}

Utilice esta regla general:

- Si es un atributo compacto de un objeto de libro mayor, utilice metadatos.
- Si es de valor o transferible, se debe modelarlo como un activo, NFT, o como objeto específico del dominio.
- En caso de que sea grande, con un alto rendimiento o para aplicaciones privadas, guardarlo fuera del WSV y poner una referencia verificable en la cadena.

Para los permisos de metadatos, véase [Token de permiso ](/es/reference/permissions.md).
