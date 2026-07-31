---
translation_locale: am
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ንብረቶች {#assets}

አንድ Iroha አንድ ንብረት በሂሳብ የተያዘ የቁጥር ሚዛን ነው.
ሚዛን ነጥቦች `AssetDefinition`, እና ትርጉሙ እንዴት እንደሆነ ይገልጻል
ይህ ንብረት ስም ሊሰጠው፣ ሊታተም፣ ሊታይና ሊከፈል ይችላል።

## የንብረት ትርጉም {#asset-definition}

አንድ `AssetDefinition` የሚከተሉትን ይ containsል:

- `id`: የካኖኒክ የአክሲዮን መገለጫ አድራሻ
- `name`: ለሰው ሊነበብ የሚችል ማሳያ ስም
- `description`: ለሰው የሚነበብ አማራጭ መግለጫ
- `alias`: አማራጭ ስያሜዎች `<name>#<domain>.<dataspace>` ወይም
  `<name>#<dataspace>` ቅጽ
- `spec`: የቁጥር ትክክለኛነት እና ሚዛን ገደቦች
- `mintable`: የዝቅተኛነት ፖሊሲ
- `logo`: አማራጭ `SoraFS` URI
- `metadata`: የትርፍ ጊዜ ማሳለፊያ
- `balance_scope_policy`: ሚዛኖቹ ዓለም አቀፍ መሆን አለመሆናቸው ወይም
  የውሂብ ቦታ የተገደበ
- `owned_by`: ትርጓሜውን የተመዘገበ ወይም ባለቤት የሆነው ሂሳብ
- `total_quantity`: የተለቀቀው ጠቅላላ መጠን
- `confidential_policy`: የተጠበቁ ንብረቶችን የሚመለከቱ ሥራዎች ፖሊሲ

የንብረት ትርጉም IDs አንድ ትርጉም ነው ጊዜ
ከጎራና ስም የተገነባ፣ Iroha ያንን ጎራ/ስም ማቆየት ይችላል
ለ UX እና መጠይቆች, ነገር ግን የካኖኒክ ጽሑፍ ቅጽ ነው የተፈጠረ
አድራሻ።

## የንብረት ሚዛን {#asset-balance}

አንድ `Asset` የሚከተሉትን ይ containsል:

- `id`: አንድ `AssetId`, የአክሲዮን ትርጉምን፣ የባለቤትነት ሂሳብን የሚያጣምረው፣
  እና አማራጭ ሚዛን
- `value`: ሀ `Numeric` ሚዛን

የባለቤትነት ሂሳብ ቀኖናዊ እና ጎራ የሌለው ነው።
ለምሳሌ በመረጃ ቦታ ብቁ በሆነ ጎራ ስር የተነደፈ
`payments.universal`.

## የማጣራት አቅም {#mintability}

የንብረት ትርጓሜዎች የሚከተሉትን የማረጋገጫ ሁነታዎች ይደግፋሉ-

| ሁነታ         | ትርጉም                                                           |
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` | ተለዋዋጭ አቅርቦት፣ ንብረቱ በተደጋጋሚ ሊነደፍ እና ሊቃጠል ይችላል።    |
| `Once`       | ቋሚ አቅርቦት ምልክት፣ አንድ ጊዜ ሊፈጠርና ከዚያም ሊቃጠል ይችላል።        |
| `Not`        | የሚቃጠለው ነገር ግን እንደገና የማይጣራ ቋሚ አቅርቦት ምልክት።       |
| `Limited(n)` | ለተወሰነ ቁጥር ተጨማሪ ሥራዎች ማጨስ ይፈቀዳል ። |

አጠቃቀም `Infinitely` ለተለመደው ተለዋዋጭ ሀብት እና `Once` ወይም `Limited(n)` ለ
ቋሚ አቅርቦት ወይም የተገደበ አቅርቦት ያላቸው ንብረቶች። `Not` እንደ መጀመሪያ
የዋጋ አቅርቦት አስቀድሞ ካልተቋቋመ በስተቀር ፖሊሲ።

## ሚዛን {#balance-scope}

የ `balance_scope_policy` ሚዛኖቹ እንዴት እንደሚጣሉ ይቆጣጠራል-

- `Global`: በአንድ ሂሳብ እና በንብረት መገለጫ ላይ አንድ የሂሳብ መጠለያ ገንዳ
- `DataspaceRestricted`: ሚዛኖቹ በመረጃ አከባቢ አውድ የተከፋፈሉ ናቸው

የመረጃ ቦታ የተገደበ ሚዛን ተመሳሳይ የአክሲዮን ትርጉም ሲኖር ጠቃሚ ነው
በበርካታ መንገዶች ጥቅም ላይ ውሏል Nexus የውሂብ ክፍሎች ግን ሚዛኖች የተለዩ መሆን አለባቸው።

## ሞክር Taira {#try-it-on-taira}

እነዚህ የንባብ ብቻ ጥሪዎች በሕዝብ ላይ እውነተኛ ሀብት ትርጉሞች ያሳያሉ Taira የሙከራ አውታረመረብ:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

የአሁኑን ያግኙ Taira XOR የክፍያ ንብረቶች ፍቺ

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

ሜታዳታ የሚሸከሙ ትርጉሞችን ፈልግ

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

ሁሉም ሦስት ምሳሌዎች ይነበባሉ. Taira, አንድ ይጠቀሙ
የፋይሌት የገንዘብ ሂሳብ እና የተጠበቀው ፍሰት
[ጋር ይገናኙ SORA Nexus የመረጃ ቋቶች](/am/get-started/sora-nexus-dataspaces.md).

ክፍያ ለመክፈል Taira የንብረት ምሳሌ, ከ ቧንቧ ረዳት አስቀምጥ
[ቴስትኔት ያግኙ XOR ላይ Taira](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)
እንደ `taira_faucet_claim.py`, ከዚያም በመጀመሪያ የቧንቧ ንብረቱን ይጠይቁ እና እንደ
የግብይት ጋዝ ንብረት:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

ከዚያም ይጨምሩ `--metadata ./taira.tx-metadata.json` ላይ `ledger asset mint`,
`ledger asset burn`, እና `ledger asset transfer` ትዕዛዞች.

## መመሪያ {#instructions}

ንብረቶች መመዝገብ፣ ማጨስ፣ ማቃጠል እና ማስተላለፍ ይችላሉ Iroha
ልዩ መመሪያዎች

- [`Register` እና `Unregister`](/am/blockchain/instructions.md#un-register)
- [`Mint` እና `Burn`](/am/blockchain/instructions.md#mint-burn)
- [`Transfer`](/am/blockchain/instructions.md#transfer)
- [`SetKeyValue` እና `RemoveKeyValue`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue)

በተጨማሪም ተመልከት:

- [CLI መመሪያ](/am/get-started/operate-iroha-via-cli.md)
- [Rust አጋዥ](/am/guide/tutorials/rust.md)
- [Python አጋዥ](/am/guide/tutorials/python.md)
- [JavaScript/TypeScript አጋዥ](/am/guide/tutorials/javascript.md)
- [የመረጃ ሞዴል](/am/blockchain/data-model.md)
- [NFTs](/am/blockchain/nfts.md)
