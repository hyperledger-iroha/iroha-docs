---
translation_locale: az
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: e14be7d9314f26f40f6aa30678fddcfcfea39eda9b98016f1b2f84838203c548
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Taira-ə qoşul {#connect-to-taira}

## Nəticə {#outcome}

Taira-ın əlçatan olduğunu təsdiqləyin, yerli müştəri konfiqurasiyasından tək protokol-standart I105 hesab ID-ni çıxarın, kriptoqrafik imzalayıcıya testnet XOR ilə vəsait əlavə edin və bir ödəniş qiymətləri göstərilmiş kanarya əməliyyatı təqdim edin. Bu resept heç vaxt Minamoto-ə yazı göndərmir.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `curl`, `jq`, Python 3.11 və sonrakı versiyalar, həmçinin cari `iroha` və `kagami` ikili fayllar.
- Bir `taira.client.toml` Taira zənciri, API son nöqtəsi, hesab profili və xüsusi testnet açarı ilə yaradılıb. [Taira Müştəri Konfiqurasiyası Yarat](/az/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config)-i izləyin və faylı mənbə nəzarətindən kənarda saxlayın.
- İcra etməyə hazır `taira_faucet_claim.py` [Taira üzərində Testnet XOR əldə edin](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-dən, müştəri konfiqurasiyasının yanında qeyd olundu.

## Addımlar {#steps}

### 1. Hazır olma vəziyyətindən canlılığı ayırın {#_1-separate-liveness-from-readiness}

`/livez` sadə mətnli proses-canlılıq probe-dir. `/status`, `/health` və `/readyz` JSON-i qaytarır. İşləyən bir node, tələb olunan bir alt sistemi bloklandıqda hazır olmaq probe-larından qanuni olaraq `503`-ü qaytara bilər.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez` yalnız prosesin cavab verib-vermədiyini müəyyən etmək üçün istifadə edin. `/readyz` trafikin qəbul edilməsi üçün istifadə edin və `503`-ni çatışmazlıq kimi qiymətləndirməzdən əvvəl onun JSON bloklayıcı detalları yoxlayın.

### 2. İctimai diaqnostikanı işə salın {#_2-run-the-public-diagnostics}

Bu yoxlama yalnız oxumaq üçündür və kriptoqrafik imzalayıcı konfiqurasiyasını yükləmir:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Həkim möhkəm DNS, TLS, zəncir və ya API son nöqtə uğursuzluğu barədə hesabat verdikdə yazmağa davam etməyin. Doymuş ictimai növbə keçicidir; gözləyin və məhdud siyasətlə yenidən cəhd edin.

### 3. Gizli məlumatı çap etmədən Taira hesab ID-sini çıxarın {#_3-derive-the-taira-account-id-without-printing-a-secret}

Konfiqurasiyadan yalnız açıq açarı oxuyun, sonra onu Taira I105 profili ilə kodlayın. `[account].domain` dəyəri yönləndirmə kontekstini təmin edir; bu, hesab ID-nin bir hissəsi deyil.

```bash
TAIRA_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("taira.client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"

export TAIRA_ACCOUNT_ID="$(
  iroha tools address convert --profile taira "$TAIRA_PUBLIC_KEY"
)"
printf '%s\n' "$TAIRA_ACCOUNT_ID"
```

Çıxış domeni olmayan tək bir protokol-standart I105 ünvanıdır. `wallet@payments.universal` kimi adlar ləqəblərdir və ciddi hesab sahələrində istifadə edilməzdən əvvəl həll edilməlidir.

### 4. Mövcud Taira ödəniş aktivini tələb edin {#_4-claim-the-current-taira-fee-asset}

Testnet maliyyələşdirmə xidməti cavabı ödəniş aktivinin tərifi üçün doğru mənbədir. Başqa şəbəkədən və ya köhnə icradan bir ID kopyalamaq əvəzinə, qaytarılan Base58 ID-ni saxlayın.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Balansı ən çox bir dəqiqə ərzində yoxlayın. Testnet maliyyələşdirmə xidməti maliyyələşdirmə əməliyyatı görünməzdən əvvəl `202 Accepted` qaytara bilər.

```bash
funded=false
for attempt in 1 2 3 4 5 6 7 8 9 10 11 12; do
  if iroha --config ./taira.client.toml ledger asset get \
    --definition "$TAIRA_FEE_ASSET" \
    --account "$TAIRA_ACCOUNT_ID"; then
    funded=true
    break
  fi
  sleep 5
done
test "$funded" = true
```

`gas_asset_id` əməliyyat metadatasıdır. Açıq `--fee-payer authority` seçimi imza ilə bağlıdır və CLI imzalamadan əvvəl dəqiq ödəniş qiymətini təxmin edir.

## Yoxla {#verify}

Bir gündəm təlimatı təqdim edin, JSON protokol nəticəsi qeydini saxlayın və Tətbiq edilmiş yekunluğu gözləyin. `--no-wait`-i atmaq da ilkin təqdimatın təsdiq üçün gözləməsinə səbəb olur; açıq status oxuması proqram təminatının son emal iş axını vəziyyətini sübut edir.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  ledger transaction status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

Son əməliyyat yalnız tranzaksiya standart `Applied` son vəziyyətinə çatdıqdan sonra müvəffəq olur. Kriptoqrafik xəşi sınaq sübutunda saxlayın; şəxsi açarı və ya tam müştəri konfiqurasiyasını heç vaxt onunla birlikdə saxlamayın.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `/livez` JSON soruşulduqda `406` qaytarır, çünki həmin API son nöqtəsi `text/plain`. Yuxarıda göstərildiyi kimi `Accept: text/plain` göndərin.
- `/health` və ya `/readyz` `/livez` və `/status` işləyərkən belə maşın tərəfindən oxunan bloklayıcı ilə `503` qaytara bilər. Onu düzəldin və ya həmin bloklayıcının qarşısını gözləyin; açarları yenidən yaratmaq nodun hazır olmasını dəyişdirməyəcək.
- Testnet maliyyələşdirmə xidməti `502`, vaxtın bitməsi və ya köhnəlmiş iş-nəzəriyyəsi ankeri ictimai xidmətin uğursuzluğudur. Yeni bir tapmaca götürün və sonra yenidən cəhd edin.
- I105 prefiks xətası, açıq açarın səhv profil ilə kodlandığını göstərir. `iroha tools address convert --profile taira` əməliyyatını yenidən həyata keçirin.
- Rüsum təklifi rədd ediləsi adətən o deməkdir ki, icazə prinsipi maliyyələşdirilməyib, rüsum aktivinin metadatası köhnəlib, ya da açıq rüsum ödəyicisi seçilməyib.
- Qeydiyyat, buraxılış və ya ad sahəsi idarəçiliyi bu kanari uğur qazandıqdan sonra da rədd edilə bilər. Bu əməliyyatlar ayrı proqram təminatı icra mühiti icazələri tələb edir; bunları Taira girişi verilmədikdə yaradılmış lokal şəbəkədə məşq edin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Taira CLI diaqnostika və canary mənbə kodu təyin olunmuş mənbə kodu reviziyasında](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Aydın ödəniş seçimi və CLI təqdimetmə mənbəyi bərkidilmiş mənbə kodu reviziyasında](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs)
- [Taira hesab və testnet maliyyələşdirmə xidməti bələdçisi](/az/get-started/sora-nexus-dataspaces.md)
- [Müştəri konfiqurasiyası](/az/guide/configure/client-configuration.md)
- [Əməliyyatlar](/az/blockchain/transactions.md)
