---
translation_locale: am
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha ን ማዋቀር {#configuring-iroha}

የአካባቢያዊ የእኩዮች ውቅር በ TOML ፋይሎች ውስጥ ተዘጋጅቷል ። ይህ በ [ `SetParameter`](/am/blockchain/instructions.md#setparameter) መመሪያዎች ከተቀየረው በሰንሰለት ላይ ካለው ውቅር የተለየ ነው። የምርት ባህሪው በቅንጅት ፋይል ወይም በ ሰንሰለት ላይ ባለው መለኪያ መወከል አለበት ፣ የአከባቢ ተለዋዋጮች የባህር በር አይደሉም ።

አጠቃቀም [`--config`](../irohad-cli#arg-config) CLI ወደ ውቅር ፋይል የሚወስደውን መንገድ ለመግለጽ አመክንዮ።

## አብነት {#template}

የእያንዳንዱን መለኪያ ዝርዝር መግለጫ ለማግኘት [Parameters](./params.md) ን ይመልከቱ።

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## የመዋቅር ፋይሎችን ማዘጋጀት {#composing-configuration-files}

የ TOML ውቅር ፋይሎች ወደ ሌሎች TOML ፋይሎች የሚጠቁሙ ተጨማሪ `extends` መስክ አላቸው ። አንድ ነጠላ መንገድ ወይም በርካታ መንገዶች ሊሆኑ ይችላሉ-

::: የኮድ ቡድን

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha በ `extends` ውስጥ የተጠቀሱትን ሁሉንም ፋይሎች በቀጣይነት ያነባል እና ወደ ንብርብሮች ይደራጃል ፣ ይህም የመጨረሻዎቹ የቀድሞዎቹን በፓራሜትር ደረጃ ይደባለቃሉ ። ለምሳሌ ፣ የ `config.toml` ንባብ ከሆነ

::: የኮድ ቡድን

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

የተገኘው ውቅር ይሆናል `chain` ከ `a.toml`, `max_content_len` ከ `b.toml`, እና `torii.address` ከ `config.toml` (በላይ የተጻፈ) `b.toml`).

## ችግሮችን መፍታት {#troubleshooting}

ኮንፊግሬሽኑ እንዴት እንደሚነበብ እና እንደሚመረመር አንድ ፍለጋ ለማየት [`--trace-config`](../irohad-cli#arg-trace-config) CLI ባንዲራውን ያለፍ ።
