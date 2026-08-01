---
translation_locale: az
translation_source: /reference/torii-api-console.md
translation_source_hash: a277d8c03a3909eb80d124f0bfed7b78e7c3ed886e443c72effe007d454718bf
translation_status: machine-validated
translation_engine: nllb-200-ct2

aside: false
pageClass: torii-api-console-page
---

# Torii API Konsol {#torii-api-console}

Yolları yoxlamaq, test tələbləri göndərmək, curl əmrlərini kopyalamaq və müştəri kodu yaratmaq üçün işləyən Torii son nöqtəsindən canlı OpenAPI sənədindən istifadə edin.

<ToriiApiConsole />

## Tələbi {#requirements}

- Torii son nöqtəsi `/openapi.json` ifşa etməlidir.
- Browser testləri CORS bu sənədlərin mənşəyini təmin etmək üçün tələb edir.
- Brauzer birbaşa son nöqtəyə çatmaq imkanına malik olmalıdır.
- Kodu istehsal etmək üçün Node.js, pnpm və OpenAPI Generator üçün Java işləmə vaxtı lazımdır.

Konsol standart olaraq `https://taira.sora.org`. Yerli inkişaf ümumiyyətlə kompüterdə Torii çalışdığınız zaman `http://127.0.0.1:8080` ilə işləyir.

## Əvvəlcə Taira sınayın {#try-taira-first}

Bir müştəri yaratmadan əvvəl, ictimai OpenAPI sənədin maşınınızdan əldə edilə biləcəyini yoxlayın:

```bash
curl -fsS https://taira.sora.org/openapi.json -o /tmp/taira-openapi.json
jq '{title: .info.title, version: .info.version, paths: (.paths | length)}' \
  /tmp/taira-openapi.json
```

Sonra konsolla `https://taira.sora.org/openapi.json` əlavə edin və `GET /status`, `GET /v1/domains` və ya `GET /v1/assets/definitions` kimi yalnız oxunma yolu sınayın. İşlənmiş əməliyyatı və şəxsi açar axınlarını iş vaxtı mühitinizdən sirləri yükləyən SDK və ya CLI müştəri üçün saxlayın.

## Yaradılmış Müştərilər {#generated-clients}

Generator komandanı konsol yüklədiyi eyni canlı OpenAPI sənədi istifadə edir. Bu, JSON operatoru, kəşfiyyatçısı, tətbiq və telemetri marşrutu üçün faydalıdır.

İmzalanmış nəşriyyat əməliyyatları, imzalanan sorğular və Norito - yerli payloadlar üçün rəsmi Iroha SDKs istifadəçiləri üstünlük verirlər. OpenAPI müştərilər sizin üçün imzaları toplamazlar, hesab açarlarını idarə etmirlər və ya Norito əməliyyat orqanlarını kodlamırlar. .

OpenAPI Generator tərəfindən dəstəklənən hər bir generatorun yoxlanılmasına görə:

```bash
pnpm dlx @openapitools/openapi-generator-cli list
```
