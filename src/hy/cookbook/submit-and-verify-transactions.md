---
translation_locale: hy
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: de608ef52ad3a999c0e253e6683e454f8f66f399a690dce4c2185c79d02334cd
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# Գործարքների ներկայացում եւ ստուգում {#submit-and-verify-transactions}

## Արդյունքը {#outcome}

Նախապատրաստեք Taira գործարքը, ընդունեք ճշգրիտ վճարային առաջարկը, ստորագրեք եւ ուղարկեք այն, սպասեք կիրառված վերջնականացմանը եւ ստուգեք հաստատված գործարքը հեշի միջոցով։

## Նախադրյալներ {#prerequisites}

- [Միացում Taira-ին](./connect-to-taira.md) էջի արդյունքում ստեղծված ֆինանսավորված `taira.client.toml`, `taira-faucet-policy.json` և `TAIRA_ACCOUNT_ID`։ Գրառումներն օգտագործում են `--fee-payer authority`; CLI-ն ստորագրելուց առաջ ստանում է ճշգրիտ վճարային առաջարկ Taira-ի վճարային ակտիվով։
- Հոսքը `iroha` CLI եւ `jq`
- Մեկ անգամ օգտագործվող Taira ստորագրող: Մի օգտագործեք նրա բանալին կամ գրեք այս հրամանները Minamoto հասցեին:

## Քայլեր {#steps}

### 1. Նախագահել վերջնական կետը, լիազորությունը եւ վճարների մնացորդը {#_1-preflight-the-endpoint-authority-and-fee-balance}

Նախ կարդացեք հերթի վիճակապատկերը, ապա ապացուցեք, որ լիազոր հաշվի վճարային մնացորդը տեսանելի է։ Base58 ակտիվի սահմանման ID-ն կարդացեք faucet-ի քաղաքականությունից, որը պահպանել է միացման բաղադրատոմսը։

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

Դադարեցրեք, եթե հաշիվի կամ վճարների մնացորդը բացակայում է: Գործունական հրահանգը չի կարող անցնել վճարային ընդունումը, երբ նրա լիազոր հաշիվը չի կարող վճարել:

### 2. Մեկ անգամ վճարի գնառաջարկ, ստորագրում եւ ներկայացնում {#_2-quote-sign-and-submit-once}

CLI նետում է հստակ ոչ ստորագրված օգտակար բեռը վճարային առաջարկի համար, կապում է ընդունված վճարման մտադրությունը գործարքի մեջ, ստորագրում եւ ներկայացնում է: JSON ռեժիմը վերադարձնում է գործարքի հեշը, ստորագրված գործարքը եւ ընդունված առաջարկը միասին:

```bash
iroha --config ./taira.client.toml \
  --machine \
  --fee-payer authority \
  tx ping --msg 'cookbook-submit-verify' \
  > taira-submission.json

jq '{hash, fee_quote}' taira-submission.json
TAIRA_TX_HASH="$(jq -er '.hash' taira-submission.json)"
```

Մի օգտագործեք `--no-wait` այս բաղադրատոմսում: Հրամանը սպասում է հաստատմանը, նախքան հաջողությամբ գրելը ստուգման համար.

### 3. Սպասեք վերջնական մշակման շղթայի վիճակը: {#_3-wait-for-terminal-pipeline-state}

HTTP ընդունումից կամ հերթում ընդունվելուց հաջողություն եզրակացնելու փոխարեն օգտագործեք տիպավորված կարգավիճակի օգնականը։ `--wait`-ով CLI-ն պարբերաբար հարցում է անում ճշգրիտ գլոբալ կարգավիճակը և հաջողությամբ ավարտվում է միայն վիճակով հաստատված `Applied` վերջնականության դեպքում։

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

`Rejected` եւ `Expired` թերմինալ ձախողումներ են, ոչ թե վերականգնվող հաջողության դեպքեր: Գրիր դրանց պատճառը գործարքի փոփոխությունից կամ վերակառուցումից առաջ:

### 4. Կարդացեք պահված գործարքը: {#_4-read-the-stored-transaction}

Pipeline- ի վիճակը պատասխանում է, թե արդյոք մշակումը ավարտված է: Գործարքի հարցումը ստուգում է, որ ընդունված գործարքը պահպանվում է նույն շիշի տակ:

```bash
iroha --config ./taira.client.toml \
  --machine \
  tx get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Հետազոտողը երկրորդ, միայն ընթերցվող դիտարկման մակերեսն է: Այն կարող է կարճ ժամանակ անց մնալ մշակման շղթայի վերջնականությունից:

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Վիճակ փոխող հրահանգի դեպքում վերջում query արեք փոփոխված օբյեկտը։ [Metadata](./metadata.md), [Գործունական ակտիվներ](./fungible-assets.md) և [NFTs](./nfts.md) բաղադրատոմսերը ներառում են գործողությունից հետո վիճակի այդ ընթերցումները։

## Փորձարկել {#verify}

Ստուգեք, որ երեք գրառումներն էլ համընկնում են նույն հեշի վրա, և որ բլոկների դիտարկիչը հաղորդում է `Committed`, այլ ոչ թե `Rejected`:

```bash
jq -e --arg hash "$TAIRA_TX_HASH" \
  '.hash == $hash and .terminal_kind == "Applied"' taira-final-status.json

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '(.hash | ascii_downcase | ltrimstr("hash:") | split("#")[0]) == $hash
      and .status == "Committed"'
```

Պահպանեք ներկայացված փաստաթուղթը եւ վերջնական կարգավիճակը որպես փորձարկման ապացույց: Նրանք պարունակում են հանրային գործարքի նյութ, այլ ոչ թե ստորագրության բանալին:

## Խնդիրների լուծում {#troubleshooting}

- HTTP `202` կամ հերթի կարգավիճակը միայն ընդունելություն է ապացուցում: Շարունակեք քվեարկությունը տիպված կարգավիճակի համար մինչեւ կիրառված, մերժված, ժամկետը լրացած կամ սահմանված ժամանակահատվածը:
- Եթե ուղարկման ժամանակահատվածը ավարտվում է hash- ը վերադարձնելուց հետո, կատարեք հարցում այն hash- ը նախքան մեկ այլ գործարք կառուցելը: Կույր վերակառուցումը ստեղծում է նոր վճարի գնառաջարկ եւ ստորագրված օգտակար բեռ:
- Վճարային առաջարկը կարող է մերժվել մինչև ստորագրումը։ Ստուգեք `--fee-payer authority`-ն, լիազոր հաշվի մնացորդը, կազմաձևված `chain`-ը և `network_id`-ն, ինչպես նաև այն, որ `--metadata`-ն չի պարունակում վճարի բանալի, օրինակ՝ `gas_asset_id`։
- `Rejected` սովորաբար նշում է հանձնարարականի վավերացումը, թույլտվությունները, վճարները կամ հնացած վիճակը: Այն հաստատված ապացույց է ձախողված կատարման եւ չպետք է վերակարգավորվի որպես փոխադրման կրկին փորձ:
- Explorer `404` Applied- ի անմիջապես հետո կարող է ինդեքսել ձգձգումը: Կրկին փորձեք ընթերցել; գործարքը կրկին չներկայացրեք:
- Եթե արտոնյալ հրահանգը աշխատում է ստեղծված տեղական ցանցում, բայց Taira մերժում է այն, ստացեք ճշգրիտ Taira թույլտվությունը կամ կառավարվող անվան տարածքի նշանակումը: Տեղական արդյունքը չի տալիս հանրային ցանցի լիազոր հաշիվ:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Գործարքի ներկայացումը եւ վճարային կոտորայի իրականացումը հաստատված commit դեպքում](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/src/main_shared.rs)
- [Գործարքի հաստատման փորձարկումները փակված commit վրա](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/src/client.rs)
- [Գործարքներ](/hy/blockchain/transactions.md)
- [CLI ուղեցույց](/hy/get-started/operate-iroha-via-cli.md)
- [Torii վերջնական կետեր](/hy/reference/torii-endpoints.md)
