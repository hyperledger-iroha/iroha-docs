---
translation_locale: hy
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: 5fb7abd4e152ece715a8337e8ef8e75330f634d2a1b26e0c5bd8308f1f3793a9
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Գործարկել Iroha 3 միջոցով CLI {#operate-iroha-3-via-cli}

`iroha` բինարը հրամանատարի գծի հաճախորդն է Iroha 3: Օգտագործեք այն, որպեսզի կատարեք հարցում գլխավոր գրքի վիճակը, ուղարկեք գործարքներ եւ ստուգեք օպերատորների վերջնական կետերը:

## 1. Նախապայմաններ {#_1-prerequisites}

Սկսեք տեղական ցանց:

- [Ծրագիր Iroha 3](./launch-iroha.md)

Ստորեւ բերված օրինակները ենթադրում են [Lunch Iroha 3](./launch-iroha.md)-ում ստեղծված տեղական ցանցից առաջացած հաճախորդի կազմավորումը.

```bash
./localnet/client.toml
```

## 2. Հիմնական CLI կարգավորումը {#_2-basic-cli-setup}

Ցույց տվեք լավագույն մակարդակի օգնությունը.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --help
```

CLI կազմակերպվում է հետեւյալ բարձր մակարդակի հրամանատարական խմբերի մեջ.

- `account`՝ հաշվի ընթերցումների և փոփոխությունների համար
- `explorer`՝ ընդհանուր զտիչներով և էջավորմամբ բլոկների դիտարկիչի հոսքերի համար
- `tx`՝ գործարքի վիճակի և գործարքների օգնականների համար
- `ledger` հաշվապահական գրասենյակի համար
- `trigger`՝ գործարկիչների ընթերցման, գրառման և կատարման համար
- `ops` օպերատորի ախտորոշման համար
- `app` հավելվածի API օգնականների համար
- `contract`՝ պայմանագրի կանչերի, դիտումների և տեղային վրիպազերծման համար․ տեղակայեք `kagami contract deploy` կամ `musubi deploy`-ով
- `tools` ախտորոշման եւ զարգացման համար նախատեսված ծառայություններ
- `dataspace`՝ տվյալների տարածքի սահմանումը պլանավորելու, կիրառելու և ուսումնասիրելու համար
- `taira`՝ Taira ախտորոշման և հաշվի սկզբնական պատրաստման համար
- `offline`՝ անցանց կոդավորիչների, հաշվետվությունների և ախտորոշման համար
- `soracloud`՝ Soracloud հավելվածային հարթակի օգնականների համար
- `sccp`՝ SORA Cross-Chain Protocol ընթերցումների, փոխանցումների և ապացույցների համար

Գործարք ուղարկող յուրաքանչյուր հրաման պահանջում է բացահայտ վճարող, օրինակ՝ `--fee-payer authority`․ CLI-ն ստորագրելուց առաջ հաշվարկում և ցույց է տալիս ճշգրիտ վճարը։

Օգտագործեք `--output-format text` մարդու համար ընթերցելի օպերատորի արտադրանքի եւ `--machine` խիստ ավտոմատացման ռեժիմի համար:

## 3. Փորձեք հանրային փորձարկման ցանցը Taira {#_3-try-the-public-taira-testnet}

Դուք կարող եք փորձել կարդալ միայն Taira ստուգումները նախքան տեղական հանգույցային կապ գործարկելը կամ ստորագրող ստեղծելը: Այս հրամանները օգտագործում են հանրային Torii JSON երթուղիներ եւ չեն ծախսում testnet XOR:

Ստուգեք Taira վիճակը.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

Թվարկեք `universal` տվյալների տարածքի հանրային տիրույթները՝

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=10' \
  | jq -r '.items[].id'
```

Նշեք ակտիվների որոշ սահմանումներ եւ դրանց ներկայիս մատակարարումը.

```bash
curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Եթե դուք ունեք ընթացիկ `iroha` երկկողմ, գործարկեք Taira ախտորոշման օգնականը:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

`taira.client.toml` ստեղծեք միայն այն ժամանակ, երբ պատրաստ եք փորձարկել ստորագրված հրամաններ։ Կարգավորման, փորձնական միջոցների ստացման և սկզբնական աշխատունակության փորձարկման հոսքի համար տես [Միանալ SORA Nexus տվյալների տարածքներին](/hy/get-started/sora-nexus-dataspaces.md)։ Taira-ի դեմ գրառման հրամաններ մի՛ գործարկեք, մինչև հաշիվը ֆինանսավորվի ծառայության տրամադրած վճարային ակտիվով։

Ցանկացած վճարովի Taira CLI օրինակի համար ֆինանսավորեք ստորագրող հաշիվը [Ստանալ փորձնական XOR Taira-ում](/hy/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) բաժնի նախապես պատրաստվող միջոցների ստացման հոսքով, ապա ստուգեք մնացորդը․

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET="$(
  curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
    | jq -er '.asset_definition_id'
)"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Եթե փորձնական միջոցների տրամադրման երթուղին վերադարձնում է `502`, սպասեք և կրկին փորձեք։ Դա հանրային փորձնական ցանցի հասանելիության խնդիր է, ոչ թե հաշվի բանալիները կրկին ստեղծելու ազդանշան։

Մնացորդը տեսանելի դառնալուց հետո գրառումները ուղարկեք `--fee-payer authority`-ով։ CLI-ն ստորագրելուց առաջ հաշվարկում և ցույց է տալիս ճշգրիտ վճարը՝ Taira-ի վճարային ակտիվով․

```bash
iroha --config ./taira.client.toml \
  --fee-payer authority \
  tx ping --msg "hello from faucet-funded taira"
```

## 4. Ռեեստրի հիմնական հրամանները {#_4-basic-ledger-commands}

Ցուցադրել բոլոր տիրույթները.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list --all
```

Սովորական տիրույթի ստեղծումը օգտագործում է հայտարարական alias պլանավորիչը. `ledger domain` հրամանը չունի `register` ենթհրամանատար: Նախապատրաստեք գաղտնիքազերծված `AliasSetupPlanRequestV1` մտադրություն `docs.universal` ՝ ձեր SDK կամ ներբորդման ծառայության միջոցով, ապա պլանավորել եւ կիրառել այն:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Մտադրությունն ամրագրում է տվյալների տարածքի ID-ն, կանոնական սեփականատեր հաշիվը, վարձակալության ժամկետը և ընթացիկ գնառաջարկի ստուգման պայմանը։ Պլանավորողը ստուգում է գործող վիճակը և վերադարձնում ուղարկվելիք ճշգրիտ ատոմային `EnsureAlias` պլանը։ Ստուգման պայմանների արժեքները ձեռքով մի՛ պատճենեք մեկ այլ ցանցից։

Հեռացրեք մի պարզ պինգ գործարք.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --fee-payer authority tx ping --msg "hello from iroha"
```

Կարդացեք վերջին բլոկը կամ բաժանորդագրվեք բլոկի իրադարձություններին.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Օպերատորի հրամանատարներ {#_5-operator-commands}

Կոնսենսուսի օպերատորի հրամանները պահանջում են թույլատրացուցակում ներառված կատարման բանալի։ Այն մի՛ պահեք `client.toml`-ում և միայն սեփականատիրոջ համար հասանելի ֆայլը փոխանցեք բացարձակ ուղիով․

```bash
: "${OPERATOR_KEY_FILE:=$PWD/secrets/operator.key}"

cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi status
```

Ոչ լիազորված հերթի, մշակման շղթայի, ընտրությունների եւ երթեւեկության ախտորոշման համար.

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi diagnostics
```

Հաստատված կոնսենսուսի գոտիները և այս հանգույցի օրինակի վիճակը՝

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi lanes
```

Շղթայի վրա համաձայնության պարամետրեր.

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi params
```

## 6. Որտե՞ղ պետք է գնալ հաջորդը {#_6-where-to-go-next}

- [SDK դասընթացներ](/hy/guide/tutorials/)
- [Torii վերջնական կետեր](/hy/reference/torii-endpoints.md)
- [Աշխատել Iroha բինարների հետ](/hy/reference/binaries.md)
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha_cli/README.md)

Աղբյուրի պատճենից ամբողջական Markdown օգնության ակնթարթային պատկերը արտածելու համար գործարկեք․

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > iroha-cli-help.md
```
