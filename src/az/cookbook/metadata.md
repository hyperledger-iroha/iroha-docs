---
translation_locale: az
translation_source: /cookbook/metadata.md
translation_source_hash: bb486994faabb29fb48609a886862e44e565148be4800ec1244218ef37e2e54b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Metaməlumat {#metadata}

## Nəticə {#outcome}

Taira üzərində metadatanı oxuyun, açıq şəkildə ödəniş edən bir əməliyyatla bir hesab metadatası dəyərini təyin edin və yoxlayın, sonra isə həmin dəyəri yenidən silin. Blokçeyn dəftəri obyekt metadatasını əməliyyat ödəniş metadatasından ayrı saxlayacaqsınız.

## Tələb olunan əvvəlcədən şərtlər {#prerequisites}

- `curl`, `jq`, Python 3.11 və daha sonrakı versiyaları, həmçinin cari `iroha` CLI.
- [Taira-ə qoşul](./connect-to-taira.md) tərəfindən maliyyələşdirilən `taira.client.toml` və `taira.tx-metadata.json`.
- hədəf hesabın metadata üzərində səlahiyyət verən əsas. Nümunə özü konfiqurasiya edilmiş səlahiyyət verən əsas hədəfləyir; başqa bir hesab dəqiq icazə tələb edir.

## Addımlar {#steps}

### 1. Kriptoqrafik imzalayan olmadan metadataları oxuyun {#_1-read-metadata-without-a-signer}

Metaməlumat `Name`-dən JSON-ə yoxlanılmış bir xəritədir. Boş xəritələr və boş filtrelənmiş çıxışlar keçərli nəticələrdir.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=100' \
  | jq '.items[] \
    | select((.metadata // {} | length) > 0) \
    | {id, name, metadata}'

curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=20' \
  | jq '.items[] | select((.metadata // {} | length) > 0)'
```

Kiçik təsviri və ya indeksləşdirmə sahələri üçün metadatalardan istifadə edin. Böyük yükləri blokçeyn dəftərxanasının xaricində saxlayın və əvəzinə kriptoqrafik həzm dəyəri, URI və ya SoraFS istinadını saxlayın.

### 2. Hədəf hesabı çıxarın {#_2-derive-the-target-account}

Taira konfiqurasiyasından yalnız açıq açarı oxuyun və onu tək protokol-standartı, domen olmayan I105 formasına çevirin.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
```

### 3. Bir JSON dəyəri təyin edin {#_3-set-one-json-value}

Standart girişdən oxunan JSON hesabın `cookbook_profile` dəyərinə çevrilir. Əksinə, `--metadata ./taira.tx-metadata.json` əməliyyat məlumat konteynerinə rüsum sahələrini əlavə edir. Bu iki xəritənin fərqli hədəfləri və məqsədləri var.

```bash
printf '%s\n' \
  '{"display_name":"Cookbook signer","tier":"testnet","version":1}' \
  | iroha --config ./taira.client.toml \
      --machine \
      --fee-payer authority \
      --metadata ./taira.tx-metadata.json \
      ledger account meta set \
      --id "$TAIRA_ACCOUNT_ID" \
      --key cookbook_profile
```

CLI ödənişi təklif edir, imzalayır, təqdim edir və defolt olaraq gözləyir. Bu dəyərdən asılı olan növbəti əməliyyat üçün `--no-wait` əlavə etməyin.

::: warning İcazə sərhədi

Fəal təsdiqləyici hər bir obyekti kim dəyişə biləcəyinə qərar verir. Başqa bir hesabı yeniləmək adətən `CanModifyAccountMetadata` tələb edir; domenlər, aktiv tərifləri, NFTs və tetiklər öz hədəfə spesifik metadata icazələrinə malikdirlər. Əgər Taira tələb olunan səlahiyyət verən prinsipi təmin etməyibsə, eyni hesab əmrlərini `./localnet/client.toml` ilə işlədin, yaradılmış localnet səlahiyyət verən prinsipin tək protokol-standart I105 identifikatorunu əvəz edin və Taira ödəniş metadatası faylını çıxarın. Açıq yerli ödəyici seçimini saxlayın.

:::

### 4. Açarı çıxarın {#_4-remove-the-key}

Əvvəlcə son dəyəri oxuyun, sonra ayrıca silmə əməliyyatı göndərin.

```bash
iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile \
  | tee cookbook-profile.json

jq -e '.version == 1' cookbook-profile.json

iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger account meta remove \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile
```

Python tətbiqləri üçün uyğun yazılı qurucular `Instruction.set_account_key_value` və `Instruction.remove_account_key_value`-dir; onları əməliyyat metadı və [Python dərsliyi](/az/guide/tutorials/python.md#shared-setup)-dən gözləyən köməkçi ilə təqdim edin.

## Yoxla {#verify}

Müəyyən edilmiş əməliyyatdan sonra, `meta get` obyektini `version: 1` ilə qaytarmalıdır. Silindikdən sonra, birbaşa axtarış artıq dəyər qaytarmamalıdır:

```bash
iroha --config ./taira.client.toml --machine ledger account get \
  --id "$TAIRA_ACCOUNT_ID" > /dev/null

if iroha --config ./taira.client.toml --machine ledger account meta get \
  --id "$TAIRA_ACCOUNT_ID" \
  --key cookbook_profile; then
  printf '%s\n' 'metadata key still exists' >&2
  exit 1
else
  printf '%s\n' 'metadata key removed'
fi
```

Ayrı hesab oxunuşu, itkin metadatalar açarını şəbəkə və ya hesab nasazlığından ayırd edir. İstehsal kodu, onu təyin etdikdən sonra bütün JSON dəyərini də yoxlamalıdır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- Standart girişdə bir dəyərli JSON olmalıdır. Sətirlər JSON sitat işarələrində olmalıdır; obyektlər və massivlər düzgün qurulmalıdır.
- Metaməlumat açarları `Name` dəyərləridir və təhlildən sonra hərf böyük-kiçikliyinə həssastır. Hər sxema dəyişikliyi üçün versiyalı açarlar yaratmaq əvəzinə sabit açar lüğətini saxlayın.
- `--metadata` əməliyyat metaverisidir; o, blokçeyn dəftər obyektinin metaverisini təyin etmir. Sonuncusu üçün varlığın `meta set` alt əmrindən istifadə edin.
- Uğurlu təqdimatdan sonra köhnə oxunuş təkraralaşma gecikməsi ola bilər. Tətbiq edilmiş sonluğu gözləyin və sorğunu yenidən təqdim etməzdən əvvəl yenidən sınayın.
- İcazənin rədd edilməsi hədəf obyektini və səlahiyyət prinsipi sərhədini müəyyən edir. Yerli olaraq məşq edin və ya dəqiq token tələb edin; giriş nəzarətindən qaçmaq üçün xüsusi tətbiq məlumatlarını ictimai metadata sahəsinə köçürməyin.
- Meta məlumatlarda şəxsi açarları, xam şəxsiyyəti göstərən məlumatları, giriş tokenlərini və ya böyük sənədləri heç vaxt saxlamayın.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabitlənmiş mənbə kodu versiyasında metaveri sorğusu inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/queries/metadata.rs)
- [Python SDK pinlənmiş mənbə kodu reviziyasında əməliyyat qurucuları](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/python/iroha_python/README.md)
- [Metaməlumat](/az/blockchain/metadata.md)
- [Meta məlumatlar və blokçeyn dəftər saxlanması seçimləri](/az/guide/configure/metadata-and-store-assets.md)
- [Təlimat istinadı](/az/reference/instructions.md)
- [İcazə tokenləri](/az/reference/permissions.md)
