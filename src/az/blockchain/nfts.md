---
translation_locale: az
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT bir sahibi olan unikal bir kitab obyektidir. Bir qeydə öz şəxsiyyətinə, metadatalara, həyat dövrü hadisələrinə və mülkiyyət transfer semantikasına ehtiyacı olduğu, lakin rəqəmsal tarazlığa ehtiyac duymadığı zaman NFTs istifadə edin.

Ədəbiyyatdan fərqli olaraq. [aktiv](/az/blockchain/assets.md), bir NFT Təsadüfi, istehsal qabiliyyəti və ya hesabına miqdarı yoxdur. NFT bir qeydiyyata alınmış obyekt kimi mövcuddur və mülkiyyət həmin obyekt üzərində birbaşa izlənilir.

## Struktura {#structure}

qeydiyyatdan keçmiş `Nft` əlamətləri aşağıdakılardır:

- `id`: bir `NftId`
- `content`: NFT-ni təsvir edən meta məlumatlar
- `owned_by`: NFT hesabının sahibi olan hesab

`content` sahəsi `Metadata` xəritəsidir. Onu kompakt saxlayın: təsviri sahələri, sabit istinadları, hashləri, URIs və ya SoraFS yollarını orada saxlayın. Böyük sənədlər, media və ya yüksək sürətli tətbiqlərin vəziyyətini silsilədən kənarda saxlayın və yalnız yoxlana bilən bir istinadını NFT saxlayın.

## Taira üzərində sınayın. {#try-it-on-taira}

Hal-hazırda ictimai Taira testnetin NFT qeydləri olub olmadığını yoxlayın:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Qeydiyyatdan keçən NFT yolları üçün canlı OpenAPI sənədinə baxın:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Boş `items` sıra ictimai test şəbəkəsində etibarlı bir cavabdır. Bu o deməkdir ki, mövcud səhifədə NFTs yoxdur, bu da NFT təlimatlarının olmaması demək deyil.

## NFT IDs {#nft-ids}

`NftId` bu mətn formasını istifadə edir:

```text
name$domain
name$domain.dataspace
```

Məsələn, `badge$docs.universal` `badge` NFT `docs.universal` domenində müəyyənləşdirir. Məlumat sahəsi buraxılırsa, cari parser `universal` məlumat sahəsindən istifadə edir, belə ki, `badge$docs` `badge$docs.universal` hesabına həll olunur.

Dayanıqlı adlardan istifadə edin NFT IDs. İndiki ID Təlimatlar, sorğular, icazələr, hadisə filtrləri və tətbiq istinadları tərəfindən istifadə olunan obyekt kimliyidir.

## Həyat dövrü {#lifecycle}

NFT həyat dövrü əməliyyatlarının istifadəsi Iroha Xüsusi təlimatlar:

- [`Register`](/az/blockchain/instructions.md#un-register) ilkin `content` ilə NFT yaratır.
- [`Unregister`](/az/blockchain/instructions.md#un-register) NFT faylını çıxarır.
- [`Transfer`](/az/blockchain/instructions.md#transfer) dəyişiklikləri `owned_by`.
- [`SetKeyValue` və `RemoveKeyValue`](/az/blockchain/instructions.md#setkeyvalue-removekeyvalue) metadatalarını yeniləyin NFT.

## Yerli olaraq sınayın {#try-it-locally}

Bu nümunələr yerli şəbəkəni qurduğunuzu və [CLI təlimatından ](/az/get-started/operate-iroha-via-cli.md) istehsal edilmiş müştəri konfiqurasiyasına sahib olduğunuzu güman edirsiniz:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Yaradılan lokal şəbəkə artıq `wonderland.universal` və onun SNS icarəsini qurur. Başqa bir domen istifadə etmək üçün əvvəlcə `app alias setup plan` və `app alias setup apply` iş axını ilə yaratın [Domains](/az/blockchain/domains.md#registration).

Bir NFT qeydiyyatdan keçirin. Qeydiyyat standart girişdən ilkin məzmunu JSON oxumuşdur:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Birbaşa NFT yoxlayın və sonra bütün NFTs əlavələrini tam qeyd edin:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Metadata açarı əlavə edin və NFT nömrəsini bir daha oxuyun:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Metadata düyməsini çıxarın:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

NFT seçkin olaraq köçürülməlidir. `ledger nft get` istifadə edərək, hazırkı sahibini `owned_by`-dən oxuyun və `ledger account list all` istifadə edərək məqsədyönlü hesabı ID tapın.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

NFT nümunəsini keçiddən sonra çıxarın. Onu köçürdüyünüz təqdirdə, ya yenidən köçürün və ya mövcud sahibinin hesabı konfigüratsiyası ilə qeydiyyatdan çıxmaq əmri göndərin.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Suallar və hadisələr {#queries-and-events}

[`FindNfts`](/az/reference/queries.md#assets-nfts-and-rwas) istifadə edərək NFTs və [`FindNftsByAccountId` ](/az/reference/queries.md#assets-nfts-and-rwas) hesabın mülkiyyətində olan NFTs siyahısını göstərin.

NFT qeydiyyat, silinmə, ötürmə və metadata yeniləmələri buraxılır NFT Məlumat hadisələri. `Nft` Qeydiyyat kitabının dəyişikliklərinə və ya reaksiya verən quruluş tetikleyicilərinə abunə olunduğu zaman məlumat hadisəsi filtri NFT həyat dövrü hadisələri.

## İzinlər {#permissions}

Standart icazə səthində NFT xüsusi nömrələri var:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

İzin yoxlamaları aktiv icra vaxtı təsdiqləyici tərəfindən həyata keçirilir. şəbəkə icraçını yüksəltməklə icazəni özelleştire bilər. [İzin simvolları](/az/reference/permissions.md) hazırkı standart simvol siyahısı üçün.

## NFTs seçimi {#choosing-nfts}

Mütəxəssislik və mülkiyyət əhəmiyyətli olduğu qeydlər üçün NFT istifadə edin:

- Sertifikatlar, nişanlar, lisenziyalar və təsdiqlər
- üzvlük və ya giriş sənədləri
- Kimliklə bağlı və ya hesabın mülkiyyətində olan müraciətlərin qeydləri
- Zəncirdən kənarda olan media, sənəd və ya manifestolara istinadlar

Fungible balanslar üçün rəqəmsal aktivdən istifadə edin və məlumatlar mövcud nəşriyyat obyektinin yalnız kompakt bir xüsusiyyəti olduğu zaman sadə [ metadata](/az/blockchain/metadata.md) istifadə edin.

Həmçinin bax:

- [Əmlaklar](/az/blockchain/assets.md)
- [Metadata](/az/blockchain/metadata.md)
- [Təlimatlar](/az/blockchain/instructions.md)
- [Suallar](/az/blockchain/queries.md)
