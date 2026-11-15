---
translation_locale: am
translation_source: /blockchain/nfts.md
translation_source_hash: 76608347790f14eb5a2d58ac26f0e194ccc34b1cb5e8983e2d6ac390fcb60ec6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# NFTs {#nfts}

አንድ Iroha NFT አንድ ባለቤት ያለው ልዩ የብሎክቼይን መዝገብ ነገር ነው። አንድ መዝገብ የራሱ ማንነት፣ ሜታዳታ፣ የህይወት ኡደት ክስተቶች እና የባለቤትነት ማስተላለፊያ ትርጓሜዎች ሲፈልግ NFTs ን ይጠቀሙ፣ ነገር ግን የቁጥር ቀሪ ሒሳብ አያስፈልገውም።

ከቁጥር [ንብረት](/am/blockchain/assets.md) በተለየ፣ NFT ትክክለኛነት፣ የንብረት አሰጣጥ ፖሊሲ ወይም የመለያ መጠን የለውም። NFT እንደ አንድ የተመዘገበ ነገር አለ፣ እና ባለቤትነት በቀጥታ በዚያ ነገር ላይ ክትትል ይደረግበታል።

## መዋቅር {#structure}

የተመዘገበ `Nft` የሚከተሉትን ያጠቃልላል -

- `id` አንድ `NftId`
- `content` NFT የሚገልፅ ሜታዳታ
- `owned_by` የ NFT

የ`content` መስክ የ`Metadata` ካርታ ነው። የታመቀ ያድርጉት ገላጭ መስኮችን፣ የተረጋጉ ማጣቀሻዎችን፣ ምስጠራ ሃሽዎችን፣ URIs ወይም SoraFS መንገዶችን እዚያ ያከማቹ። ትላልቅ ሰነዶችን፣ ሚዲያዎችን ወይም ከፍተኛ-ጩኸት የመተግበሪያ ሁኔታን ከሰንሰለት ውጪ ያከማቹ እና በ NFT ላይ ሊረጋገጥ የሚችል ማጣቀሻ ብቻ ያስቀምጡ።

## ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

የህዝብ Taira የሙከራ መረብ በአሁኑ ጊዜ NFT መዝገቦች እንዳሉት ያረጋግጡ -

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nft_ids: [.items[].id]}'
```

በኖድ ለተጋለጡ NFT መንገዶች የቀጥታ OpenAPI ሰነዱን ያረጋግጡ -

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

ባዶ `items` ድርድር በይፋዊ የሙከራ መረብ ላይ ትክክለኛ ምላሽ ነው። አሁን ባለው ገጽ ላይ ምንም NFTs የለም ማለት ነው, NFT መመሪያዎች አይገኙም ማለት አይደለም.

## NFT መታወቂያዎች {#nft-ids}

`NftId` ይህን የጽሑፍ ቅጽ ይጠቀማል -

```text
name$domain
name$domain.dataspace
```

ለምሳሌ `badge$docs.universal` በ`docs.universal` ጎራ ውስጥ ያለውን `badge` NFT ይለያል። የውሂብ ቦታው ካልተጠቀሰ አሁን ያለው ፓርሰር `universal` የውሂብ ቦታን ይጠቀማል፤ ስለዚህ `badge$docs` ወደ `badge$docs.universal` ይፈታል።

ለ NFT መታወቂያዎች የተረጋጋ ስሞችን ተጠቀም። መታወቂያው በመመሪያዎች፣ መጠይቆች፣ ፈቃዶች፣ የክስተት ማጣሪያዎች እና የመተግበሪያ ማጣቀሻዎች ጥቅም ላይ የሚውለው የነገር ማንነት ነው።

## የሕይወት ዑደት {#lifecycle}

NFT የሕይወት ዑደት ክዋኔዎች ይጠቀሙ Iroha የመመሪያ ስራዎች

- [`Register`](/am/blockchain/instructions.md#un-register) ይፈጥራል NFT ከመጀመሪያው ጋር `content`.
- [`Unregister`](/am/blockchain/instructions.md#un-register) ያስወግዳል NFT.
- [`Transfer`](/am/blockchain/instructions.md#transfer) ለውጦች `owned_by`.
- [`SetKeyValue` እና `RemoveKeyValue`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue) አዘምን NFT ሜታዳታ.

## በአገር ውስጥ ይሞክሩት {#try-it-locally}

እነዚህ ምሳሌዎች የአካባቢ አውታረ መረብ እንደጀመሩ እና የመነጨውን የደንበኛ ውቅር ከ[CLI መመሪያ](/am/get-started/operate-iroha-via-cli.md) እንዳለዎት ያስባሉ -

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN='<OWNED_DOMAIN>.universal'
export NFT_ID="badge_intro\$$NFT_DOMAIN"
```

የተፈጠረ አካባቢያዊ አውታረ መረብ ለደንበኛው የመተግበሪያ ጎራ አይመዘግብም። `NFT_DOMAIN`ን ፈራሚው መለያ ባለቤት ወደሆነበት ወይም `CanRegisterNft` ፈቃድ ወዳለው ጎራ ያዘጋጁ። አዲስ ለመፍጠር በ[ጎራዎች](/am/blockchain/domains.md#registration) የተገለጸውን አዋጅ መሰል `app alias setup plan` እና `app alias setup apply` ሂደት ይጠቀሙ።

NFT ይመዝገቡ። ምዝገባ የመጀመሪያውን ይዘት JSON ከመደበኛ ግቤት ያነባል -

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft register --id "$NFT_ID"
```

NFT ን በቀጥታ ይፈትሹ እና ከዚያ ሁሉንም NFTs ከሙሉ ግቤቶች ጋር ይዘርዝሩ -

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list --all
```

ሜታዳታ ቁልፍ ያክሉ እና NFT ን እንደገና ያንብቡ -

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

የሜታዳታ ቁልፉን ያስወግዱ

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

ከፈለጉ NFTን ያስተላልፉ። የአሁኑን ባለቤት ከ`owned_by` ለማንበብ `ledger nft get`፣ የመዳረሻ መለያ ID ለማግኘትም `account list --all` ይጠቀሙ።

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  account list --all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

መመሪያውን ከጨረሱ በኋላ የምሳሌውን NFT ያስወግዱ። ካስተላለፉት ወደ ነበረበት ይመልሱት ወይም የአሁኑን ባለቤት መለያ ውቅር ተጠቅመው የምዝገባ-ማስወገጃ ትዕዛዙን ያስገቡ።

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft unregister --id "$NFT_ID"
```

## ጥያቄዎች እና ኩነቶች {#queries-and-events}

ጥቅም [`FindNfts`](/am/reference/queries.md#assets-nfts-and-rwas) ለመዘርዘር NFTs እና [`FindNftsByAccountId`](/am/reference/queries.md#assets-nfts-and-rwas) ለመዘርዘር NFTs በመለያ ባለቤትነት የተያዘ።

NFT ምዝገባ፣ መሰረዝ፣ ማስተላለፍ እና ሜታዳታ ዝመናዎች NFT የውሂብ ክስተቶችን ያመነጫሉ። ለblockchain መዝገብ ለውጦች ሲመዘገቡ ወይም ለ NFT የህይወት ኡደት ክስተቶች ምላሽ የሚሰጡ ቀስቅሴዎችን ሲገነቡ የ`Nft` የውሂብ ክስተት ማጣሪያን ይጠቀሙ።

## ፈቃዶች {#permissions}

ነባሪው የፍቃድ ገጽ NFT -ተኮር ቶከኖችን ያካትታል -

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

የፍቃድ ፍተሻዎች የሚተገበሩት በነቃ የሶፍትዌር ማስፈጸሚያ አካባቢ አረጋጋጭ ነው፣ ስለዚህ አውታረ መረብ አስፈፃሚውን በማሻሻል ፍቃድን ማበጀት ይችላል። ለአሁኑ ነባሪ ቶከን ዝርዝር [የፍቃድ ቶከኖች](/am/reference/permissions.md) ይመልከቱ።

## NFTs ን መምረጥ {#choosing-nfts}

ልዩነት እና ባለቤትነት አስፈላጊ ለሆኑ መዝገቦች NFT ይጠቀሙ -

- የምስክር ወረቀቶች፣ ባጆች፣ ፈቃዶች እና ማረጋገጫዎች
- የአባልነት ወይም የመዳረሻ መዝገቦች
- ከማንነት ጋር የተያያዙ ወይም በመለያ የተያዙ የመተግበሪያ መዝገቦች
- ከሰንሰለት ውጪ ሚዲያዎች፣ ሰነዶች ወይም ቴክኒካዊ ማገለጫዎች ማጣቀሻዎች

ለፈንገስ ቀሪ ሒሳቦች የቁጥር ንብረትን ይጠቀሙ እና ውሂቡ የነባር የብሎክቼይን መዝገብ ነገር የታመቀ ባህሪ ብቻ ሲሆን ግልጽ [ሜታዳታ](/am/blockchain/metadata.md) ይጠቀሙ።

በተጨማሪ አንብበው

- [ንብረቶች](/am/blockchain/assets.md)
- [ሜዳዳታ](/am/blockchain/metadata.md)
- [መመሪያዎች](/am/blockchain/instructions.md)
- [መጠይቆች](/am/blockchain/queries.md)
