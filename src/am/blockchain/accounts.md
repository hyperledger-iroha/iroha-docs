---
translation_locale: am
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ሂሳቦች {#accounts}

አንድ ሂሳብ ግብይቶች መፈረም እና የራሱን መቁጠሪያ ሁኔታ ሊኖረው የሚችል ባለስልጣን ነው. አሁን ባለው Iroha 3 የመረጃ ሞዴል ውስጥ, `AccountId` ቀኖናዊ እና ጎራ የሌለው ነው: ከሂሳቡ ተቆጣጣሪ የተወሰደ ሲሆን በካኖኒካዊ መንገድ እንደ [I105](/am/reference/i105.md) ይገለጻል. ለሰው ሊነበብ የሚችል ጎራ እና የመረጃ ቦታ አውድ በተናጠል የሂሳብ-አልባ ስያሜ አገናኞች ውስጥ ይካተታል ።

## መዋቅር {#structure}

የተመዘገበ `Account` የሚከተሉትን ያካትታል፦

- `id`: ቀኖናዊው `AccountId`
- `metadata`: የትርጉም ሂሳብ ሜታዳታ
- `label`: አማራጭ የተረጋጋ ስያሜ
- `uaid`: በ Nexus ፍሰቶች ጥቅም ላይ የሚውለው አማራጭ የዩኒቨርሳል ሂሳብ ID
- `opaque_ids`: ከሂሳቡ UAID ጋር የተያያዙ ግልጽ ያልሆኑ መለያዎች።

አንድ መለያ ለመፍጠር ጥቅም ላይ የዋለው የግብይት ጭነት `NewAccount` ነው። የተመዘገበው መለያ የሚጠቀምበትን ተመሳሳይ መታወቂያ, ሜታዳታ, መለያ, UAID እና ግልጽ ያልሆነ ID መስኮች ይይዛል.

`uaid` የካኖኒካዊውን `AccountId`; የሚተካው አይደለም. Nexus አገልግሎቶች በመረጃ ማዕከላት ላይ የተረጋጋ ተጠቃሚ ወይም ድርጅት አያያዝ ያስፈልጋቸዋል ፣ የግላዊነትን የሚጠብቁ ምዝገባዎች ፣ የስራ ሰዓት አንድ-ወደ-አንድ UAID- ወደ ሂሳብ ማውጫ፣ ግልጽ ያልሆኑ መለኪያዎች በኤሌክትሮኒክ UAID, እና ሁለገብ ወይም የሚጋጩ ግልጽ ያልሆኑ መለኪያዎችን አይቀበልም. [FHE እና UAID](/am/blockchain/sora-nexus-services.md#fhe-and-uaid) ለ Nexus የአገልግሎት ደረጃ ፍሰት.

## የሂሳብ ተቆጣጣሪዎች {#account-controllers}

መቆጣጠሪያው ሂሳቡ እርምጃዎችን እንዴት እንደሚፈቅድ ይገልጻል። ነባሪው የደንበኛ ፍሰት ኤድ 25519 ቁልፍ ጥንድን ይጠቀማል ፣ ግን የመረጃ ሞዴሉ እንደ ባለብዙ ፊርማ ፖሊሲ መቆጣጠሪያዎች ያሉ የበለጠ ሀብታም መቆጣጠሪያንም ይደግፋል ።

የደንበኛው ውቅር የመፈረም ባለስልጣንን ከባልደረባው ውቅር በተናጠል ያስቀምጣል-

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

ተመልከት [የደንበኛው ውቅር](/am/guide/configure/client-configuration.md) እና [ቁልፍ ትውልድ](/am/guide/security/generating-cryptographic-keys.md) ለወቅቱ ቁልፍ ቅርጸቶች።

## Taira ላይ ይሞክሩት {#try-it-on-taira}

ከህዝባዊ Taira የሙከራ ኔት የተገኙ ጥቂት የካኖኒክ ሂሳቦችን IDs ይዘርዝሩ:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

የሂሳብን ንብረቶች ለመፈተሽ ከመጀመሪያው ጥሪ ጀምሮ ID ሂሳቡን ቅጂ ያድርጉ እና ወደ ዱካው ከማስገባትዎ በፊት URL-ይኮድ ያድርጉት። ይህ Python ቅንጥብ ለመጀመሪያው የተዘረዘረው ሂሳብ ይህን ያደርጋል

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

ሂሳቡን መፍጠር ወይም ማዘመን የተፈረመ ግብይት ነው እናም ከፋይሌት የገንዘብ ድጋፍ ይጠይቃል Taira በ ውስጥ የተገለጸው ውቅር [ጋር ይገናኙ SORA Nexus የመረጃ ቋቶች](/am/get-started/sora-nexus-dataspaces.md).

## ምዝገባ እና ፍቃዶች {#registration-and-permissions}

ሂሳቦች በአጠቃላይ [`Register` እና `Unregister`](/am/blockchain/instructions.md#un-register) መመሪያዎች ተመዝግበዋል እና አልተመዘገቡም ። ማን መለያዎችን መፍጠር እንደሚችል እና የትኞቹ ፍቃድ ቶከኖች ወይም ሚናዎች ያስፈልጋሉ የሚለውን የሚወስነው ንቁ የሂደት ጊዜ ማረጋገጫ ነው.

ከተመዘገበ በኋላ ሂሳቡ የሚከተሉትን ማድረግ ይችላል፦

- ግብይቶችን መመዝገብ
- ባለቤትነት ያላቸው ንብረቶች
- የራሳቸው ጎራዎች
- ሚናዎችን እና የመፈቃደሪያ ምልክቶችን መቀበል
- የማከማቻ ሜታዳታ
- እነዚህ ባህሪያት ሲፈቀዱ በ ‹alias› ፣ በ ‹ rekey› ፣ በማገገም እና በ Nexus ማንነት ፍሰቶች ውስጥ ይሳተፉ

## የማንነት ችግሮችን መፍታት {#troubleshooting-identity-issues}

አንድ ግብይት ባልተጠበቀ ሁኔታ ተቀባይነት ካላገኘ የሚከተሉትን ያረጋግጡ፦

- የደንበኛው የሕዝብ ቁልፍ ለመፈረም ጥቅም ላይ የዋለው የግል ቁልፍ ጋር ይዛመዳል
- ሂሳቡ በጄኔሲስ ወይም በተቀበለው ግብይት ተመዝግቧል
- ባለሥልጣኑ መመሪያው የሚጠይቀውን ፈቃድ አለው
- ጥብቅ የሂሳብ መስኮች ቀኖናዊውን I105 ሂሳብ ID ይጠቀማሉ ፣ ሊነበቡ የሚችሉ ስሞች ግን በንቃት የሂሳብ ቅጽል ስም ማያያዝ በኩል ይፈታሉ።

በተጨማሪም ተመልከት።

- [ፍቃዶች](/am/blockchain/permissions.md)
- [ሜታ መረጃዎች](/am/blockchain/metadata.md)
- [የደንበኛው ውቅር](/am/guide/configure/client-configuration.md)
- [SORA Nexus የመረጃ ቋቶች](/am/get-started/sora-nexus-dataspaces.md)
