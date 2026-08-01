---
translation_locale: hy
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Դոմեյններ {#domains}

Դոմեյնները անվանում են `World` տվյալների մոդելում գրանցված անունային տարածքներ: Ներկայիս Iroha 3 տվյալների մডেলում դոմեյնը որակավորվում է իր հիմնական տվյալների տարածքով, այնպես որ քանոնիկ նույնականացողը հետեւյալն է՝

```text
domain.dataspace
```

Օրինակ, `payments.universal` անվանում է `payments` տիրույթը `universal` տվյալների տարածքում:

## Կազմակերպություն {#structure}

Գրանցված `Domain` պարունակում է:

- `id`: տվյալների տարածքի համար հավասար `DomainId`:
- `logo`: տիրույթի լոգոյի համար նախընտրական `SoraFS` URI
- `metadata`: առանցքային արժեքի կամայական մետադատա
- `owned_by`: տիրույթի սեփականատերը, սովորաբար այն հաշիվը, որը գրանցել է այն:

Դոմենի իրականացման համար օգտագործվող բուտստրափի օգտակար լիցքավորումը `NewDomain` է: Այն կրում է `id`, ընտրանքային `logo` եւ նախնական `metadata`։ Վազման ժամանակը լրացնում է `owned_by` իշխանությունից: Սովորական հաճախորդները չեն ներկայացնում այս օգտակար լցքը անմիջապես:

## Գրանցում {#registration}

Սովորական տիրույթի ստեղծումը օգտագործում է հայտարարական alias տեղադրման հոսքը: Սա պահում է SNS վարձակալության պայմանագիրը, սեփականատերերի հնարավորությունները, փոխարժեքի պաշտպանությունը եւ տիրույթի շարքը մեկ ատոմային `EnsureAlias` գործարքում: `Register::Domain` մնում է գենեզիս / բուտստրափ մակերես, եւ `ledger domain` հրամանը չունի `register` ենթհրամանատարություն.

Ստեղծեք գաղտնի `AliasSetupPlanRequestV1` մտադրություն SDK կամ ինտերնետային ծառայության հետ, ապա ստիպեք CLI-ին այն պլանավորել կենդանի վիճակի դեմ եւ ներկայացրեք այդ հստակ ծրագիրը.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Նպատակը բացահայտում է `payments.universal`, դրա թվային տվյալների տարածքը, կանոնական I105 սեփականատերը, վարձակալության ձեռքբերման ժամկետը եւ ընթացիկ քաղաքականություն / վճարման առաջարկի պահապանը: Պլանավորման վերջ կետը `POST /v1/aliases/setup/plan` է; նրա վերադարձված պլանը շղթա, իշխանություն, պետություն եւ վերջնաժամկետ սահմանված է: Դոմեյնների հեռացումը դեռ օգտագործում է [`Unregister`](/hy/blockchain/instructions.md#un-register).

Դոմենի ստեղծումը կամ հեռացումը պահանջում է համապատասխան դոմենի կառավարման թույլտվությունը ակտիվ վավերացողի ներքո: Դոմենի մետադատները կարող են թարմացվել [`SetKeyValue` եւ `RemoveKeyValue`](/hy/blockchain/instructions.md#setkeyvalue-removekeyvalue), երբ իշխանությունն իրավունք ունի փոփոխել այդ դոմենը:

## Փորձեք այն Taira {#try-it-on-taira}

Ցուցադրել այն տիրույթները, որոնք ներկայումս տեսանելի են հանրային Taira փորձարկման ցանցում.

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Համացանցային գոտու կատալոգը քարտեզագրեք տվյալների տարածքի անանուններին.

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Օգտագործեք առաջին հրամանը, երբ հավելվածը պետք է ստուգի, թե արդյոք դոմեյն կա: Օգտագործիր գոտու կատալոգը, երբ դուք պետք է հաստատեք, թե արդյոք տվյալների տարածքը հանրային է, սահմանափակվում է կամ ուշանում է հիմնական գոտուից.

Դոմեյնային կարգավորումը վճարովի գրառում է: Նախքան փորձելը Taira, պահեք ջրհեղեղի օգնականը [Get Testnet XOR on Taira](/hy/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) որպես `taira_faucet_claim.py`, ֆինանսավորեք ստորագրողը հանրային ջրհաղթի միջոցով եւ միացրեք վճարային մետադատա.

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Կառուցեք յուրահատուկ դոմեյն անվան մտադրությունը կրկնվող թեստային ցանցի գործարկումների վրա եւ օգտագործեք Taira- ի ընթացիկ քաղաքականությունն ու վճարային ակտիվների կոտրման պահապանը: Մի՛ վերօգտագործեք տեղական ցանցի կամ Minamoto համար արտադրված պլանը:

## Բաժանորդակցություն այլ կազմակերպությունների հետ {#relationship-to-other-entities}

Դոմեյնները խմբագրում են օբյեկտներ եւ տրամադրում են անունների տարածություն դոմեյնային չափերով տվյալների համար: Աշու գույքի սահմանումները օգտագործում են դոմեյնի որակավորված նույնականացումներ, եւ հարցումները կարող են թվարկել դոմեյները կամ գտնել դոմեյինային չափով առարկաներ: Հաշվետքերն ինքնուրույն տիրույթ չունեն ներկայիս տվյալների մոդելում, բայց հաշիվները կարող են ունենալ տիրույթներ եւ պահել ակտիվներ, որոնց սահմանումները ապրում են տիրույթների ներքո:

Նայեք նաեւ.

- [Աշխարհ](/hy/blockchain/world.md)
- [Գործիքներ](/hy/blockchain/assets.md)
- [Մետադատա](/hy/blockchain/metadata.md)
- [Անունավորման կանոններ](/hy/reference/naming.md)
