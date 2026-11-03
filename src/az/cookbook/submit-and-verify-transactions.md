---
translation_locale: az
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: de608ef52ad3a999c0e253e6683e454f8f66f399a690dce4c2185c79d02334cd
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Əməliyyatları təqdim et və təsdiqlə {#submit-and-verify-transactions}

## Nəticə {#outcome}

Bir Taira əməliyyatını əvvəlcədən yoxlayın, dəqiq ödəniş qiymətinin təxminini qəbul edin, imzalayın və göndərin, Tətbiq edilmiş sonluğun gözləyin və kriptoqrafik həş vasitəsilə yekunlaşmış əməliyyatı yoxlayın.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- [Taira-ya qoşulun](./connect-to-taira.md) bələdçisinin yaratdığı maliyyələşdirilmiş `taira.client.toml`, `taira-faucet-policy.json` və `TAIRA_ACCOUNT_ID`. Yazmalar `--fee-payer authority` istifadə edir; CLI imzalamadan əvvəl dəqiq haqqı Taira-nın ödəniş aktivində hesablayıb göstərir.
- Cari `iroha` CLI və `jq`.
- Bir dəfəlik istifadə olunan Taira kriptoqrafik imzalayıcı. Onun açarını və ya bu yazma əmrlərini Minamoto üzərində yenidən istifadə etməyin.

## Addımlar {#steps}

### 1. API son nöqtəsini, səlahiyyət prinsipalını və ödəniş balansını əvvəlcədən yoxlayın {#_1-preflight-the-endpoint-authority-and-fee-balance}

Əvvəlcə növbənin anlıq görüntüsünü oxuyun, sonra səlahiyyətli hesabın ödəniş balansının göründüyünü sübut edin. Base58 aktiv tərifi ID-sini qoşulma reseptinin saxladığı testnet maliyyələşdirmə xidməti siyasətindən oxuyun.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, queue_size, txs_approved, txs_rejected}'

TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet-policy.json)"

iroha --config ./taira.client.toml account get \
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
  tx ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Bu reseptdə `--no-wait` istifadə etməyin. Əmr, uğurlu protokol nəticəsi qeydi yazmazdan əvvəl təsdiq gözləyir.

### 3. Terminal proqram təminatı işləmə vəziyyətinin tamamlanmasını gözləyin {#_3-wait-for-terminal-pipeline-state}

Uğuru HTTP qəbulundan və ya növbəyə qəbuldan nəticə çıxarmaq əvəzinə tipli status köməkçisindən istifadə edin. `--wait` ilə CLI dəqiq qlobal statusu dövri olaraq sorğulayır və yalnız vəziyyətlə təsdiqlənmiş `Applied` yekunluğunda uğurla başa çatır.

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx status \
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
  tx get --hash "$TAIRA_TX_HASH" \
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

Hər üç qeydin eyni heş üzərində razılaşdığını və blok brauzerinin `Rejected` deyil, `Committed` göstərdiyini yoxlayın:

```bash
jq -e --arg hash "$TAIRA_TX_HASH" \
  '.hash == $hash and .terminal_kind == "Applied"' taira-final-status.json

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '(.hash | ascii_downcase | ltrimstr("hash:") | split("#")[0]) == $hash
      and .status == "Committed"'
```

Təqdimat protokolu nəticəsi yazısını və son vəziyyəti test sübutu kimi saxlayın. Onlar imza açarı deyil, ictimai əməliyyat materialını əhatə edir.

## Problemlərin aradan qaldırılması {#troubleshooting}

- HTTP `202` və ya növbədə olan status yalnız qəbul olunmağı təsdiqləyir. Tətbiq olunmuş, rədd edilmiş, müddəti bitmiş və ya məhdud zaman hüduduna çatana qədər yazılmış statusu yoxlamağa davam edin.
- Təqdimetmə heş qaytardıqdan sonra vaxt aşımına uğrayarsa, başqa əməliyyat yaratmazdan əvvəl həmin heşi sorğulayın. Kor-koranə təkrar təqdimetmə ödənişi yenidən hesablanmış və imzalanmış yeni faydalı yük yaradır.
- Ödəniş qiyməti təxmini imzalamadan əvvəl rədd edilə bilər. `--fee-payer authority` parametrini, səlahiyyətli hesabın balansını, konfiqurasiya olunmuş `chain` və `network_id` dəyərlərini və `--metadata` içində `gas_asset_id` kimi ödəniş açarının olmadığını yoxlayın.
- `Rejected` adətən təlimatın doğrulanması, icazələr, ödənişlər və ya köhnəlmiş vəziyyəti göstərir. Bu, uğursuz icranın yekun sübutudur və onu çatdırılma təkrarına yenidən təsnifləşdirməmək lazımdır.
- Bir kəşfiyyatçı `404` Tətbiq edildikdən dərhal sonra indeksləşdirmədə gecikmə ola bilər. Oxumağı yenidən sınayın; əməliyyatı yenidən təqdim etməyin.
- Əgər üstünlük verilmiş əməliyyat yaradılmış localnet-də işləyirsə, lakin Taira onu rədd edirsə, dəqiq Taira icazəsini və ya tənzimlənmiş ad məkanının təyinini əldə edin. Lokal nəticə ictimai blokçeyn şəbəkəsi səlahiyyətini vermir.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Əməliyyat göndərilməsi və ödəniş-qiymət təklifinin sabitlənmiş mənbə kodu reviziyasında tətbiqi](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Əməliyyat təsdiqi tətbiqi və yoxlamaları pinlənmiş mənbə kodu reviziyasında](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/client.rs)
- [Əməliyyatlar](/az/blockchain/transactions.md)
- [CLI bələdçi](/az/get-started/operate-iroha-via-cli.md)
- [Torii API son nöqtələr](/az/reference/torii-endpoints.md)
