---
translation_locale: es
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

Un Iroha NFT es un objeto único del libro mayor de blockchain con un propietario. Utilice NFTs cuando un registro necesite su propia identidad, metadatos, eventos del ciclo de vida y semántica de transferencia de propiedad, pero no necesite un saldo numérico.

A diferencia de un [activo](/es/blockchain/assets.md) numérico, un NFT no tiene precisión, política de emisión de activos ni cantidades por cuenta. El NFT existe como un objeto registrado único y la propiedad se rastrea directamente en ese objeto.

## Estructura {#structure}

Un `Nft` registrado contiene:

- `id`: un `NftId`
- `content`: metadatos que describen el NFT
- `owned_by`: la cuenta que posee el NFT

El campo `content` es un mapa `Metadata`. Manténgalo compacto: almacene allí campos descriptivos, referencias estables, hashes criptográficos, URIs o rutas SoraFS. Almacene documentos grandes, medios o estado de aplicación de alta rotación fuera de la cadena y mantenga solo una referencia verificable en el NFT.

## Pruébalo en Taira {#try-it-on-taira}

Verifique si la testnet pública Taira actualmente tiene NFT registros:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Verifica el documento en vivo OpenAPI para las rutas NFT expuestas por el nodo:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Un arreglo `items` vacío es una respuesta válida en una testnet pública. Significa que no hay NFTs en la página actual, no que las instrucciones NFT no estén disponibles.

## NFT Identificaciones {#nft-ids}

`NftId` utiliza este formulario de texto:

```text
name$domain
name$domain.dataspace
```

Por ejemplo, `badge$docs.universal` identifica el `badge` NFT en el dominio `docs.universal`. Si se omite el espacio de datos, el analizador actual utiliza el espacio de datos `universal`, por lo que `badge$docs` se resuelve como `badge$docs.universal`.

Use nombres estables para los IDs NFT. El ID es la identidad del objeto utilizada por instrucciones, consultas, permisos, filtros de eventos y referencias de aplicaciones.

## Ciclo de vida {#lifecycle}

NFT las operaciones del ciclo de vida utilizan las operaciones de instrucción Iroha:

- [`Register`](/es/blockchain/instructions.md#un-register) crea el NFT con inicial `content`.
- [`Unregister`](/es/blockchain/instructions.md#un-register) elimina el NFT.
- [`Transfer`](/es/blockchain/instructions.md#transfer) cambios `owned_by`.
- [`SetKeyValue` y `RemoveKeyValue`](/es/blockchain/instructions.md#setkeyvalue-removekeyvalue) actualizar NFT metadatos.

## Pruébalo localmente {#try-it-locally}

Estos ejemplos asumen que has lanzado una red local y tienes la configuración del cliente generada desde el [CLI guía](/es/get-started/operate-iroha-via-cli.md):

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

La red local generada ya configura `wonderland.universal` y su arrendamiento SNS. Para usar un dominio diferente, créelo primero con el flujo de trabajo declarativo `app alias setup plan` y `app alias setup apply` descrito en [Dominios](/es/blockchain/domains.md#registration).

Registre un NFT. El registro lee el contenido inicial JSON desde la entrada estándar:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Inspeccione el NFT directamente y luego enumere todos los NFTs con entradas completas:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Agrega una clave de metadatos y lee nuevamente el NFT:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Eliminar la clave de metadatos:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

Opcionalmente transfiera el NFT. Use `ledger nft get` para leer el propietario actual de `owned_by`, y use `ledger account list all` para encontrar un ID de cuenta de destino.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Elimine el ejemplo NFT después de la guía paso a paso. Si lo transfirió, ya sea transfiéralo de nuevo o envíe el comando de baja con la configuración de la cuenta del propietario actual.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Consultas y Eventos {#queries-and-events}

Usar [`FindNfts`](/es/reference/queries.md#assets-nfts-and-rwas) enumerar NFTs y [`FindNftsByAccountId`](/es/reference/queries.md#assets-nfts-and-rwas) enumerar NFTs propiedad de una cuenta.

NFT el registro, la eliminación, la transferencia y las actualizaciones de metadatos generan eventos de datos NFT. Use el filtro de eventos de datos `Nft` al suscribirse a cambios en el libro mayor de la blockchain o al crear disparadores que reaccionen a eventos del ciclo de vida NFT.

## Permisos {#permissions}

La superficie de permisos predeterminada incluye tokens específicos de NFT:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

Las comprobaciones de permisos son aplicadas por el validador de tiempo de ejecución de software activo, por lo que una red puede personalizar la autorización actualizando el ejecutor. Consulte [Tokens de Permiso](/es/reference/permissions.md) para la lista de tokens predeterminada actual.

## Eligiendo NFTs {#choosing-nfts}

Use un NFT para registros donde la unicidad y la propiedad importan:

- certificados, insignias, licencias y certificaciones
- registros de membresía o acceso
- registros de aplicaciones vinculados a la identidad o propiedad de la cuenta
- referencias a medios fuera de la cadena, documentos o manifiestos técnicos

Use un activo numérico para saldos fungibles, y use simplemente [metadatos](/es/blockchain/metadata.md) cuando los datos sean solo un atributo compacto de un objeto existente del libro mayor de la blockchain.

Véase también:

- [Activos](/es/blockchain/assets.md)
- [Metadatos](/es/blockchain/metadata.md)
- [Instrucciones](/es/blockchain/instructions.md)
- [Consultas](/es/blockchain/queries.md)
