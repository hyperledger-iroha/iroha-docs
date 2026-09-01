---
translation_locale: zh-hant
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# 公有與私有區塊鏈 {#public-and-private-blockchains}

Iroha 可採用多種設定執行。身為自有網路的管理員，您可以決定由哪個執行器與許可權政策判定是否接受交易。

常見的設定模式包括 _私有_ 許可制網路，以及較開放的 _公有_ 網路。兩者皆透過創世狀態與執行器政策設定，而非使用不同的節點執行檔。

以下概述這兩種使用情境的主要差異。

## 許可權 {#permissions}

在 _公有_ 區塊鏈中，大多數帳戶擁有相同的一組許可權。在 _私有_ 區塊鏈中，每個帳戶只取得明確授予的許可權。

::: info

詳細資訊請參閱[許可權專章](/zh-hant/blockchain/permissions.md)。

:::

## 對等節點 {#peers}

在 _公有_ 區塊鏈中，對等節點的准入屬於鏈上政策的一部分。對於 _私有_ 區塊鏈，部署通常會在設定與創世區塊中固定受信任的對等節點集合。

::: info

詳細資訊請參閱[對等節點管理](peer-management.md)。

:::

## 註冊帳戶 {#registering-accounts}

依照您設定[創世區塊（`genesis.json`）](genesis.md)的方式，帳戶註冊流程可能採取兩種方式之一。要理解原因，必須先說明許可權。

所選執行器會定義適用的許可權檢查。您可以在創世區塊中授予預設[許可權權杖](/zh-hant/blockchain/permissions.md)，藉此建立由管理員管理的私有網路，或較開放的網路。這些許可權啟用後，帳戶註冊流程便會有所不同。

公有與私有網路的註冊政策通常不同：

- _公有_ 註冊政策會接受任何符合資格的使用者所提交的帳戶註冊[^1]。使用者需要合適的使用者端、採用受支援演演算法的私鑰，以及政策會接受的註冊要求。

- _私有_ 註冊政策可以授權單一帳戶或單一智慧合約提交註冊。自訂政策可以將註冊限制在特定時段，也可以要求提交者花費供應量固定的權杖；由於沒有任何許可權主體獲準鑄造更多權杖，其供應量因此保持固定。

- 採用預設私有網路模式時，每個新帳戶皆由既有帳戶代為提交註冊。

預設許可權驗證器涵蓋典型的私有區塊鏈使用情境。

::: info

公有與私有模式是執行器和創世政策的選擇，兩者使用相同的節點執行檔。執行開放網路前，請檢查所選執行器與創世區塊許可權。

:::

如需 `Register<Account>` 指令的詳細資訊，請參閱[指令](/zh-hant/blockchain/instructions.md#un-register)一節。

[^1]: `Register<Account>` 會為規範且不含網域的 `AccountId` 建立帳本狀態；網域路由與帳戶別名會分別管理。
