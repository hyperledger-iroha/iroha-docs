---
translation_locale: az
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Aktivlər {#assets}

Bir Iroha aktiv hesab tərəfindən saxlanılan rəqəmsal balansdır. Hər bir konkret balans `AssetDefinition`-a işarə edir və tərif bu aktivin necə adlana, buraxıla, göstərilə və bölünə biləcəyini izah edir.

## Aktivin Tərifi {#asset-definition}

Bir `AssetDefinition` aşağıdakılardan ibarətdir:

- `id`: tək protokol-standart aktiv təyinat ünvanı
- `name`: insan tərəfindən oxuna bilən göstərilən ad
- `description`: isteğe bağlı insan tərəfindən oxuna bilən təsvir
- `alias`: `<name>#<domain>.<dataspace>` və ya `<name>#<dataspace>` formasında istəyə bağlı təxəllüs
- `spec`: balanslar üçün rəqəmsal dəqiqlik və məhdudiyyətlər
- `mintable`: aktivlərin buraxılış siyasəti siyasəti
- `logo`: isteğe bağlı `SoraFS` URI
- `metadata`: ixtiyari açar-dəyər metadatası
- `balance_scope_policy`: balansların qlobal yoxsa məlumat sahəsi ilə məhdudlaşdırılıb-məhdudlaşdırılmadığı
- `owned_by`: təyinatı qeydiyyatdan keçirən və ya ona sahib olan hesab
- `total_quantity`: ümumi buraxılmış miqdar
- `confidential_policy`: qorunan aktiv əməliyyatları üçün siyasət

Aktiv tərifi identifikatorları tək protokol-standart opak ünvanlardır. Bir tərif bir domen və ad əsasında qurulduqda, Iroha həmin domen/ad proyeksiyasını UX və sorğular üçün saxlaya bilər, lakin tək protokol-standart mətn forması yaradılmış ünvandır.

## Aktiv Balansı {#asset-balance}

Bir `Asset` aşağıdakılardan ibarətdir:

- `id`: bir `AssetId`, hansı ki, aktivin tərifini, sahibinin hesabını və əlavə aktiv balansı sahəsini birləşdirir
- `value`: bir `Numeric` balans

Hesab sahibi tək protokol-standartlı və domeni olmayan şəxsdir. Aktiv tərifi, məsələn `payments.universal` kimi dataspace-səlahiyyətli bir domen altında layihələndirilə bilər.

## Aktivlərin buraxılması siyasəti {#mintability}

Aktiv tərifləri bu aktiv buraxılışı siyasət rejimlərini dəstəkləyir:

|Rejim|Mənası|
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` |Elastik təklif. Aktiv təkrar-təkrar buraxıla və məhv edilə bilər.|
| `Once`       |Sabit tədarüklü token. O, bir dəfə buraxıla bilər və sonra məhv edilə bilər.|
| `Not`        |Sabit təchizatlı token, yox edilə bilər, amma yenidən buraxıla bilməz.|
| `Limited(n)` |Siyasət yeni aktiv vahidlərinin məhdud sayı əlavə əməliyyatlarda buraxılmasına imkan verir.|

Normal elastik aktivlər üçün `Infinitely` istifadə edin və sabit təchizatlı və ya məhdud təchizatlı aktivlər üçün `Once` və ya `Limited(n)` istifadə edin. Aktiv təchizatı artıq müəyyən olunmayıbsa, ilkin siyasət kimi `Not`-dən istifadə etməyin.

## Aktiv balansının sahəsi {#balance-scope}

`balance_scope_policy` balansların necə bölünməsini idarə edir:

- `Global`: hər hesab və aktiv tərifi üçün bir balans bölməsi
- `DataspaceRestricted`: balanslar verilənlər məkanı konteksti üzrə bölünür

Məlumat sahəsi ilə məhdudlaşdırılmış balanslar, eyni aktiv təyinatı bir neçə Nexus məlumat sahəsində istifadə olunduqda faydalıdır, lakin balanslar izolyasiya edilmiş qalmalıdır.

## Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

Bu yalnız oxumaq üçün API sorğular ictimai Taira testnetində real aktiv təriflərini göstərir:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Cari Taira XOR haqqı aktiv tərifini tapın:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Metaməlumat daşıyan tərifləri axtarın:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Üç nümunənin hamısı oxumalardır. Taira-də aktivləri vermək, məhv etmək və ya köçürmək üçün testnet-ə maliyyələşdirilmiş hesabdan və [SORA Nexus Məlumat Məkanlarına qoşul](/az/get-started/sora-nexus-dataspaces.md)-dakı qorunan axından istifadə edin.

Ödənişli Taira aktiv nümunəsi üçün testnet maliyyələşdirmə köməkçisini [Taira üzərində Testnet XOR əldə edin](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) bölməsindən `taira_faucet_claim.py` adı ilə saxlayın. Əvvəlcə testnet maliyyələşdirmə xidmətindən aktivi alın, sonra onu əməliyyatın gas aktivi kimi istifadə edin:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Sonra `ledger asset mint`, `ledger asset burn` və `ledger asset transfer` əmrlərində `--metadata ./taira.tx-metadata.json`-ı daxil edin.

## Təlimatlar {#instructions}

Aktivlər Iroha Təlimat əməliyyatları ilə qeydiyyatdan keçirilə, buraxıla, məhv edilə və köçürülə bilər:

- [`Register` və `Unregister`](/az/blockchain/instructions.md#un-register)
- [`Mint` və `Burn`](/az/blockchain/instructions.md#mint-burn)
- [`Transfer`](/az/blockchain/instructions.md#transfer)
- [`SetKeyValue` və `RemoveKeyValue`](/az/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Bax həmçinin:

- [CLI bələdçi](/az/get-started/operate-iroha-via-cli.md)
- [Rust dərsliyi](/az/guide/tutorials/rust.md)
- [Python dərsliyi](/az/guide/tutorials/python.md)
- [JavaScript/TypeScript dərsliyi](/az/guide/tutorials/javascript.md)
- [Məlumat modeli](/az/blockchain/data-model.md)
- [NFTs](/az/blockchain/nfts.md)
