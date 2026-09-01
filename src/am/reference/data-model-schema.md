---
translation_locale: am
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# የውሂብ ሞዴል ንድፍ {#data-model-schema}

የውህደትዎ ዒላማዎች ካደረጉት ትክክለኛ ኖድ መርሃግብሩን ይጠይቁ። Torii ያ ወለል ሲነቃ በ `GET /v1/schema` ላይ የነቃውን የውሂብ-ሞዴል መርሃ ግብር ያገለግላል -

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

የመነሻ ሁኔታው በመጠባበቅ ላይ እያለ ከተመዝግቧል ሰነድ ቅንጭብ ማያያዣዎችን አያመነጩ። የቀጥታ ኖድ ምላሽ ለዚያ ኖድ የተጠናቀረ የውሂብ ሞዴል ስልጣን ያለው ነው; . በእርስዎ ውህደት ከሚጠቀመው የኖድ ግንባታ ጎን ለጎን እንዲሰካ ያድርጉት።
