---
translation_locale: az
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Taira-ə qoşul {#connect-to-taira}

## Nəticə {#outcome}

Taira-ın əlçatan olduğunu təsdiqləyin, yerli müştəri konfiqurasiyasından tək protokol-standart I105 hesab ID-ni çıxarın, kriptoqrafik imzalayıcıya testnet XOR ilə vəsait əlavə edin və bir ödəniş qiymətləri göstərilmiş kanarya əməliyyatı təqdim edin. Bu resept heç vaxt Minamoto-ə yazı göndərmir.

## Tələb olunan əvvəlcədən biliklər {#prerequisites}

- `curl`, `jq`, Python 3.11 və sonrakı versiyalar, həmçinin cari `iroha` və `kagami` ikili fayllar.
- Taira zənciri, dəqiq `network_id`, son nöqtə, hesab profili və ayrıca testnet açarı ilə yaradılmış `taira.client.toml`. [Taira müştəri konfiqurasiyasını yaradın](/az/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) bölməsinə əməl edin və faylı versiya nəzarəti sistemindən kənarda saxlayın.
- Testnet maliyyələşdirmə xidməti jurnalı üçün yazıla bilən iş qovluğu: `iroha taira account faucet prepare` `./taira-faucet` qovluğunu yalnız sahibinin əlçatanlığı ilə yaradır və mövcud qovluğu əvəz etməkdən imtina edir.

## Addımlar {#steps}

### 1. Hazır olma vəziyyətindən canlılığı ayırın {#_1-separate-liveness-from-readiness}

`/livez`, `/health` və `/readyz` sadə mətn yoxlamalarıdır; `/status` JSON qaytarır. İşləyən qovşaq konsensusa qəbul və ya başqa vacib alt sistem əlçatan olmadıqda `/readyz` üzərindən tamamilə normal olaraq `503` qaytara bilər.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez`-dən yalnız prosesin cavab verib-vermədiyini müəyyən etmək üçün istifadə edin. Trafikin qəbulu üçün `/readyz`-dən istifadə edin. Onun `503` cavabı bloklayıcı təfərrüatları olmayan `service_unavailable` xəta zərfidir, buna görə onu nasazlıq hesab etməzdən əvvəl aşağıdakı diaqnostikanı işə salın.

### 2. İctimai diaqnostikanı işə salın {#_2-run-the-public-diagnostics}

Bu yoxlama yalnız oxumaq üçündür və kriptoqrafik imzalayıcı konfiqurasiyasını yükləmir:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Həkim möhkəm DNS, TLS, zəncir və ya API son nöqtə uğursuzluğu barədə hesabat verdikdə yazmağa davam etməyin. Doymuş ictimai növbə keçicidir; gözləyin və məhdud siyasətlə yenidən cəhd edin.

### 3. Gizli məlumatı çap etmədən Taira hesab ID-sini çıxarın {#_3-derive-the-taira-account-id-without-printing-a-secret}

Konfiqurasiyadan yalnız ictimai açarı oxuyun, sonra onu Taira I105 profili ilə kodlaşdırın. Hesab ID-si domen daşımır; `[account].profile` yalnız onun şəbəkə prefiksini seçir.

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

Testnet maliyyələşdirmə xidmətinin siyasəti cari ödəniş aktivi tərifini göstərir. Başqa şəbəkədən və ya köhnə icradan ID kopyalamaq əvəzinə onun Base58 ID-sini saxlayın. Siyasət imzasız aşkarlama məlumatıdır, buna görə avtomatlaşdırma hər cavaba etibar etmək əvəzinə gözlədiyi emitenti, aktiv tərifini və məbləği sabitləməlidir.

```bash
curl -fsS -H 'Accept: application/json' \
  https://taira.sora.org/v1/accounts/faucet/policy \
  | tee taira-faucet-policy.json

export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` iş sübutu tapşırığını həll edir və dəqiq imzalanmış əməliyyatı saxlayır; `submit` onu bir dəfə göndərir və əməliyyat tətbiq olunduqdan sonra qayıdır. `submit` `Pending` bildirirsə və ya vaxtı bitirsə, yeni iddia hazırlamaq əvəzinə eyni konfiqurasiya və jurnal ilə `taira account faucet resume` işə salın. Sonra balansı ən çoxu bir dəqiqə ərzində dövri olaraq yoxlayın.

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

Hər Taira yazması üçün `--fee-payer authority` istifadə edin. Seçim imzaya bağlıdır və CLI imzalamadan əvvəl dəqiq haqqı Taira-nın ödəniş aktivində hesablayıb göstərir.

## Yoxla {#verify}

Bir gündəm təlimatı təqdim edin, JSON protokol nəticəsi qeydini saxlayın və Tətbiq edilmiş yekunluğu gözləyin. `--no-wait`-i atmaq da ilkin təqdimatın təsdiq üçün gözləməsinə səbəb olur; açıq status oxuması proqram təminatının son emal iş axını vəziyyətini sübut edir.

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-connect' \
  > taira-connect-submission.json

jq '{hash, fee_quote}' taira-connect-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-connect-submission.json)"

iroha --config ./taira.client.toml \
  --machine \
  tx status \
  --hash "$TAIRA_TX_HASH" \
  --wait \
  --timeout-ms 60000
```

Son əmr yalnız dəqiq qlobal status vəziyyətlə təsdiqlənmiş `Applied` yekunluğunu bildirdikdən sonra uğurla başa çatır. Heşi test sübutlarında saxlayın; onunla birlikdə heç vaxt şəxsi açarı və ya tam müştəri konfiqurasiyasını saxlamayın.

## Problemlərin aradan qaldırılması {#troubleshooting}

- `/livez`, `/health` və `/readyz` yalnız JSON istənildikdə `406` qaytarır, çünki onlar `text/plain` ilə cavab verir. Yuxarıda göstərilən `Accept` başlıqlarını göndərin.
- `/livez` və `/status` işləyərkən belə `/readyz` `service_unavailable` xəta zərfi ilə `503` qaytara bilər. Hazırlığı gözləyin və ya `iroha taira doctor` işə salın; açarların yenidən yaradılması qovşağın hazırlığını dəyişməyəcək.
- `submit` zamanı testnet maliyyələşdirmə xidmətinin `502` cavabı və ya vaxtın bitməsi iddianın nəticəsini naməlum qoyur: yeni iddia hazırlamaq əvəzinə eyni konfiqurasiya və jurnal ilə `taira account faucet resume` işə salın. Köhnəlmiş iş sübutu ankeri `prepare` mərhələsini uğursuz edir; yeni jurnal qovluğunda yenidən hazırlayın.
- I105 prefiks xətası, açıq açarın səhv profil ilə kodlandığını göstərir. `iroha tools address convert --profile taira` əməliyyatını yenidən həyata keçirin.
- Ödəniş qiyməti təxmininin rəddi adətən səlahiyyətli hesabın maliyyələşdirilmədiyini və ya konfiqurasiyadakı `network_id` dəyərinin Taira-ya aid olmadığını bildirir. Çatışmayan `--fee-payer` və ya `--metadata` içində `gas_asset_id` kimi ödəniş açarı təxmindən əvvəl lokal xəta verir.
- Qeydiyyat, buraxılış və ya ad sahəsi idarəçiliyi bu kanari uğur qazandıqdan sonra da rədd edilə bilər. Bu əməliyyatlar ayrı proqram təminatı icra mühiti icazələri tələb edir; bunları Taira girişi verilmədikdə yaradılmış lokal şəbəkədə məşq edin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- Sabitlənmiş reviziyada [Taira CLI diaqnostikası və canary mənbə kodu](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) və [maliyyələşdirmə xidməti əmrləri](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs)
- [Aydın ödəniş seçimi və CLI təqdimetmə mənbəyi bərkidilmiş mənbə kodu reviziyasında](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Taira hesab və testnet maliyyələşdirmə xidməti bələdçisi](/az/get-started/sora-nexus-dataspaces.md)
- [Müştəri konfiqurasiyası](/az/guide/configure/client-configuration.md)
- [Əməliyyatlar](/az/blockchain/transactions.md)
