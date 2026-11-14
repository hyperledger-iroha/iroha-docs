---
translation_locale: am
translation_source: /blockchain/accounts.md
translation_source_hash: d956bfb8c698fa463ef9fa84a91d50cf0e2100885eba670121ad78753f87d88d
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# መለያዎች {#accounts}

መለያ ግብይቶችን መፈረም እና የመዝገቡ ሁኔታ ባለቤት መሆን የሚችል ፈቃድ ያለው አካል ነው። በአሁኑ Iroha 3 የውሂብ ሞዴል `AccountId` ቀኖናዊ ነው፣ ጎራም አያካትትም፤ ከመለያው ተቆጣጣሪ ይመነጫል እና በ[I105](/am/reference/i105.md) ቀኖናዊ ቅርጽ ይቀየራል። በሰው ሊነበብ የሚችል የጎራ እና የውሂብ ቦታ አውድ በተለዩ የመለያ ተለዋጭ ስም ማሰሪያዎች ውስጥ ይቀመጣል።

## መዋቅር {#structure}

የተመዘገበ `Account` የሚከተሉትን ያጠቃልላል -

- `id` ነጠላ ፕሮቶኮል-መደበኛ `AccountId`
- `metadata` የዘፈቀደ መለያ ሜታዳታ
- `label` አማራጭ የተረጋጋ ተለዋጭ ስም
- `uaid`፦ በSORA Nexus ሂደቶች የሚጠቀሙበት አማራጭ ሁለንተናዊ የመለያ ID
- `opaque_ids` ከመለያው ጋር የተሳሰሩ ግልጽ ያልሆኑ መለያዎች UAID

መለያ ለመፍጠር ጥቅም ላይ የሚውለው የግብይት ጭነት `NewAccount` ነው። በተመዘገበው መለያ የሚጠቀሙባቸውን ተመሳሳይ ማንነት፣ ሜታዳታ፣ መለያ፣ UAID እና ግልጽ ያልሆኑ የመታወቂያ መስኮችን ይይዛል።

`uaid` ቀኖናዊውን `AccountId` ያሟላል እንጂ አይተካውም። የSORA Nexus አገልግሎቶች በውሂብ ቦታዎች መካከል የማይለወጥ የተጠቃሚ ወይም የድርጅት መለያ፣ ግላዊነትን የሚጠብቅ ምዝገባ ወይም የአገልግሎት ችሎታ ፍለጋ ሲፈልጉ ይጠቀሙበት። የማስፈጸሚያ አካባቢው UAIDን ከመለያ ጋር አንድ ለአንድ የሚያገናኝ ጠቋሚ ይይዛል፣ ግልጽ ያልሆኑ መለያዎች በUAID በኩል እንዲያያዙ ይጠይቃል፣ የተደገሙ ወይም የሚጋጩ መለያዎችንም ይከለክላል። የSORA Nexus የአገልግሎት ንብርብር ሂደትን ለማየት [FHE እና UAID](/am/blockchain/sora-nexus-services.md#fhe-and-uaid) ይመልከቱ።

## መለያ ተቆጣጣሪዎች {#account-controllers}

ተቆጣጣሪው መለያው ድርጊቶችን እንዴት እንደሚፈቅድ ይገልፃል። ነባሪው የደንበኛ ፍሰት የ Ed25519 ቁልፍ ጥንድ ይጠቀማል፣ ነገር ግን የውሂብ ሞዴሉ እንደ ባለብዙ ፊርማ ፖሊሲ ተቆጣጣሪዎች ያሉ የላቁ ተቆጣጣሪዎችን ይደግፋል።

የደንበኛ ውቅር የፊርማ የፈቃድ ባለቤትን ከአውታረ መረብ አቻ ውቅር ተለይቶ ያከማቻል -

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

ለአሁኑ ቁልፍ ቅርጸቶች [የደንበኛ ውቅር](/am/guide/configure/client-configuration.md) እና [ቁልፍ ትውልድ](/am/guide/security/generating-cryptographic-keys.md) ይመልከቱ።

## ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

ከህዝብ Taira የሙከራ መረብ ጥቂት ነጠላ ፕሮቶኮል-መደበኛ መለያ መታወቂያዎችን ይዘርዝሩ -

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.label // "-")] | @tsv'
```

የመለያ ንብረቶችን ለመመርመር የመለያ መታወቂያን ከመጀመሪያው ቴክኒካል ጥሪ ይቅዱ እና በመንገዱ ላይ ከማስቀመጥዎ በፊት URL-ኮድ ያድርጉት። ይህ Python ቅንጭብ ለመጀመሪያው የተዘረዘረው መለያ ያንን ያደርጋል -

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

እነዚህ ለሁሉም ክፍት የንባብ ክዋኔዎች ናቸው። መለያ መፍጠር ወይም ማዘመን የተፈረመ ግብይት ነው፤ [በTaira እና Minamoto በመጠቀም በSORA Nexus ላይ መገንባት](/am/get-started/sora-nexus-dataspaces.md) በሚለው ገጽ የተገለጸውን፣ ከፋውሴት ገንዘብ የተሞላለት የTaira ዝግጅት ይፈልጋል።

## ምዝገባ እና ፈቃዶች {#registration-and-permissions}

መለያዎች የተመዘገቡ እና ያልተመዘገቡ ናቸው [`Register` እና `Unregister`](/am/blockchain/instructions.md#un-register) መመሪያዎች. የነቃ የሶፍትዌር ማስፈጸሚያ አካባቢ አረጋጋጭ ይወስናል ማን መለያዎችን መፍጠር ይችላል እና የትኞቹ የፍቃድ ቶከኖች ወይም ሚናዎች ያስፈልጋሉ።

ከተመዘገቡ በኋላ አንድ መለያ የሚከተሉትን ማድረግ ይችላል

- ግብይቶችን ይፈርሙ
- ንብረቶችን ይያዙ
- የራሳቸው ጎራዎች
- ሚናዎችን እና የፍቃድ ምልክቶችን ይቀበሉ
- ሜታዳታ ያከማቹ
- ተዛማጅ ባህሪያት ሲነቁ በተለዋጭ ስም፣ ቁልፍ መቀየር፣ መልሶ ማግኛ እና የSORA Nexus ማንነት ሂደቶች መሳተፍ

## የማንነት ችግሮችን መላ መፈለግ {#troubleshooting-identity-issues}

ግብይቱ ባልተጠበቀ ሁኔታ ውድቅ ከተደረገ፣ የሚከተሉትን ያረጋግጡ -

- የደንበኛው የህዝብ ቁልፍ ለመፈረም ጥቅም ላይ ከሚውለው የግል ቁልፍ ጋር ይዛመዳል
- መለያው በብሎክቼይን ጀነሲስ ወይም በተጠናቀቀ ግብይት ተመዝግቧል
- የፈቃድ ርዕሰ መምህሩ በመመሪያው የሚፈለጉት ፈቃዶች አሉት
- ጥብቅ የመለያ መስኮች ነጠላ ፕሮቶኮል-ስታንዳርድ I105 መለያ መታወቂያ ይጠቀማሉ፣ ሊነበቡ የሚችሉ ስሞች ደግሞ በነቃ መለያ-ተለዋጭ ስም አስገዳጅ በኩል ይፈታሉ

በተጨማሪ አንብበው

- [ፈቃዶች](/am/blockchain/permissions.md)
- [ሜዳዳታ](/am/blockchain/metadata.md)
- [የደንበኛ ውቅር](/am/guide/configure/client-configuration.md)
- [SORA Nexus የውሂብ ቦታዎች](/am/get-started/sora-nexus-dataspaces.md)
