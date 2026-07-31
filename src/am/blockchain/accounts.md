---
translation_locale: am
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ሂሳቦች {#accounts}

ሂሳብ ግብይቶችን መፈረም እና የራሱን ዋና መዝገብ ማስመዝገብ የሚችል ባለስልጣን ነው.
በወቅቱ Iroha 3 የመረጃ ሞዴል፣ `AccountId` ቀኖናዊ እና ጎራ የሌለው ነው:
ከሂሳብ ተቆጣጣሪ የተገኘ ሲሆን በካኖኒክ መንገድ እንደ I105.
ለሰው ሊነበብ የሚችል ጎራ እና የመረጃ ቦታ አውድ ለየብቻ መለያ-አልባ ስያሜዎች ያካትታል
ተያያዥነት።

## መዋቅር {#structure}

የተመዘገበ `Account` የሚከተሉትን ይ containsል:

- `id`: የካኖኒክ `AccountId`
- `metadata`: የትዕዛዝ ሂሳብ ሜታዳታ
- `label`: አማራጭ የተረጋጋ ቅጽል ስም
- `uaid`: አማራጭ የዩኒቨርሳል ሂሳብ ID ጥቅም ላይ የዋለው Nexus ፍሰቶች
- `opaque_ids`: ከሂሳብ ጋር የተያያዙ ግልጽ ያልሆኑ መለያዎች UAID

ሂሳብ ለመፍጠር ጥቅም ላይ የዋለው የግብይት ጭነት `NewAccount`. ይሸከማል
ተመሳሳይ ማንነት፣ ሜታዳታ፣ መለያ፣ UAID, እና ግልጽ ያልሆነ ID በ
የተመዘገበ ሂሳብ።

`uaid` የካኖኒካዊውን `AccountId`; የሚተካው አይደለም። ይጠቀሙበት።
መቼ Nexus አገልግሎቶች በመላው ተጠቃሚ ወይም ድርጅት ላይ የተረጋጋ አስተናጋጅ ያስፈልጋቸዋል
የውሂብ መዳረሻዎች፣ ግላዊነትን የሚጠብቅ ምዝገባ ወይም የአገልግሎት አቅምን መፈለግ።
ሩጫ ጊዜ አንድ-ወደ-አንድ ያቆያል UAID-የሂሳብ መረጃ ጠቋሚ፣ ግልጽ ያልሆኑ መለኪያዎችን ይፈልጋል
በ UAID, እና ሁለገብ ወይም የሚጋጩን ግልጽ ያልሆኑትን ይጥላል
መታወቂያዎች
[FHE እና UAID](/am/blockchain/sora-nexus-services.md#fhe-and-uaid) ለ Nexus
የአገልግሎት ደረጃ ፍሰት.

## የሂሳብ ተቆጣጣሪዎች {#account-controllers}

የተቆጣጣሪው ሂሳቡ ድርጊቶችን እንዴት እንደሚፈቅድ ይገልጻል።
ፍሰት Ed25519 ቁልፍ ጥንድ ይጠቀማል, ነገር ግን የመረጃ ሞዴል ደግሞ ሀብታም የሚደግፍ
እንደ ባለብዙ ፊርማ ፖሊሲ መቆጣጠሪያዎች ያሉ ተቆጣጣሪዎች።

የደንበኛው ውቅር የመፈረም ባለሥልጣንን ከባልደረባው በተለየ ሁኔታ ያስቀምጣል
ውቅር:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

ተመልከት [የደንበኛው ውቅር](/am/guide/configure/client-configuration.md) እና
[ቁልፍ ትውልድ](/am/guide/security/generating-cryptographic-keys.md) ለ
የአሁኑ ቁልፍ ቅርጸቶች።

## ሞክር Taira {#try-it-on-taira}

አንዳንድ የቅዱሳን መጻሕፍት ዘገባዎችን ጻፍ IDs ከሕዝብ Taira የሙከራ አውታረመረብ:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

የሂሳብን ንብረቶች ለመፈተሽ ሂሳቡን ቅጅ አድርግ ID ከመጀመሪያው ጥሪ እና URL- ኮድ
በመንገዱ ላይ ከማስቀመጥዎ በፊት። Python snippet ለመጀመሪያ ጊዜ ያደርገዋል
የተዘረዘረው ሂሳብ:

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

ሂሳብ መፍጠር ወይም ማዘመን የተፈረመ ግብይት ነው
እና የቧንቧ የገንዘብ ድጋፍ ይጠይቃል Taira በ
[ጋር ይገናኙ SORA Nexus የመረጃ ቋቶች](/am/get-started/sora-nexus-dataspaces.md).

## ምዝገባ እና ፍቃዶች {#registration-and-permissions}

በጄኔሪክ ውስጥ የተመዘገቡ እና ያልተመዘገቡ መለያዎች
[`Register` እና `Unregister`](/am/blockchain/instructions.md#un-register)
አክቲቭ የስራ ሰዓት ማረጋገጫ ማን መለያዎችን መፍጠር እንደሚችል ይወስናል
እና የትኞቹ ፈቃድ ምልክቶች ወይም ሚናዎች ያስፈልጋሉ.

ከተመዘገበ በኋላ አንድ ሂሳብ የሚከተሉትን ማድረግ ይችላል:

- ግብይቶችን ይፈርሙ
- የያዙት ንብረቶች
- የራሳቸው ጎራዎች
- ሚናዎችን እና የመፈቃደሪያ ምልክቶችን መቀበል
- የማከማቻ ሜታዳታ
- በቅጽል ስሞች, ሪኬይ, ማግኛ ውስጥ መሳተፍ, እና Nexus ማንነት የሚፈሰው እነዚህ
  ባህሪያት ተቀባይነት አላቸው

## የማንነት ችግሮችን መፍታት {#troubleshooting-identity-issues}

አንድ ግብይት ባልተጠበቀ ሁኔታ ከተከለከለ የሚከተሉትን ያረጋግጡ

- የደንበኛው የህዝብ ቁልፍ ለፊርማው ጥቅም ላይ የዋለው የግል ቁልፍ ጋር ይዛመዳል
- ሂሳቡ በጀነሲስ ወይም በተደራጀ ግብይት ተመዝግቧል
- ባለሥልጣኑ መመሪያው የሚጠይቀውን ፈቃድ አለው
- ጥብቅ የሂሳብ መስኮች የካኖኒካል ይጠቀሙ I105 ሂሳብ ID, ሊነበብ የሚችል ሆኖ
  ስሞች በንቃት የተጠቀሰው የሂሳብ ስም አገናኝ በኩል ይፈታሉ

በተጨማሪም ተመልከት:

- [ፍቃዶች](/am/blockchain/permissions.md)
- [ሜታዳታ](/am/blockchain/metadata.md)
- [የደንበኛው ውቅር](/am/guide/configure/client-configuration.md)
- [SORA Nexus የውሂብ ክፍሎች](/am/get-started/sora-nexus-dataspaces.md)
