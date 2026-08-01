---
translation_locale: es
translation_source: /cookbook/wallet-connect.md
translation_source_hash: ab5b6c560ed8b0a208666e5854306ba6adce7af1210fc3c94b9c560d8e6eb686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: apruebe la transferencia de activos {#wallet-connect-approve-an-asset-transfer}

## El resultado {#outcome}

Crear una sesión de conexión Iroha en un navegador, obtener la aprobación criptográfica para una identidad de billetera I105, pedir a esa billetera que firme el andamio exacto de transferencia de activos de Torii, enviar la firma separada y esperar a la finalidad aplicada.

## Los requisitos previos {#prerequisites}

- Una aplicación de navegador que utilice `@iroha/iroha-js` y HTTPS.
- Una billetera que implementa Iroha Connect v1 y controla una cuenta de llave única Ed25519 I105.
- La cadena Taira actual ID y el discriminante de la cadena, la letra pequeña registrada en la cartera Ed25519 hex de llave pública, un activo transferible de propiedad y un destino canónico I105.
- El activo de cuota ID devuelto por la respuesta actual del grifo Taira. El ejemplo verifica la cotización de cuota en vivo con respecto a esa ID; nunca incorpora un identificador de activo copiado.
- Se debe habilitar la conexión en el Torii seleccionado. Verifique antes de mostrar un QR o enlace profundo:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Si Taira informa que Connect ha sido desactivado o devuelve `404`/`503`, utilice una red local generada con Connect habilitada. Una transferencia ordinaria de activos también requiere que la billetera posea suficiente cantidad transferible y saldo de tarifas.

## Los pasos {#steps}

### 1. Proporcionar un control de lanzamiento de billetera {#_1-provide-one-wallet-launch-control}

El JavaScript siguiente espera que este elemento aparezca en la página de solicitud:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Entregue el mismo URI que un código QR para una billetera en otro dispositivo. El URI contiene el token de relevo escaneado por la billetera, así que no lo ponga en análisis, registros, referentes o informes de choque.

### 2. Creación, aprobación, firma y presentación {#_2-create-approve-sign-and-submit}

Este módulo del navegador acepta valores concretos de su estado de aplicación. El primero `POST /v1/assets/transfer` omite los campos de firma y devuelve un andamio de transacción citado, versionado. El segundo solo agrega la clave pública de la billetera y la firma independiente a la misma solicitud de transferencia.

```js
import { AccountAddress } from '@iroha/iroha-js/address'
import {
  createConnectAppSession,
  createConnectSessionPreview,
  deleteConnectSession,
  registerConnectSession,
} from '@iroha/iroha-js/connect-browser'

const baseUrl = 'https://taira.sora.org'
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

const decodeBase64 = (value) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
const encodeBase64 = (bytes) =>
  btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))

async function postJson(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(
      `${path}: HTTP ${response.status}: ${await response.text()}`,
    )
  }
  return response.json()
}

async function waitForApplied(transactionHash) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const url = new URL('/v1/pipeline/transactions/status', baseUrl)
    url.searchParams.set('hash', transactionHash)
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
      throw new Error(`pipeline status: HTTP ${response.status}`)
    }
    const status = await response.json()
    const kind = status.status?.kind
    if (kind === 'Applied') return status
    if (kind === 'Rejected' || kind === 'Expired') {
      throw new Error(`${kind}: ${JSON.stringify(status.status)}`)
    }
    await wait(1_000)
  }
  throw new Error('transaction did not reach Applied within 60 seconds')
}

export async function transferWithWallet({
  chainId,
  chainDiscriminant,
  authority,
  publicKeyHex,
  assetDefinitionId,
  destination,
  amount,
  faucetFeeAssetDefinitionId,
}) {
  if (!/^[0-9a-f]{64}$/.test(publicKeyHex)) {
    throw new Error('publicKeyHex must be 32-byte lower-case Ed25519 hex')
  }
  const derivedAuthority = AccountAddress.fromAccount({
    publicKey: publicKeyHex,
    algorithm: 'ed25519',
  }).toI105(chainDiscriminant)
  if (derivedAuthority !== authority) {
    throw new Error('enrolled public key does not control authority')
  }

  const preview = createConnectSessionPreview({
    chainId,
    node: baseUrl,
  })
  const relay = await registerConnectSession(
    baseUrl,
    preview.sidBase64Url,
    {
      node: baseUrl,
    },
  )
  let connect

  try {
    connect = createConnectAppSession({
      baseUrl,
      preview,
      session: relay,
      permissions: {
        methods: ['sign_transaction'],
        resources: [assetDefinitionId],
      },
      appMeta: { name: 'Iroha cookbook transfer' },
    })

    const launch = document.querySelector('#wallet-connect')
    if (!(launch instanceof HTMLAnchorElement)) {
      throw new Error('missing #wallet-connect anchor')
    }
    launch.href = relay.wallet_uri
    launch.hidden = false

    const approval = await connect.waitForApproval()
    if (approval.accountId !== authority) {
      throw new Error('wallet approved a different I105 account')
    }

    const transfer = {
      authority,
      asset_definition_id: assetDefinitionId,
      asset_balance_scope: 'global',
      amount,
      destination,
      fee_payment: {
        payer: 'authority',
        value: { charge_limits: [] },
      },
      creation_time_ms: Date.now(),
      transaction_ttl_ms: 120_000,
      memo: 'iroha-cookbook-wallet-connect',
    }

    const prepared = await postJson('/v1/assets/transfer', transfer)
    if (!prepared.ok || prepared.submitted) {
      throw new Error('Torii did not return a pending-signature scaffold')
    }
    const limits = prepared.intent.fee_payment.value.charge_limits
    if (
      limits.some(
        (limit) =>
          limit.asset_definition_id !== faucetFeeAssetDefinitionId,
      )
    ) {
      throw new Error(
        'live fee quote uses an asset other than the faucet response',
      )
    }

    const signature = await connect.signTransaction(
      decodeBase64(prepared.transaction_scaffold_base64),
    )
    if (signature.length !== 64) {
      throw new Error('wallet returned a non-Ed25519 signature length')
    }

    const submitted = await postJson('/v1/assets/transfer', {
      ...transfer,
      public_key_hex: publicKeyHex,
      signature_base64: encodeBase64(signature),
    })
    if (!submitted.ok || !submitted.submitted) {
      throw new Error('signed transfer was not accepted')
    }

    return {
      transactionHash: submitted.transaction_hash_hex,
      pipelineStatus: await waitForApplied(submitted.transaction_hash_hex),
    }
  } finally {
    connect?.close('application finished request')
    await deleteConnectSession(baseUrl, relay.sid, {
      tokenManagement: relay.token_management,
    })
  }
}
```

Mantenga `token_app`, `token_management`, y `token_relay` Sólo el lanzamiento de la billetera URI La aprobación Connect está firmada por la identidad de la cuenta; el X25519 `walletPublicKey` En la aprobación hay una llave de transporte efímera, no la llave de firma Ed25519 de la cuenta.

### 3. Utilice los tipos de marco Rust en una implementación de billetera. {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

La superficie del protocolo Rust sólo puede sellar una firma después de que la billetera haya descifrado la transacción solicitada, mostrado su intención exacta, aplicada política y firmado con la clave de cuenta aprobada.

```rust
use iroha_crypto::{Algorithm, Signature};
use iroha_torii_shared::{connect as proto, connect_sdk as sdk};

fn seal_wallet_signature(
    wallet_direction_key: &[u8; 32],
    sid: &[u8; 32],
    sequence: u64,
    validated_signature: Signature,
) -> proto::ConnectFrameV1 {
    let payload = proto::ConnectPayloadV1::SignResultOk {
        signature: proto::WalletSignatureV1::new(
            Algorithm::Ed25519,
            validated_signature,
        ),
    };
    sdk::seal_envelope_current(
        wallet_direction_key,
        sid,
        proto::Dir::WalletToApp,
        sequence,
        payload,
    )
}
```

El repositorio es `connect_app` y `connect_wallet` ejemplos son las fichas de protocolo: utilizan claves de transporte deterministas, exponen tokens en la salida, y el accesorio de la billetera devuelve una firma manifiesta. Taira implementación de la billetera.

## Verificar {#verify}

Mantenga el hash devuelto y confirme el estado posterior del destino a través del punto final de los titulares públicos:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

La verificación sólo tiene éxito cuando el JavaScript el camarero observa `Applied` para el hash de la transacción presentada, y la explotación de destino refleja la transferencia. HTTP La aceptación o aprobación de la billetera por sí sola no constituyen finalidad del libro mayor.

## Solución de problemas {#troubleshooting}

- `404`, `503`, o `enabled: false` desde el estado de conexión significa que no se puede crear ninguna sesión de relaje en ese nodo. Cambiar a una red local activada; no vuelva a transportar aplicaciones o tokens de gestión usted mismo.
- `USER_DENIED` es una decisión de la billetera. Conservarlo como resultado del usuario terminal en lugar de abrir repetidas instrucciones de aprobación.
- Una falta de coincidencia entre la cuenta de aprobación o una firma de aprobación inválida deben cerrar la sesión. Nunca pida a la billetera que firme después de que el vínculo de identidad falla.
- `public_key_hex does not control authority` significa los datos de inscripción y el desacuerdo de identidad aprobado I105. La clave efímera de transporte de la billetera no se puede utilizar en este campo.
- Un rechazo de la firma o el andamio suele significar un campo de solicitud o una cotización en vivo cambiada entre preparar y enviar. Construye una nueva solicitud; nunca trasplante la firma antigua.
- Una reproducción exacta de una solicitud ya aceptada y firmada es impotente. Pregunte su hash de transacción devuelta antes de tratar un tiempo muerto como una razón para empezar de nuevo.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Implementación de la conexión del navegador en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/src/connect.browser.js)
- [Pruebas de conexión del navegador en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/test/connect.browser.test.js)
- [Rust Ejemplo de marco de aplicación en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust ejemplo de marco de billetera en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Pinned Torii OpenAPI schema](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/artifacts/openapi/torii.json)
- [Servicios SORA Nexus](/es/blockchain/sora-nexus-services.md)
- [Activos funcionales ](./fungible-assets.md)
- [Enviar y verificar las transacciones ](./submit-and-verify-transactions.md)
