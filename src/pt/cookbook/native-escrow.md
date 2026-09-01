---
translation_locale: pt
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Escrow de Ativo Nativo {#native-asset-escrow}

## Resultado {#outcome}

Escolha entre um escrow de mercado e um bloqueio de ativo destinado, execute o ciclo de vida digitado atual com Rust ou Python, vincule cada nova tentativa de bloqueio ao valor restante que você realmente observou e compile a superfície de escrow nativa Kotodama a partir de JavaScript.

## Pré-requisitos {#prerequisites}

- Uma definição de ativo numérico e um abridor/vendedor que possui quantidade suficiente.
- Clientes financiados de chave única I105 para cada parte que envia um passo. Use uma intenção `fee_payment` paga por autoridade ao vivo cujo ativo de taxa corresponda à resposta atual do serviço de financiamento do testnet Taira; não insira um ID de ativo da documentação.
- O SDK Rust ou Python atual do Iroha no commit `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- Para o exemplo do compilador JavaScript, Node.js 24, um pacote `@iroha/iroha-js` compilado localmente e seu `iroha_js_host` nativo; siga a [configuração da compilação do SDK JavaScript a partir do código-fonte](/pt/guide/tutorials/javascript.md#build-from-source). Compilações para navegador devem fornecer `compilerUrl` em vez de carregar o host nativo.
- Taira deve admitir a transferência de ativos e as instruções de custódia. Os proprietários de ativos podem usar o ciclo de vida normal quando sua política de ativos permitir; resolver uma disputa requer a permissão global `CanResolveEscrowDispute`. Use uma rede local gerada quando o principal de autorização da rede pública necessária estiver ausente.

Modelos de custódia de marketplace: vendedor, comprador, pagamento off-chain e liberação. Trancas genéricas nomeiam um destino e, opcionalmente, um principal de autorização de liberação distinto; elas suportam saque parcial, cancelamento e expiração.

## Passos {#steps}

### 1. Complete um depósito em garantia de marketplace com Rust {#_1-complete-a-marketplace-escrow-with-rust}

Esta função recebe IDs reais digitados e clientes. Ela abre 40 unidades, permite que o comprador aceite e marque o pagamento fora da cadeia, e então permite que o vendedor libere a custódia. Cada envio nomeia o pagador da taxa principal de autorização através de `FeePaymentIntent`.

```rust
use eyre::{Result, ensure};
use iroha::{
    client::Client,
    data_model::{
        isi::escrow::{
            AcceptAssetEscrow, MarkEscrowPaymentSent, OpenAssetEscrow,
            ReleaseAssetEscrow,
        },
        prelude::*,
        transaction::FeePaymentIntent,
    },
};
use iroha_crypto::Hash;

fn complete_marketplace_escrow(
    seller: &Client,
    buyer: &Client,
    escrow_id: EscrowId,
    asset_definition: AssetDefinitionId,
) -> Result<AssetEscrowRecord> {
    let fee = FeePaymentIntent::authority(Vec::new(), None);

    seller.submit_blocking(
        OpenAssetEscrow::with_evidence_hashes(
            escrow_id,
            asset_definition,
            Quantity::from(40_u64),
            vec![Hash::new("cookbook-fiat-invoice")],
        ),
        fee.clone(),
    )?;
    buyer.submit_blocking(AcceptAssetEscrow::new(escrow_id), fee.clone())?;
    buyer.submit_blocking(MarkEscrowPaymentSent::new(escrow_id), fee.clone())?;
    seller.submit_blocking(ReleaseAssetEscrow::new(escrow_id), fee)?;

    let record = seller.query_single(FindAssetEscrowById::new(escrow_id))?;
    ensure!(record.status == AssetEscrowStatus::Released);
    Ok(record)
}
```

A conta de custódia é gerida pelo livro contábil. Conceder um token de transferência de ativo normal não torna a custódia ativa passível de saque fora do ciclo de vida do depósito em garantia.

### 2. Abra e desenhe parcialmente um cadeado genérico com Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

O principal de autorização de liberação consulta o registro nativo assinado antes de efetuar o saque. Passar exatamente esse `remaining_amount` fornece concorrência otimista: uma solicitação paralela desatualizada é rejeitada em vez de debitar a custódia duas vezes.

```python
import secrets
import time
from decimal import Decimal


def escrow_status(record):
    status = record["status"]
    if isinstance(status, dict):
        return status.get("status", status.get("kind"))
    return str(status)


def open_and_draw_lock(
    *,
    client,
    chain_id,
    opener,
    opener_private_key,
    release_authority,
    release_private_key,
    destination,
    asset_definition_id,
    fee_payment,
):
    escrow_id = f"cookbook_lock_{secrets.token_hex(12)}"

    client.open_asset_lock_and_wait(
        chain_id=chain_id,
        authority=opener,
        private_key=opener_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        asset_definition_id=asset_definition_id,
        destination=destination,
        amount="10",
        release_authority=release_authority,
        expires_at_ms=int(time.time() * 1000) + 3_600_000,
        wait=True,
    )

    before = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )
    client.drawdown_asset_lock_and_wait(
        chain_id=chain_id,
        authority=release_authority,
        private_key=release_private_key,
        fee_payment=fee_payment,
        escrow_id=escrow_id,
        amount="4",
        expected_remaining_amount=before["remaining_amount"],
        wait=True,
    )
    after = client.get_asset_escrow(
        escrow_id=escrow_id,
        authority=release_authority,
        private_key=release_private_key,
    )

    assert escrow_status(before) == "Locked"
    assert Decimal(str(before["remaining_amount"])) == Decimal("10")
    assert escrow_status(after) == "Locked"
    assert Decimal(str(after["remaining_amount"])) == Decimal("6")
    return escrow_id, after
```

O Python SDK pode consultar automaticamente quando `expected_remaining_amount` é omitido, mas passar o valor observado torna a pré-condição econômica assinada visível no código da aplicação.

Para os fluxos de bloqueio Rust, os construtores atuais também exigem a quantidade observada:

```rust
let before = opener.query_single(FindAssetEscrowById::new(lock_id))?;
release_authority.submit_blocking(
    DrawdownAssetLock::new(
        lock_id,
        Quantity::from(4_u64),
        before.remaining_amount,
    ),
    FeePaymentIntent::authority(Vec::new(), None),
)?;

let current = opener.query_single(FindAssetEscrowById::new(lock_id))?;
opener.submit_blocking(
    CancelAssetLock::new(lock_id, current.remaining_amount),
    FeePaymentIntent::authority(Vec::new(), None),
)?;
```

`DrawdownAssetLock::new` aceita três valores; `CancelAssetLock::new` aceita dois. Omitir a quantidade restante esperada descreve uma forma de chamada antiga e insegura.

### 3. Compile a superfície de custódia Kotodama a partir de JavaScript {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript não precisa inventar instruções nativas não tipadas. O compilador atual expõe os componentes integrados de escrows do livro-razão da blockchain para Kotodama; a implantação e as chamadas então seguem [Construir e implantar um contrato inteligente](./smart-contracts.md).

Salve isto como `native_escrow.ko`:

```kotodama
seiyaku NativeEscrowAitai {
    error enum EscrowError {
        NonPositiveAmount = 1,
    }

    kotoage fn open_offer(
        Name offer,
        AssetDefinitionId asset_definition,
        quantity amount
    ) authorize("Admin") {
        require(amount > 0, EscrowError::NonPositiveAmount);
        ledger::escrow::open_offer(
            offer: offer,
            asset_definition: asset_definition,
            amount: amount,
        );
    }
}
```

Salve o seguinte como `compile-native-escrow.mjs` e use-o para compilar exatamente essa fonte de Node.js:

```js
import { readFile } from 'node:fs/promises'
import { compileKotodamaProgram } from '@iroha/iroha-js/kotodama-compiler'

const source = await readFile('./native_escrow.ko', 'utf8')

const result = await compileKotodamaProgram(source, {
  sourceName: 'native_escrow.ko',
})
if (!result.ok) {
  throw new Error(JSON.stringify(result.diagnostics, null, 2))
}
console.log({
  codeHashHex: result.output.codeHashHex,
  entrypoints: result.output.manifest.entrypoints.map(({ name }) => name),
})
```

Execute-o a partir do ambiente de pacote construído a partir da fonte descrito nas pré-requisitos:

```bash
node ./compile-native-escrow.mjs
```

## Verificar {#verify}

Para custódia de mercado, consulte `FindAssetEscrowById` e os ativos detidos por ambas as partes após a liberação. O registro deve ser `Released`, nomeie o comprador que aceitou e não mostre custódia restante. Para o bloqueio Python acima, mantenha o ID retornado e repita a consulta assinada:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Também consulte a posse de ativos do destino e confirme que ela aumentou em quatro unidades. Um registro de resultado de protocolo de transação sem o registro de garantia e o estado posterior do destino é uma verificação incompleta.

## Solução de problemas {#troubleshooting}

- `Not permitted` ao abrir geralmente significa que o titular da autorização não pode transferir o ativo selecionado para custódia. A resolução de disputas possui o portão global separado `CanResolveEscrowDispute`.
- `expected remaining amount` a rejeição é um conflito de concorrência otimista. Reconsulte o registro, decida se a outra retirada/cancelamento foi intencional e assine uma nova instrução apenas se o novo estado for aceitável.
- Apenas o principal autorizado para liberação configurado pode realizar um bloqueio confiável. O destino não pode liberá-lo apenas porque receberá os fundos.
- O lançamento no marketplace é válido apenas após a aceitação e o estado de pagamento enviado; o cancelamento é limitado aos estados do ciclo de vida anteriores.
- O vencimento utiliza o tempo do registro de blockchain autoritário. Não trate um tempo limite do relógio local como prova de que `ExpireAssetLock` irá expirar.
- Uma falha de taxa pertence à parte que envia essa etapa do ciclo de vida. Comprador de fundo, vendedor/abertura e principal de autorização de liberação de forma independente em Taira.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Modelo de instrução de escrow nativo no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Testes de integração nativa de escrow no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python métodos do cliente de escrow no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama amostra de escrow nativa no commit fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Depósito em garantia de ativo nativo](/pt/blockchain/escrow.md)
- [Ativos fungíveis](./fungible-assets.md)
- [Permissões e funções](./permissions-and-roles.md)
