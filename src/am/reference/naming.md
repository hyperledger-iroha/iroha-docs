---
translation_locale: am
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የስብሰባዎች ስም {#naming-conventions}

ሂሳቦችን ፣ ጎራዎችን ወይም ንብረቶችን ስማቸው ሲሰጡ በ Iroha ውስጥ ጥቅም ላይ የሚውሉትን የሚከተሉትን ኮንቬንሽኖች ከግምት ውስጥ ማስገባት አለብዎት-

1. ለተወሰኑ የግንባታ ዓይነቶች ጥቅም ላይ የሚውሉ በርካታ የተጠበቁ መለያያዎች አሉ-

   - `@` ለሂሳብ ስያሜዎች እና ለተዘረዘሩ የሂሳብ/የሕዝብ ቁልፍ ቅጾች የተወሰነ ነው
   - `#` ለንብረቶች መገለጫ ቅጽል ስሞች እና የንብረቶች ሚዛን ፊደላት የተያዘ ነው
   - `::` ለውል ስያሜዎች የተጠበቀ ነው
   - `.` ለጎራ እና የመረጃ ቦታ ብቃት የተጠበቀ ነው
   - `$` ለትሪገር ስኮፕ የጽሑፍ ቅጾች ብቻ የተጠበቀ ነው
   - `%` ለተረጋገጠ የጽሑፍ ቅጾች የተያዘ ነው

2. አንድ ስም ሊኖረው የሚችለው ከፍተኛ ቁጥር ያላቸው ቁምፊዎች (የ UTF-8 ቁምፊዎችን ጨምሮ) በሁለት ምክንያቶች የተገደበ ነው: `[0, u32::MAX]` እና በአሁኑ ጊዜ የተመደበው የመደርደሪያ ቦታ።

## Taira ላይ ይሞክሩት {#try-it-on-taira}

የህዝብ ሀብት ቅጽል ስያሜ በካኖኒካል የአክሲዮን ትርጓሜው ID ውስጥ ይፍታ:

```bash
curl -fsS https://taira.sora.org/v1/assets/aliases/resolve \
  -H 'content-type: application/json' \
  -d '{"alias":"usd#wonderland"}' \
  | jq '{alias, asset_definition_id, asset_name, status: .alias_binding.status}'
```

ይህንን ከንብረቱ ትርጉም ዝርዝር ጋር አወዳድር:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=20' \
  | jq -r '.items[] | select(.alias != null) | [.alias, .id, .name] | @tsv'
```

`#` ቁምፊ የንብረት ስያሜዎችን ከጎራ አውድ ይለያል። እርስዎ ሆን ብለው የንብረት ስም ወይም የንብረት ሚዛን ቃል በቃል ካልተፃፉ በስተቀር ከቀላል ስሞች ያርቁት።
