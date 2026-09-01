---
translation_locale: az
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 6d36784afef0ef10113cabc995ddfb45fd8d382d7c32c553d77cf03ba5c1f65f
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Hesablar və Ləqəblər {#accounts-and-aliases}

## Nəticə {#outcome}

Domeni olmayan tək protokol-standart I105 hesab identifikatorları və `treasury@payments.universal` kimi ayrıca bağlı insan tərəfindən oxuna bilən ləqəblərlə təhlükəsiz işləyin. Siz Taira hesablarını yoxlayacaqsınız, öz tək protokol-standart identifikatorunuzu əldə edəcəksiniz və yönləndirmə kontekstini şəxsiyyətlə qarışdırmadan ləqəbləri həll edəcəksiniz.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `curl`, `jq`, Python 3.11 və daha sonrakı versiyaları, həmçinin cari `iroha` CLI.
- Öz hesabınızı yoxlayarkən [Taira-ə qoşul](./connect-to-taira.md)-dən bir `taira.client.toml`.
- Hesaba xas oxumağın uğurla baş tutmasını gözləmədən əvvəl Taira testnet maliyyələşdirmə xidməti vasitəsilə və ya şəbəkənin idarə olunan qoşulma yolu ilə təmin edilmiş bir hesab.

## Addımlar {#steps}

### 1. Taira-də tək protokol-standart hesabları yoxlayın {#_1-inspect-canonical-accounts-on-taira}

İctimai hesab siyahısı həmişə tək protokol-standart I105 ID-lərini qaytarır. Əsas ləqəb seçimi ixtiyari olub ayrıca bildirilir.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

`.id` -dan olan bir şəxsiyyət vəsiqəsi ciddi hesab sahələri üçün etibarlıdır. Ona bir domen əlavə etməyin. `.primary_alias` -dən olan bir təxəllüs istifadəçi qarşısında axtarış açarıdır, başqa bir protokol-standart şəxsiyyət deyil.

### 2. Taira I105 İD-nizi çıxarın və normallaşdırın {#_2-derive-and-normalize-your-taira-i105-id}

Yalnız yerli konfiqurasiyadan açıq açarı oxuyun. Eyni açıq açar fərqli ictimai blokçeyn şəbəkə profilləri üçün fərqli şəkildə kodlanır, buna görə `taira`-ı açıq şəkildə seçin.

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

printf '%s\n' "$TAIRA_ACCOUNT_ID" \
  | iroha tools address normalize --profile taira
```

Normallaşdırılmış dəyər `TAIRA_ACCOUNT_ID` ilə eyni olmalıdır. TOML faylındakı `[account].domain` parametri `wonderland.universal` ola bilər, lakin bu dəyər yalnız yönləndirmə və ləqəb kontekstinə təsir göstərir.

### 3. Hesabı və onun aktivlərini oxuyun {#_3-read-the-account-and-its-assets}

Hesab təmin edildikdən sonra birbaşa onu sorğu edin və məhdudlaşdırılmış aktiv səhifəsini siyahıya alın. URL-dakı I105 dəyərini bir yolda istifadə etməzdən əvvəl kodlayın.

```bash
iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

ENCODED_ACCOUNT_ID="$(
  python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1], safe=""))' \
    "$TAIRA_ACCOUNT_ID"
)"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/accounts/$ENCODED_ACCOUNT_ID/assets?limit=10" \
  | jq '{total, items}'
```

### 4. Hesaba bağlı takma adlara baxın {#_4-look-up-aliases-bound-to-the-account}

Tərs rezolver bir dəqiq tək protokol-standart hesab ID-sini qəbul edir. İctimai məlumat sahələrinin sətirləri sorğu-imza başlıqları olmadan oxuna bilər; məhdud məlumat sahələri isə səlahiyyətli imzalı sorğu tələb edir.

```bash
jq -nc --arg account_id "$TAIRA_ACCOUNT_ID" \
  '{account_id: $account_id}' > alias-by-account.json

curl -fsS -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  --data-binary @alias-by-account.json \
  https://taira.sora.org/v1/aliases/by-account \
  | tee alias-bindings.json \
  | jq '{account_id, total, items}'
```

`total: 0` etibarlıdır: bir hesab üçün alias tələb olunmur. Bağlantı mövcud olduqda, onun tam olaraq təyin olunmuş aliasını müəyyən edin və qaytarılan hesab ID-sini müqayisə edin:

```bash
ALIAS_WAS_RESOLVED=false
if TAIRA_ALIAS="$(jq -er '.items[0].alias' alias-bindings.json)"; then
  jq -nc --arg alias "$TAIRA_ALIAS" \
    '{alias: $alias}' > alias-resolve.json

  curl -fsS -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    --data-binary @alias-resolve.json \
    https://taira.sora.org/v1/aliases/resolve \
    | tee alias-resolution.json \
    | jq '{alias, account_id, source}'
  ALIAS_WAS_RESOLVED=true
else
  printf '%s\n' 'No visible alias is bound to this account.'
fi
```

::: warning İcazə sərhədi

Taira testnet maliyyələşdirmə xidməti öz iddiaçı hesabını təmin edə bilər, lakin bu, ümumi hesab qeydiyyatı və ya aliase idarəetmə səlahiyyətini vermir. Başqa bir hesabın qeydiyyatı aktiv təsdiqləyici altında `CanRegisterAccount` tələb edir. Hesab təxəllüsləri adətən həmçinin aktiv SNS icarə və müvafiq təxəllüs icazələri tələb edir. İdarə olunan qeydiyyat/təxəllüs planlayıcısından istifadə edin və ya yaradılmış yerli şəbəkəyə qarşı qeydiyyatı məşq edin.

:::

Yerel şəbəkədə, bir təhlükəsiz kriptoqrafik imza-açar təchizatı addımı yeni bir tək protokol-standart `NEW_ACCOUNT_ID` ixrac etdikdən sonra, qeydiyyat səthi belədir:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Uyğun şəxsi açarı sənədlərdən və ya tətbiq anbarından kənarda yaradın və saxlayın. İdarəçi açarı atılmış bir ID-ni qeydiyyatdan keçirmək istifadə edilə bilməyən hesab yaradır.

## Yoxla {#verify}

Sübut edin ki, konfiqurasiyanın açıq açarı, I105 kodlaşdırması və ləqəb bağlanması hamısı tək bir protokol-standart hesab ID-sində birləşir:

```bash
NORMALIZED_ACCOUNT_ID="$(
  printf '%s\n' "$TAIRA_ACCOUNT_ID" \
    | iroha tools address normalize --profile taira
)"
test "$NORMALIZED_ACCOUNT_ID" = "$TAIRA_ACCOUNT_ID"

if test "${ALIAS_WAS_RESOLVED:-false}" = true; then
  test "$(jq -r '.account_id' alias-resolution.json)" = "$TAIRA_ACCOUNT_ID"
fi
```

Tək protokol-standart hesab ID-lərini saxlayın. İmzalar, icazələr və əməliyyat təlimatları üçün tək protokol-standart ID-lərdən istifadə edin. Alias-ı tətbiq sərhədində həll edin. Əməliyyat üçün istifadə olunan tək protokol-standart hesab ID-sini saxlayın.

## Problemlərin aradan qaldırılması {#troubleshooting}

- Bir təhlil və ya prefiks xətası adətən ünvanın fərqli şəbəkə profili üçün kodlaşdırıldığını göstərir. `--profile taira` ilə normallaşdırın və uyğun gəlməyənləri rədd edin.
- Testnet maliyyələşdirmə xidməti `202` sonra bir hesab `404` yayılma gecikməsi ola bilər. Yazını göndərmədən əvvəl hesabı və ya maliyyələşdirilmiş aktivləri sorğulayın.
- `total: 0` tərs həll edicidən o deməkdir ki, görünən heç bir təxəllüs bağlı deyil; bu, hesab axtarışı uğursuzluğu deyil.
- `401` və ya `403` bir təxəllüs marşrutundan məhdudlaşdırılmış verilənlər məkanını və ya kifayət qədər dəqiq həll icazəsinin olmadığını göstərir. Geri çəkilmə kimi geniş prefiks axtarışından istifadə etməyin.
- Oxunaqlı `name@domain.dataspace` dəyər hər yerdə tək bir protokol-standart I105 ID tələb olunduğu halda qəbul edilmir. Əvvəlcə onu həll edin.
- Əgər yerli hesabın qeydiyyatı uğurlu olarsa, amma Taira onu rədd edirsə, fərq səlahiyyətlə bağlıdır. `CanRegisterAccount`-u əldə edin; yoxlamanı keçmək üçün hesab ID-sini dəyişdirməyin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [sabitləşdirilmiş mənbə kodu reviziyasında tək protokol-standart hesab ünvanının tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_data_model/src/account/address.rs)
- [Hesab və təxəllüs Torii bərkidilmiş mənbə kodu versiyasında testlər](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Hesablar](/az/blockchain/accounts.md)
- [Məlumat-modeli təxəllüsləri](/az/blockchain/data-model.md#aliases)
- [Adlandırma qaydaları](/az/reference/naming.md)
- [İcazə tokenləri](/az/reference/permissions.md)
