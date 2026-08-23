---
translation_locale: pt
translation_source: /cookbook/wallet-connect.md
translation_source_hash: ab5b6c560ed8b0a208666e5854306ba6adce7af1210fc3c94b9c560d8e6eb686
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Wallet Connect: Aprova uma transferência de ativos {#wallet-connect-approve-an-asset-transfer}

## Resultados {#outcome}

Crie uma sessão Iroha Connect em um navegador, obtenha a aprovação criptográfica para uma identidade de carteira I105, peça à carteira que assine o andamio exato de transferência de ativos Torii, envie a assinatura separada e aguarde a finalidade aplicada.

## Pré-requisitos {#prerequisites}

- Um aplicativo de navegador que utiliza `@iroha/iroha-js` e HTTPS.
- Uma carteira que implementa Iroha Connect v1 e controla uma conta Ed25519 I105 de chave única.
- A cadeia Taira atual ID e o discriminante da cadeia, o hex de chave pública em minúsculas registrada Ed25519 da carteira, um ativo transferível de propriedade e um destino canônico I105.
- O ativo da taxa ID devolvido pela resposta atual do torneiro Taira. O exemplo verifica a cotização das taxas ao vivo em relação a essa ID; nunca incorpora um identificador de ativo copiado.
- A ligação deve ser habilitada no Torii selecionado. Verifique antes de mostrar um QR ou um link profundo:

```bash
curl -fsS \
  -H 'Accept: application/json' \
  https://taira.sora.org/v1/connect/status |
  jq -e '{enabled, sessions_active} | select(.enabled == true)'
```

Se Taira relatar Connect desativado ou retornar `404`/`503`, use uma rede local gerada com o Connect habilitado. Uma transferência comum de ativos também exige que a carteira possua quantidade e saldo de taxas suficientes para ser transferida.

## Passos {#steps}

### 1. Fornecer um controlo de lançamento da carteira {#_1-provide-one-wallet-launch-control}

O JavaScript abaixo prevê este elemento na página de pedido:

```html
<a id="wallet-connect" hidden>Open this request in my Iroha wallet</a>
```

Entregue o mesmo URI que um código de QR para uma carteira em outro dispositivo. A URI detém o token de relé esculpido pela carteira, por isso não coloque-o em análises, registros, referências ou relatórios de falhas.

### 2. Criar, aprovar, assinar e submeter. {#_2-create-approve-sign-and-submit}

Este módulo do navegador aceita valores concretos do seu estado de aplicação. O primeiro `POST /v1/assets/transfer` omite campos de assinatura e retorna um andamio de transação citado, versão. O segundo adiciona apenas a chave pública da carteira e assinatura separada ao mesmo pedido de transferência.

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

Mantenham `token_app`, `token_management`, e `token_relay` Apenas o lançamento da carteira URI A aprovação do Connect é assinada pela identidade da conta; o X25519 `walletPublicKey` na aprovação está uma chave de transporte efémeras, não a chave de assinatura Ed25519 da conta.

### 3. Utilize os tipos de quadros Rust em uma implementação de carteira {#_3-use-the-rust-frame-types-in-a-wallet-implementation}

A superfície do protocolo Rust só pode selar uma assinatura depois que a carteira tenha decodificado a transação solicitada, exibido sua intenção exata, política aplicada e assinado com a chave de conta aprovada.

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

O repositório... `connect_app` e `connect_wallet` Exemplos são os dispositivos de protocolo: eles usam chaves de transporte deterministas, expõem tokens em saída, Usá-los apenas para estudar quadros, nunca como uma ferramenta Taira Implementação da carteira.

## Verificar {#verify}

Mantenha o hash devolvido e confirme o estado posterior do destino através do ponto final de titular público:

```bash
curl -fsS -G \
  -H 'Accept: application/json' \
  "https://taira.sora.org/v1/assets/$ASSET_DEFINITION_ID/holders" \
  --data-urlencode "account_id=$DESTINATION_ACCOUNT" \
  --data-urlencode 'scope=global' |
  jq .
```

A verificação só é efetuada quando o JavaScript O garçom observa `Applied` para o hash da transação submetida e a exploração de destino reflete a transferência. HTTP A aceitação ou a aprovação da carteira por si só não é finalidade do livro de conta.

## Resolução de problemas {#troubleshooting}

- `404`, `503`, ou `enabled: false` do status Connect significa que nenhuma sessão de relevo pode ser criada nesse nó. Passe para uma rede local habilitada; não volte a transportar aplicativos ou tokens de gerenciamento por si mesmo.
- `USER_DENIED` é uma decisão de carteira. Preserva-a como um resultado do usuário terminal em vez de abrir repetidas instruções de aprovação.
- Uma falta de correspondência entre uma conta de aprovação ou uma assinatura de aprovação inválida deve encerrar a sessão.
- `public_key_hex does not control authority` significa os dados de inscrição e o desacordo de identidade aprovado I105. A chave efémeras de transporte da carteira não pode ser utilizada neste campo.
- Uma assinatura ou rejeição do andaime geralmente significa um campo de solicitação ou uma cotação de taxa ao vivo alterada entre preparar e enviar.
- Uma repetição exata de um pedido já aceito e assinado é impotente. Pergunte o hash da transacção devolvida antes de tratar um timeout como uma razão para começar de novo.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Implementação do Browser Connect no compromisso fixado ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/src/connect.browser.js)
- [Os testes de Browser Connect no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/javascript/iroha_js/test/connect.browser.test.js)
- [Exemplo de quadro de aplicação Rust no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_app.rs)
- [Rust exemplo de quadro de carteira no comit fixado](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii_shared/examples/connect_wallet.rs)
- [Empilhados Torii OpenAPI esquema](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/artifacts/openapi/torii.json)
- [Serviços SORA Nexus](/pt/blockchain/sora-nexus-services.md)
- [Ativos funcionais ](./fungible-assets.md)
- [Submeter e verificar transações ](./submit-and-verify-transactions.md)
