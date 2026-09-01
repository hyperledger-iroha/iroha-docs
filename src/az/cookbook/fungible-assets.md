---
translation_locale: az
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Mübadilə Olunan Aktivlər {#fungible-assets}

## Nəticə {#outcome}

Canlı Taira aktivlərin təyinatlarını yoxlayın və yaradılmış yerli şəbəkədə qeydiyyat, buraxılış, köçürmə, məhvetmə və balans-yoxlama prosesini tamamlayın. Resept tək protokol-standart prefiksiz Base58 aktiv-tərif ID-lərini, domen-uyğunlaşdırılmış ləqəbləri, domen-siz I105 hesab ID-lərini və açıq ödəniş haqqını istifadə edir.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `curl`, `jq`, Python 3.11 və ya daha sonra, Node.js 24 və cari `iroha` CLI.
- Yalnız oxumaq Taira icazəsi.
- Yazma icmalı üçün, `http://127.0.0.1:8080`-də [Başlat Iroha](/az/get-started/launch-iroha.md)-dən yaradılmış lokal şəbəkə, `./localnet/client.toml` və Torii ilə.

## Addımlar {#steps}

### 1. Kriptoqrafik imzalayıcı olmadan Taira təyinatlarını yoxlayın {#_1-inspect-taira-definitions-without-a-signer}

Aktivlərin tərifləri şəffaf olmayan Base58 ID, göstərilən ad, aktivin buraxılış siyasəti, ədədi ölçü, seçimli ləqəb, sahibi və ümumi miqdarı əhatə edir. Konkrekt balans həmçinin onun sahib hesabını və seçimli məlumat sahəsi çərçivəsini də əhatə edir.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

JavaScript formasını `node taira-assets.mjs` ilə işlədin. İctimai aktiv ID-ləri sadə Base58 dəyərləridir; `cookbook_credit#wonderland.universal` kimi oxunaqlı bir dəyər həmin ID-lərdən birinə həll olunan aliasdır.

### 2. Yerli səlahiyyət prinsipi və təyinatı hazırlayın {#_2-prepare-the-local-authority-and-destination}

Yaradılmış konfiqurasiyadakı açıq açardan yerli səlahiyyət prinsipini çıxarın və alıcı olaraq başqa qeydiyyatdan keçmiş hesabı seçin. Heç bir xüsusi açar çap olunmur.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Rəqəmsal tərifi qeydiyyatdan keçirin {#_3-register-a-numeric-definition}

Bu yalnız yerli ID prefiksiz Base58 aktiv-təsviri ünvanıdır. Ləqəb insan oxunaqlı `domain.dataspace` proyeksiyanı təmin edir. Ölçü `2` iki kəsirli rəqəmə icazə verir; `--mint-once`-nin atılması standart `Infinitely` siyasətini saxlayır.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

O ID-ni Taira üzərində təkrar istifadə etməyin. İctimai blokçeyn şəbəkəsində qeydiyyat üçün yeni, tək protokol-standartına uyğun ID, tətbiqinizə ayrılmış domen/alias, ödəniş və proqram təminatı işləmə mühitinin aktivlər üzrə qeydiyyat icazəsi tələb olunur.

### 4. vermək, köçürmək və məhv etmək {#_4-mint-transfer-and-burn}

Bütün yazma əmrləri icazə verən şəxsi ödəniş edən şəxs kimi açıq şəkildə seçir. CLI imzalamadan əvvəl dəqiq əməliyyatı göstərir və standart olaraq gözləyir.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

Yıxıldıqdan sonra, mənbə balansını `64.50`, təyinat balansını `25.50` və ümumi miqdarı `90.00` gözləyin.

::: warning İcazə sərhədi

On Taira, krandan əldə olunan `taira.tx-metadata.json`-u birləşdirin və hər yazı üçün `--fee-payer authority`-dən istifadə edin. Qeydiyyat və buraxılma üçün aktiv təsdiqləyicinin icazələri tələb olunur; köçürmə və məhv etmə mənbə balansı üzərində səlahiyyət prinsipi tələb edir. Testnet ilə maliyyələşdirilən hesab avtomatik olaraq buraxıcı hesab edilmir.

:::

## Yoxla {#verify}

Həm konkret balansları, həm də tərifi oxuyun. Bu post-dövlət sorğuları uğur meyarıdır; sadəcə bir təqdimat protokolu nəticə qeydiyyatı deyil.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Tətbiq təsdiqləmələri ədədi dəyərləri ikilik üzən nöqtə dəyərləri deyil, sabit nöqtə onluq kimi müqayisə etməli və hesabla yanaşı tərif ID-sini də yoxlamalıdır.

## Problemlərin aradan qaldırılması {#troubleshooting}

- İD `#` ehtiva edirsə, bu, tək bir protokol-standart aktiv-təyin İD-si deyil, bir ləqəb və ya konkret balans literalıdır. `--definition` ilə sadə Base58 dəyərindən istifadə edin, və ya `--definition-alias` ilə bağlı bir ləqəb ötürün.
- `Scale` xətaları, miqdarın tərifin icazə verdiyindən daha çox onluq rəqəm ehtiva etdiyini göstərir.
- `Mintability` rədd edilməsi o deməkdir ki, `Once`, `Not` və ya `Limited(n)` siyasəti bitib və ya verilməsinə icazə verilməyib. Tarixi yenidən yazmayın; definisiya sorğusu tərəfindən qaytarılan siyasətdən istifadə edin.
- Addım 2 məqsədli şəkildə qeydiyyatdan keçmiş təyinat hesabını seçir. Əgər aktivin qəbulu `ExplicitOnly` isə, təyinat balansını səlahiyyətli şəxs vasitəsilə təmin edin köçürməzdən əvvəl axın. Oxşar adı olan CLI qoruyucu hesab və ya balansı qeydiyyatdan keçirmir; başqa bir əmri əlavə etmək əvəzinə dayandırır.
- Ödəniş rədd edilməsi, normal təlimatın müvəffəqiyyətindən əvvəl baş verir. Ödənişi edən şəxsi seçin, şəbəkənin ödəniş aktivinin metadatasından istifadə edin və balansını yoxlayın.
- Əgər sabit yerli tərif əvvəlki bir işdən mövcuddursa, yeni yaradılmış localnet-i işə salın və ya onun mövcud vəziyyəti ilə davam edin. Base58 ID üçün heç vaxt düzgün olmayan təsadüfi sətiri əvəz etməyin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabit mənbə kodu reviziyasında aktiv həyat dövrü inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust pinlənmiş mənbə kodu reviziyasında aktivin tikinti nümunələri](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Aktivlər](/az/blockchain/assets.md)
- [Təlimatlar](/az/blockchain/instructions.md)
- [İcazə tokenləri](/az/reference/permissions.md)
- [JavaScript və TypeScript](/az/guide/tutorials/javascript.md)
