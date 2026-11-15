---
translation_locale: az
translation_source: /guide/configure/client-configuration.md
translation_source_hash: b3cfc8d8bf51a43b88cefb5ac7fe641717b347f7c89d983bf4c2de80944f1bb8
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Müştəri Konfiqurasiyası {#client-configuration}

Iroha CLI və SDK müştəriləri TOML konfiqurasiyasından istifadə edirlər. Anbar hazırkı standartı `defaults/client.toml` ünvanında təqdim edir; yaradılmış yerli şəbəkələr də çıxış qovluqlarına uyğun `client.toml` yazırlar.

::: details Müştəri konfiqurasiya şablonu

<<< @/snippets/client.template.toml

:::

## Əsas Sahələr {#core-fields}

Müştəri konfiqurasiyası ən azı zənciri, onun şəbəkə kimliyini, Torii son nöqtəsini, hesabın şəbəkə kontekstini və imzalama açarını müəyyən edir:

```toml
chain = "00000000-0000-0000-0000-000000000000"
network_id = "hash:32C903E5B3497E34C2B844EBFE8A39C19E6CF8F95D44C1FFB8BA9DCB42F91149#A2F0"
torii_url = "http://127.0.0.1:8080/"

[account]
chain_discriminant = 753
public_key = "ed0120..."
private_key = "802620..."
```

- `chain` göndərilən əməliyyatların aid olduğu zənciri seçir.
- `network_id` genezisdən törəyən və hər imzalanmış sorğunun bağlandığı şəbəkə kimliyidir. `network_id` və ya `network_id_file` seçimlərindən dəqiq birini konfiqurasiya edin; qovşaq qiyməti `GET /v1/accounts/capabilities` ünvanında elan edir.
- `torii_url` şəbəkə yoldaşı Torii HTTP API-ə işarə edir.
- `[account].chain_discriminant` şəbəkənin I105 hesab prefiksini seçir. Açıq şəbəkələr əvəzində `[account].profile = "taira"` və ya `"minamoto"` istifadə edə bilər. Bu iki seçimdən biri tələb olunur və kanonik `AccountId` özü domen daşımır.
- `[account].public_key` və `[account].private_key` əməliyyatları imzalayır; `private_key_file` sahəsi `private_key` sahəsini əvəz edə bilər.

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

`iroha` CLI yerli növbə vəziyyəti üçün məcburi olmayan `[connect]` bölməsini də oxuyur. Təkrar istifadə edilən SDK konfiqurasiyası bu bölməni qəbul etmir:

```toml
[connect]
queue_root = "./queue"
```

İş axını müştəri tərəfində davamlı növbə saxlanması tələb etdikdə bundan istifadə edin. `connect.queue_root` üçün standart qiymət `~/.iroha/connect`-dir; nisbi yol müştərinin TOML faylını saxlayan qovluğa nəzərən həll olunur.

## Konfiqurasiyaların Yaradılması {#generating-configurations}

Bir dəfəlik yerli şəbəkələr üçün Kagami-u seçin, çünki o, uyğun gələn Iroha 3 konfiqurasiyaları, blokçeyn ilkin konfiqurasiyasını, skriptləri və bir README yazır:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
```

Yaradılmış `./localnet/client.toml`-dən CLI ilə istifadə edin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```
