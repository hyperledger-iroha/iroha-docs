---
translation_locale: hy
translation_source: /blockchain/domains.md
translation_source_hash: 26e8efe6c728d0f819b12e7d8257777d3d4ea272f42fabf8aec727467146500f
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Դոմեյններ {#domains}

Տիրույթները `World`-ում գրանցված անվանված անվանատարածքներ են։ Iroha 3-ի ընթացիկ տվյալների մոդելում տիրույթն ամբողջությամբ որոշվում է իր ծնող տվյալների տարածքով, ուստի կանոնական նույնացուցիչն է՝

```text
domain.dataspace
```

Օրինակ՝ `payments.universal`-ը նշանակում է `universal` տվյալների տարածքում գտնվող `payments` տիրույթը։

## Կազմակերպություն {#structure}

Գրանցված `Domain` պարունակում է:

- `id`՝ տվյալների տարածքով ամբողջությամբ որոշված `DomainId`
- `logo`: տիրույթի լոգոյի համար նախընտրական `SoraFS` URI
- `metadata`: առանցքային արժեքի կամայական մետադատա
- `owned_by`: տիրույթի սեփականատերը, սովորաբար այն հաշիվը, որը գրանցել է այն:

Դոմենի իրականացման համար օգտագործվող բուտստրափի օգտակար լիցքավորումը `NewDomain` է: Այն կրում է `id`, ընտրանքային `logo` եւ նախնական `metadata`։ Վազման ժամանակը լրացնում է `owned_by` լիազոր հաշվից: Սովորական հաճախորդները չեն ներկայացնում այս օգտակար լցքը անմիջապես:

## Գրանցում {#registration}

Սովորական տիրույթի ստեղծումը օգտագործում է հայտարարական alias տեղադրման հոսքը: Սա պահում է SNS վարձակալության պայմանագիրը, սեփականատերերի հնարավորությունները, փոխարժեքի պաշտպանությունը եւ տիրույթի շարքը մեկ ատոմային `EnsureAlias` գործարքում: `Register::Domain` մնում է գենեզիս / բուտստրափ մակերես, եւ `ledger domain` հրամանը չունի `register` ենթհրամանատարություն.

Ստեղծեք գաղտնի `AliasSetupPlanRequestV1` մտադրություն SDK կամ ինտերնետային ծառայության հետ, ապա ստիպեք CLI-ին այն պլանավորել կենդանի վիճակի դեմ եւ ներկայացրեք այդ հստակ ծրագիրը.

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml --fee-payer authority \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

Մտադրությունը նշում է `payments.universal`-ը, դրա թվային տվյալների տարածքը, կանոնական I105 սեփականատիրոջը, վարձակալության ձեռքբերման ժամկետը և ընթացիկ քաղաքականության/վճարի գնառաջարկի ստուգման պայմանը։ Պլանավորողի վերջնակետը `POST /v1/aliases/setup/plan` է․ վերադարձված պլանը կապված է շղթային, լիազորված սուբյեկտին, վիճակին և վերջնաժամկետին։ Տիրույթի հեռացման համար շարունակում է օգտագործվել [`Unregister`](/hy/blockchain/instructions.md#un-register)-ը։

Դոմենի ստեղծումը կամ հեռացումը պահանջում է համապատասխան դոմենի կառավարման թույլտվությունը ակտիվ վավերացողի ներքո: Դոմենի մետադատները կարող են թարմացվել [`SetKeyValue` եւ `RemoveKeyValue`](/hy/blockchain/instructions.md#setkeyvalue-removekeyvalue), երբ լիազոր հաշիվն իրավունք ունի փոփոխել այդ դոմենը:

## Փորձեք այն Taira {#try-it-on-taira}

Ցուցադրել այն տիրույթները, որոնք ներկայումս տեսանելի են հանրային Taira փորձարկման ցանցում.

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Հանրային գոտիների կատալոգը համապատասխանեցրեք տվյալների տարածքների այլանուններին՝

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Առաջին հրամանն օգտագործեք, երբ հավելվածը պետք է ստուգի տիրույթի գոյությունը։ Գոտիների կատալոգով ուսումնասիրեք տվյալների տարածքին կապված գոտիները, ներառյալ յուրաքանչյուրի հանրային կամ սահմանափակ տեսանելիությունը և հիմնական գոտու նկատմամբ համաժամացման վիճակը։

Տիրույթի կարգավորումը վճարովի գրառման գործողություն է։ Taira-ում այն փորձելուց առաջ ֆինանսավորեք ստորագրող հաշիվը [Ստանալ փորձնական XOR Taira-ում](/hy/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) բաժնի նախապես պատրաստվող միջոցների ստացման հոսքով, ապա կիրառեք պլանը՝ բացահայտ նշելով վճարողին։ CLI-ն ստորագրելուց առաջ հաշվարկում և ցույց է տալիս ճշգրիտ վճարը՝

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Կառուցեք յուրահատուկ դոմեյն անվան մտադրությունը կրկնվող թեստային ցանցի գործարկումների վրա եւ օգտագործեք Taira- ի ընթացիկ քաղաքականությունն ու վճարային ակտիվների կոտրման պահապանը: Մի՛ վերօգտագործեք տեղական ցանցի կամ Minamoto համար արտադրված պլանը:

## Բաժանորդակցություն այլ կազմակերպությունների հետ {#relationship-to-other-entities}

Դոմեյնները խմբավորում են գլխավոր գրքի օբյեկտներ եւ տրամադրում են անունների տարածություն դոմեյնային տվյալների համար: Asset սահմանումները օգտագործում են դոմեյնի կողմից հավասարեցված նույնականացումներ, եւ հարցումները կարող են թվարկել տիրույթները կամ գտնել Հաշվետքերն ինքնուրույն դոմեյնազերծ են ներկայիս տվյալների մոդելում, բայց հաշիվները կարող են տիրույթներ ունենալ եւ պահել ակտիվներ, որոնց սահմանումները ապրում են տիրույթի ներքո:

Նայեք նաեւ.

- [Աշխարհ](/hy/blockchain/world.md)
- [Ակտիվներ](/hy/blockchain/assets.md)
- [Մետադատա](/hy/blockchain/metadata.md)
- [Անունավորման կանոններ](/hy/reference/naming.md)
