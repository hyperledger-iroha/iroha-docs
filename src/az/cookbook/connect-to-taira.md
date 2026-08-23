---
translation_locale: az
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: a7347a7e8ea055fd5bab9a34b6124ea19ef6f355f9beef9e9488794d9c6e3202
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Taira ünvanına bağlanın {#connect-to-taira}

## Nəticə {#outcome}

Taira -nin əldə edilə biləcəyini təsdiqləyin, yerli müştəri konfigurasiyasından kanonik I105 hesabını ID çıxarın, imzalananı testnet XOR ilə maliyyələşdirin və bir ödənişli canary əməliyyatını təqdim edin. Bu resept heç vaxt Minamoto ünvanına yazı göndərmir.

## Əvvəlki şərtlər {#prerequisites}

- `curl`, `jq`, Python 3.11 və ya daha sonrakı dövrlər və mövcud olan `iroha` və `kagami` ikililər.
- A `taira.client.toml` yaradılmışdır Taira silsilə, son nöqtə, hesab profil və xüsusi testnet açarı. [A yaratmaq Taira Müştəri Konfigurasiyası](/az/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) və faylın mənbə nəzarətindən kənarda saxlanılsın.
- İndirməyə hazır olan `taira_faucet_claim.py` üçün [Testnet əldə edin XOR haqqında Taira](/az/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), Müştəri konfigürasiyasının yanında saxlanılır.

## Dərslər {#steps}

### 1. Hazırlıqdan canlılığı ayırmaq. {#_1-separate-liveness-from-readiness}

`/livez` sadə mətn proses ömrü sondasıdır. `/status`, `/health` və `/readyz` geri qaytarma JSON. Bir işləyən düyün tələb olunan alt sistem bloklandıqda hazırlıq sondalarından qanuni olaraq `503` geri qaytara bilər.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Yalnız `/livez` -dən istifadə edərək prosesin cavab verdiyini qərar verin. `/readyz` -dən istifadə edin və `503` -ni bir kəsilmə kimi qəbul etməzdən əvvəl JSON -nin bloker detallarını yoxlayın.

### 2. İctimai diaqnostikası aparın. {#_2-run-the-public-diagnostics}

Bu yoxlama yalnız oxunacaqdır və imzalanma konfigurasını yükləmir:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Həkim ağır DNS, TLS, silsilə və ya son nöqtələrin uğursuzluğunu bildirdikdə yazmağa davam etməyin. Doymuş ictimaiyyət növbəsi keçidlidir; sərhədli bir siyasətlə gözləyin və yenidən sınayın.

### 3. Taira hesab ID sirrini çap etmədən. {#_3-derive-the-taira-account-id-without-printing-a-secret}

Yalnız konfiqurasiyadan ictimai açarı oxuyun, sonra onu Taira I105 profili ilə kodlayın. `[account].domain` dəyəri yönləndirmə kontekstini təmin edir; bu hesabın bir hissəsi deyil ID.

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

Çıxış domensiz bir kanonik I105 ünvanıdır. `wallet@payments.universal` kimi adlar ləqəbdir və sərt hesab sahələrində istifadə edilmədən əvvəl həll olunmalıdır.

### 4. Hələlik Taira haqqı aktivini tələb etmək {#_4-claim-the-current-taira-fee-asset}

Faucet cavabı ödəniş aktivinin təyinatı üçün həqiqət mənbəyidir. Başqa bir şəbəkədən və ya köhnə işləyənlərdən ID kopyalamaq əvəzinə qaytarılmış Base58 ID saxlayın.

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Maliyyələşdirmə əməliyyatının görünməsindən əvvəl faucet `202 Accepted` geri qaytara bilər.

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

`gas_asset_id` əməliyyat meta məlumatlarıdır. Açıqca `--fee-payer authority` seçimi imzalanma ilə bağlıdır və CLI imzalanmadan əvvəl dəqiq bir ödəniş quote əldə edir.

## Tətbiq edin {#verify}

JSON qəbulu saxlayın və tətbiq edilən yekunlaşmanı gözləyin. `--no-wait` buraxılması da ilkin təqdimatın təsdiqlənməsini gözləyir; açıq status oxunuşu son boru xəttinin vəziyyətini sübut edir.

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

Son əmr yalnız əməliyyat standart `Applied` terminal vəziyyətinə çatdıqdan sonra uğurla həyata keçirilir. Test sübutlarında hash saxlayın; heç vaxt özəl açarı və ya tam müştəri quruluşunu onunla saxlamayın.

## Problemlərin həlli {#troubleshooting}

- `/livez` gəlirlər `406` tələb edildikdə JSON Çünki bu son nöqtə `text/plain`. Göndər `Accept: text/plain` yuxarıda göstərildiyi kimi.
- `/health` və ya `/readyz` `/livez` və `/status` işləyərkən də maşınla oxuna bilən blokerlə `503` qaytara bilər. Bu blokeri düzəltmək və ya gözləmək; bərpa edən açarlar nodun hazırlığını dəyişdirməyəcəkdir.
- Bir faucet `502`, vaxt məhdudluğu və ya köhnə iş sübutu bağçası ictimai xidmətdə uğursuzluqdur.
- I105 prefiks xəta ictimai açar səhv profillə kodlanmışdır. Yenidən çalıştırın `iroha tools address convert --profile taira`.
- Ödəniş quote-nin rədd edilməsi adətən o deməkdir ki, orqan maliyyələşdirilməyib, ödəniş aktivinin meta məlumatları köhnədir və ya açıq bir ödəniş haqqı verilməyib.
- Bu canary uğurlu olduqda qeydiyyat, mining və ya ad məkanının idarə edilməsi hələ də rədd edilə bilər.Bu əməliyyatlar ayrı-ayrı icra vaxt icazələri tələb edir; Taira giriş verilmədikdə istehsal olunan yerli şəbəkədə təcrübə edin.

## Mənbə və əlaqəli sənədlər {#source-and-related-docs}

- [Taira CLI diaqnostikası və sabitləşdirilmiş komitdə kanary mənbəyi](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/taira.rs)
- [Açıq ödəniş seçimi və CLI təqdimat mənbəyi bağlanmış öhdəlikdə ](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Taira hesabı və kran təlimatı](/az/get-started/sora-nexus-dataspaces.md)
- [Müştəri konfiqurasiyası](/az/guide/configure/client-configuration.md)
- [Əməliyyatlar](/az/blockchain/transactions.md)
