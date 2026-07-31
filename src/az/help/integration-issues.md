---
translation_locale: az
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Integrasiya problemlərinin həlli {#troubleshooting-integration-issues}

Bu bölmədə problemlərin aradan qaldırılması üçün məsləhətlər təqdim olunur Iroha 3 İnteqrasiya. Əgər yaşadığınız problem burada təsvir olunmursa, bizə müraciət edin: [Teleqram](https://t.me/hyperledgeriroha).

## Müştəri əlaqə qura bilmir. {#client-cannot-connect}

Müştərinin konfiqurasiyasının həmyaşıdların Torii ünvanına yönəldiyini yoxlayın:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI yoxlamaları üçün eyni faylı açıq şəkildə keçin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Əgər həmyaşıdlar daxil olarsa... Docker və ya Kubernetes, müştəri prosesi ilə əldə edilə bilən host və ya xidmət ünvanından istifadə edin. `127.0.0.1` bir konteynerin içindəki ev sahibi maşın deyil.

İctimai Taira sınaqlar üçün imzalanmamış son nöqtə sondası ilə başlayın:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Əgər bu əmrlər `502`, TLS, DNS və ya vaxt məhdudlaşdırma səhvləri ilə uğursuz olarsa, hesab açarlarını və ya əməliyyat pay yüklərini düzəltmədən əvvəl şəbəkə əlçatanlığını tənzimləyin və ya ictimai testnet son nöqtəsini gözləyin.

## Əməliyyatlar rədd edilir {#transactions-are-rejected}

Əksər əməliyyat uğursuzluğunun səbəbi şəxsiyyət və ya icazə uyğunsuzluğudır:

- Müştəri konfiqurasiyasında hesabın ictimai açarı imzalanmaq üçün istifadə olunan özəl açarı ilə uyğun deyil.
- Hesabın başlanğıc və ya əvvəlki əməliyyatla qeydiyyatdan keçirilməməsi
- Hesabın icra vaxtının təsdiqçisi tərəfindən tələb olunan icazə nömrəsi və ya rolu yoxdur.
- bir domenin ID məlumat sahəsi təsnifatı yoxdur, məsələn, `domain.dataspace`

`--output-format text` əmrlərini debug edərkən CLI istifadə edin ki, səhvləri oxumaq daha asan olsun:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Suallar boş nəticələr verir {#queries-return-empty-results}

Boş sorğu nəticələri həmişə sorğunun uğursuz olduğu anlamına gəlmir.

- obyektin yaradılmasına səbəb olan əməliyyat həyata keçirilib
- İstəilən domen, aktiv təyinatı və ya hesab ID kanonikdir.
- Saytlaşdırma və ya filtrlər gözlənilən sıra istisna etmir.
- müştəri nəzərdə tutulan şəbəkəyə qoşulmuşdur, başqa bir yerli şəbəkə deyil

Domen yoxlamaları üçün ən geniş sorğu ilə başlayın:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Hadisə və ya blok axınları erkən dayandırılır {#event-or-block-streams-stop-early}

Bloq və hadisə axını nümunələri Torii axın son nöqtələrindən asılıdır. Tərəfdaşın hələ də çalışdığını yoxlayın, sonra vaxt məhdudluğu ilə sınayın:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP inteqrasiyaları üçün son nöqtə yollarını hazırkı [Torii son nöqtələrinin istinadına](/az/reference/torii-endpoints.md) müqayisə edin.
