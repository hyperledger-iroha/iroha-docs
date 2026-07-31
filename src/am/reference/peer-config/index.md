---
translation_locale: am
translation_source: /reference/peer-config/index.md
translation_source_hash: 5cc6ddf62a45f655d61a0ff3ebc7e20b939fe78c9d542087b717c2e17e19250d
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ማዋቀር Iroha {#configuring-iroha}

አካባቢያዊ የእኩዮች ውቅር ተዘጋጅቷል TOML ፋይሎች. ይህ ሰንሰለት ላይ ከ የተለየ ነው
ውቅር በ [`SetParameter`](/am/blockchain/instructions.md#setparameter)
መመሪያዎች. የምርት ባህሪው በቅንብሮች ፋይል ውስጥ መገለጽ አለበት
ወይም በሰንሰለት ላይ ያለው መለኪያ; የአካባቢ ተለዋዋጮች የፊት በር አይደሉም.

አጠቃቀም [`--config`](../irohad-cli#arg-config) CLI ወደ ውቅር ፋይል የሚወስደውን መንገድ ለመግለጽ አመክንዮ።

## አብነት {#template}

ለእያንዳንዱ መለኪያ ዝርዝር መግለጫ ለማግኘት እባክዎን [መለኪያዎች](./params.md) ማጣቀሻ።

::: details `peer.template.toml`

<<< @/snippets/peer.template.toml

:::

## የመዋቅር ፋይሎችን ማዘጋጀት {#composing-configuration-files}

TOML የኮንፊግሬሽን ፋይሎች ተጨማሪ `extends` ወደ ሌላ ቦታ የሚያመለክቱ መስኮች TOML ይህ አንድ መንገድ ወይም
በርካታ መንገዶች:

::: code-group

```toml [Single]
extends = "single-path.toml"
```

```toml [Multiple]
extends = ["file1.toml", "file2.toml"]
```

:::

Iroha በ ውስጥ የተጠቀሱትን ሁሉንም ፋይሎች በተደጋጋሚ ያነባል `extends` በደረጃዎችም አደረግን ፡ ፡ በመጨረሻዎቹም (በመጽሐፉ) ላይ ይጋጫሉ ፡ ፡
ለምሳሌ ያህል, ማንበብ ከሆነ `config.toml`:

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

The የሚመጣው ውቅር `chain` ከ `a.toml`, `max_content_len` ከ `b.toml`, እና `torii.address` ከ
`config.toml` (በላይ ተጽፏል `b.toml`).

## ችግር መፍታት {#troubleshooting}

ማለፍ [`--trace-config`](../irohad-cli#arg-trace-config) CLI ኮንፊግሬሽኑ እንዴት እንደሚነበብ እና እንደሚመረመር ለመመልከት ባንዲራ።
