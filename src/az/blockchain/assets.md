---
translation_locale: az
translation_source: /blockchain/assets.md
translation_source_hash: 58c9f7657f5714dc4bbb884933a1c947687fcf6c83e471007e6c7885f1dab214
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Varlıqlar {#assets}

Iroha aktiv bir hesabda saxlanılan rəqəmsal balansdır. Hər konkret balans `AssetDefinition` -a işarə edir və tərif həmin aktivin necə adlandırıla biləcəyini, çəkilə biləcəyini, göstəriləcəyini və bölünəcəyini təsvir edir.

## Mülkiyyətin təyinatı {#asset-definition}

`AssetDefinition` aşağıdakıları ehtiva edir:

- `id`: qanuni aktivlərin təyinatının ünvanı
- `name`: insan tərəfindən oxunula bilən bir ekran adı
- `description`: İnsana oxunması üçün seçməli təsvir
- `alias`: `<name>#<domain>.<dataspace>` və ya `<name>#<dataspace>` formasında seçmə adları:
- `spec`: balanslar üçün rəqəmsal dəqiqlik və məhdudluqlar
- `mintable`: istintaq qabiliyyəti siyasəti
- `logo`: seçim yolu ilə `SoraFS` URI
- `metadata`: key-value metadataları
- `balance_scope_policy`: balansların qlobal olub-olmaması və ya məlumat sahəsi ilə məhdudlaşdırılmış olması
- `owned_by`: tərifni qeydiyyatdan keçirən və ya sahibi olan hesab
- `total_quantity`: buraxılmış ümumi miqdar
- `confidential_policy`: mühafizə olunmuş aktiv əməliyyatları siyasəti

Əset tərifləri IDs kanonik qeyri-aşkar ünvanlardır. Bir tərif bir domen və addan qurulduqda, Iroha o domen / ad proyeksiyasını UX və suallar üçün saxlaya bilər, lakin kanoniki mətn forması istehsal olunan ünvandır.

## Mülkiyyət balansı {#asset-balance}

`Asset` aşağıdakıları ehtiva edir:

- `id`: aktivin tərifini, sahibinin hesabını və seçmə balansının məkanını birləşdirən `AssetId`;
- `value`: `Numeric` balansı

Hökumət hesabı kanonik və domensizdir. Əşya təyinatı, məsələn `payments.universal` məlumat məkanına uyğun bir domen altında proqnozlaşdırıla bilər.

## Yükləmə qabiliyyəti {#mintability}

Mülkiyyət tərifləri bu mintabilitə rejimlərini dəstəkləyir:

|Modu |Məna|
| ------------ | ----------------------------------------------------------------- |
|`Infinitely` |Elastik təchizat. Varlıq dəfələrlə silinə və yandırıla bilər. |
|`Once` |Qeydiyyatlı təchizat əlamətidir, bir dəfə çəkilə və sonra yandırıla bilər.|
|`Not` |Yandırıla bilən, lakin yenidən silinməyən sabit təchizat simvolu. |
|`Limited(n)` |Əlavə əməliyyatlar üçün məhdud sayda maddə istehsalına icazə verilir. |

Normal elastik aktivlər üçün `Infinitely` və sabit tədarük və ya məhdud tədarük aktivləri üçün `Once` və ya `Limited(n)` istifadə edin. Əməl tədarükü artıq təsdiqlənmədiyi təqdirdə `Not` ilkin siyasət kimi istifadə etməyin

## Tərəflər arasındakı balans {#balance-scope}

`balance_scope_policy` balansların necə saxlanıldığını idarə edir:

- `Global`: hesabda və aktiv təyinatına görə bir qalxan
- `DataspaceRestricted`: balanslar məlumat məkanının kontekstinə görə bölünür

Məlumat sahəsi ilə məhdudlaşdırılmış balanslar, eyni aktiv tərifi bir neçə Nexus məlumat bazasında istifadə edildikdə faydalıdır, lakin balanslar ayrı qalmalıdır.

## Taira üzərində sınayın. {#try-it-on-taira}

Bu yalnız oxunma zənglər ictimai Taira testnetdə real aktiv təriflərini göstərir:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Hazırda Taira XOR ödəniş aktivinin təyinatını tapın:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Metadata sahib olan təriflərə baxın:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Hər üç nümunə oxunur. Taira-dəki aktivləri çap etmək, yandırmaq və ya köçürmək üçün faucet maliyyələşdirilmiş hesabdan və [da qorunan axınından istifadə edin SORA Nexus Verilənlər bazasına bağlanın](/az/get-started/sora-nexus-dataspaces.md) .

Ödəniş ödəyən Taira aktiv nümunəsi üçün faucet köməkçisini [-dən saxlayın Testnet XOR-i Taira](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) -də `taira_faucet_claim.py` kimi əldə edin, sonra əvvəlcə faucet aktivini tələb edin və onu əməliyyat qazı aktiv olaraq istifadə edin:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Sonra `ledger asset mint`, `ledger asset burn` və `ledger asset transfer` əmrlərində `--metadata ./taira.tx-metadata.json` daxil edin.

## Təlimatlar {#instructions}

Əmlaklar Iroha Xüsusi Təlimatlarla qeydiyyatdan keçirilə bilər, silinə bilər, yandırılır və köçürülə bilər:

- [`Register` və `Unregister`](/az/blockchain/instructions.md#un-register)
- [`Mint` və `Burn`](/az/blockchain/instructions.md#mint-burn)
- [`Transfer`](/az/blockchain/instructions.md#transfer)
- [`SetKeyValue` və `RemoveKeyValue`](/az/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Həmçinin bax:

- [CLI rəhbərliyi](/az/get-started/operate-iroha-via-cli.md)
- [Rust təlimatı](/az/guide/tutorials/rust.md)
- [Python təlimatı](/az/guide/tutorials/python.md)
- [JavaScript/TypeScript təlimat](/az/guide/tutorials/javascript.md)
- [Məlumat modeli](/az/blockchain/data-model.md)
- [NFTs](/az/blockchain/nfts.md)
