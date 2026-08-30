---
translation_locale: am
translation_source: /cookbook/nfts.md
translation_source_hash: 5eb6a349b815afbac9717f7b44c499adc78b1280625388656015ff4b133b9085
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## ውጤቱ {#outcome}

ምርመራ Taira NFT መግለጫ, ከዚያም መመዝገብ, ማዘመን, ማስተላለፍ, እና ጥያቄ አንድ ልዩ NFT በተፈጠረው አካባቢያዊ አውታረመረብ ላይ የስራ ፍሰት ሙሉ ብቃት ያለው `name$domain.dataspace` NFT ID እና የካኖኒክ I105 ባለቤት IDs.

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`, `jq`, Python 11 ወይም ከዚያ በኋላ, እና የአሁኑ `iroha` CLI.
- Taira የንባብ-ብቻ መዳረሻ።
- ለጽሁፎች ከ [የተፈጠረ አካባቢያዊ አውታረመረብ Iroha](/am/get-started/launch-iroha.md) ይጀምራል፣ በ `./localnet/client.toml` እና Torii ላይ `http://127.0.0.1:8080`።

## እርምጃዎች {#steps}

### 1. የህዝብ Taira ስብስብ መመርመር። {#_1-inspect-the-public-taira-collection}

ባዶ ገጽ የተሳካ ንባብ ነው: ይህ ማለት በተጠየቀው ገጽ ውስጥ ምንም የሚታይ NFTs አይገኙም.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs ልዩ መዝገቦች ናቸው ፣ የቁጥር ሚዛኖች አይደሉም ። እነሱ ID ፣ አንድ ባለቤት እና ትናንሽ `content` ሜታዳታ ካርታ አላቸው ።

### 2. የአካባቢውን ባለቤት IDs ያዘጋጁ። {#_2-prepare-local-owner-ids}

የጻፍ ምሳሌ የተረጋገጠ `wonderland.universal` ጎራ ይጠቀማል. የግል ቁልፉን ሳያጋልጥ የተቀየሰውን ባለስልጣን ያመነጫሉ, ከዚያም ለሌላ የተመዘገበ መለያ እንደ ዝውውር መድረሻ ይምረጡ.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

የ `$` መለዋወጫው ወደ NFT የጽሑፍ ቅጽ ይተካል። የተሟላውን `wonderland.universal` ጎራ እና የመረጃ ቦታ ድብልቅ ይጠብቁ።

### 3. የ NFT የመጀመሪያ ይዘት ይመዝገቡ {#_3-register-the-nft-with-initial-content}

CLI የመጀመሪያውን JSON ንጥረ ነገር ከተለመደው ግብዓት ያነባል. አሁን ያለው ባለስልጣን ባለቤት ይሆናል.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. የይዘት ካርታውን ዘምኗል። {#_4-update-the-content-map}

የሜታዳታ እሴቶች JSON ናቸው። አንድ ቁልፍ ያስገቡ ወይም ያንን አንድ ማስገቢያ ይተካሉ; ይህ መላውን NFT መዝገብ አይተካም ።

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. የባለቤትነት ማስተላለፍ {#_5-transfer-ownership}

I105 ካኖኒካል መለያ IDs ማቅረብ። አንድ ቅጽል ስም `--from` ወይም `--to` ሆኖ ከመጠቀምዎ በፊት መፍታት አለበት.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning የተፈቀደለት ገደብ

በ Taira ላይ, እያንዳንዱ መጻፍ ደግሞ `--metadata ./taira.tx-metadata.json` እና ግልፅ ክፍያ የሚከፍል ሰው ያስፈልገዋል. ምዝገባ, ማስተላለፍ, መሰረዝ, እና ሜታዳታ ዝማኔዎች በ ንቁ ሩጫ ጊዜ ይመረምራሉ (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, እና `CanModifyNftMetadata` በነባሪ ፍቃድ ወለል ውስጥ) የእርስዎን መተግበሪያ የተመደበ ጎራ ይጠቀሙ ወይም በ localnet ላይ ይህን ማለፍ ይጠብቁ.

:::

ለውል ባለቤትነት ላላቸው የስራ ፍሰቶች Kotodama የተጻፉትን NFT አስተናጋጅ ጥሪዎችን ይገልጻል። የሚከተለው በፒን IVM ሰነድ ሙከራ የተጠናቀቀው እና የተከናወነው ትክክለኛ የሕይወት ዑደት ቅንብር ነው:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

ሁለቱ ተስተካክለው I105 እሴቶች የቅድመ ፍሰት የሙከራ ማያ ገጾች ናቸው ፣ ቀበቶው ከመተግበር በፊት መድረሻውን ይመዘግባል። `CURRENT_OWNER` እና `NEW_OWNER` ከ CLI አፕሊኬሽን ኮንትራት ለማግኘት ትክክለኛውን የካኖኒክ ሂሳቡን ያቅርቡ, ከዚያም ያጠናቅቁ, ይሞክሩ, ማሰማራት እና በመደወል በኩል [ብልህ ኮንትራቶች](./smart-contracts.md). ያልተመለከቱትን የባይት ኮድ ወደ Taira, እና ያስታውሱ የውል አፈፃፀም አሁንም የአፈፃፀም ጊዜ ፈቃድ ማለፍ አለበት.

## ያረጋግጡ {#verify}

NFT ን በቀጥታ ያንብቡ እና ይዘቱ ተያይዞ በሚቆይበት ጊዜ ባለቤቱ እንደተለወጠ ያረጋግጡ:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

የ CLI መዝገቡን በውጤት ፖስታ ውስጥ ይሸፍናል፣ JSON አንድ ጊዜ እና የያዘውን ማረጋገጫ ተግባራዊ NFT ኦፊሴላዊ ተለዋዋጮች ናቸው `id`, `owned_by`, እና `content`.

## ችግሮችን መፍታት {#troubleshooting}

- `name$domain` በአንዳንድ ፓርሰሮች ውስጥ በዋነኝነት ወደ ሁለንተናዊ የመረጃ ቦታ ሊገባ ይችላል ፣ ግን የምግብ አሰራር መጽሐፍ እና መተግበሪያ IDs ግልፅ የሆነውን `name$domain.dataspace` ቅጽ መጠቀም አለባቸው።
- ተመሳሳይ NFT ID ተደጋጋሚ ምዝገባ ውድቅ ተደርጓል። የተለየ መዝገብ ለመመዝገብ አዲስ አካባቢያዊ መረብ ይጠቀሙ ወይም የተረጋጋ አዲስ ID ይምረጡ ።
- የሜታዳታ ግብዓት በመደበኛ ግብዓት ላይ ትክክለኛ JSON መሆን አለበት ። ያለ JSON ጥቅስ የ ‹shell string› አንድ ሜታዳታ ዋጋ አይደለም።
- የአሁኑ ባለቤት ካልሆነ ሌላ አካውንት የተፈረመበት ዝውውር ትክክለኛ ፈቃድ ይፈልጋል፤ `--from` መቀየር ፊርማውን አይቀይረም።
- ከተላለፈ በኋላ የመጀመሪያው ደንበኛ NFT ን እንዲቀይር ወይም እንዳይመዘገብ አይፈቀድለትም። የአዲሱ ባለቤት ፊርማ ወይም የተፈቀደ ተቆጣጣሪን ይጠቀሙ ።
- Taira ባዶ የሆነ NFT ስብስብ ሊመልስ ይችላል። `items: []` የ NFT መመሪያዎች አለመኖራቸውን የሚያረጋግጥ ማስረጃ አድርገው አያዩት።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [NFT ተጣብቆ በተቀመጠበት ኮምፕርት ላይ የተዋሃዱ ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT በተቆራኘው ኮሚት ላይ አስተናጋጅ ጥሪ ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [ትክክለኛ Kotodama NFT የህይወት ዑደት ቅንብር በፒን የተቀመጠ ኮሚቴ ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/am/blockchain/nfts.md)
- [ሜታ መረጃዎች](/am/blockchain/metadata.md)
- [መመሪያዎች](/am/blockchain/instructions.md)
- [የፈቃድ ማስያዣዎች](/am/reference/permissions.md)
