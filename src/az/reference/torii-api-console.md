---
translation_locale: az
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: bing-translator-llm

aside: false
pageClass: torii-api-console-page
---

# Torii API Konsol {#torii-api-console}

Yolları yoxlamaq, test sorğuları göndərmək, curl əmrlərini kopyalamaq və müştəri kodu yaratmaq üçün işləyən Torii API son nöqtəsindən canlı OpenAPI sənədindən istifadə edin.

<ToriiApiConsole />

## Tələblər {#requirements}

- Torii API son nöqtəsi `/openapi.json`-ı açıq etməlidir.
- Brauzer testi bu sənədlərin mənşəyinə icazə vermək üçün CORS tələb edir.
- Brauzer birbaşa API nöqtəsinə çatmaq qabiliyyətinə malik olmalıdır.
- Kod yaradılması Node.js, pnpm və OpenAPI Generator üçün bir Java proqram icra mühiti tələb edir.

Konsol varsayılan olaraq `https://taira.sora.org` istifadə edir. Yerli inkişaf adətən sizin cihazınızda Torii işlədikdə `http://127.0.0.1:8080` ilə işləyir.

## Əvvəlcə Taira-i sınayın {#try-taira-first}

Müştəri yaratmadan əvvəl, ictimai OpenAPI sənədinizin maşınınızdan əlçatan olduğunu yoxlayın:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Sonra konsola `https://taira.sora.org/openapi.json` yapışdırın və `GET /status`, `GET /v1/domains` və ya `GET /v1/assets/definitions` kimi yalnız oxuma yolu sınayın. İmzalanmış əməliyyat və şəxsi açar axınlarını proqram təminatı icra mühitinizdən sirlər yükləyən SDK və ya CLI müştəri üçün saxlayın.

## Yaradılmış Müştərilər {#generated-clients}

Generator əmri konsolun yüklədiyi eyni canlı OpenAPI sənəddən istifadə edir. Bu, JSON operatoru, tədqiqatçı, tətbiq və telemetriya marşrutları üçün faydalıdır.

İmzalanmış blokçeyn dəftər əməliyyatları, imzalanmış sorğular və Norito-yerli yükləmələr üçün rəsmi Iroha SDKs-dən istifadə edin. OpenAPI müştəriləri sizə imzaları yığmır, hesab açarlarını idarə etmir və Norito əməliyyat bədənlərini kodlamır.

Hər bir OpenAPI Generator tərəfindən dəstəklənən generatoru yoxlamaq üçün, bunu işlədin:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
