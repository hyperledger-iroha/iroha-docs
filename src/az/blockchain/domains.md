---
translation_locale: az
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Domenlər {#domains}

Domainlər ad sahələrində qeydə alınmış `World`. Hazırda Iroha 3 məlumat modeli bir domen ana məlumat məkanı ilə təsnif olunur, buna görə kanonik identifikator:

```text
domain.dataspace
```

Məsələn, `payments.universal` `payments` domeninin `universal` məlumat sahəsindəki adlarını göstərir.

## Struktura {#structure}

qeydiyyatdan keçmiş `Domain` əlamətləri aşağıdakılardır:

- `id`: məlumat məkanına uyğun olan `DomainId`
- `logo`: bir domen logosu üçün seçim yolu ilə `SoraFS` URI
- `metadata`: key-value metadataları
- `owned_by`: domenin sahibi hesabı, ümumiyyətlə onu qeydiyyatdan keçirən hesab.

Bir domenin materiallaşdırılması üçün istifadə olunan bootstrap pay yükü: `NewDomain`. O, `id`, istisna olmaqla `logo`, və ilkin `metadata`. Döyüş vaxtı doldurulur `owned_by` Ümumi müştərilər bu pay yükünü birbaşa təqdim etmirlər.

## qeydiyyat {#registration}

Adi domen yaradılması deklarativ alias setup axını istifadə edir. Bu, SNS icarəsini, sahibkarlıq imkanlarını, quote qoruyucuğunu və bir atom `EnsureAlias` əməliyyatında domen sətirini saxlayır. `Register::Domain` bir genesis / bootstrap səth olaraq qalır və `ledger domain` komandanın heç bir `register` alt komandanı yoxdur.

Sirrsiz bir yaradın `AliasSetupPlanRequestV1` məqsədi SDK və ya yükləmə xidməti, sonra CLI Bunu canlı vəziyyətlə qarşı planlaşdırın və dəqiq planı təqdim edin:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Məqsəd `payments.universal`, onun rəqəmsal məlumat sahəsi, kanonik I105 sahibini, icarə satın alma müddəti və cari siyasət / ödəniş qiymətləndirilməsi mühafizəsini müəyyənləşdirir. Planlaşdırıcı son nöqtəsi `POST /v1/aliases/setup/plan`; geri qaytarılmış planı zəncir, səlahiyyət, dövlət və vaxt məhdudiyyəti ilə bağlıdır. Domen aradan qaldırılması hələ də [`Unregister`](/az/blockchain/instructions.md#un-register) istifadə edir.

Bir domenin yaradılması və ya çıxarılması aktiv icra vaxtı təsdiqçisi altında müvafiq domen idarəetmə icazəsi tələb edir. Domen metadataları [`SetKeyValue` və `RemoveKeyValue`](/az/blockchain/instructions.md#setkeyvalue-removekeyvalue) ilə yenilənə bilər.

## Taira üzərində sınayın. {#try-it-on-taira}

Hal-hazırda ictimai Taira test şəbəkəsində görünən domenlərin siyahısını göstərin:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

İctimai zolaq kataloqunu məlumat məkanı aliaslarına qaytarın:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Bir tətbiq bir domenin mövcud olub olmadığını yoxlamaq üçün ilk əmrdən istifadə edin. Bir məlumat sahəsinin ictimai, məhdud və ya əsas zolaqdan geri qalıb-qalmadığını təsdiq etmək üçün yol kataloqundan istifadə edin.

Domain qurulması ödənişli bir yazıdır. Taira-də sınamaqdan əvvəl, faucet köməkçisini [-dən saxlayın Testnet XOR-i Taira](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-də `taira_faucet_claim.py` olaraq əldə edin, imzalananı ictimai faucet vasitəsilə maliyyələşdirin və ödəniş metadataları əlavə edin:

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

Təkrarlanan test şəbəkələrin icrasında unikal bir domen adının niyyətini qurun və istifadə edin Taira localnet üçün hazırlanmış bir planı yenidən istifadə etməyin və ya Minamoto.

## Digər subyektlərlə münasibətlər {#relationship-to-other-entities}

Domenlər obyektləri qruplaşdırır və domen ölçülü məlumatlar üçün ad məkanı təmin edir. Əmlak tərifləri domen təsnifatlı identifikatorlardan istifadə edir və sorğular domenlərin siyahısına daxil ola bilər və ya bir domena ölçülü obyektləri tapa bilər. Hesabların özləri mövcud məlumat modelində domensizdirlər, lakin hesablar domenlərə sahib ola bilər və tərifləri domenlərin altında yaşayan aktivləri saxlaya bilərlər.

Həmçinin bax:

- [Dünya](/az/blockchain/world.md)
- [Əmlaklar](/az/blockchain/assets.md)
- [Metadata](/az/blockchain/metadata.md)
- [Adlandırma qaydaları](/az/reference/naming.md)
