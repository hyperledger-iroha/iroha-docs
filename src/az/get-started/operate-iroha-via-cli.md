---
translation_locale: az
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 40714a6cd124d4b0342b0f6ecf321f286e714c0e236afd6fd7834c0cf0ad1165
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# CLI vasitəsilə Iroha 3-i işlədin {#operate-iroha-3-via-cli}

`iroha` icra faylı Iroha 3 üçün əmr sətri müştərisidir. Ondan reyestr vəziyyətini sorğulamaq, əməliyyat göndərmək və operator son nöqtələrini yoxlamaq üçün istifadə edin.

## 1. Tələblər {#_1-prerequisites}

Sənədləşdirilmiş mənbə reviziyasındakı Iroha nüsxəsindən dörd həmyaşıd qovşaqlı yerli şəbəkə yaradın və başladın:

```bash
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
./localnet/start.sh
```

Aşağıdakı nümunələr onun yaratdığı müştəri konfiqurasiyasından, `./localnet/client.toml` faylından istifadə edir.

## 2. Əsas CLI Quraşdırma {#_2-basic-cli-setup}

Yuxarı səviyyə köməyini göstərin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI bu əsas əməliyyat qruplarına bölünüb:

- hesab oxumaları və dəyişiklikləri üçün `account`
- ortaq filtrlər və səhifələmə ilə blok tədqiqatçısı axınları üçün `explorer`
- əməliyyat vəziyyəti və əməliyyat köməkçiləri üçün `tx`
- `ledger` blokçeyn ledgeri üçün oxuma və yazmalar
- tətik oxumaları, yazmaları və icrası üçün `trigger`
- `ops` operator diaqnostikası üçün
- `app` tətbiqi üçün API köməkçilər
- müqavilə çağırışları, görünüşləri və yerli xəta ayıqlaması üçün `contract`; yerləşdirmək üçün `kagami contract deploy` və ya `musubi deploy` istifadə edin
- `tools` diaqnostika və inkişaf etdirici vasitələr üçün
- məlumat məkanı tərifini planlaşdırmaq, tətbiq etmək və yoxlamaq üçün `dataspace`
- Taira diaqnostikası və hesabın ilkin hazırlanması üçün `taira`
- oflayn kodlayıcılar, hesabatlar və diaqnostika üçün `offline`
- Soracloud tətbiq platforması köməkçiləri üçün `soracloud`
- SORA Cross-Chain Protocol oxumaları, köçürmələri və sübutları üçün `sccp`

Əməliyyat göndərən hər əmr `--fee-payer authority` kimi açıq göstərilmiş haqq ödəyicisi tələb edir; CLI imzalamadan əvvəl dəqiq haqqı hesablayıb göstərir.

`--output-format text` insan oxuya bilən operator çıxışı üçün, `--machine` isə sərt avtomatlaşdırma rejimi üçün istifadə edin.

## 3. İctimai Taira Testnet-i sınayın {#_3-try-the-public-taira-testnet}

Yerel şəbəkə iştirakçısını işə salmadan və ya kriptoqrafik imzalayıcı yaratmadan əvvəl yalnız oxumaq üçün Taira yoxlamalarını sınaya bilərsiniz. Bu əmrlər ictimai Torii JSON yollarından istifadə edir və testnet XOR xərcləmir.

Taira statusunu yoxlayın:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Autentifikasiya olunmamış oxucuya görünən domenləri sadalayın:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Bir neçə aktivin tərifini və onların mövcud təklifini siyahıya alın:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Əgər sizin cari `iroha` ikili faylınız varsa, Taira diaqnostika köməkçisini işə salın:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Yalnız imzalanmış əmrləri sınamağa hazır olduqda `taira.client.toml` yaradın. Konfiqurasiya, test vəsaiti paylama və ilkin işləkliyə dair sınaq axını üçün [SORA Nexus məlumat məkanlarına qoşulma](/az/get-started/sora-nexus-dataspaces.md) bölməsinə baxın. Hesab vəsait paylama xidmətinin haqq aktivi ilə maliyyələşdirilənədək Taira üzərində yazma əmrləri işlətməyin.

Haqq tələb edən istənilən Taira CLI nümunəsi üçün [Taira üzərində testnet XOR əldə etmək](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) bölməsindəki əvvəlcədən hazırlanan vəsait alma axını ilə imzalayan hesabı maliyyələşdirin, sonra balansı yoxlayın:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Vəsait paylama marşrutu `502` qaytararsa, gözləyin və yenidən cəhd edin. Bu, açıq testnetin əlçatanlıq problemidir, hesab açarlarını yenidən yaratmaq üçün işarə deyil.

Balans göründükdən sonra yazmaları `--fee-payer authority` ilə göndərin. CLI imzalamadan əvvəl dəqiq haqqı Taira-nın haqq aktivində hesablayıb göstərir:

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Əsas blokçeyn dəftər əmrləri {#_4-basic-ledger-commands}

Bütün domenləri siyahıya al:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Adi domen yaradılması deklarativ alias planlayıcısından istifadə edir; `ledger domain` əmri `register` alt əmri yoxdur. `docs.universal` üçün `AliasSetupPlanRequestV1` niyyəti sirlərsiz olaraq SDK və ya onboarding xidmətiniz ilə hazırlayın, sonra onu planlayın və tətbiq edin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Niyyət məlumat məkanı ID-sini, kanonik sahib hesabını, icarə müddətini və cari qiymət təklifinin yoxlama şərtini sabitləyir. Planlayıcı canlı vəziyyəti yoxlayır və göndəriləcək dəqiq atomik `EnsureAlias` planını qaytarır. Yoxlama şərti qiymətlərini başqa şəbəkədən əl ilə köçürməyin.

Sadə bir ping əməliyyatı göndərin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Son bloku oxuyun və ya blok hadisələrinə abunə olun:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Operator Əmrləri {#_5-operator-commands}

Konsensus operatoru əmrləri icazə siyahısına daxil edilmiş icra mühiti açarı tələb edir. Onu `client.toml` daxilində saxlamayın və yalnız sahibin girişinə açıq faylı mütləq yolu ilə ötürün:

```bash
# The generated localnet writes its allow-listed operator key here.
: "${OPERATOR_KEY_FILE:=$PWD/localnet/runtime/operator-signer.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

Səlahiyyətli olmayan növbə, proqram təminatı işləmə iş axını, seçki və icra zolağı diaqnostikası:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Təsdiqlənmiş konsensus zolaqları və bu qovşağın instansiya vəziyyəti:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

Zəncirdaxili konsensus parametrləri:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. Sonra Haraya Getmək {#_6-where-to-go-next}

- [SDK dərsliklər](/az/guide/tutorials/)
- [Torii son nöqtələri](/az/reference/torii-endpoints.md)
- [Iroha ikilikləri ilə işləmək](/az/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

Mənbə kodu nüsxəsindən tam Markdown kömək görüntüsünü çıxarmaq üçün bunu işlədin:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
