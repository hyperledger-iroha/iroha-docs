---
translation_locale: pt
translation_source: /cookbook/wallet-connect.md
translation_source_hash: 6bcb87693d4a4cdf45662029dd455c15d3a7a1d4a1e1586e92317ca91b587390
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Wallet Connect: Aprovar uma Transferência de Ativo {#wallet-connect-approve-an-asset-transfer}

## Resultado {#outcome}

Crie uma sessão Iroha Connect em um navegador, obtenha aprovação criptográfica para uma identidade de carteira I105, peça que essa carteira assine o payload exato e não assinado de transferência de ativos do Torii, envie a assinatura destacada e aguarde a finalização aplicada.

## Pré-requisitos {#prerequisites}

- Um aplicativo de navegador usando `@iroha/iroha-js` e HTTPS.
- Uma carteira que implementa Iroha Connect v1, controla uma conta I105 Ed25519 de chave única e concede os métodos `sign_transaction` e `sign_raw`.
- O atual ID de rede Taira, a chave pública Ed25519 em minúsculas registrada na carteira, em hexadecimal, um ativo transferível possuído e um destino canônico I105.
- O ID do ativo de taxa publicado pela política atual do serviço de financiamento da testnet Taira. O exemplo verifica a estimativa de preço de taxa ao vivo em relação a esse ID; ele nunca incorpora um identificador de ativo copiado.
- O Connect deve estar ativado no Torii selecionado. Leia o ID de rede das capacidades públicas de conta antes de mostrar um QR ou link profundo:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/capabilities |
  jq -er '.network_id'
```

O Torii não publica um status anônimo do Connect: `GET /v1/connect/status` informa sobre uma sessão a quem apresenta seu token de gerenciamento, e o status agregado exige uma assinatura de operador. Quando um nó desativa o Connect, `registerConnectSession` falha com HTTP `503` e o código `connect_disabled` (`404` quando a compilação omite o Connect), e o exemplo não mostra nenhum código QR nem link profundo; use uma rede local gerada com o Connect ativado. Uma transferência de ativo comum também requer que a carteira possua quantidade transferível suficiente e saldo para taxas.

## Passos {#steps}

### 1. Forneça um controle de lançamento de carteira {#_1-provide-one-wallet-launch-control}

O JavaScript abaixo espera este elemento na página do aplicativo:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Renderize o mesmo URI como um código QR para uma carteira em outro dispositivo. O URI contém o token de retransmissão específico da carteira, então não o coloque em análises, registros, referenciadores ou relatórios de falhas.

### 2. Criar, aprovar, assinar e enviar {#_2-create-approve-sign-and-submit}

Este módulo de navegador aceita valores concretos do estado da sua aplicação. O primeiro `POST /v1/assets/transfer` omite campos de assinatura e retorna a intenção de taxa cotada e o payload da transação não assinada. O segundo adiciona apenas a chave pública da carteira e a assinatura destacada ao mesmo pedido de transferência. O Torii exige uma assinatura canônica de conta em ambos os pedidos, então o módulo faz a carteira assiná-los por meio de `createConnectCanonicalRequestAuth`.

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

Mantenha `token_app`, `token_management` e `token_relay` na memória do aplicativo. Apenas o lançamento da carteira URI/token é transferido para a carteira. A aprovação do Connect é assinada pela identidade da conta; o X25519 `walletPublicKey` na aprovação é uma chave de transporte efêmera, não a chave de assinatura Ed25519 da conta.

### 3. Use os tipos de quadro Rust em uma implementação de carteira {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

A superfície do protocolo Rust pode selar uma assinatura somente depois que a carteira decodificou a transação solicitada, exibiu sua intenção exata, aplicou a política e assinou com a chave da conta aprovada. Este auxiliar aceita essa assinatura validada; ele não fabrica uma:

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

Os exemplos `connect_app` e `connect_wallet` do repositório são demonstrações de protocolo: o aplicativo imprime o URI da carteira, incluindo seu token, na saída padrão, e a carteira recebe seus tokens como argumentos de linha de comando e assina os bytes solicitados sem decodificá-los nem exibi-los. Use-os apenas para estudar quadros, nunca como uma implementação de carteira Taira.

## Verificar {#verify}

Mantenha o hash criptográfico retornado e confirme o estado pós-destino através do endpoint dos detentores públicos API:

```bash
HOLDER_FILTER="account_id = \"$DESTINATION_ACCOUNT\" and scope = \"global\""
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "filter=$HOLDER_FILTER" |
  jq .
```

A verificação só é bem-sucedida quando o garçom JavaScript observa `Applied` para o hash criptográfico da transação submetida e o saldo de destino reflete a transferência. A aceitação HTTP ou a aprovação da carteira sozinha não constitui a finalização do livro-razão da blockchain.

## Solução de problemas {#troubleshooting}

- `503` com o código `connect_disabled`, ou `404`, de `registerConnectSession` significa que nenhuma sessão de retransmissão pode ser criada nesse nó. Mude para uma rede local habilitada; não volte a transportar tokens de aplicativo ou de gerenciamento por conta própria.
- `USER_DENIED` é uma decisão de carteira. Preserve-a como um resultado do usuário final em vez de abrir solicitações de aprovação repetidas.
- Uma incompatibilidade entre aprovação e conta ou uma assinatura de aprovação inválida deve encerrar a sessão. Nunca peça à carteira para assinar após a falha na vinculação de identidade.
- `public_key_hex does not control authority` significa dados de inscrição e a identidade aprovada I105 não corresponde. A chave de transporte da carteira efêmera não pode ser usada neste campo.
- Uma assinatura destacada rejeitada geralmente significa que um campo do pedido ou a estimativa de preço da taxa ao vivo mudou entre preparar e enviar. Crie um novo pedido; nunca transplante a assinatura antiga.
- Uma reprodução exata de uma solicitação já aceita e assinada é idempotente. Consulte seu hash criptográfico de transação retornado antes de tratar um tempo limite como motivo para recomeçar.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Implementação do Browser Connect no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/src/connect.browser.js)
- [Testes de Browser Connect no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/javascript/iroha_js/test/connect.browser.test.js)
- [Rust exemplo de estrutura de app no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust exemplo de estrutura de carteira no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Esquema fixado Torii OpenAPI](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/artifacts/openapi/torii.json)
- [SORA Nexus serviços](/pt/blockchain/sora-nexus-services.md)
- [Ativos fungíveis](./fungible-assets.md)
- [Enviar e verificar transações](./submit-and-verify-transactions.md)
