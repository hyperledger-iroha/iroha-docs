---
translation_locale: am
translation_source: /reference/data-model-schema.md
translation_source_hash: c4f0305c73f9470d1652b70e6787b59de2553a08b6c96603a9369512efbdb1af
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# የውሂብ ሞዴል ንድፍ {#data-model-schema}

የውህደትዎ ዒላማዎች ካደረጉት ትክክለኛ ኖድ መርሃግብሩን ይጠይቁ። Torii ያ ወለል ሲነቃ በ `GET /v1/schema` ላይ የነቃውን የውሂብ-ሞዴል መርሃ ግብር ያገለግላል -

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

ማሰሪያዎችን ለሌላ ግንባታ ከታተመ ቅጂ ሳይሆን ከዚያው ምላሽ ያመንጩ። የሚሠራው ኖድ ምላሽ ለዚያ ኖድ የተጠናቀረ የውሂብ ሞዴል የታመነ ምንጭ ነው፤ ከውህደትዎ የሚጠቀምበት የኖድ ግንባታ ጋር አብረው ያስቀምጡት።
