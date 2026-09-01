---
translation_locale: az
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Domenlər {#domains}

Domenlər `World`-da qeydiyyatdan keçmiş adlandırılmış ad sahələridir. Hazırkı Iroha 3 məlumat modeli üzrə bir domen onun valideyn məlumat sahəsi ilə təyin olunur, buna görə tək protokol-standart identifikator belədir:

```text
domain.dataspace
```

Məsələn, `payments.universal` `universal` məlumat sahəsinin içərisindəki `payments` domenini adlandırır.

## Struktur {#structure}

Qeydiyyatdan keçmiş `Domain` aşağıdakıları ehtiva edir:

- `id`: məlumat məkanına uyğun `DomainId`
- `logo`: bir domen loqosu üçün isteğe bağlı `SoraFS` URI
- `metadata`: ixtiyari açar-dəyər metadatası
- `owned_by`: domenin sahib olduğu hesab, adətən onu qeydiyyatdan keçirən hesab

Bir domeni həyata keçirmək üçün istifadə olunan bootstrap yükü `NewDomain`-dir. O, `id`-i, isteğe bağlı `logo`-i və ilkin `metadata`-ü daşıyır. Proqramın icra mühiti `owned_by`-ü səlahiyyət prinsiplərindən doldurur. Adi müştərilər bu yükü birbaşa təqdim etmirlər.

## Qeydiyyat {#registration}

Adi domen yaradılması deklarativ ləqəb quruluşu axınından istifadə edir. Bu, SNS icarəni, sahibin imkanlarını, ödəniş qiymətinin təsdiq qoruyucusunu və domen sətrini bir atomik `EnsureAlias` əməliyyatında saxlayır. `Register::Domain` hələ də bir başlanğıc/bootstrap səthidir və `ledger domain` əmri heç bir `register` alt əmri yoxdur.

Gizli olmayan `AliasSetupPlanRequestV1` niyyəti SDK və ya onboarding xidməti ilə yaradın, sonra CLI-nin onu canlı vəziyyətə qarşı planlaşdırmasını və həmin planı təqdim etməsini təmin edin:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Niyyət müəyyən edir `payments.universal`, rəqəmsal məlumat sahəsi, tək protokol-standart I105 sahib, icarə əldə etmə müddəti və mövcud siyasət/ödəmə haqqı-qiymət təsdiqi qoruyucusu. Planlayıcı API son nöqtədir `POST /v1/aliases/setup/plan`; qaytarılan plan zəncirlə bağlıdır, əməliyyatın təsdiqi şəxsiyyət, blok zənciri dəftər vəziyyəti və son tarix. Domenin silinməsi hələ də istifadə edir [`Unregister`](/az/blockchain/instructions.md#un-register).

Bir domen yaratmaq və ya silmək üçün uyğun domen idarəetmə icazəsi tələb olunur aktiv proqram təminatının icra mühiti yoxlayıcısı. Domen metadata məlumatları ilə yenilənə bilər [`SetKeyValue` və `RemoveKeyValue`](/az/blockchain/instructions.md#setkeyvalue-removekeyvalue) icazə verən əsasın həmin domeni dəyişdirmək icazəsi olduğu zaman.

## Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

İctimai Taira testnet-də hazırda görünən domenləri siyahıya alın:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

İctimai edam zolağı kataloqunu məlumat sahəsi ləqəblərinə geri xəritələyin:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Tətbiq bir domenin mövcud olub olmadığını yoxlamalı olduğu zaman ilk əmrdən istifadə edin. Bir dataspace-in ictimai, məhdud və ya əsas icra xəttindən geridə olub olmadığını təsdiqləmək lazım olduqda icra xətti kataloqundan istifadə edin.

Domen qurulması ödənişli yazıdır. Taira-də sınamadan əvvəl, testnet maliyyələşdirmə xidmət köməkçisini [Taira üzərində Testnet XOR əldə edin](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-dən `taira_faucet_claim.py` kimi saxlayın, kriptoqrafik imzalayıcıyı ictimai testnet maliyyələşdirmə xidməti vasitəsilə maliyyələşdirin və ödəniş metadatasını əlavə edin:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Təkrarlanan testnet icra zamanı unikal domen adı üçün məqsəd qurun və Taira-ın mövcud siyasətini və ödəniş-aktiv ödəniş qiyməti yoxlama mühafizəsini istifadə edin. Localnet və ya Minamoto üçün hazırlanmış planı yenidən istifadə etməyin.

## Digər qurumlarla münasibət {#relationship-to-other-entities}

Domenlər blokçeyn dəftər obyektlərini qruplaşdırır və domenlə məhdudlaşdırılmış məlumat üçün ad sahəsi təmin edir. Aktiv tərifləri domenə uyğun identifikatorlardan istifadə edir və sorğular domenləri siyahıya ala bilər və ya domenə aid edilən obyektləri tapın. Hazırki məlumat modelində hesablar özləri domenə aid deyil, lakin hesablar domenlərə sahib ola bilər və tərifləri domenlərin altında olan aktivləri saxlaya bilər.

Bax həmçinin:

- [Dünya](/az/blockchain/world.md)
- [Aktivlər](/az/blockchain/assets.md)
- [Metaməlumat](/az/blockchain/metadata.md)
- [Adlandırma qaydaları](/az/reference/naming.md)
