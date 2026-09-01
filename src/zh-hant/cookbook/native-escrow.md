---
translation_locale: zh-hant
translation_source: /cookbook/native-escrow.md
translation_source_hash: 576e03924f19b63681cdfafa641b996672e35a992478fc9eaf5b83f0e7baa6da
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# 產業資產保證 {#native-asset-escrow}

## 結果 {#outcome}

選擇市場託管和目標繫結資產鎖,用 Rust 或 Python 執行當前輸入的生命週期,將每個鎖試連線到您實際觀察到的剩餘金額,並從 JavaScript 編譯本地 Kotodama 託管表面.

## 預先條件 {#prerequisites}

- 數字資產定義和擁有足夠數量的開放者/賣方.
- 提供資金,單鑰匙 I105 每個提交步驟的客戶.使用現場授權付費 `fee_payment` 目的,其費用資產與當前相匹配 Taira 管響應;不嵌入資產 ID 根據檔案.
- Rust 或 Python SDK 的電流從 Iroha 提交 `0010c5a70039eac101a4846499ba9ceaf43eb65c`.
- 對於 JavaScript 編譯器的例子,Node.js 24加上本地構建的 `@iroha/iroha-js`包及其原生 `iroha_js_host`;遵循[JavaScript SDK 源構建設定](/zh-hant/guide/tutorials/javascript.md#build-from-source).瀏覽器構建必須提供 `compilerUrl`而不是載入原生主機.
- Taira 必須承認資產轉讓和保證指令.資產所有者可以使用其資產政策允許的普通生命週期;解決爭端需要全球的 `CanResolveEscrowDispute`許可.在缺席必要的公共網路授權主體時,使用生成的本地網路.

市場託管模式是賣家,買家,鏈外支付和釋放.通用鎖定名稱一個目的地和可選的單獨釋放許可權;它們支援部分撤銷,取消和過期.

## 步驟 {#steps}

### 1. 用 Rust 完成市場保證. {#_1-complete-a-marketplace-escrow-with-rust}

這種函式接收了實型別的 IDs 和客戶.它開啟了40個單位,讓買家接受並標記鏈外支付,然後讓賣方釋放監管權.每個提交都會透過 `FeePaymentIntent`命名授權費付款人.

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

儲存帳戶由帳本管理. 授予正常資產轉讓代幣並不使活躍的儲存在保證券生命週期之外可剝離.

### 2. 用 Python 開啟並部分繪製通用鎖. {#_2-open-and-partially-draw-a-generic-lock-with-python}

發放機構在撤銷之前查詢已簽署的原始記錄.透過確切的 `remaining_amount`提供了樂觀的同步性:一個陳舊的並行請求被拒絕,而不是兩次扣除保證權.

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

當 Python SDK 被遺漏時,可以自動查詢`expected_remaining_amount`,但透過觀察值使簽署的經濟先決條件可見於應用程式程式碼中.

對於 Rust 鎖流,電流構造器還需要觀察到的數量:

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

`DrawdownAssetLock::new`取三個值; `CancelAssetLock::new`取兩個. 省略預期剩餘數量描述了一個較舊的,不安全的呼叫形式.

### 3. 從 JavaScript 編譯 Kotodama 託管表面. {#_3-compile-the-kotodama-escrow-surface-from-javascript}

JavaScript 無需自行構造無型別的原生指令。目前編譯器向 Kotodama 公開帳本託管內建函式；部署和呼叫隨後遵循[建置並部署智慧合約](./smart-contracts.md)。

儲存為 `native_escrow.ko`:

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

以 `compile-native-escrow.mjs`儲存下文,並使用它從 Node.js 編譯出那個精確的來源:

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

執行從前列條件中所描述的源構建包裝環境:

```bash
node ./compile-native-escrow.mjs
```

## 驗證 {#verify}

對於市場託管,查詢 `FindAssetEscrowById` 和雙方釋出後的資產持有.記錄必須是`Released`,命名接受買家,並沒有顯示剩餘保管權.對上述 Python 鎖來說,保留返回的 ID 並重復簽署的查詢:

```python
record = client.get_asset_escrow(
    escrow_id=escrow_id,
    authority=release_authority,
    private_key=release_private_key,
)
assert escrow_status(record) == "Locked"
assert Decimal(str(record["remaining_amount"])) == Decimal("6")
```

也查詢目的地資產持有量,並確認其增長了4個單位. 沒有保證記錄和目的地後狀態的交易收據是不完整的驗證.

## 解決問題 {#troubleshooting}

- `Not permitted`在開放時通常意味著該機構無法將選定的資產轉移到保管中.爭端解決有單獨的全球 `CanResolveEscrowDispute`門口.
- `expected remaining amount`拒絕是樂觀與競爭的衝突.重新查詢記錄,決定是否打算另一個撤銷/取消,並且只簽署新指示,如果新的狀態是可接受的.
- 只有配置的釋放授權主體才能繪製一個值得信賴的鎖.目的地不能僅僅因為它將收到資金而釋放.
- 市場釋出僅在接受和支付傳送狀態後才有效;取消限於更早的生命週期狀態.
- 截止日期使用權威的賬本時間. 不要把當地的牆鍾截止時間視為證明`ExpireAssetLock`將透過.
- 收費失效屬於提交該生命週期步驟的當事人.基金購買者,賣方/開放者和獨立釋放許可權在 Taira.

## 來源及相關檔案 {#source-and-related-docs}

- [在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/isi/escrow.rs)上,本地保證指令模型
- [在固定的提交中進行本地保證券整合測試](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/native_escrow.rs)
- [Python 託管客戶的方法在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/src/iroha_python/client.py)
- [Kotodama 本地保證券樣本在固定提交](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/kotodama_lang/src/samples/native_escrow.ko)
- [原生資產託管](/zh-hant/blockchain/escrow.md)
- [性資產](./fungible-assets.md)
- [許可證和角色](./permissions-and-roles.md)
