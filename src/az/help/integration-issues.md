---
translation_locale: az
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# İnteqrasiya Problemlərinin Həlli {#troubleshooting-integration-issues}

Bu bölmə Iroha 3 inteqrasiyası üçün problem həll etmə məsləhətləri təklif edir. Əgər yaşadığınız problem burada təsvir edilməyibsə, bizə [Telegram](https://t.me/hyperledgeriroha) vasitəsilə müraciət edin.

## Müştəri əlaqə qura bilmir {#client-cannot-connect}

Müştəri konfiqurasiyasının şəbəkə iştirakçısının Torii ünvanına işarə etdiyini yoxlayın:

```toml
torii_url = "http://127.0.0.1:8080/"
```

CLI yoxlamaları üçün eyni faylı açıq şəkildə göndərin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Əgər şəbəkə tərəfdaşı Docker və ya Kubernetes-də işləyirsə, müştəri prosesindən əlçatan olan host və ya xidmət ünvanından istifadə edin. Konteyner içində `127.0.0.1` host maşın deyil.

İctimai Taira testlər üçün, imzasız API son nöqtə sındırma cihazından başlayın:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

Əgər bu əmrlər `502`, TLS, DNS və ya zaman aşımı xətaları ilə uğursuz olarsa, şəbəkəyə çıxışı düzəldin və ya hesab açarlarını və ya əməliyyat yükünü düzəltməkdən əvvəl ictimai testnet API son nöqtəsini gözləyin.

## Əməliyyatlar rədd edilir {#transactions-are-rejected}

Əksər əməliyyat uğursuzluqlarına şəxsiyyət və ya səlahiyyət uyğunsuzluğu səbəb olur:

- Müştəri konfiqurasiyasında olan hesabın açıq açarı imzalamaq üçün istifadə olunan şəxsi açarla uyğun gəlmir
- hesab blockchain genesis-də və ya əvvəlki əməliyyat tərəfindən qeydiyyatdan keçməyib
- hesabda proqramın icra mühiti doğrulayıcısı tərəfindən tələb olunan icazə tokeni və ya rol yoxdur
- bir domen ID-si öz məlumatlar sahəsi kvalifikasiyasını itirib, məsələn `domain.dataspace`

Xətaları oxumağı asanlaşdırmaq üçün CLI əmrlərini ayıklayarkən `--output-format text` istifadə edin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## Sorğular boş nəticələr verir {#queries-return-empty-results}

Boş sorğu nəticələri həmişə sorğunun uğursuz olduğunu göstərmir. Yoxlayın:

- obyekti yaratmalı olan əməliyyat yekunlaşdırıldı
- sorğulanan domen, aktiv tərifi və ya hesab ID-si tək protokol-standartdır
- səhifələmə və ya filtrlər gözlənilən sətri istisna etmir
- müştəri nəzərdə tutulan şəbəkəyə qoşulub, başqa yerli şəbəkəyə yox

Domain yoxlamaları üçün ən geniş sorğu ilə başlayın:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## Hadisə və ya blok axınları erkən dayandırılır {#event-or-block-streams-stop-early}

Blok və hadisə axını nümunələri Torii axın API son nöqtələrinə əsaslanır. Şəbəkə qohumunun hələ işlədiyini yoxlayın, sonra zaman aşımı ilə test edin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

HTTP inteqrasiyaları üçün, API son nöqtə yollarınızı mövcud [Torii API nöqtə sonu istinadı](/az/reference/torii-endpoints.md) ilə müqayisə edin.
