---
translation_locale: az
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# CLI vasitəsilə Iroha 3-i işlədin {#operate-iroha-3-via-cli}

`iroha` ikili faylı Iroha 3 üçün əmr sətri müştərisidir. Blokçeyn qeydiyyat vəziyyətini sorğulamaq, əməliyyatları təqdim etmək və operator API son nöqtələrini yoxlamaq üçün istifadə edin.

## 1. Tələblər {#_1-prerequisites}

Əvvəlcə yerli şəbəkəni başladın:

- [Başlat Iroha 3](./launch-iroha.md)

Aşağıdakı nümunələr [Başlat Iroha 3](./launch-iroha.md)-da yaradılan localnet-dən əldə olunan müştəri konfiqurasiyasını nəzərdə tutur:

```bash
./localnet/client.toml
```

## 2. Əsas CLI Quraşdırma {#_2-basic-cli-setup}

Yuxarı səviyyə köməyini göstərin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI bu əsas əməliyyat qruplarına bölünüb:

- `account` hesab yönümlü qısayollar üçün
- `tx` əməliyyat səviyyəli köməkçilər üçün
- `ledger` blokçeyn ledgeri üçün oxuma və yazmalar
- `ops` operator diaqnostikası üçün
- `app` tətbiqi üçün API köməkçilər
- `contract` müqavilə yerləşdirilməsi və texniki çağırışlar üçün
- `tools` diaqnostika və inkişaf etdirici vasitələr üçün
- `taira` üçün Taira və Nexus-yönümlü iş axınları

`ledger` qrupu həmçinin `ledger transaction` kimi sahəyə xas əməliyyat köməkçilərini də ehtiva edir.

`--output-format text` insan oxuya bilən operator çıxışı üçün, `--machine` isə sərt avtomatlaşdırma rejimi üçün istifadə edin.

## 3. İctimai Taira Testnet-i sınayın {#_3-try-the-public-taira-testnet}

Yerel şəbəkə iştirakçısını işə salmadan və ya kriptoqrafik imzalayıcı yaratmadan əvvəl yalnız oxumaq üçün Taira yoxlamalarını sınaya bilərsiniz. Bu əmrlər ictimai Torii JSON yollarından istifadə edir və testnet XOR xərcləmir.

Taira statusunu yoxlayın:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` məlumat məkanında ictimai domenləri siyahıya alın:

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

Yalnız imzalı əmrləri sınaqdan keçirməyə hazır olduğunuz zaman `taira.client.toml`-i yaradın. Konfiqurasiya, testnet maliyyələşdirmə xidməti və kanarya axını üçün [SORA Nexus Məlumat Məkanlarına qoşul](/az/get-started/sora-nexus-dataspaces.md)-ə baxın. Hesab testnet maliyyələşdirmə xidməti haqqı aktivləri ilə maliyyələşdirilməyincə Taira-ə yazma əmrləri icra etməyin.

Hər hansı ödənişli Taira CLI nümunəsi üçün, [Taira üzərində Testnet XOR əldə edin](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-dən testnet maliyyələşdirmə xidməti köməkçisini `taira_faucet_claim.py` kimi yadda saxlayın, sonra testnet XOR-ü əvvəlcə tələb edin:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Əgər testnet maliyyələşdirmə xidməti problemi və ya tələb marşrutu `502` qaytarırsa, gözləyin və yenidən cəhd edin. Bu, hesab açarlarını yenidən yaratmaq üçün bir siqnal deyil, ictimai testnet mövcudluğu problemi deməkdir.

Balans görünəndən sonra, ödəniş aktivinin metadata-sını yazılara əlavə edin:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Əsas blokçeyn dəftər əmrləri {#_4-basic-ledger-commands}

Bütün domenləri siyahıya al:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Adi domen yaradılması deklarativ alias planlayıcısından istifadə edir; `ledger domain` əmri `register` alt əmri yoxdur. `docs.universal` üçün `AliasSetupPlanRequestV1` niyyəti sirlərsiz olaraq SDK və ya onboarding xidmətiniz ilə hazırlayın, sonra onu planlayın və tətbiq edin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Məqsəd məlumat sahəsi ID-sini, tək protokol-standart sahib hesabını, icarə müddətini və mövcud ödəniş-qiymət doğrulama qoruyucusunu təyin edir. Planlaşdırıcı canlı vəziyyəti yoxlayır və təqdim etmək üçün dəqiq atom `EnsureAlias` planını qaytarır. Qoruyucu dəyərləri başqa bir şəbəkədən əllə köçürməyin.

Sadə bir ping əməliyyatı göndərin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Son bloku oxuyun və ya blok hadisələrinə abunə olun:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Operator Əmrləri {#_5-operator-commands}

Konsensus operator əmrləri icazə verilmiş proqram təminatı icra mühiti açarı tələb edir. Onu `client.toml`-dən kənarda saxlayın və yalnız sahibinin istifadə etdiyi faylı açıq şəkildə ötürün:

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

Ən yüksək və kilidli konsensus kvorum sertifikatları:

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [Torii API son nöqtələr](/az/reference/torii-endpoints.md)
- [Iroha ikilikləri ilə işləmək](/az/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

Mənbə kodu iş nüsxəsindən tam Markdown kömək təsvirini yenidən yaratmaq üçün aşağıdakı əmri icra edin:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
