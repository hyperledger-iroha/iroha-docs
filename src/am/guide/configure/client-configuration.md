---
translation_locale: am
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የደንበኛው ውቅር {#client-configuration}

Iroha CLI እና SDK ደንበኞች ይጠቀማሉ TOML ማቀናበሪያው
የአሁኑ ነባሪ `defaults/client.toml`; የተፈጠሩ አካባቢያዊ አውታረ መረቦች ደግሞ አንድ ይጻፉ
ማመሳሰል `client.toml` ወደ ውፅዓት ማውጫዎቻቸው።

::: details የደንበኛ ውቅር አብነት

<<< @/snippets/client.template.toml

:::

## ዋና መስኮች {#core-fields}

ቢያንስ አንድ የደንበኛ ውቅር ሰንሰለት ይለያል, Torii የመጨረሻ ነጥብ እና
የፊርማ ሂሳብ

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` የተላኩትን ግብይቶች የሚያካትት ሰንሰለት ይመርጣል።
- `torii_url` እኩዮቹ ላይ ነጥቦች Torii HTTP API.
- `[account].domain` ጥቅም ላይ ይውላል CLI አቋራጮች እና የአድራሻ-ምርጫ ኮዲንግ;
  የካኖኒክ `AccountId` ራሷም ጎራ የሌላት ናት።
- `[account].public_key` እና `[account].private_key` ግብይቶችን ይፈርማሉ።

ይህ መለያ ቀድሞውኑ በሰንሰለት ላይ መኖር አለበት. ለነባሪ አካባቢያዊ አውታረመረብ ይህ ነው
በጅነሲስ ማኒፌስት የተያዘ።

::: info የጉዳይ ስሜታዊነት

Iroha ስሞች ከካኖኒካል ፓርሲንግ በኋላ ለጉዳዩ ስሜታዊ ናቸው
`wonderland.universal`, `Wonderland.universal`, እና
`looking_glass.universal` የተለያየ ጎራ የቃል ቃላት ናቸው።

:::

## መሰረታዊ ማረጋገጫ {#basic-authentication}

አማራጭ `[basic_auth]` ክፍል አንድ ይጨምራል HTTP `Authorization` ወደ ራስጌ
የደንበኞቻችን ጥያቄ። Iroha እኩዮች እነዚህን የምስክር ወረቀቶች በቀጥታ አይተረጉሙም
እነዚህ Torii እንደ Nginx የመሳሰሉ የኋላ ኋላ ወኪል በስተጀርባ ነው.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## የግብይት ቅንብሮች {#transaction-settings}

የግብይት ባህሪ በ `[transaction]` ክፍል:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` የግብይት ዕድሜ በሚሊ ሰከንዶች ውስጥ ነው.
- `status_timeout_ms` ደንበኛው ለግብይት ምን ያህል ጊዜ እንደሚጠብቅ ይቆጣጠራል
  ሁኔታ።
- `nonce = true` ደንበኛው በተደጋጋሚ የሚደረጉ ግብይቶችን ለማካተት ይጠይቃል
  የተለያዩ ሃሽዎችን ያመርታሉ።

## ረድፍ ቅንብሮችን ያገናኙ {#connect-queue-settings}

የአሁኑ Iroha ደንበኞች ደግሞ አማራጭ መጠቀም ይችላሉ `[connect]` አካባቢያዊ ክፍል
ረድፍ ሁኔታ:

```toml
[connect]
queue_root = "./queue"
```

አንድ የስራ ፍሰት ዘላቂ የደንበኛ ጎን ረድፍ ማከማቻ ሲፈልግ ይህንን ይጠቀሙ።

## ቅንብሮችን መፍጠር {#generating-configurations}

ለአንድ ጊዜ የሚጠቀሙ አካባቢያዊ አውታረ መረቦች Kagami ምክንያቱም የሚዛመደው ይጽፋል Iroha
3 መለያዎች, ዘፍጥረት, ስክሪፕቶች, እና አንድ README:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

የተፈጠረውን ይጠቀሙ `./localnet/client.toml` ጋር CLI:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
