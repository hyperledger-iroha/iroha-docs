---
translation_locale: es
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Un Iroha NFT es un objeto de libro mayor único con un solo propietario. Use NFTs cuando un registro necesita su propia identidad, metadatos, eventos del ciclo de vida y semántica de transferencia de propiedad, pero no necesita un equilibrio numérico.

A diferencia de un número [activo](/es/blockchain/assets.md), una NFT No tiene precisión, capacidad de extracción ni cantidades por cuenta. NFT existe como un solo objeto registrado, y la propiedad se rastrea directamente en ese objeto.

## La estructura {#structure}

Un `Nft` registrado contiene:

- `id`: un `NftId`
- `content`: metadatos que describen el NFT
- `owned_by`: la cuenta que posee el NFT

El campo `content` es un mapa de `Metadata`. Manténgalo compacto: almacene campos descriptivos, referencias estables, hashes, rutas URIs o SoraFS allí. Almacenar documentos grandes, medios o aplicaciones de alto rendimiento fuera de la cadena y mantener solo una referencia verificable en el NFT.

## Pruébalo en Taira {#try-it-on-taira}

Compruebe si la red de pruebas pública Taira tiene actualmente registros NFT:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Compruebe el documento OpenAPI en vivo para las rutas NFT expuestas por el nodo:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Una matriz vacía `items` es una respuesta válida en una red de prueba pública. Esto significa que no hay NFTs en la página actual, no es que las instrucciones NFT no estén disponibles.

## NFT IDs {#nft-ids}

`NftId` utiliza el siguiente formulario de texto:

```text
name$domain
name$domain.dataspace
```

Por ejemplo, `badge$docs.universal` identifica el `badge` NFT en el dominio `docs.universal`. Si se omite el espacio de datos, el analizador actual utiliza el espacio de información `universal`, por lo que `badge$docs` se resuelve a `badge$docs.universal`.

Utilice nombres estables para NFT IDs. La identidad de objeto utilizada por instrucciones, consultas, permisos, filtros de eventos y referencias de aplicaciones es la ID.

## Ciclo de vida {#lifecycle}

Uso de las operaciones del ciclo de vida NFT Iroha Instrucciones especiales:

- [El `Register`](/es/blockchain/instructions.md#un-register) crea el NFT con la inicial `content`.
- [El `Unregister`](/es/blockchain/instructions.md#un-register) elimina el NFT.
- [`Transfer`](/es/blockchain/instructions.md#transfer) cambios en el `owned_by`.
- [`SetKeyValue` y `RemoveKeyValue`](/es/blockchain/instructions.md#setkeyvalue-removekeyvalue) actualización de los metadatos NFT.

## Prueba en el lugar {#try-it-locally}

Estos ejemplos suponen que ha lanzado una red local y tiene la configuración del cliente generada a partir de la guía [CLI ](/es/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

La red local generada ya establece `wonderland.universal` y su SNS contrato de arrendamiento. Para usar un dominio diferente, crea primero con el flujo de trabajo declarativo `app alias setup plan` y `app alias setup apply` descrito en [Domains](/es/blockchain/domains.md#registration).

Registrar un NFT. En el registro se lee el contenido inicial JSON de la entrada estándar:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Inspeccionar directamente el NFT y luego enumerar todos los NFTs con entradas completas:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Añadir una clave de metadatos y volver a leer el NFT:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Quita la clave de metadatos:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Trasladar opcionalmente la NFT. Utilice `ledger nft get` para leer el propietario actual de `owned_by`, y utilice `ledger account list all` para encontrar una cuenta de destino ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Si ha transferido el NFT, ejecute este comando con la configuración de cuenta del propietario actual o devuelva primero el NFT.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Las preguntas y los acontecimientos {#queries-and-events}

Utilice [`FindNfts`](/es/reference/queries.md#assets-nfts-and-rwas) para enumerar a NFTs y [`FindNftsByAccountId`](/es/reference/queries.md#assets-nfts-and-rwas) para enumorar a NFTs propiedad de una cuenta.

Las actualizaciones de registro, eliminación, transferencia y metadatos NFT emiten eventos de datos de NFT. Utilice el filtro de eventos de datos `Nft` al suscribirse a cambios en el libro mayor o crear disparadores que reaccionen a los eventos del ciclo de vida NFT.

## Las autorizaciones {#permissions}

La superficie de autorización predeterminada incluye fichas específicas para NFT:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Las verificaciones de permisos son ejecutadas por el validador activo de tiempo de ejecución, por lo que una red puede personalizar la autorización mediante la actualización del  El ejecutor. [Tokens de autorización](/es/reference/permissions.md) para la lista actual de tokens predeterminados.

## La elección de NFTs {#choosing-nfts}

Utilice un NFT para registros en los que sea importante la singularidad y la propiedad:

- Certificados, insignias, licencias y certificaciones
- registros de membresía o acceso
- Registros de solicitudes vinculados a la identidad o en cuenta
- referencias a medios, documentos o manifiestos fuera de la cadena;

Utilice un activo numérico para los saldos fungibles, y utilice metadatos [ simples ](/es/blockchain/metadata.md) cuando los datos sean solo un atributo compacto de un objeto de libro mayor existente.

Véase también:

- [Activos ](/es/blockchain/assets.md)
- [Metadatos ](/es/blockchain/metadata.md)
- [Las instrucciones ](/es/blockchain/instructions.md)
- [Las consultas ](/es/blockchain/queries.md)
