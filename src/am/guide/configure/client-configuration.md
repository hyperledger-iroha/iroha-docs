---
translation_locale: am
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የደንበኛ ውቅር {#client-configuration}

Iroha CLI እና SDK ደንበኞች የ TOML ውቅር ይጠቀማሉ። ማከማቻው የአሁኑን ነባሪ በ `defaults/client.toml` ይልካል። የተፈጠሩ የአካባቢ አውታረ መረቦች እንዲሁ ተዛማጅ `client.toml` ወደ ውፅዓት ማውጫቸው ይጽፋሉ።

::: details የደንበኛ ውቅር አብነት

<<< @/snippets/client.template.toml

:::

## ዋና መስኮች {#core-fields}

ቢያንስ፣ የደንበኛ ውቅር ሰንሰለቱን፣ Torii API የመጨረሻ ነጥብን እና መለያን መፈረም ይለያል -

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` የቀረቡትን ግብይቶች ያሉበትን ሰንሰለት ይመርጣል።
- `torii_url` በኔትወርክ አቻ Torii HTTP API ላይ ይጠቁማል።
- `[account].domain` በ CLI አቋራጮች እና አድራሻ-መራጭ ኢንኮዲንግ ጥቅም ላይ ይውላል; ነጠላ ፕሮቶኮል-ስታንዳርድ `AccountId` ራሱ ጎራ የሌለው ነው።.
- `[account].public_key` እና `[account].private_key` ግብይቶችን ይፈርማሉ።

መለያው አስቀድሞ በሰንሰለት ላይ መኖር አለበት። ለነባሪው የአካባቢ አውታረመረብ፣ ይህ የሚስተናገደው በተጠቀለለው blockchain ጀነሲስ ቴክኒካል ማኒፌስት ነው።

::: info የጉዳይ ትብነት

Iroha ስሞች ከነጠላ ፕሮቶኮል-መደበኛ ትንተና በኋላ ለጉዳይ ሚስጥራዊነት ያላቸው ናቸው።. ለምሳሌ፣ `wonderland.universal`፣ `Wonderland.universal` እና `looking_glass.universal` የተለዩ የጎራ ቃል በቃል ናቸው።

:::

## መሰረታዊ ማረጋገጫ {#basic-authentication}

የአማራጭ `[basic_auth]` ክፍል ለደንበኛ ጥያቄዎች HTTP `Authorization` ራስጌን ይጨምራል። Iroha የአውታረ መረብ እኩዮች እነዚህን ምስክርነቶች በቀጥታ አይተረጉሙም; Torii እንደ Nginx ካሉ የተገላቢጦሽ ፕሮክሲ ጀርባ ሲሆን ይጠቀሙባቸው።

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## የግብይት ቅንብሮች {#transaction-settings}

የግብይት ባህሪ ከ`[transaction]` ክፍል ጋር ተዋቅሯል -

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` የግብይቱ የህይወት ዘመን በሚሊሰከንዶች ውስጥ ነው።
- `status_timeout_ms` ደንበኛው የግብይት ሁኔታን ለምን ያህል ጊዜ እንደሚጠብቅ ይቆጣጠራል።
- `nonce = true` ደንበኛው የምስጠራ ኖሴ እሴትን እንዲያካትት ይጠይቃል ስለዚህ ተደጋጋሚ ግብይቶች የተለያዩ ምስጠራ ሃሽዎችን ያመነጫሉ።

## የወረፋ ቅንብሮችን ያገናኙ {#connect-queue-settings}

የአሁኑ Iroha ደንበኞች ለአካባቢያዊ ወረፋ ሁኔታ አማራጭ `[connect]` ክፍልን መጠቀም ይችላሉ -

```toml
[connect]
queue_root = "./queue"
```

የስራ ፍሰት ዘላቂ የደንበኛ-ጎን ወረፋ ማከማቻ ሲፈልግ ይህንን ይጠቀሙ።

## አወቃቀሮችን በማመንጨት ላይ {#generating-configurations}

ለሚጣሉ የአካባቢ አውታረ መረቦች፣ Kagami ን ይምረጡ ምክንያቱም ተዛማጅ Iroha 3 ውቅሮችን፣ የብሎክቼይን ጀነሲስን፣ ስክሪፕቶችን እና README ስለሚጽፍ -

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

የተፈጠረውን `./localnet/client.toml` ከ CLI ጋር ይጠቀሙ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
