---
translation_locale: am
translation_source: /reference/naming.md
translation_source_hash: 15d095e674edf780c5859abe6f4615d53338e3304e8eedfa494017911204d4b6
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# ስምምነቶችን መሰየም {#naming-conventions}

መለያዎችን፣ ጎራዎችን ወይም ንብረቶችን በሚሰይሙበት ጊዜ፣ በ Iroha ውስጥ ጥቅም ላይ የዋሉትን የሚከተሉትን ስምምነቶች ማስታወስ አለብዎት።

1. ለተወሰኑ የአወቃቀር ዓይነቶች የሚያገለግሉ በርካታ የተያዙ መለያያዎች አሉ፦

   - `@` ለመለያ ተለዋጭ ስሞች እና ወሰን መለያ/ይፋዊ-ቁልፍ ቅጾች የተያዘ ነው
   - `#` ለንብረት ፍቺ ተለዋጭ ስሞች እና ለንብረት ቀሪ ሒሳብ ቃል በቃል የተያዘ ነው
   - `::` ለኮንትራት ተለዋጭ ስሞች የተያዘ ነው።
   - `.` ለጎራ እና ዳታ ቦታ መመዘኛ የተያዘ ነው።
   - `$` እንደ `name$domain.dataspace` ላሉ የNFT መለያዎች የተያዘ ነው

2. ስም ባዶ ያልሆነ፣ በUnicode NFC ቅርጽ፣ ቢበዛ 255 UTF-8 ባይት ርዝመት ያለው፣ እንዲሁም ከባዶ ቦታ፣ ከቁጥጥር እና ከሁለት አቅጣጫ ቁጥጥር ቁምፊዎች ነፃ መሆን አለበት።

## ይህንን የስራ ፍሰት በ Taira ላይ ያሂዱ {#try-it-on-taira}

የህዝብ ንብረት ተለዋጭ ስም ወደ ነጠላ ፕሮቶኮል-መደበኛ የንብረት ፍቺ መታወቂያ ይፍቱ -

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

ያንን ከንብረት ፍቺ ዝርዝር ጋር ያወዳድሩ -

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

የ`#` ባህሪ የንብረት ተለዋጭ ስም ከጎራ አውድ ይለያል። ሆን ብለው የንብረት ተለዋጭ ስም ወይም የንብረት ቀሪ ሒሳብ ቃል በቃል ካልጻፉ በስተቀር ግልጽ ከሆኑ ስሞች ያርቁት።
