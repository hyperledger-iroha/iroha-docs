---
translation_locale: az
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Domenlər {#domains}

Domenlər `World` daxilində qeydiyyatdan keçmiş adlandırılmış ad məkanlarıdır. Hazırkı Iroha 3 məlumat modelində domen öz ana məlumat məkanı ilə tam müəyyənləşdirilir, buna görə kanonik identifikator belədir:

```text
domain.dataspace
```

Məsələn, `payments.universal` adı `universal` məlumat məkanındakı `payments` domenini bildirir.

## Struktur {#structure}

Qeydiyyatdan keçmiş `Domain` aşağıdakıları ehtiva edir:

- `id`: məlumat məkanı ilə tam müəyyənləşdirilmiş `DomainId`
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

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

Niyyət `payments.universal` domenini, onun ədədi məlumat məkanı identifikatorunu, kanonik I105 sahibini, icarənin əldə olunma müddətini və cari siyasət/ödəniş təklifinin yoxlama şərtini müəyyən edir. Planlayıcının son nöqtəsi `POST /v1/aliases/setup/plan`-dır; qaytardığı plan zəncirə, səlahiyyət sahibinə, vəziyyətə və son tarixə bağlıdır. Domeni silmək üçün hələ də [`Unregister`](/az/blockchain/instructions.md#un-register) istifadə olunur.

Bir domen yaratmaq və ya silmək üçün uyğun domen idarəetmə icazəsi tələb olunur aktiv proqram təminatının icra mühiti yoxlayıcısı. Domen metadata məlumatları ilə yenilənə bilər [`SetKeyValue` və `RemoveKeyValue`](/az/blockchain/instructions.md#setkeyvalue-removekeyvalue) icazə verən əsasın həmin domeni dəyişdirmək icazəsi olduğu zaman.

## Bu iş axınını Taira üzərində işə sal {#try-it-on-taira}

İctimai Taira testnet-də hazırda görünən domenləri siyahıya alın:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Açıq zolaq kataloqunu məlumat məkanı ləqəbləri ilə uyğunlaşdırın:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Tətbiq domenin mövcudluğunu yoxlamalıdırsa, birinci əmrdən istifadə edin. Məlumat məkanı ilə əlaqəli zolaqları, o cümlədən hər zolağın açıq və ya məhdud görünməsini və əsas zolağa nəzərən sinxronizasiya vəziyyətini araşdırmaq üçün zolaq kataloqundan istifadə edin.

Domenin qurulması haqq tələb edən yazma əməliyyatıdır. Taira üzərində sınamazdan əvvəl [Taira üzərində testnet XOR əldə etmək](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) bölməsindəki əvvəlcədən hazırlanan vəsait alma axını ilə imzalayan hesabı maliyyələşdirin, sonra planı açıq şəkildə göstərilmiş haqq ödəyicisi ilə tətbiq edin. CLI imzalamadan əvvəl dəqiq haqqı hesablayıb göstərir:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
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
