---
translation_locale: az
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 6b50c995afaf9f46df6fdaab31add40b106cfa12fdaa31dabbb74448486f87f9
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Fungible Assets {#fungible-assets}

## Nəticə {#outcome}

Canlı Taira aktiv tərifləri yoxlayın və yaradılmış yerli şəbəkədə bir qeydiyyat, mint, köçürmə, yandırma və balans yoxlama axını tamamlayın. resept kanonik prefixed Base58 asset-definition IDs, domain-qualified aliases, domainless I105 hesabı IDs və açıq ödəniş haqqını istifadə edir.

## Əvvəlki şərtlər {#prerequisites}

- `curl`, `jq`, Python 3.11 və ya daha sonra, Node.js 24 və indiki `iroha` CLI.
- Yalnız oxumaq üçün Taira giriş.
- Yazı keçid üçün, bir yerli şəbəkə [Çıxış Iroha](/az/get-started/launch-iroha.md), ilə `./localnet/client.toml` və Torii ilə `http://127.0.0.1:8080`.

## Dərslər {#steps}

### 1. Taira təriflərini imzalayan olmadan yoxlayın. {#_1-inspect-taira-definitions-without-a-signer}

Mülkiyyət tərifləri qeyri-aşkar Base58 ID, ekran adı, mintabilitə siyasəti, nömrəli miqyas, seçmə aliasları, sahibi və ümumi miqdarı daşıyır. Konkret balans həmçinin sahib hesabını və seçməli məlumat məkanının əhatə dairəsini ehtiva edir.

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

JavaScript formasını `node taira-assets.mjs` ilə icra edin. Dövlət aktivləri IDs boş Base58 dəyərlərdir; `cookbook_credit#wonderland.universal` kimi oxuna bilən bir qiymət, bu qiymətlərdən birinə həlledici bir aliasdır IDs.

### 2. Yerli hakimiyyəti və məkanı hazırlayın. {#_2-prepare-the-local-authority-and-destination}

Yaradılan konfiqurasiyadakı ictimai açıdan yerli orqanı çıxarın və alıcı olaraq başqa bir qeydiyyatdan keçmiş hesab seçin.

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

### 3. Rəqəmsal tərifni qeyd edin {#_3-register-a-numeric-definition}

Bu yalnız yerli olan ID etibarlı bir prefixsiz Base58 aktiv tərif ünvanıdır. Əksi adı insan oxuya bilən `domain.dataspace` proyeksiyasını təmin edir. Skala `2` iki hissə rəqəminə icazə verir; `--mint-once` buraxmaq standart `Infinitely` siyasətini saxlayır.

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

Bunu yenidən istifadə etməyin. ID ilə Taira. İctimai şəbəkə qeydiyyatı yeni kanonik tələb edir ID, Başvurunuza verilən domen/alias, ödəniş maliyyələşdirilməsi və icra müddətinin aktiv qeydiyyatına icazəsi.

### 4. Mint, köçürmə və yandırma {#_4-mint-transfer-and-burn}

Bütün yazma əmrləri ödəniş haqqı ödənən orqanı açıq şəkildə seçir. CLI imzalanmadan əvvəl dəqiq əməliyyatı qeyd edir və default olaraq gözləyir.

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

Yandırıldıqdan sonra mənbə balansını `64.50`, məqsədyönlü balansı `25.50` və ümumi miqdarını `90.00` gözləyin.

::: warning Rəsmi sərhəd

Taira-də faucetdən alınan `taira.tx-metadata.json` əlavəsini əlavə edin və hər yazıda `--fee-payer authority` istifadə edin. qeydiyyatdan keçmək üçün aktiv təsdiqçinin icazəsi lazımdır; köçürmə və yandırmaq mənbə balansı üzərində səlahiyyət tələb edir. Faucet maliyyələşdirilmiş hesab avtomatik olaraq emitent deyil.

:::

## Tətbiq edin {#verify}

Həm konkret balansları, həm də tərifləri oxuyun. Bu dövlətdən sonrakı sorğular uğur meyarıdır; təqdimat qəbulu özü deyil.

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

Tətbiq iddiaları sayı dəyərlərini sabit nöqtə onluqları kimi müqayisə etməlidir, ikili yüngül nöqtə dəyərləri deyil və tərif ID və hesabı yoxlamalıdır.

## Problemlərin həlli {#troubleshooting}

- Bir ID içərisində `#` əsl bir alias və ya konkret balansdır, kanonik bir aktiv tərifi deyil ID. Base58 qiymətindən istifadə edin `--definition`, və ya bağlanmış bir alias keçmək `--definition-alias`.
- `Scale` səhvləri deməkdir ki, bir miqdarın müəyyənləşdirilmədən daha çox hissə rəqəmi var.
- `Mintability` rədd etmək `Once`, `Not` və ya `Limited(n)` siyasətinin məhdudlaşdırılması və ya qadağan edilməsi deməkdir. Tarixi yenidən yazmayın; tərif sorğusu ilə qaytarılan siyasətdən istifadə edin.
- 2-ci mərhələdə məqsədyönlü olaraq qeydiyyata alınmış hədəf hesabı seçilir. `ExplicitOnly`, Transferdən əvvəl icazə verilən bir axın vasitəsilə təyinat balansını təmin edir. CLI mühafizəçi hesabı və ya balansı qeyd etmir; başqa bir təlimat əlavə etmək əvəzinə abort edir.
- Ödənişlərin normal uğurundan əvvəl ödənişin rədd edilməsi baş verir. ödəyicini seçin, şəbəkənin ödəniş aktivinin meta məlumatlarından istifadə edin və balansını yoxlayın.
- Əgər sabit yerli təyinat əvvəlki bir işdən artıq mövcuddursa, yeni istehsal olunan lokal şəbəkə yaratmaq və ya mövcud olan şəbəkəni davam etdirmək Heç vaxt Base58 üçün səhv bir təsadüfi xətti əvəz etməyin. ID.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Əsasnamənin həyat dövrü inteqrasiya sınaqları bağlanmış komitdə ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/asset.rs)
- [Rust bağlanmış öhdəlikdəki aktivlərin quruluşunun nümunələri](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/examples/tutorial.rs)
- [Əmlaklar](/az/blockchain/assets.md)
- [Təlimatlar](/az/blockchain/instructions.md)
- [Rəsmi nişanlar ](/az/reference/permissions.md)
- [JavaScript və TypeScript ](/az/guide/tutorials/javascript.md)
