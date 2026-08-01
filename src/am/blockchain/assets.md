---
translation_locale: am
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ንብረቶች {#assets}

Iroha ንብረት በሂሳብ የተያዘ የቁጥር ሚዛን ነው ። እያንዳንዱ ተጨባጭ ሚዛን ወደ `AssetDefinition` ያመለክታል ፣ እናም ትርጉሙ ያንን ሀብት እንዴት እንደሚሰየም ፣ እንደሚጠራ ፣ እንደሚታይ እና እንደሚከፈል ይገልጻል ።

## የንብረት ትርጉም {#asset-definition}

`AssetDefinition` የሚከተሉትን ይዟል፦

- `id`: የካኖኒክ የአክሲዮን ማብራሪያ አድራሻ
- `name`: ለሰው ሊነበብ የሚችል ማሳያ ስም
- `description`: ለሰው ልጅ የሚነበብ አማራጭ መግለጫ
- `alias`: አማራጭ ስያሜዎች በ `<name>#<domain>.<dataspace>` ወይም `<name>#<dataspace>` ቅጽ
- `spec`: የቁጥር ትክክለኛነት እና ሚዛን ገደቦች
- `mintable`: የኃይል ማመንጫ ፖሊሲ
- `logo`: አማራጭ `SoraFS` URI
- `metadata`: የትዕግሥት ቁልፍ ዋጋ ሜታዳታ
- `balance_scope_policy`: ቀሪ ሂሳቦች ዓለም አቀፍ ወይም የመረጃ ቦታ የተገደቡ መሆን አለመሆናቸው
- `owned_by`: ትርጉሙን ያስመዘገበ ወይም ባለቤት የሆነው አካውንት
- `total_quantity`: የተለቀቀው ጠቅላላ መጠን
- `confidential_policy`: የተጠበቁ ንብረቶችን የሚመለከቱ ሥራዎች ፖሊሲ

የንብረት ትርጉም IDs የካኖኒካል ግልጽ ያልሆኑ አድራሻዎች ናቸው ። አንድ ትርጉም ከጎራ እና ስም ሲገነባ ፣ Iroha ያንን የጎራ / ስም ትንበያ ለ UX እና መጠይቆች ሊጠብቅ ይችላል ፣ ግን የካኖኒካዊ ጽሑፍ ቅጽ የተፈጠረው አድራሻ ነው ።

## የንብረት ሚዛን {#asset-balance}

`Asset` የሚከተሉትን ይዟል፦

- `id`: የንብረት ትርፍ፣ የባለቤትነት ሂሳብ እና አማራጭ ቀሪ ሚዛንን የሚያጣምር `AssetId`።
- `value`: የ `Numeric` ሚዛን

የባለቤትነት ሂሳብ ቀኖናዊ እና ጎራ የሌለው ነው። የንብረት ማብራሪያ ለምሳሌ በ `payments.universal` የመረጃ ቦታ ብቁ በሆነ ጎራ ስር ሊተነተን ይችላል ።

## የማጣራት አቅም {#mintability}

የንብረት ትርጓሜዎች የሚከተሉትን የማረጋገጫ ሁነታዎች ይደግፋሉ:

|ሁነታ|ትርጉም|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |ተለዋዋጭ አቅርቦት: ንብረቱ በተደጋጋሚ ሊፈጠር እና ሊቃጠል ይችላል.|
|`Once` |ቋሚ አቅርቦት ምልክት፣ አንድ ጊዜ ሊፈጠርና ከዚያም ሊቃጠል ይችላል።|
|`Not` |የሚቃጠለው ነገር ግን ዳግመኛ የማይሰረዝ ቋሚ አቅርቦት ምልክት።|
|`Limited(n)` |ፖሊሲው የተገደበ ቁጥር ባላቸው ተጨማሪ ግብይቶች ውስጥ አዳዲስ የንብረት ክፍሎች እንዲለቀቁ ያስችላል። |

አጠቃቀም `Infinitely` ለተለመደው ተለዋዋጭ ሀብቶች እና `Once` ወይም `Limited(n)` ለቋሚ አቅርቦት ወይም ለተገደበ አቅርቦት ንብረቶች። `Not` የንብረት አቅርቦት ቀድሞውኑ ካልተቋቋመ በስተቀር እንደ መጀመሪያ ፖሊሲ።

## የሂሳብ ሚዛን {#balance-scope}

`balance_scope_policy` ሚዛኖቹ እንዴት እንደሚጣሉ ይቆጣጠራል-

- `Global`: በአንድ ሂሳብ እና በንብረቱ መገለጫ ላይ አንድ የሂሳብ መጠለያ ገንዳ
- `DataspaceRestricted`: ሚዛኖች በመረጃ ቦታ አውድ የተከፋፈሉ ናቸው

የመረጃ ቋት የተገደቡ ሚዛኖች ተመሳሳይ የንብረት ትርጉም በበርካታ Nexus የመረጃ ቋቶች ውስጥ ጥቅም ላይ ሲውል ጠቃሚ ናቸው ነገር ግን ሚዛኖቹ ተለይተው መቆየት አለባቸው.

## Taira ላይ ይሞክሩት {#try-it-on-taira}

እነዚህ የንባብ ብቻ ጥሪዎች በሕዝብ Taira የሙከራ አውታረመረብ ላይ እውነተኛ ሀብት ትርጓሜዎችን ያሳያሉ-

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

የአሁኑን Taira XOR የክፍያ ንብረቶች ትርጉም ያግኙ:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

ሜታዳታ የሚሸከሙትን ትርጉሞች ፈልግ፦

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

በ Taira ላይ ያሉ ንብረቶችን ለመቅረጽ ፣ ለማቃጠል ወይም ለማስተላለፍ የቧንቧ-ተኮር መለያ እና በ [ ውስጥ የተጠበቀ ፍሰት ይጠቀሙ ወደ SORA Nexus የውሂብ ጎታዎች ](/am/get-started/sora-nexus-dataspaces.md) ይገናኙ።

ለክፍያ የሚከፈልበት Taira ንብረቶች ምሳሌ ፣ የቧንቧ ረዳት ከ [ ውስጥ ያስቀምጡ Testnet XOR በ Taira ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ላይ እንደ `taira_faucet_claim.py` ያግኙ ፣ ከዚያ በመጀመሪያ የቧንፉ ንብረቱን ይጠይቁ እና እንደ ግብይት ጋዝ ንብረቱ ይጠቀሙበት

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

ከዚያም `ledger asset mint`፣ `ledger asset burn` እና `ledger asset transfer` ትዕዛዞች ላይ `--metadata ./taira.tx-metadata.json` ይጨምሩ።

## መመሪያ {#instructions}

ንብረቶች Iroha ልዩ መመሪያዎችን በመከተል መመዝገብ፣ ማሰስ፣ ማቃጠል እና ማስተላለፍ ይችላሉ፦

- [`Register` እና `Unregister`](/am/blockchain/instructions.md#un-register)
- [`Mint` እና `Burn`](/am/blockchain/instructions.md#mint-burn)
- [`Transfer`](/am/blockchain/instructions.md#transfer)
- [`SetKeyValue` እና `RemoveKeyValue`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue)

በተጨማሪም ተመልከት።

- [CLI መመሪያ](/am/get-started/operate-iroha-via-cli.md)
- [Rust መመሪያ](/am/guide/tutorials/rust.md)
- [Python መመሪያ](/am/guide/tutorials/python.md)
- [JavaScript/TypeScript መመሪያ ](/am/guide/tutorials/javascript.md)
- [የመረጃ ሞዴል ](/am/blockchain/data-model.md)
- [NFTs](/am/blockchain/nfts.md)
