---
translation_locale: am
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የደንበኛው ውቅር {#client-configuration}

Iroha CLI እና SDK ደንበኞች የ TOML ውቅር ይጠቀማሉ. የመረጃ ቋቱ የአሁኑን ነባሪ በ `defaults/client.toml` ይላካል; የተፈጠሩ አካባቢያዊ አውታረ መረቦችም ወደ የውጤት ማውጫዎቻቸው ውስጥ የሚዛመድ `client.toml` ይጽፋሉ.

::: details የደንበኛው ውቅር አብነት

<<< @/snippets/client.template.toml

:::

## ዋና መስኮች {#core-fields}

ቢያንስ የደንበኛው ውቅር ሰንሰለት ፣ Torii መጨረሻ ነጥብ እና ፊርማ መለያን ይገልጻል-

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` ያቀረቡት ግብይቶች የሚገኙበትን ሰንሰለት ይመርጣል።
- `torii_url` ነጥቦች በባልደረባው Torii HTTP API።
- `[account].domain` በ CLI አቋራጭ መንገዶች እና በአድራሻ-ምርጫ ኮዲንግ ጥቅም ላይ ይውላል; ቀኖናዊው `AccountId` ራሱ የጎራ የሌለው ነው.
- `[account].public_key` እና `[account].private_key` የሚፈርሙ ግብይቶች።

ሂሳቡ ቀድሞውኑ በሰንሰለት ላይ መኖር አለበት ። በነባሪው አካባቢያዊ አውታረመረብ ይህ በተቀናጀ የጄኔዝስ ማኒፌስት ይስተናገዳል ።

::: info የጉዳይ ስሜታዊነት

Iroha ስሞች ከካኖኒካል ፓርሲንግ በኋላ ለጉዳዩ ስሜታዊ ናቸው ለምሳሌ ፣ `wonderland.universal` ፣ `Wonderland.universal` እና `looking_glass.universal` የተለዩ የጎራ ፊደላት ናቸው።

:::

## መሰረታዊ ማረጋገጫ {#basic-authentication}

አማራጭ `[basic_auth]` ክፍል አንድ ይጨምራል HTTP `Authorization` የደንበኞቹን ጥያቄዎች ራስጌ። Iroha እኩዮች እነዚህን የምስክር ወረቀቶች በቀጥታ አይተረጉሙም; ሲጠቀሙባቸው Torii እንደ Nginx ባሉ የኋላ ኋላ ወኪሎች ጀርባ ነው.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## የግብይት ቅንብሮች {#transaction-settings}

የግብይት ባህሪ በ `[transaction]` ክፍል ላይ የተመሠረተ ነው:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` በሚሊሰከንዶች ውስጥ የግብይት ዕድሜ ነው.
- `status_timeout_ms` ደንበኛው የግብይት ሁኔታን ለምን ያህል ጊዜ እንደሚጠብቅ ይቆጣጠራል።
- `nonce = true` ደንበኛው የተደጋገሙ ግብይቶች የተለያዩ ሃሽስ እንዲፈጥሩ አንድ ያልሆነ ነገር እንዲያካትት ይጠይቃል ።

## ረድፍ ቅንብሮችን ያገናኙ {#connect-queue-settings}

የአሁኑ Iroha ደንበኞች እንዲሁ ለአካባቢያዊ ረድፍ ሁኔታ አማራጭ የሆነውን `[connect]` ክፍል መጠቀም ይችላሉ-

```toml
[connect]
queue_root = "./queue"
```

አንድ የስራ ፍሰት ዘላቂ የደንበኛ ጎን ረድፍ ማከማቻ ሲፈልግ ይህንን ይጠቀሙ።

## ውቅር ማመንጨት {#generating-configurations}

ለአንድ ጊዜ የሚጣሉ አካባቢያዊ አውታረ መረቦች, Kagami ይመርጣል ምክንያቱም የሚዛመዱ የ Iroha 3 ቅንብሮች, ጅምር, ስክሪፕቶች እና README ስለሚጽፍ:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

የተፈጠረውን `./localnet/client.toml` ከ CLI ጋር ይጠቀሙ:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
