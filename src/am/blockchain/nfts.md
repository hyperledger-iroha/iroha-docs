---
translation_locale: am
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: bing-translator-llm
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
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
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

ለምሳሌ፣ `badge$docs.universal` በ`docs.universal` ጎራ ውስጥ ያለውን `badge` NFT ይለያል። የውሂብ ክፍተቱ ከተተወ፣ የአሁኑ ተንታኝ የ `universal` ዳታ ቦታን ይጠቀማል፣ ስለዚህ `badge$docs` ወደ `badge$docs.universal` ይፈታል።

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
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

የተፈጠረው አካባቢያዊ መረብ አስቀድሞ `wonderland.universal` እና SNS የሊዝ ውሉን አዘጋጅቷል። የተለየ ጎራ ለመጠቀም በመጀመሪያ በ[ጎራዎች](/am/blockchain/domains.md#registration) ውስጥ በተገለጸው ገላጭ `app alias setup plan` እና `app alias setup apply` የስራ ፍሰት ይፍጠሩት።

NFT ይመዝገቡ። ምዝገባ የመጀመሪያውን ይዘት JSON ከመደበኛ ግቤት ያነባል -

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

NFT ን በቀጥታ ይፈትሹ እና ከዚያ ሁሉንም NFTs ከሙሉ ግቤቶች ጋር ይዘርዝሩ -

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

ሜታዳታ ቁልፍ ያክሉ እና NFT ን እንደገና ያንብቡ -

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

የሜታዳታ ቁልፉን ያስወግዱ

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

እንደ አማራጭ NFT ን ያስተላልፉ። የአሁኑን ባለቤት ከ`owned_by` ለማንበብ `ledger nft get`ን ይጠቀሙ እና የመድረሻ መለያ መታወቂያ ለማግኘት `ledger account list all`ን ይጠቀሙ።

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

መመሪያውን ከጨረሱ በኋላ የምሳሌውን NFT ያስወግዱ። ካስተላለፉት ወደ ነበረበት ይመልሱት ወይም የአሁኑን ባለቤት መለያ ውቅር ተጠቅመው የምዝገባ-ማስወገጃ ትዕዛዙን ያስገቡ።

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
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
