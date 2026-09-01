---
translation_locale: az
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 6da8a0abddc9723b16477a935a3953ebd497300f02eadd635e4e38027a11d095
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Müştəri Konfiqurasiyası {#client-configuration}

Iroha CLI və SDK müştəriləri TOML konfiqurasiyasından istifadə edirlər. Anbar hazırkı standartı `defaults/client.toml` ünvanında təqdim edir; yaradılmış yerli şəbəkələr də çıxış qovluqlarına uyğun `client.toml` yazırlar.

::: details Müştəri konfiqurasiya şablonu

<<< @/snippets/client.template.toml

:::

## Əsas Sahələr {#core-fields}

Ən azı, bir müştəri konfiqurasiyası zənciri, Torii API son nöqtəsini və imzalama hesabını müəyyən edir:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` göndərilən əməliyyatların aid olduğu zənciri seçir.
- `torii_url` şəbəkə yoldaşı Torii HTTP API-ə işarə edir.
- `[account].domain` CLI qısayolları və ünvan-seçici kodlaşdırması tərəfindən istifadə olunur; tək protokol-standart `AccountId` özü sahəsizdir.
- `[account].public_key` və `[account].private_key` əməliyyatları imzalayır.

Hesabın artıq zəncirdə mövcud olması lazımdır. Varsayılan yerli şəbəkə üçün bu, daxil edilmiş blokçeyn başlanğıc texniki manifesti tərəfindən idarə olunur.

::: info Hərf həssaslığı

Iroha adları tək protokol-standart analizindən sonra böyük-kiçik hərf fərqi nəzərə alınır. Məsələn, `wonderland.universal`, `Wonderland.universal` və `looking_glass.universal` fərqli domen literallarındır.

:::

## Əsas Doğrulama {#basic-authentication}

Seçimli `[basic_auth]` bölməsi müştəri sorğularına HTTP `Authorization` başlığı əlavə edir. Iroha şəbəkə yoldaşları bu etimadnamələri birbaşa şərh etmir; onları Torii Nginx kimi bir əks proxy arxasında olduqda istifadə edin.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Əməliyyat Parametrləri {#transaction-settings}

Əməliyyat davranışı `[transaction]` bölməsi ilə konfiqurasiya olunur:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` əməliyyatın ömür müddətidir, millisekundlarla.
- `status_timeout_ms` müştərinin əməliyyat statusunu gözləmə müddətini idarə edir.
- `nonce = true` müştəridən təkrar əməliyyatların fərqli kriptoqrafik həşlər yaratması üçün kriptoqrafik nonce dəyərini daxil etməyi xahiş edir.

## Növbə Parametrlərinə Qoşul {#connect-queue-settings}

Hazırkı Iroha müştərilər həmçinin yerli növbə vəziyyəti üçün seçimi `[connect]` bölməsini istifadə edə bilərlər:

```toml
[connect]
queue_root = "./queue"
```

Bunu iş axını davamlı müştəri tərəfi növbə saxlamağa ehtiyac duyduqda istifadə edin.

## Konfiqurasiyaların Yaradılması {#generating-configurations}

Bir dəfəlik yerli şəbəkələr üçün Kagami-u seçin, çünki o, uyğun gələn Iroha 3 konfiqurasiyaları, blokçeyn ilkin konfiqurasiyasını, skriptləri və bir README yazır:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Yaradılmış `./localnet/client.toml`-dən CLI ilə istifadə edin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
