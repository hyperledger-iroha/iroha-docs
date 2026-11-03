---
translation_locale: es
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Wallet Connect: Aprobar una transferencia de activos {#wallet-connect-approve-an-asset-transfer}

## Resultado {#outcome}

Crea una sesión de Iroha Connect en un navegador, obtén la aprobación criptográfica para una identidad de billetera I105, solicita que esa billetera firme la carga útil exacta y sin firmar de transferencia de activos de Torii, envía la firma separada y espera la finalización aplicada.

## Requisitos previos {#prerequisites}

- Una aplicación de navegador que usa `@iroha/iroha-js` y HTTPS.
- Una cartera que implementa Iroha Connect v1, controla una cuenta I105 Ed25519 de clave única y concede los métodos `sign_transaction` y `sign_raw`.
- El ID de red Taira actual, la clave pública Ed25519 en minúsculas inscrita de la billetera en hexadecimal, un activo transferible en propiedad y un destino canónico I105.
- El ID de activo de tarifa publicado por la política actual del servicio de financiación de testnet Taira. El ejemplo verifica la estimación del precio de la tarifa en vivo contra ese ID; nunca incrusta un identificador de activo copiado.
- Connect debe estar habilitado en el Torii seleccionado. Lea el ID de red de las capacidades públicas de cuenta antes de mostrar un QR o enlace profundo:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

Torii no publica un estado anónimo de Connect: `GET /v1/connect/status` informa sobre una sesión a quien presenta su token de gestión, y el estado agregado requiere una firma de operador. Cuando un nodo desactiva Connect, `registerConnectSession` falla con HTTP `503` y el código `connect_disabled` (`404` cuando la compilación omite Connect), y el ejemplo no muestra ningún código QR ni enlace profundo; use una red local generada con Connect habilitado. Una transferencia de activos ordinaria también requiere que la billetera tenga suficiente cantidad transferible y saldo para tarifas.

## Pasos {#steps}

### 1. Proporcionar un control de lanzamiento de billetera {#_1-provide-one-wallet-launch-control}

El JavaScript a continuación espera este elemento en la página de la aplicación:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Genera el mismo URI como un código QR para una billetera en otro dispositivo. El URI contiene el token de retransmisión con alcance de billetera, por lo que no lo pongas en análisis, registros, referidos o informes de fallos.

### 2. Crear, aprobar, firmar y enviar {#_2-create-approve-sign-and-submit}

Este módulo del navegador acepta valores concretos de su estado de aplicación. El primero `POST /v1/assets/transfer` omite los campos de firma y devuelve la intención de tarifa cotizada y la carga útil de la transacción sin firmar. El segundo solo añade la clave pública de la cartera y la firma separada a la misma solicitud de transferencia. Torii exige una firma canónica de cuenta en ambas solicitudes, por lo que el módulo hace que la cartera las firme mediante `createConnectCanonicalRequestAuth`.

```js
import { buildCanonicalJsonRequest } from '@iroha/iroha-js/canonical-request'
import {
  NetworkId,
  createConnectAppSession,
  createConnectCanonicalRequestAuth,
  createConnectSessionPreview,
  deleteConnectSession,
  registerConnectSession,
  toHex,
} from '@iroha/iroha-js/connect-browser'
import { ToriiBrowserClient } from '@iroha/iroha-js/torii-browser'

const baseUrl = 'https://taira.sora.org'
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

const decodeBase64 = (value) =>
  Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
const encodeBase64 = (bytes) =>
  btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))

async function postSignedJson(path, body, auth, networkId) {
  const request = await buildCanonicalJsonRequest({
    nativeIdentity: auth.nativeIdentity,
    accountId: auth.authAccountId,
    networkId,
    method: 'POST',
    path,
    baseUrl,
    body,
    sign: auth.sign,
  })
  const response = await fetch(`${baseUrl}${path}`, {
    method: request.method,
    headers: request.headers,
    body: request.body,
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
    if (response.status === 404) {
      await wait(1_000)
      continue
    }
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
  networkIdLiteral,
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
  const networkId = NetworkId.parse(networkIdLiteral)
  const torii = new ToriiBrowserClient(baseUrl, { networkId })

  const preview = createConnectSessionPreview({
    networkId,
    node: baseUrl,
  })
  const relay = await registerConnectSession(
    baseUrl,
    preview,
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
      inspectAccountIdentity: (accountId, options) =>
        torii.inspectAccountIdentity(accountId, options),
      permissions: {
        methods: ['sign_transaction', 'sign_raw'],
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
    if (toHex(approval.signingPublicKey) !== publicKeyHex) {
      throw new Error('enrolled public key does not control authority')
    }
    const auth = await createConnectCanonicalRequestAuth(connect)

    const transfer = {
      authority,
      asset_definition_id: assetDefinitionId,
      asset_balance_scope: 'global',
      amount,
      destination,
      fee_payment: {
        payer: 'authority',
        value: { charge_limits: [], gas_limit: null },
      },
      creation_time_ms: Date.now(),
      transaction_ttl_ms: 120_000,
      memo: 'iroha-cookbook-wallet-connect',
    }

    const prepared = await postSignedJson(
      '/v1/assets/transfer',
      transfer,
      auth,
      networkId,
    )
    if (!prepared.ok || prepared.submitted) {
      throw new Error('Torii did not return an unsigned transaction payload')
    }
    const limits = prepared.intent.fee_payment.value.charge_limits
    if (
      limits.some(
        (limit) =>
          limit.asset_definition_id !== faucetFeeAssetDefinitionId,
      )
    ) {
      throw new Error(
        'live fee quote uses an asset other than the faucet policy asset',
      )
    }

    const signature = await connect.signTransaction(
      decodeBase64(prepared.transaction_payload_b64),
    )
    if (signature.length !== 64) {
      throw new Error('wallet returned a non-Ed25519 signature length')
    }

    const submitted = await postSignedJson(
      '/v1/assets/transfer',
      {
        ...transfer,
        public_key_hex: publicKeyHex,
        signature_base64: encodeBase64(signature),
      },
      auth,
      networkId,
    )
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

Mantenga `token_app`, `token_management` y `token_relay` en la memoria de la aplicación. Solo el lanzamiento de la billetera URI/token se transfiere a la billetera. La aprobación de Connect es firmada por la identidad de la cuenta; la X25519 `walletPublicKey` en la aprobación es una clave de transporte efímera, no la clave de firma Ed25519 de la cuenta.

### 3. Use los tipos de marco Rust en una implementación de cartera {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

La superficie del protocolo Rust puede sellar una firma solo después de que la billetera haya decodificado la transacción solicitada, mostrado su intención exacta, aplicado la política y firmado con la clave de cuenta aprobada. Este asistente acepta esa firma validada; no fabrica una:

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

Los ejemplos `connect_app` y `connect_wallet` del repositorio son demostraciones del protocolo: la aplicación imprime el URI de la billetera, incluido su token, en la salida estándar, y la billetera recibe sus tokens como argumentos de línea de comandos y firma los bytes solicitados sin decodificarlos ni mostrarlos. Úselos solo para estudiar marcos, nunca como una implementación de billetera Taira.

## Verificar {#verify}

Mantenga el hash criptográfico devuelto y confirme el estado posterior del destino a través del endpoint de titulares públicos API:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

La verificación tiene éxito solo cuando el camarero JavaScript observa `Applied` para el hash criptográfico de la transacción enviada y el destino refleja la transferencia. La aceptación de HTTP o la aprobación de la billetera por sí sola no constituye la finalización del libro mayor de la blockchain.

## Solución de problemas {#troubleshooting}

- `503` con el código `connect_disabled`, o `404`, de `registerConnectSession` significa que no se puede crear una sesión de retransmisión en ese nodo. Cambie a una red local habilitada; no intente transportar tokens de aplicación o de gestión por su cuenta.
- `USER_DENIED` es una decisión de cartera. Consérvala como un resultado del usuario terminal en lugar de abrir repetidamente solicitudes de aprobación.
- Un desajuste entre la cuenta de aprobación o una firma de aprobación no válida debe cerrar la sesión. Nunca pidas a la billetera que firme después de que falle la vinculación de identidad.
- `public_key_hex does not control authority` significa que los datos de inscripción y la identidad aprobada I105 no coinciden. La clave de transporte de la billetera efímera no se puede usar en este campo.
- Una firma separada rechazada generalmente significa que un campo de solicitud o la estimación de tarifa en vivo cambiaron entre la preparación y el envío. Construya una nueva solicitud; nunca trasplante la firma antigua.
- Una repetición exacta de una solicitud firmada ya aceptada es idempotente. Consulte su hash criptográfico de transacción devuelto antes de considerar un tiempo de espera como motivo para empezar de nuevo.

## Fuente y documentos relacionados {#source-and-related-docs}

- [Implementación de Browser Connect en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [Pruebas de Browser Connect en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust ejemplo de marco de aplicación en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust ejemplo de marco de billetera en el commit fijado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Esquema fijado Torii OpenAPI](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus servicios](/es/blockchain/sora-nexus-services.md)
- [Activos fungibles](./fungible-assets.md)
- [Enviar y verificar transacciones](./submit-and-verify-transactions.md)
