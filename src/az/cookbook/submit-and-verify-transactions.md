---
translation_locale: az
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 01907ea433e711cb0b1aa327d46c44744aad0a7571a65430dddd7a8aed3df373
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Transaksiyaların təqdim edilməsi və təsdiqlənməsi {#submit-and-verify-transactions}

## Nəticə {#outcome}

Taira əməliyyatı əvvəlcədən həyata keçirin, dəqiq bir ödəniş təklifini qəbul edin, imzalayın və göndərin, tətbiq olunmuş yekunluğu gözləyin və öhdəlik götürülmüş əməliyyatın hashlə yoxlanılmasını təmin edin.

## Əvvəlki şərtlər {#prerequisites}

- [ tərəfindən istehsal olunan və maliyyələşdirilən `taira.client.toml`, `taira.tx-metadata.json` və `TAIRA_ACCOUNT_ID` Taira](./connect-to-taira.md) ilə əlaqə saxlanılır.
- `iroha` CLI və `jq` axını.
- Birbaşa istifadə edilə bilən Taira imzalanıcısı. Onun açarını və ya bu əmrləri Minamoto -də yazmaqdan çəkinin.

## Dərslər {#steps}

### 1. Son nöqtə, səlahiyyət və ödəniş balansını əvvəlcədən təyin edin. {#_1-preflight-the-endpoint-authority-and-fee-balance}

İlk növbə sürətini oxuyun, sonra orqanın ödəniş balansının görünür olduğunu sübut edin. Bağlantı resepti tərəfindən yaradılan metadadan Base58 aktiv tərifini ID oxuyun.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.gas_asset_id' taira.tx-metadata.json)"

iroha --config ./taira.client.toml ledger account get \
  --id "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Hesab və ya ödəniş balansı yoxdursa, dayandırın. Müvafiq göstərici ödəniş edə bilmədiyi təqdirdə ödəniş haqqını qəbul edə bilməz.

### 2. Bir dəfə qeyd edin, imzalayın və göndərin {#_2-quote-sign-and-submit-once}

CLI ödəniş qiymətləri üçün dəqiq imzalanmamış payload göndərir, qəbul edilmiş ödəmə niyyətini əməliyyatla bağlayır, imzalar və təqdim edir. JSON rejimi əməliyyat hashini, imzalanan əməliyyatı və qəbul edilmiş qiyməti birlikdə qaytarır.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Bu reseptdə `--no-wait` istifadə etməyin. Komanda uğurlu bir qəbulu yazmadan əvvəl təsdiqlənməsini gözləyir.

### 3. Terminal boru kəmərinin vəziyyətini gözləyin {#_3-wait-for-terminal-pipeline-state}

HTTP qəbulundan və ya növbə girişindən uğur əldə etmək əvəzinə yazdırılmış status köməkçisini istifadə edin. `--wait` ilə təhlükəsiz istiqamət sahəsi avtomatik olaraq seçilir və standart hədəf tətbiq edilən yekunluqdır.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000 \
  > taira-final-status.json

jq . taira-final-status.json
```

`Rejected` və `Expired` terminal uğursuzluqlardır, geri çəkilə bilən uğurlu vəziyyətlər deyil. Müqaviləni dəyişdirmədən və ya yenidən qurmadan əvvəl onların səbəbini qeyd edin.

### 4. Saxlanan əməliyyatı oxuyun. {#_4-read-the-stored-transaction}

Boru kəmərinin statusu işlənməsinin bitdiyini və bitmədiyini göstərir. Bir əməliyyat sorğusu qəbul edilmiş əməliyyatın eyni hash altında saxlandığını təsdiqləyir.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Eksplorator ikinci, yalnız oxumaq üçün müşahidə sahəsidir. Bu, boru kəmərinin bitməsindən bir müddət geridə qala bilər.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Dövlət dəyişdirmə təlimatı üçün, mutasiya edilmiş obyektin sorğusunu bitir. [Metadata](./metadata.md), [Fungible assets](./fungible-assets.md) və [NFTs](./nfts.md) reseptləri bu post-dövlət oxumalarını ehtiva edir.

## Tətbiq edin {#verify}

Hər üç qeydin eyni hash üzərində razılaşdığını yoxlayın və kəşfiyyatçı artıq gözləməyən bir vəziyyətdən xəbər vermir:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Müraciət qəbulu və son statusunu sınaq sübutları kimi saxlayın. Onlarda imza açarı yox, ictimai əməliyyat materialı var.

## Problemlərin həlli {#troubleshooting}

- HTTP `202` və ya növbədə olan status yalnız qəbul olduğunu sübut edir. tətbiq olunana, rədd edilənə, başa çatana və ya məhdud müddətə qədər tiplənmiş statusu seçməyə davam edin.
- Bir hash qaytarıldıqdan sonra göndərmə vaxtları sona çatırsa, başqa bir əməliyyat qurmadan əvvəl bu hashdən soruşun. Kör yenidən göndərmə yeni bir sitat və imzalanmış pay yükü yaradır.
- İmzalanmadan əvvəl bir ödəniş təklifini rədd etmək olar. `--fee-payer authority`, `gas_asset_id`, orqanın balansını və şəbəkə zəncirini yoxlayın ID.
- `Rejected` ümumiyyətlə təlimatların təsdiqlənməsini, icazələrini, ödənişləri və ya köhnə vəziyyətini göstərir. Bu uğursuz icra edilməsinin güvənli sübutudur və nəqliyyatın yenidən sınağı kimi yenidən təsnif edilməlidir.
- Bir kəşfiyyatçı `404` tətbiqdən dərhal sonra indeksləmə gecikməsi ola bilər. Oxunuşu yenidən sınayın; əməliyyatı yenidən təqdim etməyin.
- Əgər xüsusi təlimat istehsal olunan lokal şəbəkədə işləyir, lakin Taira onu rədd edərsə, dəqiq Taira icazəsi və ya idarə edilən ad məkanı təyin etməsini alın.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Əməliyyatların təqdim edilməsi və sabitləşdirilmiş öhdəlikdə ödəniş kvotası həyata keçirilməsi ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Əməliyyatın təsdiqlənməsi sınaqları bağlanmış komitdə](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Əməliyyatlar](/az/blockchain/transactions.md)
- [CLI rəhbərliyi](/az/get-started/operate-iroha-via-cli.md)
- [Torii son nöqtələri](/az/reference/torii-endpoints.md)
