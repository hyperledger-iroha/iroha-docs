---
translation_locale: hy
translation_source: /get-started/operate-iroha-via-cli.md
translation_source_hash: c070c86b715b36079a7b6a47de2e31144187d7ebc6309f294a346be61a372660
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

- `account` հաշիվային ուղղված կարճատեւների համար
- `tx` գործարքային մակարդակի օգնականների համար
- `ledger` հաշվապահական գրասենյակի համար
- `ops` օպերատորի ախտորոշման համար
- `app` հավելվածի API օգնականների համար
- `contract` պայմանագրային տեղակայման եւ հրավիրումների համար
- `tools` ախտորոշման եւ զարգացման համար նախատեսված ծառայություններ
- `taira`՝ Taira եւ Nexus ուղղված աշխատանքային հոսքերի համար

`ledger` խումբը պարունակում է նաեւ դոմեյնային հատուկ գործարքների օգնականներ, ինչպիսիք են `ledger transaction`.

Օգտագործեք `--output-format text` մարդու համար ընթերցելի օպերատորի արտադրանքի եւ `--machine` խիստ ավտոմատացման ռեժիմի համար:

## 3. Փորձեք հանրային փորձարկման ցանցը Taira {#_3-try-the-public-taira-testnet}

Դուք կարող եք փորձել կարդալ միայն Taira ստուգումները նախքան տեղական հանգույցային կապ գործարկելը կամ ստորագրող ստեղծելը: Այս հրամանները օգտագործում են հանրային Torii JSON երթուղիներ եւ չեն ծախսում testnet XOR:

Ստուգեք Taira վիճակը.

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
```

`universal` տվյալների տարածքում հանրային տիրույթները ցուցադրեք.

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

Ստեղծեք `taira.client.toml` միայն այն ժամանակ, երբ պատրաստ եք փորձարկել ստորագրված հրամանները: Նայեք [SORA Nexus Տվյալների տիրույթներին ](/hy/get-started/sora-nexus-dataspaces.md) ՝ կոնֆիգավորման, faucet եւ կանարի հոսքի համար: Մի գործադրեք գրելու հրամաններ Taira- ի դեմ, մինչեւ հաշիվը ֆինանսավորվի ջրահեղի վճարային ակտիվով.

Ցանկացած վճարովի Taira CLI օրինակ, պահեք faucet օգնականը [Ստանալ թեստային ցանցի XOR Taira-ում](/hy/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) որպես `taira_faucet_claim.py`, ապա նախ պահանջեք testnet XOR:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle | jq .
python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account "$TAIRA_ACCOUNT_ID"
```

Եթե faucet հանելուկը կամ պահանջի երթուղին վերադարձնում է `502`, սպասեք եւ կրկին փորձեք: Դա հանրային թեստնետի մատչելիության խնդիր է, այլ ոչ թե հաշիվի բանալիների վերականգնման ազդանշան:

Բալանսը տեսանելի դարձնելուց հետո, միացրեք վճարային ակտիվի մետադատները գրելու համար.

```bash
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  ledger transaction ping --msg "hello from faucet-funded taira"
```

## 4. Ռեեստրի հիմնական հրամանները {#_4-basic-ledger-commands}

Ցուցադրել բոլոր տիրույթները.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

Սովորական տիրույթի ստեղծումը օգտագործում է հայտարարական alias պլանավորիչը. `ledger domain` հրամանը չունի `register` ենթհրամանատար: Նախապատրաստեք գաղտնիքազերծված `AliasSetupPlanRequestV1` մտադրություն `docs.universal` ՝ ձեր SDK կամ ներբորդման ծառայության միջոցով, ապա պլանավորել եւ կիրառել այն:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup plan \
  --intent-file ./docs-domain.intent.json \
  --plan-file ./docs-domain.plan.json

cargo run --bin iroha -- --config ./localnet/client.toml \
  app alias setup apply --plan-file ./docs-domain.plan.json
```

Intent- ը փայլում է տվյալների տարածքը ID, կանոնիկ սեփականատերերի հաշիվը, վարձակալության ժամկետը եւ ընթացիկ կոտաժի պահպանումը: Պլանավորողը ստուգում է կենդանի վիճակը եւ վերադարձնում է հստակ ատոմային `EnsureAlias` ծրագիրը ներկայացնելու համար: Մի ձեռքով պատճենեք այլ ցանցից պահպանումի արժեքները.

Հեռացրեք մի պարզ պինգ գործարք.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger transaction ping --msg "hello from iroha"
```

Կարդացեք վերջին բլոկը կամ բաժանորդագրվեք բլոկի իրադարձություններին.

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

## 5. Օպերատորի հրամանատարներ {#_5-operator-commands}

Համաձայնության օպերատորի հրամանները պահանջում են թույլատրելի ցուցակում գտնվող վազման բանալին: Պահպանեք այն `client.toml` եւ բացարձակապես փոխանցեք միայն սեփականատիրոջ ֆայլը.

```bash
: "${OPERATOR_KEY_FILE:=./secrets/operator.key}"

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

Բարձրագույն եւ փակ քվորումի վկայականներ.

```bash
cargo run --bin iroha -- \
  --config ./localnet/client.toml \
  --operator-private-key-file "$OPERATOR_KEY_FILE" \
  --output-format text ops sumeragi qc
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
- [CLI README](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli/README.md)

Որպեսզի վերականգնել ամբողջ Markdown օգնության snapshot աղբյուրի ստուգման, գործարկել:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```
