---
translation_locale: pt
translation_source: /cookbook/native-escrow.md
translation_source_hash: aa8e079684879bdcda2b4439e9c12742d4ab477e6f560f7c326a59b6be5bf666
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Escrow de ativos nativos {#native-asset-escrow}

## Resultados {#outcome}

Escolha entre um escrow de mercado e um bloqueio de ativo vinculado ao destino, execute o ciclo de vida atual digitado com Rust ou Python, amarrar cada tentativa de bloqueio à quantia restante que você realmente observou e compilar a superfície nativa do escrow Kotodama a partir de JavaScript.

## Pré-requisitos {#prerequisites}

- Uma definição numérica de ativo e um operador/vendedor que tenha quantidade suficiente.
- Clientes de chave única I105 financiados para cada parte que submeter um passo. Utilize uma intenção `fee_payment` paga pela autoridade ao vivo cujo ativo de taxa corresponde à resposta atual do torneiro Taira; não incorpore um ativo ID na documentação.
- O atual Rust ou Python SDK do Iroha compromete o `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- Para o JavaScript Exemplo de compilador, Node.js 24 mais um construído localmente `@iroha/iroha-js` embalagem e o seu nativo `iroha_js_host`; Seguir o [JavaScript SDK Configuração da construção de fonte](/pt/guide/tutorials/javascript.md#build-from-source). As construções do navegador devem fornecer `compilerUrl` Em vez de carregar o anfitrião nativo.
- Taira deve admitir as instruções de transferência e custódia dos ativos. Os proprietários de ativos podem usar o ciclo normal de vida quando sua política de ativos o permite; resolver uma disputa requer a permissão global `CanResolveEscrowDispute`.

Modelos de mercado em custódia vendedor, comprador, pagamento fora da cadeia e liberação. Os bloqueios genéricos nomeam um destino e opcionalmente uma libertação distinta Autoridade; apoiam a retirada parcial, o cancelamento e a expiração.

## Passos {#steps}

### 1. Completar uma fiança de mercado com Rust {#_1-complete-a-marketplace-escrow-with-rust}

Esta função recebe o tipo real IDs e os clientes. Ele abre 40 unidades, permite ao comprador aceitar e marcar o pagamento fora da cadeia, em seguida, deixa o vendedor liberar a custódia. Cada submissão nomea o pagador de taxas de autoridade através de `FeePaymentIntent`.

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

A concessão de um token normal de transferência de ativos não torna a custódia ativa drenável fora do ciclo de vida da garantia.

### 2. Abrir e desenhar parcialmente um fechamento genérico com Python {#_2-open-and-partially-draw-a-generic-lock-with-python}

A autoridade de liberação consulta o registo nativo assinado antes de retirar. Passar esse `remaining_amount` exato proporciona uma simultaneidade otimista: um pedido paralelo obsoleto é rejeitado em vez de cobrar a custódia duas vezes.

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

O Python SDK pode fazer consultas automaticamente quando o `expected_remaining_amount` é omitido, mas passar o valor observado torna visível a condição económica assinada no código de aplicação.

Para os fluxos de bloqueio Rust, os construtores de corrente também exigem a quantidade observada:

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

`DrawdownAssetLock::new` toma três valores; `CancelAssetLock::new` toma dois. A omissão da quantidade restante esperada descreve uma forma de chamada mais antiga e insegura.

### 3. Compilhar a superfície de garantia Kotodama a partir de JavaScript; {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript não precisa inventar instruções nativas não-tipoadas. O compilador atual expõe o registro de custódia incorporado a Kotodama; implantação e chamadas seguem então [Construir e implantar um contrato inteligente ](./smart-contracts.md).

Salvar isto como `native_escrow.ko`:

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

Salvar o seguinte como `compile-native-escrow.mjs` e utilizar para compilar essa fonte exata a partir de Node.js:

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

Executa-o a partir do ambiente de pacote baseado na fonte descrito nos pré-requisitos:

```bash
node ./compile-native-escrow.mjs
```

## Verificar {#verify}

Para custódia no mercado, consulta `FindAssetEscrowById` e as possessões de ativos de ambas as partes após a liberação. O registro deve ser `Released`, nome do comprador aceitante e não mostrar nenhuma custódia restante. Para o bloqueio Python acima, retenha o devolvido ID e repita a consulta assinada:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

Além disso, consulte a posse de activos do destino e confirme que aumentou em quatro unidades. Um recibo de transação sem o registo do escrow e o estado pós-destino é uma verificação incompleta.

## Resolução de problemas {#troubleshooting}

- `Not permitted` A abertura geralmente significa que a autoridade não pode transferir o ativo selecionado em custódia. A resolução de litígios tem o sistema global `CanResolveEscrowDispute` O portão.
- A rejeição `expected remaining amount` é um conflito de otimismo-concurrência. Requerer o registro, decidir se a outra retirada/cancelação foi prevista e assinar uma nova instrução somente se o novo estado for aceitável.
- Só a autoridade de liberação configurada pode desenhar um fechamento confiável. O destino não pode liberá-lo simplesmente porque receberá os fundos.
- O lançamento no mercado só é válido após a aceitação e o estado de envio do pagamento; o cancelamento é limitado aos estados anteriores do ciclo de vida.
- A expiração usa o tempo do livro-razão autorizado. Não trate um cronograma local de relógio de parede como prova de que `ExpireAssetLock` vai passar.
- Uma falha de taxa pertence à parte que apresenta essa etapa do ciclo de vida: comprador, vendedor/abrior e autoridade de liberação independentemente em Taira.

## Fonte e documentos relacionados {#source-and-related-docs}

- [Modelo nativo de instrução em custódia no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)
- [Ensaios de integração nativa do escrow no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python Métodos de garantia do cliente no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama amostra de custódia nativa no compromisso fixado](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [Ativos nativos em garantia ](/pt/blockchain/escrow.md)
- [Ativos funcionais ](./fungible-assets.md)
- [Permissões e funções ](./permissions-and-roles.md)
