---
translation_locale: es
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# NFTs {#nfts}

## Resultado {#outcome}

Inspeccione el estado de Taira NFT, luego registre, actualice, transfiera y consulte un NFT único en una red local generada. El flujo de trabajo utiliza un ID de `name$domain.dataspace` NFT completamente calificado y IDs de propietarios canónicos I105.

## Prerrequisitos {#prerequisites}

- `curl`, `jq`, Python 3.11 o posterior, y el actual `iroha` CLI.
- Acceso de solo lectura Taira.
- Para escrituras, una red local creada con `kagami localnet generate --peers 4 --out-dir ./localnet` como en [Lanzar Iroha](/es/get-started/launch-iroha.md), con `./localnet/client.toml` y Torii en `http://127.0.0.1:8080`, además de un dominio NFT que pertenezca a su firmante (consulte el paso 2).

## Pasos {#steps}

### 1. Inspeccionar la colección pública Taira {#_1-inspect-the-public-taira-collection}

Una página vacía es una lectura exitosa: significa que no hay NFTs visibles en la página solicitada.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs son registros únicos, no saldos numéricos. Tienen un ID, un propietario y un mapa de contenido compacto, que las filas de colección de Torii devuelven como `metadata` y `ledger nft get` devuelve como `content`.

### 2. Prepare identificaciones de propietarios locales {#_2-prepare-local-owner-ids}

El ejemplo de escritura necesita un dominio que pertenezca a la cuenta firmante, o una concesión de `CanRegisterNft` para él. Una red local generada no registra ningún dominio de aplicación para su cliente, y el registro directo de dominios está reservado al génesis, así que establezca `NFT_DOMAIN` en un dominio `name.dataspace` que controle su firmante. Derive el principal de autorización configurado sin exponer su clave privada, luego elija otra cuenta registrada como destino de la transferencia.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

El separador `$` pertenece a la forma de texto del NFT. Mantenga el dominio `name.dataspace` completo en el ID.

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

En Taira, cada escritura usa `--fee-payer authority`; el CLI cotiza la tarifa exacta, en el activo de tarifa de Taira, antes de firmar. El registro, la transferencia, la eliminación y las actualizaciones de metadatos son verificadas por el entorno de ejecución activo (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` y `CanModifyNftMetadata` en la superficie de permisos predeterminada). Use un dominio que pertenezca a su cuenta, o uno para el que esta tenga estas concesiones.

:::

Para los flujos de trabajo propiedad del contrato, Kotodama expone llamadas de host tipadas NFT. Lo siguiente es el artefacto de prueba de ciclo de vida exacto compilado y ejecutado por la documentación de prueba IVM fijada:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
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

El CLI imprime el propio registro del NFT. Los invariantes de referencia son `id`, `owned_by` y `content`.

## Solución de problemas {#troubleshooting}

- `name$domain` puede predeterminarse al espacio de datos universal en algunos analizadores, pero los IDs de libros de cocina y aplicaciones deben usar la forma explícita `name$domain.dataspace`.
- Se rechaza un registro repetido del mismo ID NFT. Use una red local nueva o elija un ID nuevo y estable para un registro distinto.
- La entrada de metadatos debe ser válida JSON en la entrada estándar. Una cadena de shell sin comillas JSON no es un valor de metadatos.
- Una transferencia firmada por una cuenta que no sea el propietario actual necesita la propiedad del dominio del NFT o una concesión exacta de `CanTransferNft`; cambiar `--from` no cambia el firmante criptográfico.
- La transferencia solo cambia `owned_by`. Las actualizaciones de metadatos y la baja del registro siguen correspondiendo al propietario del dominio o a una cuenta que tenga `CanModifyNftMetadata` o `CanUnregisterNft` para ese NFT; el nuevo propietario puede volver a transferirlo.
- Taira puede devolver una colección NFT vacía. No considere `items: []` como prueba de que las instrucciones NFT no están disponibles.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Pruebas de integración NFT en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT pruebas de llamadas al host en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Vector exacto de prueba del ciclo de vida de un NFT de Kotodama en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [Pruebas de los ejemplos de documentación de Kotodama en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/es/blockchain/nfts.md)
- [Metadatos](/es/blockchain/metadata.md)
- [Instrucciones](/es/blockchain/instructions.md)
- [Tokens de permiso](/es/reference/permissions.md)
