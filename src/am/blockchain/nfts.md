---
translation_locale: am
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT አንድ ባለቤት ያለው ልዩ መቁጠሪያ ዕቃ ነው። መዝገብ የራሱ ማንነት ፣ ሜታዳታ ፣ የሕይወት ዑደት ክስተቶች እና የባለቤትነት ማስተላለፍ ትርጓሜዎች ሲያስፈልጋቸው ግን የቁጥር ሚዛን የማይፈልጉበት ጊዜ NFTs ይጠቀሙ።

ከቁጥር [ ሀብት ](/am/blockchain/assets.md) በተቃራኒው NFT ትክክለኛነት ፣ የማጣራት ችሎታ ወይም በሂሳብ ብዛት የለውም ። NFT እንደ አንድ የተመዘገበ ንጥረ ነገር ይኖራል ፣ እና ባለቤትነት በቀጥታ በዚያ ንጥረ ነገር ላይ ተከትሏል ።

## መዋቅር {#structure}

የተመዘገበ `Nft` የሚከተሉትን ያካትታል፦

- `id`: አንድ `NftId`
- `content`: የ NFT ን የሚገልጽ ሜታዳታ
- `owned_by`: የ NFT ባለቤት የሆነበት ሂሳብ

የ `content` መስክ አንድ `Metadata` ካርታ ነው. የታመቀ ያድርጉት: የመግለጫ መስኮችን, የተረጋጋ ማጣቀሻዎችን, ሃሽስ, URIs ወይም SoraFS መንገዶችን እዚያ ያስቀምጡ. ትላልቅ ሰነዶችን, ሚዲያዎችን, ወይም ከፍተኛ-ጥንካሬ አፕሊኬሽን ሁኔታን ከሰንሰለት ውጭ ያስቀምጡ እና በ NFT ላይ ብቻ የሚረጋገጥ ማጣቀቂያ ይያዙ.

## Taira ላይ ይሞክሩት {#try-it-on-taira}

የህዝብ Taira የሙከራ ኔትወርክ በአሁኑ ጊዜ NFT መዝገቦችን እንዳለው ያረጋግጡ:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

የ NFT ጎዳናዎች በኖዱ የተጋለጡበትን የቀጥታ OpenAPI ሰነድ ይመልከቱ:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

ባዶ የሆነ `items` ቅደም ተከተል በአደባባይ የሙከራ አውታረመረብ ላይ ትክክለኛ ምላሽ ነው ። ይህ ማለት አሁን ባለው ገጽ ውስጥ ምንም NFTs የለም ማለት አይደለም ፣ የ NFT መመሪያዎች አይገኙም ።

## NFT IDs {#nft-ids}

`NftId` የሚከተለውን ጽሑፍ ይጠቀማል፦

```text
name$domain
name$domain.dataspace
```

ለምሳሌ፣ `badge$docs.universal` የሚያመለክተው `badge` NFT በ `docs.universal` የውሂብ ቦታው ካልተወገደ፣ የአሁኑ አሳሽ የ `universal` የውሂብ ቦታ, ስለዚህ `badge$docs` የሚወስነው `badge$docs.universal`.

ለ NFT IDs የተረጋጋ ስሞችን ይጠቀሙ። ID መመሪያዎችን ፣ መጠይቆችን ፣ ፍቃዶችን ፣ ክስተት ማጣሪያዎችን እና የመተግበሪያ ማጣቀሻዎችን የሚያገለግል የንጥረ ነገር ማንነት ነው.

## የሕይወት ዑደት {#lifecycle}

NFT የህይወት ዑደት ስራዎች አጠቃቀም Iroha ልዩ መመሪያዎች:

- [`Register`](/am/blockchain/instructions.md#un-register) የመጀመሪያውን `content` ጋር NFT ይፈጥራል.
- [`Unregister`](/am/blockchain/instructions.md#un-register) የ NFT ን ያስወግዳል.
- [`Transfer`](/am/blockchain/instructions.md#transfer) ለውጦች `owned_by`.
- [`SetKeyValue` እና `RemoveKeyValue`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue) የዘመነ NFT ሜታዳታ።

## በአካባቢህ ሞክር {#try-it-locally}

እነዚህ ምሳሌዎች እርስዎ አካባቢያዊ አውታረ መረብ ጀምረዋል እና ከ [CLI መመሪያ ](/am/get-started/operate-iroha-via-cli.md) የተፈጠረ የደንበኛ ውቅር አላቸው ይገምታሉ:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

የተፈጠረው አካባቢያዊ አውታረመረብ ቀድሞውኑ ይዘጋጃል `wonderland.universal` እና የእሱ SNS ለየት ያለ ጎራ ለመጠቀም በመጀመሪያ በመግለጫው `app alias setup plan` እና `app alias setup apply` የስራ ፍሰት በ [ጎራዎች](/am/blockchain/domains.md#registration).

አንድ NFT ይመዝገቡ። ምዝገባው ከመደበኛ ግብዓት የመጀመሪያውን ይዘት JSON ያነባል-

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

NFT ን በቀጥታ ይፈትሹ እና ከዚያ ሁሉንም NFTs ሙሉ ማስታወሻዎችን ያቅርቡ:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

አንድ ሜታዳታ ቁልፍ ይጨምሩ እና NFT ን እንደገና ያንብቡ:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

የሜታዳታ ቁልፍን ያስወግዱ:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

በፈቃደኝነት የ NFT. አጠቃቀም `ledger nft get` የአሁኑ ባለቤት ማንበብ `owned_by`, እና አጠቃቀም `ledger account list all` የመድረሻ ሂሳብ ለማግኘት ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

NFT ከተሰጡ ይህን ትእዛዝ የአሁኑ ባለቤት መለያ ውቅር ጋር ያሂዱ ወይም NFT ወደ ኋላ በመጀመሪያ ማስተላለፍ.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## ጥያቄዎችና ክስተቶች {#queries-and-events}

[`FindNfts`](/am/reference/queries.md#assets-nfts-and-rwas) በመጠቀም NFTs እና [`FindNftsByAccountId`](/am/reference/queries.md#assets-nfts-and-rwas) ለመጠቀም መለያ ባለቤት የሆኑትን NFTs ለመዘርዘር.

NFT ምዝገባ, መሰረዝ, ዝውውር እና ሜታዳታ ዝማኔዎች NFT የውሂብ ክስተቶችን ያወጣሉ. ለፕሮግራም መለያ ለውጦች ሲመዘገቡ ወይም ለ NFT የሕይወት ዑደት ክስተቶች ምላሽ የሚሰጡ የግንባታ ማነቃቂያዎችን በሚጠቀሙበት ጊዜ የ `Nft` የመረጃ ክስተት ማጣሪያ ይጠቀሙ.

## ፍቃዶች {#permissions}

ነባሪ ፍቃድ ገጽ የ NFT ልዩ ምልክቶችን ያካትታል:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

የፍቃድ ፍተሻዎች በንቃት የሂደት ጊዜ ማረጋገጫ አማካኝነት ይፈጸማሉ ፣ ስለሆነም አውታረመረብ አስፈፃሚውን በማሻሻል ፈቃድ ማበጀት ይችላል ። ለአሁኑ ነባሪ ምልክት ዝርዝር [ፍቃድ ቶከኖችን ](/am/reference/permissions.md) ይመልከቱ።

## NFTs መምረጥ {#choosing-nfts}

ልዩነት እና ባለቤትነት አስፈላጊ በሆነባቸው መዝገቦች ላይ NFT ይጠቀሙ

- የምስክር ወረቀቶች፣ አርማዎች፣ ፈቃዶችና ማረጋገጫዎች
- የአባልነት ወይም የመዳረሻ መዝገቦች
- ማንነት የታሰረ ወይም በሂሳብ የተያዘ የመልዕክት መዝገብ
- ከሰንሰለት ውጭ ለሚገኙ ሚዲያዎች፣ ሰነዶች ወይም ማኒፌሶች የሚያመለክቱት

ለፈንጂቢል ሚዛኖች የቁጥር ንብረትን ይጠቀሙ ፣ እና ውሂቡ ነባር መቁጠሪያ ዕቃ የተዋሃደ ባህሪ ብቻ በሚሆንበት ጊዜ ቀላል [ ሜታዳታ ](/am/blockchain/metadata.md) ይጠቀሙ ።

በተጨማሪም ተመልከት።

- [ንብረቶች](/am/blockchain/assets.md)
- [ሜታ መረጃዎች](/am/blockchain/metadata.md)
- [መመሪያዎች](/am/blockchain/instructions.md)
- [ጥያቄዎች](/am/blockchain/queries.md)
