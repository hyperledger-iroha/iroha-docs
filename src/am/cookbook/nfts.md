---
translation_locale: am
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## ውጤት {#outcome}

Taira NFT ሁኔታን ይፈትሹ፣ ከዚያ በመነጨ የአካባቢ አውታረ መረብ ላይ ልዩ NFT ይመዝገቡ፣ ያዘምኑ፣ ያስተላልፉ እና ይጠይቁ። የስራ ሂደቱ ሙሉ ብቃት ያለው `name$domain.dataspace` NFT መታወቂያ እና ነጠላ ፕሮቶኮል-ደረጃ I105 የባለቤት መታወቂያዎችን ይጠቀማል።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`፣ `jq`፣ Python 3.11 ወይም ከዚያ በኋላ፣ እና የአሁኑ `iroha` CLI።
- ተነባቢ ብቻ Taira መዳረሻ።
- ለመጻፍ፣ ከ[አስጀምር Iroha](/am/get-started/launch-iroha.md)፣ `./localnet/client.toml` እና Torii በ`http://127.0.0.1:8080` ላይ የመነጨ የአካባቢ አውታረ መረብ።

## እርምጃዎች {#steps}

### 1. የህዝብን Taira ስብስብ ይፈትሹ {#_1-inspect-the-public-taira-collection}

ባዶ ገጽ የተሳካ ንባብ ነው በተጠየቀው ገጽ ላይ ምንም የሚታይ NFTs የለም ማለት ነው።

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs ልዩ መዝገቦች እንጂ የቁጥር ቀሪ ሒሳቦች አይደሉም።. መታወቂያ፣ ነጠላ ባለቤት እና የታመቀ `content` ሜታዳታ ካርታ አላቸው።

### 2. የአካባቢ ባለቤት መታወቂያዎችን ያዘጋጁ {#_2-prepare-local-owner-ids}

የመፃፍ ምሳሌ ተመዝግቦ የገባውን `wonderland.universal` ጎራ ይጠቀማል። የግል ቁልፉን ሳያጋልጡ የተዋቀረውን የፈቃድ ባለቤት ያውጡ፣ ከዚያ ሌላ የተመዘገበ መለያ እንደ ማስተላለፊያ መድረሻ ይምረጡ።

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

የ `$` መለያያ የ NFT ጽሑፍ ቅርጽ አካል ነው። ሙሉውን `wonderland.universal` የጎራ እና የመረጃ ቦታ ቅጥያ ይጠብቁ።

### 3. NFT በመጀመሪያው ይዘት ያስመዝግቡ {#_3-register-the-nft-with-initial-content}

CLI የመጀመሪያውን JSON ነገር ከመደበኛ ግቤት ያነባል። የአሁኑ የፍቃድ ዋና ባለቤት ይሆናል።

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. የይዘት ካርታውን ያዘምኑ {#_4-update-the-content-map}

የሜታዳታ እሴቶች JSON ናቸው። ቁልፍ ማቀናበር ያንን አንድ ግቤት ያስገባል ወይም ይተካዋል; ሙሉውን NFT መዝገብ አይተካም።

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. ባለቤትነትን ያስተላልፉ {#_5-transfer-ownership}

ሁለቱንም ነጠላ ፕሮቶኮል-መደበኛ I105 መለያ መታወቂያዎችን ያቅርቡ። ተለዋጭ ስም እንደ `--from` ወይም `--to` ከመጠቀሙ በፊት መፈታት አለበት።

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning የፍቃድ ወሰን

በ Taira ላይ፣ እያንዳንዱ የመጻፍ ክዋኔ `--metadata ./taira.tx-metadata.json` እና ግልጽ ክፍያ ከፋይ ያስፈልገዋል። ምዝገባ፣ ማስተላለፍ፣ ማስወገድ እና ሜታዳታ ዝመናዎች በነቃ የሶፍትዌር አፈፃፀም የተረጋገጡ ናቸው አካባቢ (`CanRegisterNft`፣ `CanTransferNft`፣ `CanUnregisterNft` እና `CanModifyNftMetadata` በነባሪው የፍቃድ ወለል ላይ)። ለመተግበሪያዎ የተመደበውን ጎራ ይጠቀሙ ወይም ይህን የእግር ጉዞ በlocalnet ላይ ያቆዩት።

:::

በኮንትራት ባለቤትነት ለተያዙ የስራ ፍሰቶች፣ Kotodama የተተየቡ NFT የአስተናጋጅ ተግባር ጥሪዎችን ያጋልጣል። የሚከተለው በተሰካው IVM የሰነድ ሙከራ የተጠናቀረ እና የተተገበረው ትክክለኛው የህይወት ኡደት የሙከራ አብነት ነው።

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

ሁለቱ ቋሚ I105 እሴቶች የላይኛው ተፋሰስ የሙከራ አብነቶች ናቸው; የሙከራ ሯጩ ከመፈጸሙ በፊት መድረሻውን ይመዘግባል. እነሱ `CURRENT_OWNER` እና `NEW_OWNER` ከ CLI የእግር ጉዞ አይደሉም። ለመተግበሪያ ውል ትክክለኛውን ነጠላ ፕሮቶኮል-መደበኛ መለያዎችን ያቅርቡ፣ ከዚያ ያጠናቅሩ፣ ይፈትሹ፣ ያሰማሩ እና በ[ብልጥ ኮንትራቶች](./smart-contracts.md) በኩል ይጥራሉ። ያልተገመገመ ባይት ኮድ ለ Taira አያስገቡ፣ እና የኮንትራት አፈፃፀም አሁንም የሶፍትዌር ማስፈጸሚያ አካባቢ ፍቃድ እንደሚያልፍ ያስታውሱ።

## አረጋግጥ {#verify}

NFT ን በቀጥታ ያንብቡ እና ይዘቱ ተያይዞ እያለ ባለቤቱ እንደተለወጠ ያረጋግጡ -

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

CLI መዝገቡን በውጤት ውሂብ መያዣ ውስጥ ካጠቀለለ፣ JSON ን አንድ ጊዜ ይፈትሹ እና ማረጋገጫውን በያዘው NFT ነገር ላይ ይተግብሩ። ስልጣን ያላቸው የማይለዋወጡ `id`፣ `owned_by` እና `content` ናቸው።

## መላ ፍለጋ {#troubleshooting}

- `name$domain` በአንዳንድ ተንታኞች ውስጥ ወደ ሁለንተናዊ የውሂብ ቦታ ነባሪ ሊሆን ይችላል፣ ነገር ግን የተግባር መመሪያ ስብስብ እና የመተግበሪያ መታወቂያዎች ግልጽ የሆነውን `name$domain.dataspace` ቅጽ መጠቀም አለባቸው።.
- ተመሳሳይ NFT መታወቂያ ተደጋጋሚ ምዝገባ ውድቅ ተደርጓል። አዲስ localnet ይጠቀሙ ወይም ለተለየ መዝገብ የተረጋጋ አዲስ መታወቂያ ይምረጡ።
- ሜታዳታ ግቤት በመደበኛ ግቤት ላይ የሚሰራ መሆን አለበት JSON JSON መጥቀስ የሌለበት የሼል ሕብረቁምፊ የሜታዳታ እሴት አይደለም።.
- ከአሁኑ ባለቤት በሌላ መለያ የተፈረመ ዝውውር ግልጽ ፈቃድ ያስፈልገዋል; `--from`ን መቀየር ምስጠራ ፈራሚውን አይለውጠውም።
- ከተላለፈ በኋላ፣ ዋናው ደንበኛ NFT እንዲቀይር ወይም እንዲመዘገብ ላይፈቀድለት ይችላል። የአዲሱን ባለቤት ምስጠራ ፈራሚ ወይም የተፈቀደለት ተቆጣጣሪ ይጠቀሙ።
- Taira ባዶ NFT ስብስብ መመለስ ይችላል። `items: []` NFT መመሪያዎች አለመገኙን እንደ ማረጋገጫ አይያዙ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [NFT በተሰካው የምንጭ-ኮድ ክለሳ ላይ የውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT በተሰካው የምንጭ-ኮድ ክለሳ ላይ የአስተናጋጅ-ቴክኒካዊ ጥሪ ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [ትክክለኛው Kotodama NFT የህይወት ዑደት የሙከራ አብነት በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/am/blockchain/nfts.md)
- [ሜዳዳታ](/am/blockchain/metadata.md)
- [መመሪያዎች](/am/blockchain/instructions.md)
- [የፍቃድ ምልክቶች](/am/reference/permissions.md)
