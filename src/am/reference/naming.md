---
translation_locale: am
translation_source: /reference/naming.md
translation_source_hash: d757024fca471ec55f1fe4857e88e01a9a0a18e0d79e8cb4fdb3da0cb250f4be
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# የስብሰባዎች ስም ማውጣት {#naming-conventions}

ሂሳቦችን፣ ጎራዎችን ወይም ንብረቶችን ስማቸው ሲሰጡ ከግምት ውስጥ ማስገባት አለብዎት
የሚከተሉት ኮንቬንሽኖች Iroha:

1. ለተወሰኑ ልዩነቶች የሚጠቀሙ በርካታ የተቀመጡ መለያዎች አሉ
   የግንባታ ዓይነቶች

   - `@` ለሂሳብ ስያሜዎች እና ለተዘረዘሩ የሂሳብ/የሕዝብ ቁልፍ ቅጾች የተጠበቀ ነው
   - `#` ለንብረቶች መገለጫ ቅጽል ስሞች እና የንብረቶች ሚዛን ፊደላት የተጠበቀ ነው
   - `::` ለውል ቅጽል ስሞች የተጠበቀ ነው
   - `.` ለጎራ እና የመረጃ ቦታ ማረጋገጫ የተጠበቀ ነው
   - `$` ለፈታኝ ስኮፕ የጽሑፍ ቅጾች የተጠበቀ ነው
   - `%` ለቫሊዲተር-ተኮር የጽሑፍ ቅጾች የተጠበቀ ነው

2. የቁምፊዎች ከፍተኛ ቁጥር (እንደዚሁም UTF-8 ፊደላት) አንድ ስም ሊኖረው ይችላል
   በሁለት ምክንያቶች የተገደበ ነው `[0, u32::MAX]` እና በአሁኑ ጊዜ
   የተመደበው የመደርደሪያ ቦታ።

## ሞክር Taira {#try-it-on-taira}

የሕዝብ ንብረት ስም በካኖኒካል የአክሲዮን ትርጓሜው ውስጥ እንዲፈታ ID:

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

የ `#` ገጸ-ባህሪው የንብረት ስያሜ ከጎራ አውድ ይለያል
የንብረት ስም ወይም ንብረትን ሆን ተብሎ ካልጻፉ በስተቀር
ሚዛን ቃል በቃል ነው።
