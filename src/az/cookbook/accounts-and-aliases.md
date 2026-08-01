---
translation_locale: az
translation_source: /cookbook/accounts-and-aliases.md
translation_source_hash: 23b3ddbdadb0d177b2b12de60e0947a94ecdb20fa6ee1b3a2c6b83e5c91ba2f3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Hesablar və ali-saytlar {#accounts-and-aliases}

## Nəticə {#outcome}

Domainless Canonical ilə təhlükəsiz işləyin I105 hesab IDs və ayrı-ayrı bağlanmış insan tərəfindən oxuna bilən adlar, məsələn `treasury@payments.universal`. Sən yoxlayacaqsan. Taira hesablar, öz kanonik mənşəli ID, yollanma kontekstini şəxsiyyətlə qarışdırmadan aliasları həll etmək.

## Əvvəlki şərtlər {#prerequisites}

- `curl`, `jq`, Python 3.11 və ya daha sonrakı dövrlər və axın `iroha` CLI.
- A `taira.client.toml` üçün [Bağlantı Taira](./connect-to-taira.md) Öz hesabınızı yoxlayarkən.
- Taira kranı və ya şəbəkənin idarə olunan yüklənmə yolu vasitəsilə hesabın xüsusi oxunmasının uğur qazanacağını gözləmədən təmin edilmiş hesab.

## Dərslər {#steps}

### 1. Taira üzrə kanonik hesabları yoxlayın. {#_1-inspect-canonical-accounts-on-taira}

İctimai hesablar siyahısında hər zaman kanonik I105 IDs qaytarılır. Birincil əlifba seçimdir və ayrı-ayrı bildirilir.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

ID `.id` hesab sahələri üçün etibarlıdır. Ona bir domen əlavə etməyin. `.primary_alias` əlifbası istifadəçiyə yönəlmiş axtarış açarıdır, başqa bir kanonik kimlik deyil.

### 2. Taira I105 ID -ni təyin edin və normallaşdırın. {#_2-derive-and-normalize-your-taira-i105-id}

Yalnız ictimai açarı yerli konfigüratsiyadan oxuyun. Eyni ictimai anahtar müxtəlif ictimai şəbəkə profilləri üçün fərqli şəkildə kodlanır, buna görə `taira` seçin.

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

Normallaşdırılmış qiymət `TAIRA_ACCOUNT_ID` ilə eynidir. TOML faylında olan `[account].domain` parametrləri `wonderland.universal` ola bilər, lakin bu dəyər yalnız marşrutlama və alias kontekstinə təsir edir.

### 3. Hesabı və aktivlərini oxuyun. {#_3-read-the-account-and-its-assets}

Hesabın təmin edilməsindən sonra, birbaşa sual verin və sərhədləndirilmiş aktiv səhifəsini siyahıya alın. URL - yolu istifadə etməzdən əvvəl I105 dəyərini kodlayın.

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

### 4. Hesabla əlaqəli adları axtarın. {#_4-look-up-aliases-bound-to-the-account}

Əksinə həllçi bir dəqiq kanonik hesabı qəbul edir ID. İctimai məlumat sahəsi sətirləri müraciət imza başlıqları olmadan oxuna bilər; məhdud məlumat sahələri icazəli imzalanmış tələb tələb edir.

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

`total: 0` etibarlıdır: bir hesabın aliyi lazım deyil. Bir bağlayıcı varsa, tam təsdiqlənmiş aliyini həll edin və qaytarılmış hesabı ID müqayisə edin:

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

::: warning Rəsmi sərhəd

Taira kranı iddiaçının hesabını təmin edə bilər, lakin bu ümumi hesab qeydiyyatına və ya alias idarəetmə səlahiyyətinə malik deyil. Başqa bir hesabın qeydiyyata alınması üçün aktiv təsdiqçi altında `CanRegisterAccount` tələb olunur. Hesab aliases ümumiyyətlə aktiv SNS icarə müqaviləsi və uyğun alias icazələri tələb edir. idarə edilən onboarding / alias planer istifadə edin, ya da istehsal olunan yerli şəbəkəyə qarşı qeydiyyat təcrübəsi.

:::

Yerli şəbəkədə, təhlükəsiz imzalanma təchizatı mərhələsi yeni kanonik `NEW_ACCOUNT_ID` ixrac etdikdən sonra qeydiyyat səthinin:

```bash
iroha --config ./localnet/client.toml \
  --machine \
  --fee-payer authority \
  ledger account register --id "$NEW_ACCOUNT_ID"

iroha --config ./localnet/client.toml ledger account get \
  --id "$NEW_ACCOUNT_ID"
```

Müvafiq xüsusi açarı sənəd və ya tətbiq anbarının xaricində istehsal etmək və saxlamaq. ID nəzarətçi açarı atılmış olan istifadəsi mümkün olmayan hesab yaratır.

## Tətbiq edin {#verify}

Konfigurasiya ictimai açarının, I105 kodlaşdırmanın və bağlayan aliasların hamısı bir kanonik hesabda ID birləşdiyini sübut edin:

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

Kanonik hesabı saxlayın IDs. İmzalar, icazələr və əməliyyat təlimatları üçün kanonik IDs istifadə edin. Tətbiq sərhədində bir alias həll edin. Əməliyyat üçün istifadə olunan kanonik hesabı ID saxlayın.

## Problemlərin həlli {#troubleshooting}

- Parse və ya prefix səhvləri ümumiyyətlə bir ünvanın fərqli bir şəbəkə profili üçün kodlaşdırıldığını göstərir. `--profile taira` ilə normallaşdırın və uyğunsuzluqları rədd edin.
- Hesab `404` bir faucet `202` sonra yayılma gecikməsi ola bilər. hesabı və ya maliyyələşdirilmiş aktiv göndərmədən əvvəl sorğu.
- `total: 0` reverse resolver-dən görünən bir alias bağlanmamışdır; hesab axtarışında səhv yoxdur.
- `401` və ya `403` bir alias marşrutdan məhdud məlumat sahəsi və ya kifayət qədər dəqiq həll icazəsi göstərir. Yuxarı prefiks axtarışını geri çəkilmək üçün istifadə etməyin.
- Oxuna bilən `name@domain.dataspace` dəyəri hər yerdə qəbul edilmir. Kanonik I105 ID tələb olunur.
- Əgər yerli hesabın qeydiyyatı uğurlu olsa, lakin Taira İzin verilməsini rədd edərsə, fərq icazədir. `CanRegisterAccount`; Hesabı dəyişdirməyin ID təsdiqlənmədən kənarda qalmaq.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Qeydiyyatlı komitdə Canonical hesab ünvanının tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_data_model/src/account/address.rs)
- [Hesab və alias testləri Torii sabitləşdirilmiş komitdə ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_torii/tests/accounts_endpoints.rs)
- [Hesablar](/az/blockchain/accounts.md)
- [Məlumat modelləri aliases](/az/blockchain/data-model.md#aliases)
- [Adlandırma konvensiyaları](/az/reference/naming.md)
- [Rəsmi nişanlar ](/az/reference/permissions.md)
