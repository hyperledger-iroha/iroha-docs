---
translation_locale: hy
translation_source: /cookbook/submit-and-verify-transactions.md
translation_source_hash: e07cc42a3fd5579db312bfbfbb8010f473062edebe0141eb9bb8c2a0e7faa4da
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Գործարքների ներկայացում եւ ստուգում {#submit-and-verify-transactions}

## Արդյունքը {#outcome}

Նախապատրաստեք Taira գործարքը, ընդունեք ճշգրիտ վճարային առաջարկը, ստորագրեք եւ ուղարկեք այն, սպասեք կիրառված վերջնականացմանը եւ ստուգեք պարտավորվող գործարքը хэշի միջոցով։

## Նախադրյալներ {#prerequisites}

- Ֆինանսավորված `taira.client.toml`, `taira.tx-metadata.json` եւ `TAIRA_ACCOUNT_ID` ապրանքներ, որոնք արտադրվել են [: Կապվեք Taira](./connect-to-taira.md):
- Հոսքը `iroha` CLI եւ `jq`
- Մեկ անգամ օգտագործվող Taira ստորագրող: Մի օգտագործեք նրա բանալին կամ գրեք այս հրամանները Minamoto հասցեին:

## Քայլեր {#steps}

### 1. Նախագահել վերջնական կետը, լիազորությունը եւ վճարների հավասարակշռությունը {#_1-preflight-the-endpoint-authority-and-fee-balance}

Սկզբում կարդացեք հերթի նկարը, ապա ապացուցեք, որ իշխանության վճարային հավասարակշռությունը տեսանելի է: Կարդացեք Base58 ակտիվի սահմանումը ID կապի բաղադրատոմսով ստեղծված մետադատայից:

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

Դադարեցրեք, եթե հաշիվի կամ վճարների հավասարակշռությունը բացակայում է: Գործունական հրահանգը չի կարող անցնել վճարային ընդունումը, երբ նրա իշխանությունը չի կարող վճարել:

### 2. Մեկ անգամ մեջբերում, ստորագրում եւ ներկայացնում {#_2-quote-sign-and-submit-once}

CLI նետում է հստակ ոչ ստորագրված օգտակար բեռը վճարային առաջարկի համար, կապում է ընդունված վճարման մտադրությունը գործարքի մեջ, ստորագրում եւ ներկայացնում է: JSON ռեժիմը վերադարձնում է գործարքի хэշը, ստորագրված գործարքը եւ ընդունված առաջարկը միասին:

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

Մի օգտագործեք `--no-wait` այս բաղադրատոմսում: Հրամանը սպասում է հաստատմանը, նախքան հաջողությամբ գրելը ստուգման համար.

### 3. Սպասեք վերջնական խողովակաշարի վիճակը: {#_3-wait-for-terminal-pipeline-state}

Օգտագործեք մուտքագրված կարգավիճակի օգնականը, այլ ոչ թե հաջողության եզրակացությունը HTTP ընդունումից կամ հերթի ընդունումից: With `--wait`, անվտանգ երթեւեկման շրջանակը ավտոմատ կերպով ընտրվում է, եւ նախանշյալ նպատակն է կիրառվում վերջնականություն.

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

`Rejected` եւ `Expired` թերմինալ ձախողումներ են, ոչ թե վերականգնվող հաջողության դեպքեր: Գրիր դրանց պատճառը գործարքի փոփոխությունից կամ վերակառուցումից առաջ:

### 4. Կարդացեք պահված գործարքը: {#_4-read-the-stored-transaction}

Pipeline- ի վիճակը պատասխանում է, թե արդյոք մշակումը ավարտված է: Գործարքի հարցումը ստուգում է, որ ընդունված գործարքը պահպանվում է նույն շիշի տակ:

```bash
iroha --config ./taira.client.toml \
  --machine \
  ledger transaction get --hash "$TAIRA_TX_HASH" \
  > taira-transaction.json

jq . taira-transaction.json
```

Հետազոտողը երկրորդ, միայն ընթերցվող դիտարկման մակերեսն է: Այն կարող է կարճ ժամանակ անց մնալ խողովակաշարի վերջնականությունից:

```bash
curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq '{hash, block, status, authority, executable}'
```

Պետության փոփոխման հրահանգի համար ավարտեք մուտացված օբյեկտի հարցմամբ: [Metadata](./metadata.md), [Fungible assets](./fungible-assets.md) եւ [NFTs](./nfts.md) բաղադրատոմսերը ներառում են այն հետ-պետության ընթերցումները.

## Փորձարկել {#verify}

Ստուգեք, որ բոլոր երեք արձանագրությունները համաձայն են նույն շաշի վրա եւ որ Explorer- ը այլեւս չի հայտնում սպասվող վիճակի մասին.

```bash
test "$(jq -r '.hash' taira-submission.json)" = "$TAIRA_TX_HASH"

curl -fsS -H 'Accept: application/json' \
  "https://taira.sora.org/v1/explorer/transactions/$TAIRA_TX_HASH" \
  | jq -e --arg hash "$TAIRA_TX_HASH" \
    '.hash == $hash and .status == "Committed"'
```

Պահպանեք ներկայացված փաստաթուղթը եւ վերջնական կարգավիճակը որպես փորձարկման ապացույց: Նրանք պարունակում են հանրային գործարքի նյութ, այլ ոչ թե ստորագրության բանալին:

## Խնդիրների լուծում {#troubleshooting}

- HTTP `202` կամ հերթի կարգավիճակը միայն ընդունելություն է ապացուցում: Շարունակեք քվեարկությունը տիպված կարգավիճակի համար մինչեւ կիրառված, մերժված, ժամկետը լրացած կամ սահմանված ժամանակահատվածը:
- Եթե ուղարկման ժամանակահատվածը ավարտվում է hash- ը վերադարձնելուց հետո, հարցրեք այն hash- ը նախքան մեկ այլ գործարք կառուցելը: Կույր վերակառուցումը ստեղծում է նոր մեջբերված եւ ստորագրված օգտակար բեռ:
- Հաշվարկի առաջարկը կարող է մերժվել ստորագրելուց առաջ: Ստուգեք `--fee-payer authority`, `gas_asset_id`, մարմնի հավասարակշռությունը եւ ցանցային շղթան ID.
- `Rejected` սովորաբար նշում է հանձնարարականի վավերացումը, թույլտվությունները, վճարները կամ հնացած վիճակը: Այն պարտավորացված ապացույց է ձախողված կատարման եւ չպետք է վերակարգավորվի որպես փոխադրման կրկին փորձ:
- Explorer `404` Applied- ի անմիջապես հետո կարող է ինդեքսել ձգձգումը: Կրկին փորձեք ընթերցել; գործարքը կրկին չներկայացրեք:
- Եթե արտոնյալ հրահանգը աշխատում է ստեղծված տեղական ցանցում, բայց Taira մերժում է այն, ստացեք ճշգրիտ Taira թույլտվությունը կամ կառավարվող անվան տարածքի նշանակումը: Տեղական արդյունքը չի տալիս հանրային ցանցի իշխանություն:

## Աղբյուրը եւ դրա հետ կապված փաստաթղթերը {#source-and-related-docs}

- [Գործարքի ներկայացումը եւ վճարային կոտորայի իրականացումը հաստատված պարտավորության դեպքում](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha_cli/src/main_shared.rs)
- [Գործարքի հաստատման փորձարկումները փակված պարտավորության վրա](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/iroha/tests/tx_confirmation.rs)
- [Գործարքներ](/hy/blockchain/transactions.md)
- [CLI ուղեցույց](/hy/get-started/operate-iroha-via-cli.md)
- [Torii վերջնական կետեր](/hy/reference/torii-endpoints.md)
