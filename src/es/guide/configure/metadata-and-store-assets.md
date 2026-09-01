---
translation_locale: es
translation_source: /guide/configure/metadata-and-store-assets.md
translation_source_hash: b538b2cad11d4fd3b2b7d201a20882389049d3e4453f11baa6f854861bda6b51
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Opciones de almacenamiento de metadatos y libro mayor blockchain {#metadata-and-ledger-storage-choices}

El modelo de datos Iroha 3 no tiene un tipo de activo `Store` separado para datos arbitrarios de clave-valor. Use las siguientes opciones de almacenamiento.

## Metadatos {#metadata}

Usa [metadatos](/es/blockchain/metadata.md) para pequeños campos JSON que pertenecen a un objeto del libro mayor de la blockchain:

- nombres para mostrar y etiquetas
- IDs de integración
- pequeñas banderas de política
- hashes criptográficos, URIs, CIDs o SoraFS rutas que apuntan a cargas útiles más grandes

Los metadatos son parte del estado mundial y se devuelven con el objeto que los posee. Mantén las claves estables, los valores compactos y los permisos explícitos. No almacenes documentos grandes, registros o estado de aplicaciones de alta rotación directamente en los metadatos.

## Activos Numéricos y NFTs {#numeric-assets-and-nfts}

Use [activos](/es/blockchain/assets.md) y [NFTs](/es/blockchain/nfts.md) cuando el estado tiene valor:

- activos numéricos para saldos fungibles
- NFTs para registros de propiedad única
- [RWAs](/es/blockchain/rwas.md) y otros objetos específicos del dominio cuando el modelo de datos activo los expone

Los activos y NFTs tienen sus propios IDs, eventos del ciclo de vida, comportamiento de transferencia y verificaciones de permisos. Son mejores que los metadatos cuando importa la propiedad, la escasez o el historial de transferencias.

## Datos fuera de la cadena {#off-chain-data}

Utilice almacenamiento fuera de la cadena para cargas útiles grandes o mutables. Almacene solo una referencia estable en la cadena, como:

- un hash criptográfico de contenido
- un URI
- una ruta SoraFS o referencia de manifiesto técnico
- un compromiso compacto utilizado por una prueba de aplicación

Esto mantiene el WSV pequeño al mismo tiempo que permite a las aplicaciones verificar que la carga fuera de la cadena coincide con la referencia en la cadena.

## Elegir una ubicación {#choosing-a-location}

Usa esta regla general:

- Si es un atributo compacto de un objeto del libro mayor de blockchain, usa metadatos.
- Si tiene valor o es transferible, modelarlo como un activo, NFT, o un objeto específico del dominio.
- Si es grande, de alta rotación o privada de la aplicación, guárdelo fuera del WSV y ponga una referencia verificable en la cadena.

Para los permisos de metadatos, vea [Tokens de permiso](/es/reference/permissions.md).
