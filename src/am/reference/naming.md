---
translation_locale: am
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# ስምምነቶችን መሰየም {#naming-conventions}

መለያዎችን፣ ጎራዎችን ወይም ንብረቶችን በሚሰይሙበት ጊዜ፣ በ Iroha ውስጥ ጥቅም ላይ የዋሉትን የሚከተሉትን ስምምነቶች ማስታወስ አለብዎት።

1. ለተወሰኑ የአወቃቀር ዓይነቶች የሚያገለግሉ በርካታ የተያዙ መለያያዎች አሉ፦

   - `@` ለመለያ ተለዋጭ ስሞች እና ወሰን መለያ/ይፋዊ-ቁልፍ ቅጾች የተያዘ ነው
   - `#` ለንብረት ፍቺ ተለዋጭ ስሞች እና ለንብረት ቀሪ ሒሳብ ቃል በቃል የተያዘ ነው
   - `::` ለኮንትራት ተለዋጭ ስሞች የተያዘ ነው።
   - `.` ለጎራ እና ዳታ ቦታ መመዘኛ የተያዘ ነው።
   - `$` ቀስቅሴ-ወሰን ለሆኑ የጽሑፍ ቅጾች የተያዘ ነው።
   - `%` ለአረጋጋጭ-ወሰን ለሆኑ የጽሑፍ ቅጾች የተያዘ ነው።

2. አንድ ስም ሊኖረው የሚችለው ከፍተኛው የቁምፊዎች ብዛት (UTF-8 ቁምፊዎችን ጨምሮ) በሁለት ምክንያቶች የተገደበ ነው `[0, u32::MAX]` እና አሁን የተመደበው ቁልል ቦታ።

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
