---
translation_locale: az
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: ab8f3bf6d2259dc1ea649273e695429a992108b936475b263fe9d1fae59e8766
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Iroha 3 vasitəsilə CLI ilə hərəkət etmək {#operate-iroha-3-via-cli}

`iroha` ikili, Iroha 3 üçün əmr xətt klientidir. Onu kitabın vəziyyətini sorğulaşdırmaq, əməliyyatları təqdim etmək və operatorun son nöqtələrini yoxlamaq üçün istifadə edin.

## 1. Əvvəlki şərtlər {#_1-prerequisites}

Əvvəlcə yerli şəbəkə açın:

- [İndirmə Iroha 3](./launch-iroha.md)

Aşağıdakı nümunələr [Launch Iroha 3](./launch-iroha.md)-də yaradılan lokalnetdən yaranan müştəri konfigurasiyasını ehtimal edir:

```bash
./localnet/client.toml
```

## 2. Əsas CLI quruluşu {#_2-basic-cli-setup}

Ən yüksək səviyyəli kömək göstərin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI aşağıdakı yüksək səviyyəli komandanlıq qruplarına təşkil olunur:

- `account` hesab istiqamətində keçidlər üçün
- `tx` əməliyyat səviyyəsində köməkçilər üçün
- `ledger` nəşriyyatda oxumaq və ya yazmaq üçün
- `ops` operatorun diaqnostikası üçün
- `app` üçün tətbiq API köməkçiləri
- `contract` müqavilələrin icrası və çağırışlar üçün
- `tools` diaqnostik və inkişaf etdiricilər üçün xidmətlər
- `taira` üçün Taira və Nexus- istiqamətlənmiş iş axınları

`ledger` qrupu həmçinin `ledger transaction` kimi domenə aid əməliyyat köməkçiləri də var.

İnsan oxuya bilən operator çıxışı üçün `--output-format text` və ciddi avtomatlaşdırma rejimində `--machine` istifadə edin.

## 3. İctimai Taira Testnetini sınayın. {#_3-try-the-public-taira-testnet}

Yerli bir həmyaşıd işlətmədən və ya imzalayan yaratmadan əvvəl yalnız oxumaq üçün Taira yoxlamalarını cəhd edə bilərsiniz. Bu əmrlər ictimai Torii JSON yollarından istifadə edir və testnet XOR xərcləmirlər.

Taira statusunu yoxlayın:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` məlumat sahəsində ictimai domenlərin siyahısı:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Bir neçə aktiv tərifini və onların mövcud təkliflərini göstərin:

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Əgər mövcud `iroha` ikili varsa, Taira diaqnostik köməkçisini çalışdırın:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Yaradın `taira.client.toml` Yalnız imzalanmış əmrləri sınamağa hazır olduğunuzda. [Bağlantı SORA Nexus Məlumat sahələri](/az/get-started/sora-nexus-dataspaces.md) Konfig, faucet və kanary axını üçün. Taira Hesab faucet haqqı aktivindən maliyyələşənədək.

Hər hansı bir ödəniş üçün Taira CLI Məsələn, kran köməkçisini xilas edin [Testnet əldə edin XOR haqqında Taira](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) kimi `taira_faucet_claim.py`, sonra da iddia testnet XOR Birincisi:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Əgər faucet puzzle və ya iddia yolu `502` qaytarsa, gözləyin və yenidən cəhd edin. Bu hesab açarlarını yeniləmək üçün siqnal deyil, testnetin ictimai mövcudluğu ilə bağlı bir problemdir.

Hesab görünmədikdən sonra, ödəniş aktivinin metadatalarını əlavə edin:

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Əsas Ledger əmrləri {#_4-basic-ledger-commands}

Bütün domenləri siyahıya alın:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Adətən domen yaradılması deklarativ alias planlaşdırıcıdan istifadə edir; `ledger domain` komandanın yoxdur `register` Sirrsiz bir silah hazırlayın. `AliasSetupPlanRequestV1` məqsədi `docs.universal` Sizinlə SDK ya da yükləmə xidməti, sonra planlaşdırın və tətbiq edin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Məqsəd məlumat boşluğu ID, kanonik sahibi hesabı, icarə müddəti və cari qiymət mühafizəsi. Planlaşdırıcı canlı vəziyyətini yoxlayır və təqdim etmək üçün dəqiq atom `EnsureAlias` planını qaytarır. Başqa bir şəbəkədən mühafizə dəyərlərini əl ilə kopyalamayın.

Sadə bir ping əməliyyat göndərin:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Son blokunu oxuyun və ya blok hadisələrinə abunə olun:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Operator əmrləri {#_5-operator-commands}

Konsensus vəziyyəti:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi status
```

Fazalar üzrə gecikmə sürəti:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi phases
```

Mövcudluq, toplayıcı, RBC geri yükləmə və VRF sürətli görüntüsü:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ops sumeragi telemetry
```

Zəncirdəki konsensus parametrləri:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ops sumeragi params
```

## 6. Nereye gedəcəyimiz? {#_6-where-to-go-next}

- [SDK təlimatları](/az/guide/tutorials/)
- [Torii bitki nöqtələri](/az/reference/torii-endpoints.md)
- [Iroha binarları](/az/reference/binaries.md) ilə işləmək
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/main/crates/iroha_cli/README.md)

Mənbə hesabından tam bir Markdown kömək snapshot bərpa etmək üçün, çalıştır:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
