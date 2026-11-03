---
translation_locale: az
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Mübadilə Olunan Aktivlər {#fungible-assets}

## Nəticə {#outcome}

Canlı Taira şəbəkəsindəki aktiv təriflərini yoxlayın və yaradılmış lokal şəbəkədə buraxılış, köçürmə, məhv etmə və balans yoxlaması axınını sona qədər tamamlayın. Resept kanonik, prefikssiz Base58 aktiv tərifi ID-lərindən, domensiz I105 hesab ID-lərindən və ödəniş haqqının açıq şəkildə ödənilməsindən istifadə edir.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `curl`, `jq`, Python 3.11 və ya daha yeni versiya, Node.js 24 və cari CLIs: `iroha` və `kagami`.
- Yalnız oxumaq Taira icazəsi.
- Yazma addımları üçün: [Iroha-nı işə salın](/az/get-started/launch-iroha.md) səhifəsində olduğu kimi `kagami localnet generate --peers 4 --out-dir ./localnet` ilə yaradılmış və `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` əlavə edilmiş lokal şəbəkə. O, `./localnet/client.toml` faylını və `http://127.0.0.1:8080` ünvanında Torii-ni təmin edir.

## Addımlar {#steps}

### 1. Kriptoqrafik imzalayıcı olmadan Taira təyinatlarını yoxlayın {#_1-inspect-taira-definitions-without-a-signer}

Aktiv tərifləri qeyri-şəffaf Base58 ID, göstərilən ad, buraxılış siyasəti, ədədi miqyas, istəyə bağlı alias, sahib, istəyə bağlı sahib domen və ya məlumat məkanı, balans siyasəti və ümumi miqdar daşıyır. Konkret balans həmçinin onu saxlayan hesabı və istəyə bağlı məlumat məkanı əhatəsini ehtiva edir.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
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

Yaradılmış konfiqurasiyadakı ictimai açardan lokal səlahiyyətli hesabı çıxarın, sonra yeni alıcı hesabı üçün açar cütü yaradın və onu qeydiyyatdan keçirin. Heç bir şəxsi açar çap olunmur.

```bash
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

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Müştəriyə məxsus ədədi tərifdən istifadə edin {#_3-use-a-client-owned-numeric-definition}

Genezisdən kənarda tərif imzalayanın sahib olduğu `--domain` domeni altında qeydiyyatdan keçirilir, yaradılmış lokal şəbəkənin müştərisinin isə heç bir domeni yoxdur. `--asset-definition-id` ilə yaradılmış lokal şəbəkədə bu tərif artıq mövcuddur: genezis onu məhdudiyyətsiz miqyasla qeydiyyatdan keçirib, müştərini onun sahibi edib və müştəriyə 1,000,000,000 vahid buraxıb.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Bu ID-ni Taira-da təkrar istifadə etməyin. İctimai şəbəkədə qeydiyyat üçün yeni kanonik ID, hesabınızın sahib olduğu domen (`ledger asset definition register` əmrinə `--domain` kimi ötürülür), hər bir alias üçün `CanManageAssetDefinitionAlias` icazəsinin verilməsi və ödəniş haqqının maliyyələşdirilməsi tələb olunur.

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

Yıxıldıqdan sonra, mənbə balansını `1000000064.50`, təyinat balansını `25.50` və ümumi miqdarı `1000000090.00` gözləyin.

::: warning İcazə sərhədi

Taira-da hər yazma əməliyyatı üçün `--fee-payer authority` istifadə edin; CLI imzalamadan əvvəl dəqiq haqqı Taira-nın ödəniş aktivində hesablayıb göstərir. Qeydiyyat tərifin `--domain` domeninə sahib olmağı tələb edir, alias üçün isə əlavə olaraq `CanManageAssetDefinitionAlias` lazımdır. Buraxılış tərifə sahib olmağı və ya `CanMintAssetWithDefinition` ya da `CanMintAssetToAccount` icazəsinə malik olmağı tələb edir; köçürmə və məhv etmə mənbə balansı üzərində səlahiyyət tələb edir. Testnet maliyyələşdirmə xidmətinin maliyyələşdirdiyi hesab avtomatik olaraq emitent deyil.

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
- 2-ci addım təyinat hesabını açıq şəkildə qeydiyyatdan keçirir, buna görə köçürmə hesab qəbulu rejimi `ExplicitOnly` olduqda da işləyir. Oxşar adlı CLI qoruyucusu nə hesabı, nə də balansı qeydiyyatdan keçirir; başqa təlimat əlavə etmək əvəzinə əməliyyatı dayandırır.
- Ödənişin rədd edilməsi təlimatın adi uğurlu icrasından əvvəl baş verir. Ödəyicini seçin, CLI tərəfindən verilən ödəniş qiyməti təxminində ödəniş aktivini və maksimum məbləği yoxlayın və həmin balansı təsdiqləyin.
- Eyni lokal şəbəkədə təkrar icra əvvəlki balanslardan başlayır və `kagami keys` mövcud `./cookbook-recipient` qovluğunu rədd edir. Yeni yaradılmış lokal şəbəkəni işə salın və həmin qovluğu silin, ya da mütləq dəyərlər əvəzinə balans dəyişikliklərini müqayisə edin. Base58 ID əvəzinə heç vaxt səhv formalaşdırılmış təsadüfi sətirdən istifadə etməyin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Sabit mənbə kodu reviziyasında aktiv həyat dövrü inteqrasiya testləri](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust pinlənmiş mənbə kodu reviziyasında aktivin tikinti nümunələri](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Aktivlər](/az/blockchain/assets.md)
- [Təlimatlar](/az/blockchain/instructions.md)
- [İcazə tokenləri](/az/reference/permissions.md)
- [JavaScript və TypeScript](/az/guide/tutorials/javascript.md)
