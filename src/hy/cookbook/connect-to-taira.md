---
translation_locale: hy
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 31555f0c56bddb8892d09af250cef732a2dfdd39564c83de8b344200157751b9
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Կապակցեք Taira {#connect-to-taira}

## Արդյունքը {#outcome}

Համոզվեք, որ Taira հասանելի է, տեղական հաճախորդի կոնֆիգուրացիայից հանեք կանոնիկ I105 հաշիվը ID, փորձարկման ցանցով ֆինանսավորեք ստորագրողին XOR եւ ներկայացրեք մեկ վճարային կոտացված կանարյան գործարք: Այս բաղադրատոմսը երբեք չի ուղարկում գրառումներ Minamoto:

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Python 3.11 կամ ավելի ուշ, եւ ընթացիկ `iroha` եւ `kagami` բինարներ:
- `taira.client.toml`, որը ստեղծված է Taira-ի շղթայով, ճշգրիտ `network_id`-ով, վերջնակետով, հաշվի պրոֆիլով և առանձին թեստային ցանցի բանալիով։ Հետևեք [Taira հաճախորդի կազմաձևման ստեղծում](/hy/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) բաժնին և ֆայլը պահեք տարբերակների կառավարման համակարգից դուրս։
- Գրելու հնարավորությամբ աշխատանքային գրացուցակ faucet-ի մատյանի համար: `iroha taira account faucet prepare`-ը ստեղծում է `./taira-faucet`-ը միայն սեփականատիրոջը հասանելի իրավունքներով և հրաժարվում է փոխարինել գոյություն ունեցող գրացուցակը։

## Քայլեր {#steps}

### 1. Կենդանիության եւ պատրաստվածության տարբերություն {#_1-separate-liveness-from-readiness}

`/livez`-ը, `/health`-ը և `/readyz`-ը պարզ տեքստային ստուգումներ են; `/status`-ը վերադարձնում է JSON։ Աշխատող հանգույցը կարող է օրինաչափորեն վերադարձնել `503` `/readyz`-ից, երբ կոնսենսուսի ընդունումը կամ մեկ այլ պարտադիր ենթահամակարգ անհասանելի է։

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: text/plain, application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

`/livez`-ն օգտագործեք միայն պարզելու համար, թե արդյոք գործընթացը պատասխանում է։ Երթևեկի ընդունման համար օգտագործեք `/readyz`-ը։ Դրա `503`-ը `service_unavailable` սխալի ծրար է՝ առանց արգելափակման մանրամասների, ուստի նախքան այն որպես խափանում դիտարկելը գործարկեք ստորև նկարագրված ախտորոշումը։

### 2. Հանրային ախտորոշման աշխատանքներ իրականացնել {#_2-run-the-public-diagnostics}

Այս ստուգումը միայն ընթերցման համար է եւ չի բեռնում ստորագրողի կոնֆիգը.

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Մի՛ շարունակեք գրել, երբ բժիշկը հայտնում է խիստ DNS, TLS, շղթայի կամ վերջային կետի ձախողման մասին: Լցված հանրային հերթը անցնող է; սպասեք եւ փորձեք կրկին սահմանափակ քաղաքականությամբ:

### 3. Հեռացնել Taira հաշիվը ID առանց գաղտնիք տպելու: {#_3-derive-the-taira-account-id-without-printing-a-secret}

Կազմաձևումից կարդացեք միայն հանրային բանալին, ապա կոդավորեք այն Taira-ի I105 պրոֆիլով։ Հաշվի ID-ն դոմեն չի պարունակում; `[account].profile`-ն ընտրում է միայն դրա ցանցի նախածանցը։

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

Արտադրանքը դոմեյնազուրկ կանոնիկ I105 հասցե է: Նման անուններ, ինչպիսիք են `wallet@payments.universal`, կեղծանուններ են եւ պետք է լուծվեն նախքան դրանք օգտագործվելը խիստ հաշիվների դաշտերում:

### 4. Պահանջել ընթացիկ Taira վճարային ակտիվը: {#_4-claim-the-current-taira-fee-asset}

Faucet-ի քաղաքականությունը նշում է վճարային ակտիվի ընթացիկ սահմանումը։ Պահպանեք դրա Base58 ID-ն՝ այլ ցանցից կամ հին գործարկումից ID պատճենելու փոխարեն։ Քաղաքականությունը չստորագրված հայտնաբերման տվյալներ է, ուստի ավտոմատացումը յուրաքանչյուր պատասխանին վստահելու փոխարեն պետք է ամրագրի իր ակնկալած թողարկողը, ակտիվի սահմանումը և գումարը։

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

`prepare`-ը լուծում է աշխատանքի ապացույցը և պահպանում ճշգրիտ ստորագրված գործարքը; `submit`-ը այն ուղարկում է մեկ անգամ և վերադառնում է գործարքի կիրառվելուց հետո։ Եթե `submit`-ը հաղորդում է `Pending` կամ ժամանակը սպառվում է, մեկ այլ հայտ պատրաստելու փոխարեն գործարկեք `taira account faucet resume` նույն կազմաձևմամբ և մատյանով։ Ապա առավելագույնը մեկ րոպե պարբերաբար ստուգեք մնացորդը։

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

Taira-ում յուրաքանչյուր գրառման համար օգտագործեք `--fee-payer authority`։ Ընտրությունը կապված է ստորագրությանը, և CLI-ն ստորագրելուց առաջ ստանում է ճշգրիտ վճարային առաջարկ Taira-ի վճարային ակտիվով։

## Փորձարկել {#verify}

Ներկայացրեք օրագրային հրահանգ, պահեք JSON ստուգումը եւ սպասեք կիրառված վերջնականության: `--no-wait` բաց թողնելը նաեւ ստիպում է նախնական ներկայացումը սպասել հաստատման համար. Բացասական վիճակի ընթերցումը ապացուցում է մշակման շղթայի վերջնական վիճակը:

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

Վերջին հրամանը հաջողվում է միայն այն բանից հետո, երբ ճշգրիտ գլոբալ կարգավիճակը հաղորդում է վիճակով հաստատված `Applied` վերջնականություն։ Հեշը պահեք թեստային ապացույցներում; երբեք դրա հետ մի՛ պահեք մասնավոր բանալին կամ հաճախորդի ամբողջական կազմաձևումը։

## Խնդիրների լուծում {#troubleshooting}

- `/livez`-ը, `/health`-ը և `/readyz`-ը վերադարձնում են `406`, երբ պահանջվում է միայն JSON, քանի որ նրանք պատասխանում են `text/plain`-ով։ Ուղարկեք վերևում ցուցադրված `Accept` վերնագրերը։
- `/readyz`-ը կարող է վերադարձնել `503` `service_unavailable` սխալի ծրարով, նույնիսկ երբ `/livez`-ը և `/status`-ը աշխատում են։ Սպասեք պատրաստականությանը կամ գործարկեք `iroha taira doctor`; բանալիների վերագեներացումը չի փոխի հանգույցի պատրաստականությունը։
- Faucet-ի `502`-ը կամ ժամանակի սպառումը `submit`-ի ընթացքում հայտի արդյունքն անհայտ է թողնում: մեկ այլ հայտ պատրաստելու փոխարեն գործարկեք `taira account faucet resume` նույն կազմաձևմամբ և մատյանով։ Աշխատանքի ապացույցի հնացած խարիսխը ձախողում է `prepare`-ը; կրկին պատրաստեք մատյանի նոր գրացուցակում։
- I105 նախադրյալի սխալը նշանակում է, որ հանրային բանալին կոդավորված էր սխալ պրոֆիլով: Վերագործարկել `iroha tools address convert --profile taira`
- Վճարային առաջարկի մերժումը սովորաբար նշանակում է, որ լիազոր հաշիվը ֆինանսավորված չէ կամ կազմաձևված `network_id`-ը Taira-ինը չէ։ Բացակայող `--fee-payer`-ը կամ `--metadata`-ում վճարի բանալին, օրինակ՝ `gas_asset_id`-ը, ձախողվում է տեղականորեն՝ մինչև առաջարկը։
- Գրանցումը, մինինգը կամ անվանումների տարածքի կառավարումը դեռ կարող են մերժվել այն բանից հետո, երբ այս կանարին հաջողության է հասել: Այդ գործողությունները պահանջում են առանձին վազման թույլտվություններ: Դասընթացներ ստեղծված տեղական ցանցը, եթե Taira մուտք չի տրվել:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Taira CLI-ի ախտորոշման և canary ստուգումների աղբյուրը](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira.rs) և [faucet-ի հրամանները](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/taira_onboarding.rs) ամրագրված commit-ում
- [Բացարձակ վճարային ընտրություն եւ CLI ներկայացման աղբյուր փաթեթավորված commit վրա](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs):
- [Taira հաշվառման եւ գազի ուղեցույց](/hy/get-started/sora-nexus-dataspaces.md)
- [Հաճախորդի կարգավորումը](/hy/guide/configure/client-configuration.md)
- [Գործարքներ](/hy/blockchain/transactions.md)
