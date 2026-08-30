---
translation_locale: hy
translation_source: /cookbook/connect-to-taira.md
translation_source_hash: 263e058a0877e1a3c48b6514b127bc56022e3d244284e0b72881743a4aee0f58
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Կապակցեք Taira {#connect-to-taira}

## Արդյունքը {#outcome}

Համոզվեք, որ Taira հասանելի է, տեղական հաճախորդի կոնֆիգուրացիայից հանեք կանոնիկ I105 հաշիվը ID, փորձարկման ցանցով ֆինանսավորեք ստորագրողին XOR եւ ներկայացրեք մեկ վճարային կոտացված կանարյան գործարք: Այս բաղադրատոմսը երբեք չի ուղարկում գրառումներ Minamoto:

## Նախադրյալներ {#prerequisites}

- `curl`, `jq`, Python 3.11 կամ ավելի ուշ, եւ ընթացիկ `iroha` եւ `kagami` բինարներ:
- A `taira.client.toml` ստեղծվել է Taira շղթայով, վերջային կետով, հաշիվի պրոֆիլով եւ հատուկ թեստնետի բանալիրով: Հետեւեք [ Ստեղծեք Taira Client Config](/hy/get-started/sora-nexus-dataspaces.md#_3-create-a-taira-client-config) եւ պահեք ֆայլը աղբյուրի վերահսկողությունից դուրս:
- Պատրաստ գործելու համար `taira_faucet_claim.py` _ ից [Ստացեք Testnet- ը XOR բ) Taira](/hy/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira), պահված է հաճախորդի գաղտնիքի կողքին:

## Քայլեր {#steps}

### 1. Կենդանիության եւ պատրաստվածության տարբերություն {#_1-separate-liveness-from-readiness}

`/livez` պարզ տեքստային գործընթացների տեւողության հետաքննություն է: `/status`, `/health` եւ `/readyz` վերադարձ JSON. Գործող հանգույցը կարող է օրինական կերպով վերադարձնել `503` պատրաստության հետաքինություններից, երբ անհրաժեշտ ենթակառուցվածքը արգելափակվում է.

```bash
curl -fsS -H 'Accept: text/plain' https://taira.sora.org/livez

curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -sS -H 'Accept: application/json' \
  -w '\nHTTP %{http_code}\n' https://taira.sora.org/readyz
```

Օգտագործեք `/livez` միայն որոշելու համար, թե արդյոք գործընթացը արձագանքում է: Օգտագործել `/readyz` երթեւեկության մուտքի համար եւ ստուգել նրա JSON արգելափակիչի մանրամասները, նախքան `503`- ը դիտարկելը որպես անջատում.

### 2. Հանրային ախտորոշման աշխատանքներ իրականացնել {#_2-run-the-public-diagnostics}

Այս ստուգումը միայն ընթերցման համար է եւ չի բեռնում ստորագրողի կոնֆիգը.

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Մի՛ շարունակեք գրել, երբ բժիշկը հայտնում է խիստ DNS, TLS, շղթայի կամ վերջային կետի ձախողման մասին: Լցված հանրային հերթը անցնող է; սպասեք եւ փորձեք կրկին սահմանափակ քաղաքականությամբ:

### 3. Հեռացնել Taira հաշիվը ID առանց գաղտնիք տպելու: {#_3-derive-the-taira-account-id-without-printing-a-secret}

Կարդացեք միայն հանրային բանալին կոնֆիգից, ապա կոդավորեք այն Taira I105 պրոֆիլով: `[account].domain` արժեքը մատակարարում է երթեւեկման համատեքստը, այն չի կազմում հաշիվը ID:

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

Գաղափարների պատասխանը փաստի աղբյուրն է վճարային ակտիվների սահմանման համար: Պահպանեք վերադարձված Base58 ID ՝ այլ ցանցից կամ հին երթեւեկությունից ստացված ID պատճենի փոխարեն:

```bash
python3 ./taira_faucet_claim.py "$TAIRA_ACCOUNT_ID" \
  | tee taira-faucet.json

export TAIRA_FEE_ASSET="$(jq -er '.asset_definition_id' taira-faucet.json)"
jq -n --arg gas_asset_id "$TAIRA_FEE_ASSET" \
  '{gas_asset_id: $gas_asset_id}' > taira.tx-metadata.json
```

Պարզեք հավասարակշռությունը առավելագույնս մեկ րոպեի ընթացքում: Փողովակը կարող է վերադարձնել `202 Accepted` մինչեւ ֆինանսավորման գործարքը տեսանելի լինի:

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

`gas_asset_id` գործարքի մետադատա: Հստակ `--fee-payer authority` ընտրությունը պարտադիր է ստորագրության վրա, եւ CLI-ը ձեռք է բերում ճշգրիտ վճարային առաջարկ ՝ նախքան այն ստորագրվում է:

## Փորձարկել {#verify}

Ներկայացրեք օրագրային հրահանգ, պահեք JSON ստուգումը եւ սպասեք կիրառված վերջնականության: `--no-wait` բաց թողնելը նաեւ ստիպում է նախնական ներկայացումը սպասել հաստատման համար. Բացասական վիճակի ընթերցումը ապացուցում է խողովակաշարի վերջնական վիճակը:

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

Վերջնական հրամանը հաջողվում է միայն այն բանից հետո, երբ գործարքը հասնում է նախանշված `Applied` տերմինալային վիճակի: Պահպանեք շիշը փորձարկման ապացույցներում. Երբեք պահեք մասնավոր բանալին կամ ամբողջական հաճախորդի կոնֆիգերը դրա հետ.

## Խնդիրների լուծում {#troubleshooting}

- `/livez` վերադարձ `406` երբ պահանջվում է JSON քանի որ այդ վերջակետն է `text/plain`. ուղարկել `Accept: text/plain` ինչպես ցույց է տրված վերեւում:
- `/health` կամ `/readyz` կարող են վերադարձնել `503` մեքենայով ընթերցելի արգելափակիչի միջոցով նույնիսկ այն ժամանակ, երբ `/livez` եւ `/status` աշխատում են: Փոփոխեք կամ սպասեք այդ արգելափակչի համար. Վերականգնման կոճակները չեն փոխի հանգույցների պատրաստությունը:
- Հասարակական ծառայության խախտում է `502`, ժամկետային դադար, կամ հնացած աշխատանքային ապացույցի ամփոփիչը: Գտիր նոր հանելուկ եւ փորձիր նորից ավելի ուշ:
- I105 նախադրյալի սխալը նշանակում է, որ հանրային բանալին կոդավորված էր սխալ պրոֆիլով: Վերագործարկել `iroha tools address convert --profile taira`
- Հարկային կոտայի մերժումը սովորաբար նշանակում է, որ իշխանությունը չի ֆինանսավորվել, վճարային ակտիվի մետադատները հնացած են կամ բացարձակ վճարովի վճարող չի ընտրվել:
- Գրանցումը, մինինգը կամ անվանումների տարածքի կառավարումը դեռ կարող են մերժվել այն բանից հետո, երբ այս կանարին հաջողության է հասել: Այդ գործողությունները պահանջում են առանձին վազման թույլտվություններ: Դասընթացներ ստեղծված տեղական ցանցը, եթե Taira մուտք չի տրվել:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Taira CLI ախտորոշում եւ կանարային աղբյուր փակված հանձնաժողովում](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/taira.rs)
- [Բացարձակ վճարային ընտրություն եւ CLI ներկայացման աղբյուր փաթեթավորված պարտավորության վրա](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/src/main_shared.rs):
- [Taira հաշվառման եւ գազի ուղեցույց](/hy/get-started/sora-nexus-dataspaces.md)
- [Հաճախորդի կարգավորումը](/hy/guide/configure/client-configuration.md)
- [Գործարքներ](/hy/blockchain/transactions.md)
