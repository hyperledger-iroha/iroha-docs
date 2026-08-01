---
translation_locale: es
translation_source: /cookbook/nfts.md
translation_source_hash: f34043c1940b556439c23de7decc5e79f198f52eca8517dd8a9a5892d997e211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## El resultado {#outcome}

Inspección Taira NFT el estado, luego registrar, actualizar, transferir y consultar un único NFT El flujo de trabajo utiliza un sistema `name$domain.dataspace` NFT ID y canónico I105 propietario IDs.

## Los requisitos previos {#prerequisites}

- `curl`, `jq`, Python 3.11 o más tarde, y la corriente `iroha` CLI.
- Acceso de sólo lectura Taira.
- Para los escritos, una red local generada a partir de [Lanzamiento Iroha](/es/get-started/launch-iroha.md), con `./localnet/client.toml` y Torii en `http://127.0.0.1:8080`.

## Los pasos {#steps}

### 1. Inspeccionar la colección pública Taira {#_1-inspect-the-public-taira-collection}

Una página vacía es una lectura exitosa: significa que no hay ningún NFTs visible en la página solicitada.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs son registros únicos, no saldos numéricos. Tienen un ID, un propietario y un mapa de metadatos compacto `content`.

### 2. Preparar al propietario local IDs {#_2-prepare-local-owner-ids}

El ejemplo de escritura utiliza el dominio `wonderland.universal` registrado. Derivar la autoridad configurada sin exponer su clave privada, y luego elegir otra cuenta registrada como destino de transferencia.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

El separador `$` pertenece al formulario de texto NFT. Mantén el dominio completo `wonderland.universal` y el sufijo del espacio de datos.

### 3. Registrar el NFT con contenido inicial {#_3-register-the-nft-with-initial-content}

El CLI lee el objeto inicial de JSON desde la entrada estándar. La autoridad actual se convierte en propietaria.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Actualizar el mapa de contenido {#_4-update-the-content-map}

Los valores de metadatos son JSON. Establecer una clave inserta o sustituye esa entrada; no reemplaza todo el registro NFT.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Transferencia de la propiedad {#_5-transfer-ownership}

Proporcionar la cuenta canónica I105 IDs. Un alias debe ser resuelto antes de que se utilice como `--from` o `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Límites de los permisos

En Taira, cada escritura también necesita `--metadata ./taira.tx-metadata.json` y un pagador explícito de cuotas. (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` y `CanModifyNftMetadata` en la superficie de permisos predeterminados). Utilice un dominio asignado a su aplicación o mantenga este paso por localnet.

:::

Para los flujos de trabajo propiedad de contratos, Kotodama expone las llamadas host NFT typed. La siguiente es la fijación exacta del ciclo de vida compilada y ejecutada por el test de documentación IVM pined:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

Las dos fijas I105 Los valores son fijos de ensayo upstream; el arnés registra el destino antes de la ejecución. No son `CURRENT_OWNER` y `NEW_OWNER` de la CLI Para un contrato de aplicación, provee sus cuentas canónicas reales, luego compila, prueba, implementa y llama a través [Los contratos inteligentes](./smart-contracts.md). No envíe un código de byte no revisado a Taira, y recuerda que la ejecución del contrato aún pasa por la autorización de tiempo de ejecución.

## Verificar {#verify}

Leer directamente el NFT y afirmar que su propietario ha cambiado mientras su contenido se mantuvo adjunto:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Si el CLI se envuelve el registro en un sobre de salida, inspeccionar la JSON una vez y aplicar la afirmación al contenido NFT Los invariantes autorizados son: `id`, `owned_by`, y `content`.

## Solución de problemas {#troubleshooting}

- `name$domain` puede introducirse por defecto en el espacio de datos universal en algunos parser, pero el libro de cocina y la aplicación IDs deben utilizar el formulario explícito `name$domain.dataspace`.
- El registro repetido del mismo NFT ID se rechaza. Utilice una red local nueva o elija una nueva estable ID para un registro distinto.
- La entrada de metadatos debe ser válida JSON en la entrada estándar. Una cadena de captura sin citación JSON no es un valor de metadata.
- Una transferencia firmada por una cuenta distinta del propietario actual requiere un permiso exacto; el cambio de `--from` no cambia al firmante.
- Después de la transferencia, el cliente original ya no podrá modificar o desinstalar el NFT. Utilice el nombre del nuevo propietario o un controlador autorizado.
- Taira puede devolver una colección vacía de NFT. No trate a `items: []` como prueba de que las instrucciones de NFT no están disponibles.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración NFT en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/nft.rs)
- [Kotodama NFT pruebas de llamada host en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Exactamente . Kotodama NFT Fijación del ciclo de vida en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/es/blockchain/nfts.md)
- [Metadatos ](/es/blockchain/metadata.md)
- [Las instrucciones ](/es/blockchain/instructions.md)
- [Los tokens de autorización ](/es/reference/permissions.md)
