---
translation_locale: az
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: 98e5c7e9db1ba8468cfd5409409b0e8d02251311dc85492f7b71675e983dc4fd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Əməliyyatları təqdim et və təsdiqlə {#submit-and-verify-transactions}

## Nəticə {#outcome}

Bir Taira əməliyyatını əvvəlcədən yoxlayın, dəqiq ödəniş qiymətinin təxminini qəbul edin, imzalayın və göndərin, Tətbiq edilmiş sonluğun gözləyin və kriptoqrafik həş vasitəsilə yekunlaşmış əməliyyatı yoxlayın.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- Maliyyələşdirilən `taira.client.toml`, `taira.tx-metadata.json` və `TAIRA_ACCOUNT_ID`, [Taira-ə qoşul](./connect-to-taira.md) tərəfindən istehsal olunub.
- Cari `iroha` CLI və `jq`.
- Bir dəfəlik istifadə olunan Taira kriptoqrafik imzalayıcı. Onun açarını və ya bu yazma əmrlərini Minamoto üzərində yenidən istifadə etməyin.

## Addımlar {#steps}

### 1. API son nöqtəsini, səlahiyyət prinsipalını və ödəniş balansını əvvəlcədən yoxlayın {#_1-preflight-the-endpoint-authority-and-fee-balance}

Əvvəlcə növbənin zaman nöqtəsi məlumat baxışını oxuyun, sonra təsdiqləyin ki, səlahiyyət prinsiplərinin ödəniş balansı görünəndir. Əlaqə resepti tərəfindən yaradılan metadatalardan Base58 aktiv-tərif ID-sini oxuyun.

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

Hesab və ya ödəniş balansı yoxdursa dayanın. Ödənişi ödəmək səlahiyyəti olmayan bir təlimat, ödəniş qəbulunu keçə bilməz.

### 2. Ödənişi hesabladın, imzalayın və bir dəfə təqdim edin {#_2-quote-sign-and-submit-once}

CLI dəqiq imzasız yükü ödəniş qiymətinə görə göndərir, qəbul edilmiş ödəniş niyyətini əməliyyata bağlayır, imzalayır və təqdim edir. JSON rejimi əməliyyatın kriptoqrafik xəşini, imzalanmış əməliyyatı və qəbul edilmiş təklifi birlikdə qaytarır.

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

Bu reseptdə `--no-wait` istifadə etməyin. Əmr, uğurlu protokol nəticəsi qeydi yazmazdan əvvəl təsdiq gözləyir.

### 3. Terminal proqram təminatı işləmə vəziyyətinin tamamlanmasını gözləyin {#_3-wait-for-terminal-pipeline-state}

HTTP qəbulundan və ya sıra qəbulundan uğuru çıxarmaq əvəzinə yazılmış status köməkçisini istifadə edin. `--wait` ilə təhlükəsiz yönləndirmə sahəsi avtomatik seçilir və standart hədəf Tətbiq edilmiş yekunluqdur.

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

`Rejected` və `Expired` təkrar cəhd edilə bilən uğur vəziyyətləri deyil, son uğursuzluqlardır. Əməliyyatı dəyişdirmədən və ya yenidən qurmazdan əvvəl səbəblərini qeyd edin.

### 4. Saxlanmış əməliyyatı oxuyun {#_4-read-the-stored-transaction}

Proqram təminatı işləmə iş axını statusu işləmənin bitib-bitmədiyini cavablandırır. Bir əməliyyat sorğusu qəbul edilmiş əməliyyatın eyni kriptoqrafik xas altında saxlanıldığını təsdiqləyir.

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Kəşfiyyatçı ikinci, yalnız oxumaq üçün nəzərdə tutulmuş müşahidə səthidir. O, proqram təminatı emal iş axınının sonluğu qarşısında qısa müddət gecikə bilər.

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Dövlət dəyişdirən təlimat üçün dəyişdirilmiş obyektin sorğusu ilə başa çatdırın. [Metaməlumat](./metadata.md), [Mübadilə edilə bilən aktivlər](./fungible-assets.md) və [NFTs](./nfts.md) reseptləri həmin post-dövlət oxumalarını əhatə edir.

## Yoxla {#verify}

Bütün üç qeydin eyni kriptoqrafik xəşdə razılaşdığını və tədqiqatçının artıq gözləmə vəziyyətini göstərmədiyini yoxlayın:

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Təqdimat protokolu nəticəsi yazısını və son vəziyyəti test sübutu kimi saxlayın. Onlar imza açarı deyil, ictimai əməliyyat materialını əhatə edir.

## Problemlərin aradan qaldırılması {#troubleshooting}

- HTTP `202` və ya növbədə olan status yalnız qəbul olunmağı təsdiqləyir. Tətbiq olunmuş, rədd edilmiş, müddəti bitmiş və ya məhdud zaman hüduduna çatana qədər yazılmış statusu yoxlamağa davam edin.
- Təqdimetmə heş qaytardıqdan sonra vaxt aşımına uğrayarsa, başqa əməliyyat yaratmazdan əvvəl həmin heşi sorğulayın. Kor-koranə təkrar təqdimetmə ödənişi yenidən hesablanmış və imzalanmış yeni faydalı yük yaradır.
- Ödəniş qiyməti təklifi imzalanmadan əvvəl rədd edilə bilər. `--fee-payer authority`, `gas_asset_id`, səlahiyyət verən şəxsin balansını və şəbəkə zənciri ID-sini yoxlayın.
- `Rejected` adətən təlimatın doğrulanması, icazələr, ödənişlər və ya köhnəlmiş vəziyyəti göstərir. Bu, uğursuz icranın yekun sübutudur və onu çatdırılma təkrarına yenidən təsnifləşdirməmək lazımdır.
- Bir kəşfiyyatçı `404` Tətbiq edildikdən dərhal sonra indeksləşdirmədə gecikmə ola bilər. Oxumağı yenidən sınayın; əməliyyatı yenidən təqdim etməyin.
- Əgər üstünlük verilmiş əməliyyat yaradılmış localnet-də işləyirsə, lakin Taira onu rədd edirsə, dəqiq Taira icazəsini və ya tənzimlənmiş ad məkanının təyinini əldə edin. Lokal nəticə ictimai blokçeyn şəbəkəsi səlahiyyətini vermir.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Əməliyyat göndərilməsi və ödəniş-qiymət təklifinin sabitlənmiş mənbə kodu reviziyasında tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Əməliyyat təsdiqi tətbiqi və yoxlamaları pinlənmiş mənbə kodu reviziyasında](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/src/client.rs)
- [Əməliyyatlar](/az/blockchain/transactions.md)
- [CLI bələdçi](/az/get-started/operate-iroha-via-cli.md)
- [Torii API son nöqtələr](/az/reference/torii-endpoints.md)
