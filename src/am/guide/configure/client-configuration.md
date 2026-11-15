---
translation_locale: am
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# የደንበኛ ውቅር {#client-configuration}

Iroha CLI እና SDK ደንበኞች የ TOML ውቅር ይጠቀማሉ። ማከማቻው የአሁኑን ነባሪ በ `defaults/client.toml` ይልካል። የተፈጠሩ የአካባቢ አውታረ መረቦች እንዲሁ ተዛማጅ `client.toml` ወደ ውፅዓት ማውጫቸው ይጽፋሉ።

::: details የደንበኛ ውቅር አብነት

<<< @/snippets/client.template.toml

:::

## ዋና መስኮች {#core-fields}

ቢያንስ የደንበኛ ውቅር ሰንሰለቱን፣ የአውታረ መረቡን ማንነት፣ የTorii መገናኛ ነጥብ፣ የመለያውን የአውታረ መረብ አውድ እና የፊርማ ቁልፍ ይለያል:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` የቀረቡትን ግብይቶች ያሉበትን ሰንሰለት ይመርጣል።
- `network_id` ከgenesis የተመነጨ፣ እያንዳንዱ የተፈረመ ጥያቄ የሚያያዝበት የአውታረ መረብ ማንነት ነው። `network_id` ወይም `network_id_file` ከሁለቱ አንዱን ብቻ ያዋቅሩ፤ ኖድ እሴቱን በ`GET /v1/accounts/capabilities` ያሳውቃል።
- `torii_url` በኔትወርክ አቻ Torii HTTP API ላይ ይጠቁማል።
- `[account].chain_discriminant` የአውታረ መረቡን I105 የመለያ ቅድመ ቅጥያ ይመርጣል። ክፍት አውታረ መረቦች በምትኩ `[account].profile = "taira"` ወይም `"minamoto"` ሊጠቀሙ ይችላሉ። ከሁለቱ አንዱ ያስፈልጋል፣ ቀኖናዊው `AccountId` ራሱ ግን ጎራ የለውም።
- `[account].public_key` እና `[account].private_key` ግብይቶችን ይፈርማሉ፤ `private_key_file` የ`private_key` ምትክ ሊሆን ይችላል።

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

`iroha` CLI ለአካባቢያዊ የወረፋ ሁኔታ አማራጭ `[connect]` ክፍልም ያነባል። እንደገና ጥቅም ላይ የሚውለው የSDK ውቅር ይህን አይቀበልም:

```toml
[connect]
queue_root = "./queue"
```

ሂደት በደንበኛ በኩል የወረፋ ቋሚ ማከማቻ ሲፈልግ ይጠቀሙበት። የ`connect.queue_root` ነባሪ እሴት `~/.iroha/connect` ነው፤ አንጻራዊ መንገድ ደግሞ የደንበኛ TOML ፋይል ካለበት ማውጫ አንጻር ይፈታል።

## አወቃቀሮችን በማመንጨት ላይ {#generating-configurations}

ለሚጣሉ የአካባቢ አውታረ መረቦች፣ Kagami ን ይምረጡ ምክንያቱም ተዛማጅ Iroha 3 ውቅሮችን፣ የብሎክቼይን ጀነሲስን፣ ስክሪፕቶችን እና README ስለሚጽፍ -

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

የተፈጠረውን `./localnet/client.toml` ከ CLI ጋር ይጠቀሙ -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
