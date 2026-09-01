---
translation_locale: es
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## Resultado {#outcome}

Inspeccione el estado de Taira NFT, luego registre, actualice, transfiera y consulte un NFT único en una red local generada. El flujo de trabajo utiliza un ID de `name$domain.dataspace` NFT completamente calificado y IDs de propietarios canónicos I105.

## Prerrequisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 o posterior, y el actual `iroha` CLI.
- Acceso de solo lectura Taira.
- Para escrituras, una red local generada a partir de [Lanzar Iroha](/es/get-started/launch-iroha.md), con `./localnet/client.toml` y Torii en `http://127.0.0.1:8080`.

## Pasos {#steps}

### 1. Inspeccionar la colección pública Taira {#_1-inspect-the-public-taira-collection}

Una página vacía es una lectura exitosa: significa que no hay NFTs visibles en la página solicitada.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs son registros únicos, no saldos numéricos. Tienen un ID, un propietario y un mapa de metadatos compacto `content`.

### 2. Prepare identificaciones de propietarios locales {#_2-prepare-local-owner-ids}

El ejemplo de escritura utiliza el dominio `wonderland.universal` registrado. Derive el principal de autorización configurado sin exponer su clave privada, luego elija otra cuenta registrada como destino de la transferencia.

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

El separador `$` pertenece al formulario de texto NFT. Mantenga el dominio completo `wonderland.universal` y el sufijo del espacio de datos.

### 3. Registrar el NFT con contenido inicial {#_3-register-the-nft-with-initial-content}

El CLI lee el objeto inicial JSON desde la entrada estándar. El principal de autorización actual se convierte en el propietario.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Actualizar el mapa de contenido {#_4-update-the-content-map}

Los valores de metadatos son JSON. Establecer una clave inserta o reemplaza esa entrada; no reemplaza todo el registro NFT.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Transferir la propiedad {#_5-transfer-ownership}

Proporcione ambos identificadores de cuenta canónicos I105. Un alias debe resolverse antes de que se use como `--from` o `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Límite de permisos

En Taira, cada escritura también necesita `--metadata ./taira.tx-metadata.json` y un pagador de tarifas explícito. El registro, la transferencia, la eliminación y las actualizaciones de metadatos son verificadas por el software activo tiempo de ejecución (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` y `CanModifyNftMetadata` en la superficie de permisos predeterminada). Utiliza un dominio asignado a tu aplicación o mantén este recorrido en localnet.

:::

Para los flujos de trabajo propiedad del contrato, Kotodama expone llamadas de host tipadas NFT. Lo siguiente es el artefacto de prueba de ciclo de vida exacto compilado y ejecutado por la documentación de prueba IVM fijada:

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

Los dos valores fijos I105 son artefactos de prueba iniciales; el ejecutor de pruebas registra el destino antes de la ejecución. No son `CURRENT_OWNER` y `NEW_OWNER` del recorrido CLI. Para un contrato de aplicación, proporcione sus cuentas canónicas reales, luego complílelo, pruébelo, impleméntelo y llámelo a través de [Contratos inteligentes](./smart-contracts.md). No envíe bytecode no revisado a Taira, y recuerde que la ejecución del contrato aún pasa la autorización de tiempo de ejecución del software.

## Verificar {#verify}

Lea el NFT directamente y afirme que su propietario cambió mientras su contenido permaneció adjunto:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Si el CLI envuelve el registro en un contenedor de datos de salida, inspeccione el JSON una vez y aplique la afirmación al objeto NFT contenido. Los invariantes autorizados son `id`, `owned_by` y `content`.

## Solución de problemas {#troubleshooting}

- `name$domain` puede predeterminarse al espacio de datos universal en algunos analizadores, pero los IDs de libros de cocina y aplicaciones deben usar la forma explícita `name$domain.dataspace`.
- Se rechaza un registro repetido del mismo ID NFT. Use una red local nueva o elija un ID nuevo y estable para un registro distinto.
- La entrada de metadatos debe ser válida JSON en la entrada estándar. Una cadena de shell sin comillas JSON no es un valor de metadatos.
- Una transferencia firmada por una cuenta que no sea el propietario actual necesita un permiso exacto; cambiar `--from` no cambia el firmante criptográfico.
- Después de la transferencia, es posible que al cliente original ya no se le permita modificar o cancelar el registro del NFT. Use el firmante criptográfico del nuevo propietario o un controlador autorizado.
- Taira puede devolver una colección NFT vacía. No considere `items: []` como prueba de que las instrucciones NFT no están disponibles.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración NFT en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT pruebas de llamadas al host en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Vector exacto de prueba del ciclo de vida de un NFT de Kotodama en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/es/blockchain/nfts.md)
- [Metadatos](/es/blockchain/metadata.md)
- [Instrucciones](/es/blockchain/instructions.md)
- [Tokens de permiso](/es/reference/permissions.md)
