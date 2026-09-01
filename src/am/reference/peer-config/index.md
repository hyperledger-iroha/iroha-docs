---
translation_locale: am
translation_source: /reference/peer-config/index.md
translation_source_hash: dd44f8f12cc456d6f37e1ceb3e82cf4a979e80115c75e28dcb1fe4f29469aaf4
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# በማዋቀር ላይ Iroha {#configuring-iroha}

የአካባቢ አውታረ መረብ አቻ ውቅር ተቀናብሯል TOML ፋይሎች. ይህ በሰንሰለት ላይ ከተቀየረ ውቅር የተለየ ነው [`SetParameter`](/am/blockchain/instructions.md#setparameter) መመሪያዎች. የምርት ባህሪ በውቅር ውስጥ መወከል አለበት ፋይል ወይም በሰንሰለት ላይ ያለው መለኪያ; የአካባቢ ተለዋዋጮች የባህሪ በሮች አይደሉም።

ጥቅም [`--config`](../iroha3d-cli#arg-config) CLI ወደ ፋይሉ የሚወስደውን መንገድ ለመግለጽ ክርክር።

## አብነት {#template}

ለእያንዳንዱ ግቤት ዝርዝር መግለጫ ለማግኘት እባክዎ የ [መለኪያዎች](./params.md) ማጣቀሻውን ይመልከቱ።

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## የማዋቀሪያ ፋይሎችን ማቀናበር {#composing-configuration-files}

TOML የማዋቀሪያ ፋይሎች ወደ ሌላ TOML ፋይል(ዎች) የሚያመለክቱ ተጨማሪ `extends` መስክ አላቸው። አንድ ነጠላ መንገድ ወይም ብዙ መንገዶች ሊሆን ይችላል -

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha በ `extends` ውስጥ የተገለጹትን ሁሉንም ፋይሎች በተደጋጋሚ ያነባል እና ወደ ንብርብሮች ያዋህዳቸዋል፣ በኋላ ላይ የቀደሙትን በመለኪያ ደረጃ ይተካሉ። ለምሳሌ፣ `config.toml` ሲያነቡ -

::: code-group

```toml [config.toml]
extends = ["a.toml", "b.toml"]

[torii]
address = "0.0.0.0:8080"
```

```toml [a.toml]
chain = "whatever"
```

```toml [b.toml]
[torii]
address = "localhost:4000"
max_content_len = 2048
```

:::

የተገኘው ውቅር `chain` ከ`a.toml`፣ `max_content_len` ከ`b.toml`፣ እና `torii.address` ከ`config.toml` (`b.toml`) ይሆናል።

## መላ ፍለጋ {#troubleshooting}

ማለፍ [`--trace-config`](../iroha3d-cli#arg-trace-config) CLI ውቅሩ እንዴት እንደሚነበብ እና እንደሚተነተን ዱካ ለማየት ባንዲራ ያድርጉ።
