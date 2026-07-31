---
translation_locale: az
translation_source: /guide/configure/client-configuration.md
translation_source_hash: 0d897a79e6118de2e7e88a45f1daf1444b515fd35e7b2562f7c1cc18ed0a83b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Müştəri Konfiqurasiyası {#client-configuration}

Iroha CLI və SDK müştəriləri TOML konfigurasiyasından istifadə edirlər. Repozitor hazırki standartı `defaults/client.toml` ünvanına göndərir; istehsal olunan yerli şəbəkələr də öz çıxışı dizaynlarına uyğun bir `client.toml` yazırlar.

::: details Müştəri konfigurasiyası şablonu

<<< @/snippets/client.template.toml

:::

## Əsas sahələr {#core-fields}

Ən azı bir müştəri konfigurasiyası zəncir, Torii son nöqtəsi və imza hesabını müəyyən edir:

```toml
chain = "00000000-0000-0000-0000-000000000000"
torii_url = "http://127.0.0.1:8080"

[account]
domain = "wonderland.universal"
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` təqdim edilmiş əməliyyatların daxil olduğu zəncir seçilir.
- `torii_url` nöqtələri Torii HTTP API nisbətində.
- `[account].domain` CLI qısa yolları və ünvan seçicisi kodlaşdırması ilə istifadə olunur; kanonik `AccountId` özü domensizdir.
- `[account].public_key` və `[account].private_key` əməliyyatları imzalayır.

Hesab artıq zəncirdə mövcud olmalıdır. Varsayılan yerli şəbəkə üçün bu, birləşmiş genesis manifestı ilə idarə olunur.

::: info Dərs həssaslığı

Iroha adları kanonik analizdən sonra vəziyyətə həssasdır. məsələn, `wonderland.universal`, `Wonderland.universal` və `looking_glass.universal` fərqli domen ədəbiyyatıdırlar.

:::

## Əsas etibarlılıq {#basic-authentication}

Seçilmiş `[basic_auth]` bölməsi müştəri müraciətlərinə HTTP `Authorization` başlığı əlavə edir. Iroha həmyaşıllıları bu etibarnamələri birbaşa şərh etmirlər; Torii Nginx kimi əks proxy arxasında olduğu zaman istifadə edin.

```toml
[basic_auth]
web_login = "mad_hatter"
password = "ilovetea"
```

## Transaction Settings {#transaction-settings}

Transaction behavior `[transaction]` bölməsi ilə qurulur:

```toml
[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

- `time_to_live_ms` millisekundlarda əməliyyatın ömrüdür.
- `status_timeout_ms` müştərinin əməliyyat vəziyyətini nə qədər gözlədiyini idarə edir.
- `nonce = true` müştəridən dəfələrlə təkrarlanan əməliyyatların fərqli hashlər gətirib çıxarması üçün bir nonce daxil etməsini tələb edir.

## Satır parametrlərini bağlayın {#connect-queue-settings}

Hal-hazırda Iroha müştərilər yerli sıra vəziyyətinə görə `[connect]` bölməsindən də istifadə edə bilərlər:

```toml
[connect]
queue_root = "./queue"
```

İş axını üçün davamlı müştəri tərəfində növbə saxlanılması lazım olduqda bunu istifadə edin.

## Konfiqurasiyaların yaradılması {#generating-configurations}

Birdəfəlik yerli şəbəkələr üçün Kagami -i üstün tutun, çünki uyğunlaşdırılmış Iroha 3 konfiqurasiyaları, genesis, skriptləri və README yazır:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Yaradılan `./localnet/client.toml` ilə CLI istifadə edin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```
