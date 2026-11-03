---
translation_locale: am
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# NFTs {#nfts}

## ውጤት {#outcome}

Taira NFT ሁኔታን ይፈትሹ፣ ከዚያ በመነጨ የአካባቢ አውታረ መረብ ላይ ልዩ NFT ይመዝገቡ፣ ያዘምኑ፣ ያስተላልፉ እና ይጠይቁ። የስራ ሂደቱ ሙሉ ብቃት ያለው `name$domain.dataspace` NFT መታወቂያ እና ነጠላ ፕሮቶኮል-ደረጃ I105 የባለቤት መታወቂያዎችን ይጠቀማል።

## ቅድመ ሁኔታዎች {#prerequisites}

- `curl`፣ `jq`፣ Python 3.11 ወይም ከዚያ በኋላ፣ እና የአሁኑ `iroha` CLI።
- ተነባቢ ብቻ Taira መዳረሻ።
- ለመጻፍ ክዋኔዎች፣ በ[አስጀምር Iroha](/am/get-started/launch-iroha.md) ላይ እንደተገለጸው በ`kagami localnet generate --peers 4 --out-dir ./localnet` የተፈጠረ የአካባቢ አውታረ መረብ፣ ከ`./localnet/client.toml` እና በ`http://127.0.0.1:8080` ላይ ከሚሰራ Torii ጋር፣ እንዲሁም ፈራሚው በባለቤትነት የሚይዘው የ NFT ጎራ (ደረጃ 2ን ይመልከቱ)።

## እርምጃዎች {#steps}

### 1. የህዝብን Taira ስብስብ ይፈትሹ {#_1-inspect-the-public-taira-collection}

ባዶ ገጽ የተሳካ ንባብ ነው በተጠየቀው ገጽ ላይ ምንም የሚታይ NFTs የለም ማለት ነው።

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs ልዩ መዝገቦች እንጂ የቁጥር ቀሪ ሒሳቦች አይደሉም። መታወቂያ፣ ነጠላ ባለቤት እና የታመቀ የይዘት ካርታ አላቸው፤ የ Torii ስብስብ ረድፎች ይህን ካርታ እንደ `metadata` ይመልሳሉ፣ `ledger nft get` ደግሞ እንደ `content` ይመልሰዋል።

### 2. የአካባቢ ባለቤት መታወቂያዎችን ያዘጋጁ {#_2-prepare-local-owner-ids}

የመፃፍ ምሳሌው የፊርማ መለያው በባለቤትነት የሚይዘው ጎራ፣ ወይም ለዚያ ጎራ የተሰጠ የ`CanRegisterNft` የፈቃድ ስጦታ ያስፈልገዋል። የመነጨ localnet ለደንበኛው ምንም የመተግበሪያ ጎራ አያስመዘግብም፣ እና ጥሬ የጎራ ምዝገባ ለጀነሲስ የተጠበቀ ነው፤ ስለዚህ `NFT_DOMAIN`ን ምስጠራ ፈራሚዎ ወደሚቆጣጠረው የ`name.dataspace` ጎራ ያቀናብሩ። የግል ቁልፉን ሳያጋልጡ የተዋቀረውን የፈቃድ ባለቤት ያውጡ፣ ከዚያ ሌላ የተመዘገበ መለያ እንደ ማስተላለፊያ መድረሻ ይምረጡ።

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

የ `$` መለያያ የ NFT ጽሑፍ ቅርጽ አካል ነው። ሙሉውን የ`name.dataspace` ጎራ በመታወቂያው ውስጥ ያቆዩ።

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

በ Taira ላይ፣ እያንዳንዱ የመጻፍ ክዋኔ `--fee-payer authority` ይጠቀማል፤ CLI ከመፈረሙ በፊት ትክክለኛውን ክፍያ በ Taira የክፍያ ንብረት የሚገልጽ የክፍያ ዋጋ ግምት ያቀርባል። ምዝገባ፣ ማስተላለፍ፣ ማስወገድ እና የሜታዳታ ዝመናዎች በነቃው የሶፍትዌር ማስፈጸሚያ አካባቢ ይፈተሻሉ (`CanRegisterNft`፣ `CanTransferNft`፣ `CanUnregisterNft` እና `CanModifyNftMetadata` በነባሪው የፍቃድ ወለል ላይ)። መለያዎ በባለቤትነት የሚይዘውን ጎራ፣ ወይም መለያዎ እነዚህን የፈቃድ ስጦታዎች የያዘበትን ጎራ ይጠቀሙ።

:::

በኮንትራት ባለቤትነት ለተያዙ የስራ ፍሰቶች፣ Kotodama የተተየቡ NFT የአስተናጋጅ ተግባር ጥሪዎችን ያጋልጣል። የሚከተለው በተሰካው IVM የሰነድ ሙከራ የተጠናቀረ እና የተተገበረው ትክክለኛው የህይወት ኡደት የሙከራ አብነት ነው።

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
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

CLI የ NFT መዝገቡን ራሱን ያትማል። ስልጣን ያላቸው የማይለዋወጡ `id`፣ `owned_by` እና `content` ናቸው።

## መላ ፍለጋ {#troubleshooting}

- `name$domain` በአንዳንድ ተንታኞች ውስጥ ወደ ሁለንተናዊ የውሂብ ቦታ ነባሪ ሊሆን ይችላል፣ ነገር ግን የተግባር መመሪያ ስብስብ እና የመተግበሪያ መታወቂያዎች ግልጽ የሆነውን `name$domain.dataspace` ቅጽ መጠቀም አለባቸው።.
- ተመሳሳይ NFT መታወቂያ ተደጋጋሚ ምዝገባ ውድቅ ተደርጓል። አዲስ localnet ይጠቀሙ ወይም ለተለየ መዝገብ የተረጋጋ አዲስ መታወቂያ ይምረጡ።
- ሜታዳታ ግቤት በመደበኛ ግቤት ላይ የሚሰራ መሆን አለበት JSON JSON መጥቀስ የሌለበት የሼል ሕብረቁምፊ የሜታዳታ እሴት አይደለም።.
- ከአሁኑ ባለቤት በሌላ መለያ የተፈረመ ዝውውር የ NFT ጎራውን ባለቤትነት ወይም ትክክለኛ የ`CanTransferNft` የፈቃድ ስጦታ ያስፈልገዋል፤ `--from`ን መቀየር ምስጠራ ፈራሚውን አይለውጠውም።
- ዝውውር የሚለውጠው `owned_by`ን ብቻ ነው። የሜታዳታ ዝመናዎች እና የምዝገባ መሰረዝ ከጎራው ባለቤት ወይም ለዚያ NFT `CanModifyNftMetadata` ወይም `CanUnregisterNft` ከያዘ መለያ ጋር ይቆያሉ፤ አዲሱ ባለቤት ደግሞ ወደ ሌላ ሊያስተላልፈው ይችላል።
- Taira ባዶ NFT ስብስብ መመለስ ይችላል። `items: []` NFT መመሪያዎች አለመገኙን እንደ ማረጋገጫ አይያዙ።

## ምንጭ እና ተዛማጅ ሰነዶች {#source-and-related-docs}

- [NFT በተሰካው የምንጭ-ኮድ ክለሳ ላይ የውህደት ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT በተሰካው የምንጭ-ኮድ ክለሳ ላይ የአስተናጋጅ-ቴክኒካዊ ጥሪ ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [ትክክለኛው Kotodama NFT የህይወት ዑደት የሙከራ አብነት በተሰካው የምንጭ-ኮድ ክለሳ ላይ](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [በተሰካው የምንጭ-ኮድ ክለሳ ላይ የ Kotodama ሰነድ ምሳሌ ሙከራዎች](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/am/blockchain/nfts.md)
- [ሜዳዳታ](/am/blockchain/metadata.md)
- [መመሪያዎች](/am/blockchain/instructions.md)
- [የፍቃድ ምልክቶች](/am/reference/permissions.md)
