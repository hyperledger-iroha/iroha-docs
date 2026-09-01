---
translation_locale: am
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ንብረቶች {#assets}

Iroha ንብረት በመለያ የተያዘ የቁጥር ቀሪ ሂሳብ ነው። እያንዳንዱ ተጨባጭ ቀሪ ሒሳብ ወደ `AssetDefinition` ይጠቁማል፣ እና ትርጉሙ ንብረቱ እንዴት መሰየም፣ መስጠት፣ ማሳየት እና መከፋፈል እንደሚቻል ይገልጻል።

## የንብረት ፍቺ {#asset-definition}

አንድ `AssetDefinition` የሚከተሉትን ያጠቃልላል

- `id` ነጠላ ፕሮቶኮል-መደበኛ የንብረት ፍቺ አድራሻ
- `name` ሰው ሊነበብ የሚችል የማሳያ ስም
- `description` አማራጭ ሰው ሊነበብ የሚችል መግለጫ
- `alias` አማራጭ ተለዋጭ ስም በ `<name>#<domain>.<dataspace>` ወይንም `<name>#<dataspace>` ፎርም
- `spec` የቁጥር ትክክለኛነት እና ገደቦች ለቀሪ ሒሳብ
- `mintable` የንብረት አሰጣጥ ፖሊሲ
- `logo` አማራጭ `SoraFS` URI
- `metadata` የዘፈቀደ ቁልፍ-እሴት ሜታዳታ
- `balance_scope_policy` ቀሪ ሒሳቦች ዓለም አቀፋዊ ወይም በዳታ ቦታ የተገደቡ እንደሆኑ
- `owned_by` የተመዘገበው ወይም የተመዘገበው መለያ
- `total_quantity` ጠቅላላ የተሰጠ ብዛት
- `confidential_policy` የተከለሉ ንብረት ስራዎች ፖሊሲ

የንብረት ፍቺ መታወቂያዎች ነጠላ ፕሮቶኮል-መደበኛ ግልጽ ያልሆኑ አድራሻዎች ናቸው። ፍቺ ከጎራ እና ከስም ሲገነባ፣ Iroha ያንን ጎራ/ስም ትንበያ ለ UX እና መጠይቆች ማቆየት ይችላል፣ ነገር ግን ነጠላ ፕሮቶኮል-መደበኛ የጽሑፍ ቅጽ የመነጨ አድራሻ ነው።

## የንብረት ቀሪ ሒሳብ {#asset-balance}

አንድ `Asset` የሚከተሉትን ያጠቃልላል

- `id`፦ የንብረት ፍቺውን፣ የያዡን መለያ እና አማራጭ የቀሪ ሒሳብ ወሰን የሚያጣምር `AssetId`
- `value` ሀ `Numeric` ቀሪ ሒሳብ

የያዢው መለያ ነጠላ ፕሮቶኮል-መደበኛ እና ጎራ የሌለው ነው። የንብረት ፍቺው በዳታ ቦታ ብቁ በሆነ ጎራ ስር ሊተነበይ ይችላል፣ ለምሳሌ `payments.universal`።

## የንብረት አሰጣጥ ፖሊሲ {#mintability}

የንብረት ፍቺዎች እነዚህን የንብረት አሰጣጥ ፖሊሲ ሁነታዎች ይደግፋሉ -

|ሞድ|ትርጉም|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely`|የላስቲክ አቅርቦት. ንብረቱ በተደጋጋሚ ሊሰጥ እና ሊጠፋ ይችላል.|
|`Once`|ቋሚ አቅርቦት ቶከን. አንድ ጊዜ ሊወጣ እና ከዚያም ሊጠፋ ይችላል.|
|`Not`|ሊጠፋ የሚችል ነገር ግን እንደገና የማይሰጥ ቋሚ አቅርቦት ቶከን።|
|`Limited(n)`|ፖሊሲው አዲስ የንብረት ክፍሎች በተወሰኑ ተጨማሪ ስራዎች እንዲወጡ ያስችላቸዋል።|

ለመደበኛ የላስቲክ ንብረቶች `Infinitely` እና `Once` ወይም `Limited(n)` ለቋሚ አቅርቦት ወይም የታሰረ አቅርቦት ንብረቶች ይጠቀሙ። የንብረት አቅርቦቱ አስቀድሞ ካልተቋቋመ በስተቀር `Not`ን እንደ የመጀመሪያ ፖሊሲ አይጠቀሙ።

## የንብረት ቀሪ ሂሳብ ወሰን {#balance-scope}

`balance_scope_policy` ቀሪ ሒሳቦች እንዴት እንደሚከፋፈሉ ይቆጣጠራል -

- `Global` በአንድ መለያ እና በንብረት ፍቺ አንድ ቀሪ ሂሳብ ክፍልፍል
- `DataspaceRestricted` ቀሪ ሒሳቦች በዳታ ቦታ አውድ የተከፋፈሉ ናቸው

በዳታ ስፔስ የተገደቡ ቀሪ ሒሳቦች ተመሳሳይ የንብረት ፍቺ በበርካታ Nexus የውሂብ ቦታዎች ላይ ጥቅም ላይ ሲውል ጠቃሚ ናቸው ነገር ግን ቀሪ ሒሳቦች ተለይተው መቆየት አለባቸው።

## ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

እነዚህ ተነባቢ-ብቻ API ጥያቄዎች በሕዝብ Taira የሙከራ መረብ ላይ እውነተኛ የንብረት ፍቺዎችን ያሳያሉ -

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

የአሁኑን Taira XOR የክፍያ ንብረት ፍቺ ያግኙ -

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

ሜታዳታ የሚይዙ ትርጓሜዎችን ይፈልጉ -

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

ሦስቱም ምሳሌዎች ይነበባሉ። በ Taira ላይ ንብረቶችን ለማውጣት፣ ለማጥፋት ወይም ለማስተላለፍ፣ በቴስትኔት የተደገፈ አካውንት እና በ[ከ SORA Nexus የውሂብ ቦታዎች ጋር ይገናኙ](/am/get-started/sora-nexus-dataspaces.md) ውስጥ ያለውን የተጠበቀ ፍሰት ይጠቀሙ።

ክፍያ ለሚጠይቅ የ Taira ንብረት ምሳሌ፣ የገንዘብ ድጋፍ አጋዡን ከ [በ Taira የሙከራ መረብ XOR ያግኙ](/am/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) ወስደው `taira_faucet_claim.py` በሚል ስም ያስቀምጡ፤ ከዚያ በመጀመሪያ የገንዘብ ድጋፍ ንብረቱን ይጠይቁ እና ለግብይቱ የ gas ንብረት ይጠቀሙበት፦

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

ከዚያም `ledger asset mint`፣ `ledger asset burn` እና `ledger asset transfer` ትዕዛዞችን `--metadata ./taira.tx-metadata.json` ያካትቱ።

## መመሪያዎች {#instructions}

ንብረቶች ሊመዘገቡ፣ ሊሰጡ፣ ሊጠፉ እና ሊተላለፉ ይችላሉ Iroha የማስተማሪያ ስራዎች -

- [`Register` እና `Unregister`](/am/blockchain/instructions.md#un-register)
- [`Mint` እና `Burn`](/am/blockchain/instructions.md#mint-burn)
- [`Transfer`](/am/blockchain/instructions.md#transfer)
- [`SetKeyValue` እና `RemoveKeyValue`](/am/blockchain/instructions.md#setkeyvalue-removekeyvalue)

በተጨማሪ አንብበው

- [CLI መመሪያ](/am/get-started/operate-iroha-via-cli.md)
- [Rust አጋዥ ስልጠና](/am/guide/tutorials/rust.md)
- [Python አጋዥ ስልጠና](/am/guide/tutorials/python.md)
- [JavaScript/TypeScript አጋዥ ስልጠና](/am/guide/tutorials/javascript.md)
- [የውሂብ ሞዴል](/am/blockchain/data-model.md)
- [NFTs](/am/blockchain/nfts.md)
