---
translation_locale: am
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# መለያዎች {#accounts}

መለያ ግብይቶችን መፈረም እና የብሎክቼይን መዝገብ ሁኔታ ባለቤት የሆነ የፈቃድ ባለቤት ነው። አሁን ባለው Iroha 3 የውሂብ ሞዴል፣ `AccountId` ነጠላ ፕሮቶኮል-ስታንዳርድ እና ጎራ የሌለው ነው። ከመለያ ተቆጣጣሪው የተገኘ እና በነጠላ ፕሮቶኮል-መደበኛ ቅጽ እንደ [I105](/am/reference/i105.md) ተቀምጧል። በሰው ሊነበብ የሚችል ጎራ እና የውሂብ ቦታ አውድ የተለየ መለያ-ተለዋጭ ማሰሪያዎች ናቸው።

## መዋቅር {#structure}

የተመዘገበ `Account` የሚከተሉትን ያጠቃልላል -

- `id` ነጠላ ፕሮቶኮል-መደበኛ `AccountId`
- `metadata` የዘፈቀደ መለያ ሜታዳታ
- `label` አማራጭ የተረጋጋ ተለዋጭ ስም
- `uaid` በ Nexus ፍሰቶች ጥቅም ላይ የሚውል አማራጭ ሁለንተናዊ መለያ መታወቂያ
- `opaque_ids` ከመለያው ጋር የተሳሰሩ ግልጽ ያልሆኑ መለያዎች UAID

መለያ ለመፍጠር ጥቅም ላይ የሚውለው የግብይት ጭነት `NewAccount` ነው። በተመዘገበው መለያ የሚጠቀሙባቸውን ተመሳሳይ ማንነት፣ ሜታዳታ፣ መለያ፣ UAID እና ግልጽ ያልሆኑ የመታወቂያ መስኮችን ይይዛል።

`uaid` ነጠላ ፕሮቶኮል-ደረጃውን ያሟላል `AccountId`; አይተካውም. Nexus አገልግሎቶች በዳታ ቦታዎች፣ ግላዊነትን የሚጠብቅ ምዝገባ ወይም የአገልግሎት አቅም ፍለጋ ላይ የተረጋጋ ተጠቃሚ ወይም ድርጅት አያያዝ ሲፈልጉ ይጠቀሙበት። የሶፍትዌር ማስፈጸሚያ አካባቢ ከአንድ ለአንድ UAID-ወደ-መለያ መረጃ ጠቋሚን ይይዛል፣ ግልጽ ያልሆኑ መለያዎች በ UAID በኩል እንዲያያዙ ይፈልጋል፣ እና የተባዙ ወይም የሚጋጩ ግልጽ ያልሆኑ መለያዎችን ውድቅ ያደርጋል። ለ Nexus የአገልግሎት-ንብርብር ፍሰት [FHE እና UAID](/am/blockchain/sora-nexus-services.md#fhe-and-uaid)ን ይመልከቱ።

## መለያ ተቆጣጣሪዎች {#account-controllers}

ተቆጣጣሪው መለያው ድርጊቶችን እንዴት እንደሚፈቅድ ይገልፃል። ነባሪው የደንበኛ ፍሰት የ Ed25519 ቁልፍ ጥንድ ይጠቀማል፣ ነገር ግን የውሂብ ሞዴሉ እንደ ባለብዙ ፊርማ ፖሊሲ ተቆጣጣሪዎች ያሉ የላቁ ተቆጣጣሪዎችን ይደግፋል።

የደንበኛ ውቅር የፊርማ የፈቃድ ባለቤትን ከአውታረ መረብ አቻ ውቅር ተለይቶ ያከማቻል -

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

ለአሁኑ ቁልፍ ቅርጸቶች [የደንበኛ ውቅር](/am/guide/configure/client-configuration.md) እና [ቁልፍ ትውልድ](/am/guide/security/generating-cryptographic-keys.md) ይመልከቱ።

## ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

ከህዝብ Taira የሙከራ መረብ ጥቂት ነጠላ ፕሮቶኮል-መደበኛ መለያ መታወቂያዎችን ይዘርዝሩ -

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
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

እነዚህ ይፋዊ ንባቦች ናቸው። መለያ መፍጠር ወይም ማዘመን የተፈረመ ግብይት ነው እና በ[ከ SORA Nexus የውሂብ ቦታዎች ጋር ይገናኙ](/am/get-started/sora-nexus-dataspaces.md) ውስጥ የተገለጸውን በቴስትኔት የገንዘብ ድጋፍ የሚደረግለት Taira ማዋቀርን ይጠይቃል።

## ምዝገባ እና ፈቃዶች {#registration-and-permissions}

መለያዎች የተመዘገቡ እና ያልተመዘገቡ ናቸው [`Register` እና `Unregister`](/am/blockchain/instructions.md#un-register) መመሪያዎች. የነቃ የሶፍትዌር ማስፈጸሚያ አካባቢ አረጋጋጭ ይወስናል ማን መለያዎችን መፍጠር ይችላል እና የትኞቹ የፍቃድ ቶከኖች ወይም ሚናዎች ያስፈልጋሉ።

ከተመዘገቡ በኋላ አንድ መለያ የሚከተሉትን ማድረግ ይችላል

- ግብይቶችን ይፈርሙ
- ንብረቶችን ይያዙ
- የራሳቸው ጎራዎች
- ሚናዎችን እና የፍቃድ ምልክቶችን ይቀበሉ
- ሜታዳታ ያከማቹ
- እነዚያ ባህሪያት ሲነቁ ተለዋጭ ስም፣ ዳግም ኪይ፣ መልሶ ማግኛ እና Nexus የማንነት ፍሰቶች ውስጥ ይሳተፉ

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
- [SORA Nexus የውሂብ ክፍተቶች](/am/get-started/sora-nexus-dataspaces.md)
