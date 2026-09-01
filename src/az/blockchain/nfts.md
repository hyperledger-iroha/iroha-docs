---
translation_locale: az
translation_source: /blockchain/nfts.md
translation_source_hash: 6dd2d21a29f352a14cb17046c66cfa541ef501b733b95bb6874d2d3f86ec0504
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

Bir Iroha NFT tək sahibi olan unikal blockchain jurnal obyektidir. Bir qeydin öz şəxsiyyətinə, metadatasına, həyat dövrü hadisələrinə və mülkiyyət köçürmə semantikasına ehtiyacı olduqda, lakin rəqəmsal balans tələb etmədikdə NFTs-dən istifadə edin.

Rəqəmsal [aktiv](/az/blockchain/assets.md)-dan fərqli olaraq, NFT-in dəqiqliyi, aktiv buraxılışı siyasəti və ya hesab başına miqdarı yoxdur. NFT bir qeydiyyatdan keçmiş obyekt kimi mövcuddur və mülkiyyət birbaşa həmin obyekt üzərində izlənilir.

## Struktur {#structure}

Qeydiyyatdan keçmiş `Nft` aşağıdakıları ehtiva edir:

- `id`: bir `NftId`
- `content`: NFT-i təsvir edən metadata
- `owned_by`: NFT sahib olan hesab

`content` sahəsi `Metadata` xəritəsidir. Onu kompaktda saxlayın: təsviri sahələri, sabit istinadları, kriptoqrafik xəşləri, URIs və ya SoraFS yollarını ora yığın. Böyük sənədləri, media fayllarını və ya yüksək dəyişən tətbiq vəziyyətini zəncir xaricində saxlayın və yalnız NFT-də yoxlanıla bilən istinadı saxlayın.

## Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

İctimai Taira test şəbəkəsində hazırda NFT qeydlərin olub-olmadığını yoxlayın:

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

Node tərəfindən açıq olan NFT marşrutları üçün canlı OpenAPI sənədini yoxlayın:

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

Boş `items` massiv ictimai test şəbəkəsində etibarlı cavabdır. Bu, cari səhifədə heç bir NFTs olmadığını göstərir, NFT təlimatların mövcud olmadığı deyil.

## NFT Şəxsiyyət vəsiqələri {#nft-ids}

`NftId` bu mətn formasını istifadə edir:

```text
name$domain
name$domain.dataspace
```

Məsələn, `badge$docs.universal` `docs.universal` sahəsindəki `badge` NFT-ı müəyyən edir. Əgər məlumat sahəsi göstərilməzsə, mövcud analizator `universal` məlumat sahəsindən istifadə edir, buna görə `badge$docs` `badge$docs.universal`-ə çevrilir.

NFT İD-lər üçün sabit adlardan istifadə edin. İD, təlimatlar, sorğular, icazələr, hadisə filtrləri və tətbiq istinadları tərəfindən istifadə olunan obyekt kimliyidir.

## Həyat dövrü {#lifecycle}

NFT həyat dövrü əməliyyatları Iroha Təlimat əməliyyatlarından istifadə edir:

- [`Register`](/az/blockchain/instructions.md#un-register) yaradır NFT başlanğıcla `content`.
- [`Unregister`](/az/blockchain/instructions.md#un-register) çıxarır NFT.
- [`Transfer`](/az/blockchain/instructions.md#transfer) dəyişikliklər `owned_by`.
- [`SetKeyValue` və `RemoveKeyValue`](/az/blockchain/instructions.md#setkeyvalue-removekeyvalue) yeniləmək NFT metaməlumat.

## Yerli olaraq sınayın {#try-it-locally}

Bu nümunələr yerli şəbəkəni işə saldığınızı və [CLI bələdçi](/az/get-started/operate-iroha-via-cli.md)-dən yaradılmış müştəri konfiqurasiyanızı əldə etdiyinizi fərz edir:

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Yaradılan localnet artıq `wonderland.universal` və onun SNS ipotekasını qurur. Fərqli bir domen istifadə etmək üçün, əvvəlcə [Domenlər](/az/blockchain/domains.md#registration)-də təsvir edilmiş deklarativ `app alias setup plan` və `app alias setup apply` iş axını ilə onu yaradın.

Bir NFT qeydiyyatdan keçirin. Qeydiyyat standart girişdən ilkin məzmunu JSON oxuyur:

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

Birbaşa NFT-i yoxlayın və sonra bütün NFTs-ləri tam məlumatla siyahıya alın:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

Bir metadata açarı əlavə edin və NFT-i yenidən oxuyun:

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Metadatanın açarını silin:

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

İstəyə bağlı olaraq NFT-ü köçürdürün. Cari sahibi `owned_by`-dən oxumaq üçün `ledger nft get`-dən istifadə edin və təyinat hesabı ID-sini tapmaq üçün `ledger account list all`-dən istifadə edin.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

Məşqdən sonra NFT nümunəsini silin. Əgər onu köçürtmüsünüzsə, ya geri köçürün, ya da cari sahibin hesab konfiqurasiyası ilə qeydiyyatsız komandanı təqdim edin.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## Sorğular və Tədbirlər {#queries-and-events}

İstifadə et [`FindNfts`](/az/reference/queries.md#assets-nfts-and-rwas) siyahıya salmaq NFTs və [`FindNftsByAccountId`](/az/reference/queries.md#assets-nfts-and-rwas) siyahıya salmaq NFTs hesaba məxsus.

NFT qeydiyyat, silmə, köçürmə və metadata yeniləmələri NFT data hadisələri yaradır. Blokçeyn dəftər dəyişikliklərinə abunə olarkən və ya NFT həyat dövrü hadisələrinə reaksiya verən tetikleyicilər qurarkən `Nft` data hadisə filtrlərindən istifadə edin.

## İcazələr {#permissions}

Standart icazə səthi NFT-spesifik tokenləri ehtiva edir:

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

İcazə yoxlamaları aktiv proqram icra mühitinin yoxlayıcısı tərəfindən tətbiq olunur, buna görə bir şəbəkə icraçını yeniləyərək səlahiyyətləri fərdiləşdirə bilər. Mövcud standart token siyahısı üçün [İcazə Jetonları](/az/reference/permissions.md) baxın.

## NFTs-i seçmək {#choosing-nfts}

Yalnızlıq və mülkiyyət əhəmiyyətli olan qeydler üçün NFT istifadə edin:

- sertifikatlar, nişanlar, lisenziyalar və təsdiqlər
- üzvlük və ya giriş qeydləri
- şəxsiyyətə bağlı və ya hesab sahibi olan tətbiq qeydləri
- zəncirdən kənar media, sənədlər və ya texniki manifestlərə istinadlar

Fungsionallığı olan balanslar üçün rəqəmsal aktivdən istifadə edin və məlumat yalnız mövcud blokçeyn dəftər obyektinin yığcam xüsusiyyəti olduqda sadə [metaməlumat](/az/blockchain/metadata.md) istifadə edin.

Bax həmçinin:

- [Aktivlər](/az/blockchain/assets.md)
- [Metaməlumat](/az/blockchain/metadata.md)
- [Təlimatlar](/az/blockchain/instructions.md)
- [Sorğular](/az/blockchain/queries.md)
