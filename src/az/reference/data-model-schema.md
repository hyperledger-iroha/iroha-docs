---
translation_locale: az
translation_source: /reference/data-model-schema.md
translation_source_hash: cf27b1f313a695b648ae450564a51120af0e3e39641ed140a187d128b930da97
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Məlumat Modeli SXeması {#data-model-schema}

İnteqrasiyanızın hədəf aldığı dəqiq noddan sxemi sorğulayın. Torii səthi aktiv olduqda `GET /v1/schema` ünvanında aktiv məlumat modeli sxemini təqdim edir:

```bash
export TORII_URL=http://127.0.0.1:8180

curl -fsS -H 'Accept: application/json' "$TORII_URL/v1/schema" \
  > iroha-data-model-schema.json
```

Təsdiq edilmiş sənədləşdirmə parçacığından bağımlılıqlar yaratmayın, əgər onun mənşə statusu gözləmədədirsə. Canlı nodun cavabı həmin nodun tərtib edilmiş məlumat modeli üçün səlahiyyətlidir; onu inteqrasiyanızda istifadə olunan node quruluşu ilə yanaşı sabitləyin.
