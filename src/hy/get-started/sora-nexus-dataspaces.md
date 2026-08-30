---
translation_locale: hy
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Կառուցեք SORA 3-ի վրա: Taira եւ Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 ծրագրի ուղղված հանրային տեղակայման ուղին է կառուցվել Iroha 3 եւ SORA Nexus. Կառուցել եւ փորձել Taira նախ, ապա տեղափոխել նույն հաճախորդի ձեւը Minamoto միայն այն դեպքում, երբ դուք ունեք առանձին mainnet բանալիներ, իրական XOR վճարների եւ արտադրության հաստատման համար:

Այս դասընթացը ցույց է տալիս, թե ինչպես կարգավորել Iroha հաճախորդը հանրային SORA 3 ցանցերի համար.

- Taira փորձարկման ցանցը՝ `https://taira.sora.org`
- Minamoto գլխավոր ցանց՝ `https://minamoto.sora.org`

Օգտագործեք Taira ինտեգրման փորձարկումների, գազանի կողմից ֆինանսավորվող գրելու կանարիների եւ տեղակայման վերապատրաստումների համար: Օգտագործիր Minamoto միայն արտադրության պատրաստի հիմնական ցանցի գործունեության համար: Երկու ցանցերը վճարում են XOR:

- Taira օգտագործում է հանրային ջրհեղեղից ստուգման ցանցը XOR:
- Minamoto օգտագործվում է իրական XOR: Չկա Minamoto ջրհեղեղի։

## Շինարարների ճանապարհը {#builder-path}

|Քայլ |Taira Testnet |Minamoto Mainnet |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Սկսեք կարդալ ցանցի վիճակը |Հարցում `/status` առանց բանալիների |Հարցում `/status` առանց բանալիների |
|Ընտրեք տվյալների տարածք |Օգտագործեք հանրային `universal` , եթե ձեր հավելվածը չի պահանջում կառավարվող երթուղին |Օգտագործեք նույն տվյալների տարածքը միայն հիմնական ցանցի հաստատումից հետո: |
|Ստացեք վճարային ակտիվ:|Օգտագործեք հանրային Taira ջրհեղեղ |Ստացեք XOR ֆինանսավորվող Minamoto հաշիվից կամ հաստատված գանձարանային հոսքից |
|Թեստը գրում է |Օգտագործեք ջրհեղեղով ֆինանսավորվող փորձարկում XOR |Օգտագործել փորձարկման գործիքներ, գրում է ծախսել իրական XOR |
|Առաջնորդել |Կրկին փորձեք տրամաբանությունը, վերահսկողությունը եւ ստորագրողի կառավարումը |Օգտագործեք առանձին բանալիներ, ֆինանսավորումներ եւ ազատման վերահսկողություններ |

Գործնական հոսքը հետեւյալն է.

1. Կառուցել հաճախորդը Taira-ի դեմ եւ օգտագործել հանրային `universal` տվյալների տարածքը:
2. Ավելացրեք ստորագրող եւ ֆինանսավորեք այն Taira ջրհեղեղով:
3. Օգտագործեք ձեր հավելվածի տրամաբանությունը Taira - ի դեմ, մինչեւ ձանձրալի եւ դիտարկելի չլինեն սխալները:
4. Ստեղծեք առանձին Minamoto ստորագրող, ֆինանսավորել այն իրական XOR եւ տեղափոխել միայն նույն ապացուցված գործառույթները mainnet:

## Շարունակեք խոհանոցի գիրքը {#continue-with-the-cookbook}

Օգտագործեք այս ուղեցույցը ՝ ընտրելու ցանց, կոնֆիգուրացնել ստորագրող եւ ֆինանսավորել վճարները: Այնուհետեւ շարունակեք այն բաղադրատոմսը, որը համապատասխանում է ձեր ծրագրային վարքագիծին, որը ցանկանում եք ստեղծել.

|Նպատակ |Պրակտիկա |
| --- | --- |
|Ստուգեք Taira եւ կարգավորեք հաճախորդը | [Կապակցեք Taira](/hy/cookbook/connect-to-taira.md) |
|Առաջին գրառումը ուղարկեք եւ ստուգեք արդյունքը:| [Գործարքների ներկայացում եւ ստուգում](/hy/cookbook/submit-and-verify-transactions.md) |
|Գրանցում, մինետ եւ փոխադրման արժեք | [Հաշվարկային ակտիվներ](/hy/cookbook/fungible-assets.md) |
|Կարդալ ֆիլտրված դիմման վիճակը | [Հարցազրույց Ledger State](/hy/cookbook/query-ledger-state.md) |
|Պատասխանել պարտավորվող փոփոխություններին | [Հոսքային իրադարձություններ](/hy/cookbook/stream-events.md) |

Խոհանոցային գիրքը պահում է յուրաքանչյուր աշխատանքային հոսքի կենտրոնացած եւ կապեր այստեղ, երբ այն կարիք ունի Taira ֆինանսավորման կամ SORA Nexus ցանցի համատեքստ:

## 1. Հասկացեք, թե ինչ եք նախապատրաստում {#_1-understand-what-you-are-setting-up}

SORA Nexus-ում տվյալների տարածքը հանդիսանում է ցանցային գոտու եւ երթեւեկման կատալոգի մի մասը: Հաճախորդը չի ստեղծում նոր հանրային տվյալների տարածք ՝ պարզապես փոխելով `client.toml`: Հաճախողի կարգավորումը կատարում է երկու բան:

1. հյուրին ուղղում է աջ Torii վերջային կետ
2. ընտրում է տիրույթի եւ տվյալների տարածքի երթեւեկության համատեքստը իր կանոնիկ հաշիվի համար

`AccountId` միշտ կանոնական է եւ առանց տիրույթների: `[account].domain` արժեքը `client.toml` մատակարարում է երթուղային եւ alias համատեքստ. այն չի դառնում հաշիվի ինքնության մի մասը: Բազմաթիվ դիմումների համար սկսեք հանրային `universal` Տվյալների տարածք. Դոմենի համատեքստը օգտագործում է `domain.dataspace` ձեւ, օրինակ՝

```text
wonderland.universal
```

Եթե ձեզ անհրաժեշտ է նոր կազմակերպական տվյալների տարածք, նախապատրաստեք կատալոգ եւ երթեւեկման առաջարկ, այլ ոչ թե փորձեք գրանցել այն սովորական հաճախորդի հաշիվից: Տես [Նոր տվյալների տարածքի տրամադրում](#_8-provision-a-new-dataspace) ստորեւ:

## 2. Ստուգեք հանրային Torii վերջնական կետը {#_2-check-the-public-torii-endpoint}

Ստուգեք, որ թիրախային վերջնական կետը կենդանի է նախքան ստորագրողի կազմաձեւումը:

Taira համար՝

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto համար՝

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Ստուգեք տվյալների տարածքի եւ երթուղի տեսանկյունը, որը բաց է թողնում հանգույցը.

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Օգտագործեք նույն հրամանը `https://minamoto.sora.org/status` հիմնական ցանցի համար:

## Taira MCP գործակալների համար {#taira-mcp-for-agents}

Taira նաեւ բացահայտում է Torii- ի բնիկ մոդելի համատեքստային պրոտոկոլ (MCP) կամուրջը գործակալների վազման ժամանակների համար: Օգտագործեք այն, երբ գործակալին անհրաժեշտ է կենդանի թեստնետի ընթերցումներ, սցենտային ախտորոշում կամ սերտորեն վերանայված գրքի փորձարկումներ ՝ առանց նախ կառուցելու հարմարվողական Torii հաճախորդ.

|Կարգավորումը|Գինը |
| --- | --- |
|MCP վերջնական կետը |`https://taira.sora.org/v1/mcp` |
|ցանցի արմատը |`https://taira.sora.org` |
|Նախատեսված օգտագործումը |Taira թեստային ցանցի ընթերցումներ եւ գազանի կողմից ֆինանսավորվող գրելու փորձեր |
|Արտադրանքի համարժեք |Մի ուղղեք այս գրառումը Minamoto հասցեին, եթե հիմնական ցանցի MCP վերջային կետը եւ արտանետման վերահսկողությունները բացարձակապես հաստատված չեն: |

Ստուգեք կամուրջի մետադատները նախքան ստորագրման նյութը ավելացնելը.

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

Կոնֆigurել URL որպես օգտագործողի տեղական MCP սերվեր գործակալի վազման ժամանակ. Մի պարտավորեք գործակալի MCP կոնֆիգը, API տոքերները, փոխանցված հեղինակային գլխավորությունները, `authority`, կամ `private_key` արժեքները այս փաստաթղթերի repo կամ ծրագրի repo:

Գործակալ prompt կանոններ, որոնք աշխատում են լավ Taira:

- Բացահայտեք MCP սերվերի գործիքները, նախքան նրանց զանգելը; կրկին բացահայտեք, եթե սերվերը հաղորդում է `listChanged`:
- Նախընտրում են կուրացված `iroha.` գործիքները 'փոխարինված `torii.` աշխատանքային գործիքներին:
- Սկսեք կարդալ միայն. ստուգեք վիճակը, հաշիվները, ակտիվները, կեղծանունները, բլոկերը, կառավարման վիճակը եւ գործարքի կարգավիճակը նախքան գրելու առաջարկը:
- Պահանջել է հստակ մարդկային հրահանգներ կենդանի թեստային ցանցի մուտացիաներից առաջ: Նախապես ստորագրված գործարքի փաթեթների համար օգտագործեք `iroha.transactions.submit_and_wait`, որպեսզի գործակալը սպասի արդյունքին, այլ ոչ թե միայն ներկայացնի:
- Գործակալի արձագանքում ամփոփեք գործարքի շիշերը, վերջնական վիճակը եւ սերվերի հավաստագրման սխալները:

### Գործակալների հետ մշակման աշխատանքային ընթացքը {#development-workflow-with-agents}

Օգտագործեք գործակալներ որպես մշակման օգնական Iroha հաճախորդների, փոխանցումների ստեղծողների, ախտորոշիչ սցենարների եւ թեստնետի վազքի գրքերի համար: Պահպանեք գործակալի լիազորությունները սահմանափակ. Այն կարող է ստուգել կոդը, կարդալ Taira վիճակը, առաջարկել փոփոխություններ եւ իրականացնել տեղական փորձարկումներ, բայց այն չպետք է փոխի կենդանի ցանցը, քանի դեռ մարդը հաստատում է ճշգրիտ գործողությունը:

Գործնական աշխատանքային ընթացքը հետեւյալն է.

1. Խնդրեք գործակալին ստուգել համապատասխան փաստաթղթերը, SDK կոդը, CLI հրամանը կամ MCP գործիքային սխեման, նախքան կոդը գրելը:
2. Խնդրեք գործակալին նախ գրել հաճախորդի ամենափոքր ուղին. վիճակի ստուգում, հաշիվների որոնում, alias լուծումը կամ հավասարակշռության որոնում:
3. Գործարքի կառուցման կոդը ավելացնել միայն այն բանից հետո, երբ միայն ընթերցված զանգերը աշխատում են Taira դեմ:
4. Պահպանեք կենդանի ցանցի փորձարկումների ընտրությունը, օրինակ՝ `TAIRA_LIVE=1` ետեւում, այնպես որ սովորական միավորային փորձարկման ընթացքը երբեք չի ծախսում փորձարկման ցանցի միջոցներ կամ կախված է ցանցի առկայությունից:
5. Պահանջում է գործակալին զեկուցել ցանցի արմատը, շղթան, իշխանության հաշիվը, հրահանգների ամփոփումը, վճարային ակտիվը եւ սպասվող վիճակի փոփոխությունը նախքան ցանկացած գործարք ներկայացնելուց:
6. Վերանայեք ստեղծված կոդը գաղտնի կառավարման, կրկին փորձելու վարքագծի, idempotency- ի եւ մերժման կառավարման համար ՝ այն առաջադրելուց առաջ CI կամ հիմնական ցանցի աշխատանքային հոսքերի վրա:

Օգտակար միայն ընթերցվող MCP գործիքները մշակման համար ներառում են հաշիվների ակտիվների որոնում, alias լուծումը, բլոկային որոնում, գործարքների որոնում, փոխանցումների ցուցակներ եւ խողովակաշարի կարգավիճակի ստուգումներ: Օգտագործեք դրանք վստահություն ստեղծելու համար նախքան ցանկացած ստորագրված օգնական ծանրաբեռնվածություն ուղարկելը.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Գործարքի աշխատանքային հոսքը գործակալների միջոցով {#transaction-workflow-through-agents}

MCP կամուրջը կարող է ներկայացնել ստորագրված Iroha գործարք, բայց այն չի վերացնում գործարքի սովորական պահանջները: Գործարքի համար դեռ պետք է ճիշտ իշխանություն, թույլտվություններ, վճարային ֆինանսավորում, շղթա ID, մեթադատա եւ ստորագրություն:

Հատուկ Iroha գործարքների համար նախ ստեղծեք եւ ստորագրեք գործարքի փաթեթը SDK կամ CLI անունով, այնուհետեւ ներկայացրեք գործակալին միայն կանոնական ստորագրված գործարքի բայտներ, որոնք կոդավորված են `body_base64`։ Գործակալը կարող է փաթեթը ներկայացնել `iroha.transactions.submit_and_wait` կամ `iroha.transactions.submit` եւ հարցազրույց՝ `iroha.transactions.wait` անունով:

Մի տեղադրեք մասնավոր բանալիները գործակալի հրահանգի մեջ: Եթե գործակալը պետք է կառուցի գործարք, ուղղեք այն տեղական կոդին, որը բեռնում է գաղտնիքները օգտագործողի վազման ժամանակ Շրջակա միջավայրի, ստեղնաշարի, սարքավորումների ստորագրող կամ անտեսված testnet կոնֆիգ ֆայլը. գործակալը երբեք չպետք է գրի հիմնական նյութը Markdown- ում, տեղադրումներում, օրագրերում կամ հանձնարարություններում։

Առեւտրի ներկայացնելուց առաջ գործակալը պետք է պատրաստի կարճ գործարքի ծրագիր.

- `network`: Taira փորձարկման ցանցի արմատը եւ շղթան ID
- `authority`: հաշիվ, որը ստորագրում է եւ վճարում է վճարներ
- `instructions`: գրանցում, մինետ, այրում, փոխանցում, մետադատա, թույլտվություն կամ պայմանագրի զանգի ամփոփում:
- `fee asset`: այն ակտիվը, որը կվճարվի Taira:
- `preflight reads`: հաշիվ, ակտիվների հավասարակշռություն, թույլտվություններ, անանուններ կամ արդեն կատարված բլոկային ստուգումներ
- `expected result`: այն վիճակը, որը պետք է տեսանելի լինի հաստատումից հետո
- `idempotency`: ինչ է տեղի ունենում, եթե նույն խնդրանքը կրկին փորձարկվի

Ներկայացումից հետո գործակալին ստիպեք սպասել վերջնական կարգավիճակի, ապա ստուգեք վիճակի փոփոխությունը ընթերցման հարցերով: Օգտակար ավարտի զեկույցը ներառում է.

- գործարքային շիշ
- վերջնական կարգավիճակը, ինչպիսիք են `Committed`, `Applied`, `Rejected` կամ `Expired`:
- բլոկի կամ հետազոտողի մանրամասները, երբ դրանք մատչելի են
- ստուգման ընթերցման արդյունքները
- մերժման հաղորդագրությունը եւ արդյոք ձախողումը նման է թույլտվությունների, վճարների, հավաստիացման, հնացած վիճակի կամ վերջնական կետերի մատչելիության

Օրինակ պահված արագություն.

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Եթե ստորագրված փաթեթը արդեն պատրաստված է.

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP-ը վերաբերվում է որպես հանրային փորձարկման ցանցի վերահսկողության մակերես: Taira բանալիները, փորձարկման համակարգը XOR, ջրհեղեղեղի հաշիվները եւ կանարի ստորագրիչները մեկ անգամ օգտագործելի են եւ պետք է առանձին մնան Minamoto բանալիցներից եւ արտադրական ազատման աշխատանքային հոսքերից։

## Խաղալի օրինակներ, որոնք կարող եք փորձել հիմա {#toy-examples-you-can-try-now}

Այս օրինակները միայն ընթերցելի են, եթե նշված չլինեն: Նրանք աշխատում են նախքան բանալիները ստեղծելը եւ անվտանգ են երկու հանրային ցանցերի դեմ գործելու համար.

Համեմատեք Taira փորձարկման ցանցի եւ Minamoto գլխավոր ցանցի առողջությունը.

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Ցուցադրել Taira հրապարակային տվյալների տարածքի ուղիները.

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Նույն հրամանը գործարկեք Minamoto-ի դեմ, երբ ձեզ անհրաժեշտ է հիմնական ցանցային տեսքը.

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Ստեղծեք փոքրիկ Node.js վիճակային հետաքննություն վահանակի, բոտի կամ տեղակայման ստուգման համար.

```bash
node --input-type=module <<'EOF'
const roots = {
  taira: 'https://taira.sora.org',
  minamoto: 'https://minamoto.sora.org',
};

for (const [name, root] of Object.entries(roots)) {
  const status = await fetch(`${root}/status`, {
    headers: { Accept: 'application/json' },
  }).then((res) => res.json());
  const publicSpaces = status.teu_lane_commit
    .filter((lane) => lane.visibility === 'public')
    .map((lane) => `${lane.dataspace_alias}:${lane.block_height}`)
    .join(', ');

  console.log(
    `${name}: ${status.blocks} blocks, ${status.queue_size} queued, public spaces ${publicSpaces}`,
  );
}
EOF
```

Առաջին գրելու կողմի խաղալիքը պետք է լինի Taira ջրհեղեղի պնդում: Այն օգտագործում է փորձարկման ցանց XOR եւ երբեք չպետք է ուղղվի Minamoto հասցեին.

## 3. Ստեղծեք Taira հաճախորդի Config {#_3-create-a-taira-client-config}

Ստեղծեք կոճակային զույգ, եթե դուք արդեն չունեք մեկը:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

Ստեղծեք `taira.client.toml`:

```toml
chain = "fc56984b-2be7-431d-840e-21514d1883f0"
torii_url = "https://taira.sora.org/"

[account]
domain = "wonderland.universal"
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Բարձրագույն մակարդակը `chain` ճշգրիտ է Taira գործարքային շղթան ID: `[account].profile = "taira"` կարգավորումը ինքնուրույն ընտրում է Taira I105 շղթայի խտրականությունը: ID շղթան չի ընտրում հաշիվի պրոֆիլը:

Կատարեք միայն ընթերցման ստուգում.

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Նախքան գրելու թեստերը կատարեք հանրային Taira ախտորոշումը.

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Taira հաշիվը ֆինանսավորեք ջրհեղեղի միջոցով, նախքան վճարովի գրառումները գործարկելը: Ջրհեղքի անմիջական հոսքը գտնվում է [Get Testnet XOR-ում Taira](#_4-get-testnet-xor-on-taira).

Նշվում է, որ Taira կանարին նախընտրական կերպով պետք է փորձարկել գազի ծուխը.

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

Canary- ն ներկայացնում է ստորագրված ping, սպասում է հաստատմանը եւ գրում է runtime signer config- ը, երբ տրամադրվում է `--write-config`: Taira հանրային փորձարկման ցանց է, այնպես որ հերթի հագեցվածությունը կարող է թույլ տալ, որ ստորագրված պինգը ձախողվի նույնիսկ այն ժամանակ, երբ ինքնուրույն faucet- ը աշխատում է: Եթե `taira doctor`- ն հայտնում է հագեցած հերթի մասին կամ կանարին վերադարձնում է `PRTRY:NEXUS_FEE_ADMISSION_REJECTED`, սպասեք եւ կրկին փորձեք, նախքան այն դիտարկելը որպես հաճախորդի կազմավորման սխալ.

Առանց վերահսկողության ծխի փորձարկումների համար կաթիլը փակեք սահմանված կրկնակի փորձարկման փուլում.

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml taira write-canary \
    --public-root https://taira.sora.org \
    --write-config ./taira.canary.client.toml \
    --json && ok=true && break

  sleep 60
done

test "$ok" = true
```

Դադարեցրեք կրկնակի փորձարկումը, եթե `iroha taira doctor` ցույց է տալիս ծանր ձախողումներ: Սյունիքի հագեցածությունը եւ վճարների ընդունման մերժումները անցումային հանրային թեստային ցանցի պայմաններ են. DNS, TLS կամ `status = "fail"` ախտորոշումները չեն:

## Ստեղծեք SORA Nexus հաշիվ ID {#generate-a-sora-nexus-account-id}

SORA Nexus հաշիվը ID հանդիսանում է հաշվառման հանրային բանալից եւ թիրախային ցանցի նախադրյալից ստացված քանոնիկ I105 հասցեն: Այն չի հանդիսանում հաճախորդի `[account].domain` արժեքը TOML: Նույն հանրային բանալիները կոդավորվում են տարբեր IDs հասցեներում Taira եւ Minamoto, իսկ արտադրության օգտատերերը պետք է ստեղծեն առանձին բանալիների զույգ Minamoto համար:

Ստեղծել կամ բեռնել Ed25519 կոճակային զույգը, որը վերահսկում է հաշիվը:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

Հասարակական բանալին Taira հաշիվի ID մեջ փոխակերպել

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Փոխակերպել Minamoto հանրային բանալին' հիմնական ցանցի նախադրյալով.

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Օգտագործեք ստացված հաշիվը ID այն դեպքում, երբ Nexus API կամ CLI հրամանը պահանջում է կանոնիկ հաշիվ ID, օրինակ՝ Taira ջրհեղեղի `account_id`, հավասարակշռման հարցումները, խիստ հաշիվների դաշտերը կամ alias- ի պարտավորությունները: Պահպանեք համապատասխան գաղտնի բանալին ձեր հաճախորդի կարգավորման մեջ եւ ընտրեք նույն հանրային ցանցը `[account].profile = "taira"` կամ `[account].profile = "minamoto"`:

ID ստեղծելը ինքնուրույն չի ստեղծում ֆինանսավորվող շղթայի վրա հաշիվ: Taira -ի վրա ջրհեղեղեղը կարող է ստեղծել եւ ֆինանսավորել թեստային ցանցի գրառումների համար հաշիվը: Minamoto -ին, օգտագործեք հաստատված հիմնական ցանցի ներմուծում կամ գանձարանի հոսք:

### Գլխավորների պահեստավորում եւ կրկնօրինակում {#key-storage-and-backup}

Հաշիվը ID եւ հանրային բանալին կարող են կիսվել: Համատեղելի մասնավոր բանալին, գաղտնաբառը, սերմերը եւ վերականգնման նյութը պետք է պահվեն որպես գաղտնի:

Օգտագործեք SORA Nexus հաշիվների համար հետեւյալ վարքագիծը.

- Գաղտնի բանալիները պահեք կոդավորված գաղտնաբառերի կառավարիչում, սարքավորումների աջակցությամբ հիմնախնդիրների խանութում կամ նվիրված ստորագրման ծառայության մեջ: Մի պարտավորեցրեք բանալիները աղբյուրի վերահսկողությանը կամ թողեք արտադրական բանալիներ շելի պատմության մեջ, օրենսգրքում, զրույցում, տոմսերում կամ չկոդավորված կրկնօրինակումներ.
- Օգտագործեք յուրահատուկ բարձր էնդրոպիկ գաղտնաբառ յուրաքանչյուր պահեստի կամ արտադրության ստորագրողի համար: Պահպանեք գաղտնաբերերը գաղտնաբերի կառավարիչում կամ բաժանված պահեստավորման գործընթացում, այլ ոչ թե նույն ֆայլում կամ կրկնօրինակի փաթեթում, ինչպես կոդավորված մասնավոր բանալին:
- Պահպանեք Taira եւ Minamoto բանալիները առանձին: Բարեւեք Taira բանալիներին որպես մեկ անգամ օգտագործվող փորձարկման ցանցի նյութ, իսկ Minamoto բանալիններին՝ որպես արտադրական միջոցների մարմին:
- Պահպանեք մասնավոր բանալին, հանրային բանալը, հաշիվը ID, հաշիվի պրոֆիլը եւ ցանկացած հաշիվի վերականգնման կամ պահեստային գրառում, որոնք անհրաժեշտ են ստորագրողի վերականգնելու համար: Բացառական բանալին առանց ցանցի համատեքստի հեշտ է չարաշահմանել վերականգնման ընթացքում:
- Պահպանեք առնվազն մեկ կոդավորված օֆլայն պահեստ եւ մեկ աշխարհագրական առանձին կոդավորված պահեստ արտադրության ստորագրողների համար: Փորձեք վերականգնումը միայն ընթերցման փոքր գործողությամբ ՝ նախքան պատուհանի վրա կախված լինելը:
- Շրջեք կամ փոխարինեք ստորագրողին, եթե գաղտնի բանալին, գաղտնաբառը, պահեստային մեդիան կամ ստորագրող հյուրընկալողը կարող են հայտնվել:

Ավելի մանրամասն տեղեկություններ ստանալու համար դիտեք [Սպառման կրիպտոգրաֆիկ բանալիները](/hy/guide/security/storing-cryptographic-keys.md) եւ [Խաղանձի անվտանգությունը](/hy/guide/security/password-security.md).

## 4. Ստացեք Testnet- ը XOR ՝ Taira -ին: {#_4-get-testnet-xor-on-taira}

Օգտագործեք հանրային ջրհեղեղի անմիջապես:

1. Ստեղծել կամ բեռնել ստորագրող եւ հաշվարկել դրա կանոնիկ Taira հաշիվը ID:
2. Վերցրեք ներկա ջրհեղեղի հանելուկը:
3. Բացահայտեք հանելուկը, եթե `difficulty_bits` մեծ է, քան `0`.
4. Ներկայացրեք ջրհեղեղի պահանջը:
5. Սպասեք, որ հաշիվը կամ ակտիվների հավասարակշռությունը տեսանելի լինի, նախքան վճարովի գրառումներ ուղարկելը:

Փոխակերպել հանրային բանալին Taira I105 հաշվին ID, որը ակնկալվում է ջրհեղեղովի կողմից.

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Գտիր հանելուկը:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

Գլխեղդը հանդիսանում է հանրային փորձարկման ցանցի ծառայություն: Եթե հանելուկը կամ պահանջվող վերջնական կետը վերադարձնում են `502`, ժամանակահատվածը, կամ Gateway- ի մակարդակի այլ սխալ, սպասեք եւ կրկին փորձեք նախքան ձեր բանալիները կամ հաճախորդի կարգավորումը փոխելը:

Պատասխանն ունի հետեւյալ ձեւը.

```json
{
  "algorithm": "scrypt-leading-zero-bits-v1",
  "difficulty_bits": 8,
  "anchor_height": 741,
  "anchor_block_hash_hex": "05d2...",
  "challenge_salt_hex": null,
  "scrypt_log_n": 13,
  "scrypt_r": 8,
  "scrypt_p": 1,
  "max_anchor_age_blocks": 6
}
```

Եթե `difficulty_bits` է `0`, ներկայացրեք միայն հաշվետվությունը ID.

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

Երբ `difficulty_bits` մեծ է, քան `0`, լուծեք հանելուկը եւ ներառեք կեղտերի բարձրությունը գումարած nonce- ը.

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{
    "account_id": "<TAIRA_I105_ACCOUNT_ID>",
    "pow_anchor_height": 741,
    "pow_nonce_hex": "<NONCE_HEX>"
  }' \
  | tee ./taira-faucet-response.json \
  | jq .
```

Պազլային ալգորիթմը հետեւյալն է.

1. Ստեղծեք մարտահրավերը որպես SHA-256:
   - `iroha:accounts:faucet:pow:v2` բայթները
   - UTF-8 հաշիվը ID
   - `anchor_height` որպես խոշոր հնդիա `u64`
   - `anchor_block_hash_hex` կոդավորվել է որպես բայթներ
   - `challenge_salt_hex` կոդավորվում է որպես բայթներ, երբ ներկա է
2. Փորձեք `u64` nonces կոդավորված որպես մեծ-endian 8-բայտ արժեքներ.
3. Յուրաքանչյուր նոնսի համար ստեղագրեք հետեւյալը.
   - գաղտնաբառ. 8-բայտային նոնս
   - աղ. 32-բայտային մարտահրավեր
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - արտադրանքի երկարությունը. 32 բայտ
4. Հաղթող նոնսը առաջին դիժեսն է, որը առնվազն `difficulty_bits` առաջատար է զրոյական բիթներով:

Բջիջային պատասխանը ներառում է ֆինանսավորվող ակտիվը եւ հերթով կատարված գործարքի հաշինգը.

```json
{
  "account_id": "<TAIRA_I105_ACCOUNT_ID>",
  "asset_definition_id": "<TAIRA_FEE_ASSET_DEFINITION_ID>",
  "asset_id": "...",
  "amount": "<FUNDED_AMOUNT>",
  "tx_hash_hex": "...",
  "status": "QUEUED"
}
```

Պատասխանը ներկայումս վերադարձվում է HTTP `202 Accepted`։ Նրա `asset_definition_id`-ն հանդիսանում է հանրային ջրհեղեղի կողմից ֆինանսավորվող ընթացիկ Taira վճարային ակտիվը, այն բխում է պատասխանից, այլ ոչ թե պատճենելով օրինակ ID։ Ջրհեղին ընդունել է խնդրանքը, երբ վերադարձնում է `tx_hash_hex` եւ `status: "QUEUED"`:

Այնուհետեւ հարցում անցկացրեք ֆինանսավորվող ակտիվի վերաբերյալ, նախքան վճարովի գործարքները ներկայացնելուց:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Եթե faucet- ի պահանջը ընդունվել է, բայց հաշիվը կամ ակտիվը դեռեւս տեսանելի չէ, գործարքը դեռեւս գտնվում է հանրային testnet հերթի մշակման ետեւում: Սպասեք եւ փորձեք կարդալ նախքան ուղարկելը գրում է:

Գործնական պատրաստի ուղիղ API ստուգման համար սա պահեք որպես `taira_faucet_claim.py` եւ անցեք Taira I105 հաշիվը ID:

```python
#!/usr/bin/env python3
import hashlib
import json
import sys
import urllib.request


def has_leading_zero_bits(digest: bytes, bits: int) -> bool:
    full, rem = divmod(bits, 8)
    if digest[:full] != b"\0" * full:
        return False
    return rem == 0 or digest[full] >> (8 - rem) == 0


root = "https://taira.sora.org"
account_id = sys.argv[1]

puzzle_request = urllib.request.Request(
    f"{root}/v1/accounts/faucet/puzzle",
    headers={"Accept": "application/json"},
)

with urllib.request.urlopen(puzzle_request) as res:
    puzzle = json.load(res)

claim = {"account_id": account_id}
difficulty = int(puzzle["difficulty_bits"])

if difficulty > 0:
    challenge = hashlib.sha256()
    challenge.update(b"iroha:accounts:faucet:pow:v2")
    challenge.update(account_id.encode())
    challenge.update(int(puzzle["anchor_height"]).to_bytes(8, "big"))
    challenge.update(bytes.fromhex(puzzle["anchor_block_hash_hex"]))
    if puzzle.get("challenge_salt_hex"):
        challenge.update(bytes.fromhex(puzzle["challenge_salt_hex"]))

    n = 1 << int(puzzle["scrypt_log_n"])
    r = int(puzzle["scrypt_r"])
    p = int(puzzle["scrypt_p"])
    salt = challenge.digest()

    for nonce in range(1_000_000):
        nonce_bytes = nonce.to_bytes(8, "big")
        digest = hashlib.scrypt(nonce_bytes, salt=salt, n=n, r=r, p=p, dklen=32)
        if has_leading_zero_bits(digest, difficulty):
            claim["pow_anchor_height"] = puzzle["anchor_height"]
            claim["pow_nonce_hex"] = nonce_bytes.hex()
            break
    else:
        raise SystemExit("faucet nonce not found")

request = urllib.request.Request(
    f"{root}/v1/accounts/faucet",
    data=json.dumps(claim).encode(),
    headers={"Accept": "application/json", "content-type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as res:
    print(json.dumps(json.load(res), indent=2))
```

Փլաները նախատեսված են միայն Taira թեստնետային միջոցների համար: Չօգտագործեք XOR փորձնետային ցանցը, փլաների հաշիվները կամ Taira կանարի ստորագրիչները Minamoto հոսքներում.

## 5. Ստեղծեք Minamoto հաճախորդի Config {#_5-create-a-minamoto-client-config}

Օգտագործեք Minamoto համար առանձին կոճակային զույգ, իսկ հիմնական ցանցի համար մի օգտագործեք Taira կոճակները.

Ստեղծեք `minamoto.client.toml`:

```toml
chain = "00000000-0000-0000-0000-000000000753"
torii_url = "https://minamoto.sora.org/"

[account]
domain = "wonderland.universal"
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Բարձրագույն մակարդակը `chain` է հոսքը Nexus հիմնական ցանցի շղթան ID. `[account].profile = "minamoto"` ընտրում է Minamoto I105 շղթայի խտրական; վերջային կետի հյուրընկալող անունն ու շղթան ID մի ընտրեք այն անուղղակիորեն:

Փոխակերպել Minamoto հանրային բանալին իր կանոնիկ I105 հաշիվի մեջ ID ՝ հիմնական ցանցի նախադրյալով.

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Կատարեք միայն ընթերցված կողմի ստուգումներ, մինչեւ հաշիվը ապահովվի եւ ֆինանսավորվի հիմնական ցանցի ներբեռնման կամ կառավարման հոսքի միջոցով.

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Մի գործարկեք Taira գազանի կամ գրելու օգնիչը Minamoto-ի դեմ:

## 6. Ֆինանսավորել Minamoto հաշիվ XOR: {#_6-fund-a-minamoto-account-with-xor}

Minamoto վճարները վճարվում են արտադրության հետ XOR, եւ Minamoto-ը չունի հանրային գազակ: Կառավարեք կազմված հաշիվը հաստատված հիմնական ցանցի ներմուծման կամ գանձախոսի փոխանցման միջոցով կամ ստացեք XOR ՝ գոյություն ունեցող ֆինանսավորվող Minamoto հաշվից:

Նախքան գրառումը ներկայացնելը ստուգեք քանոնիկ հաշիվը ID եւ ֆինանսավորումը միայն ընթերցման միջոցով: Բարեւ Minamoto XOR-ին որպես արտադրական միջոցներ վերաբերվեք. նախ փորձեք նույն գործողությունը Taira- ում, պահեք առանձին արտադրական բանալիները եւ մի ենթադրեք, որ հիմնական ցանցի գործարքը կարող է վերսկսվել:

Taira XOR-ը չի կարող վճարել Minamoto տուրքերը: Testnet հավասարակշռությունը եւ գազի պահանջները չեն փոխանցվում Minamoto-ին:

## 7. Աշխատեք տվյալների տարածքի ներսում {#_7-work-inside-an-existing-dataspace}

Օգտագործեք լիարժեք որակավորված տիրույթի անուններ տվյալների տարածքի ներսում գտնվող գլխավոր գրքի օբյեկտների համար: Օրինակ, հանրային տվյալների տարածքում նախագծի տիրույթը պետք է օգտագործի.

```text
apps.universal
```

Այն բանից հետո, երբ ձեր հաշիվը ունենա պահանջվող թույլտվությունները, ստեղծեք գաղտնի `AliasSetupPlanRequestV1` մտադրություն դոմենի համար եւ օգտագործեք հայտարարական պլանավորիչը.

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto համար պետք է ստեղծել եւ հաստատել առանձին հիմնական ցանցի մտադրություն եւ ծրագիր: Ծրագրերը կապված են իրենց շղթայի, իշխանության, կենդանի վիճակի կապակցությամբ եւ ժամկետի հետ, այնպես որ Taira ծրագիրը չի կարող առաջխաղացվել կամ կրկնվել.

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Հաշվետու կեղծանունները օգտագործում են նույն տվյալների տարածքի հաջորդականությունը.

```text
alice@apps.universal
alice@universal
```

Հստակ հաշվառման դաշտերը դեռեւս օգտագործում են կանոնական I105 հաշիվը IDs: Բարեւեք կեղծանունները որպես մարդկային ընթերցելի կապեր, որոնք լուծվում են կանոնային հաշվին IDs.

## 8. Տվյալների նոր տարածք տրամադրել {#_8-provision-a-new-dataspace}

Նոր տվյալների տարածքը օպերատոր եւ կառավարման փոփոխություն է: Հանրային Torii վերջ կետը կարող է երթուղղել երթեւեկությունը կոնֆիգուրացված տվյալների տարածքներին, բայց դա մերժում է անհայտ տվյալների տարածքի կեղծանունները:

Նախքան փոփոխություն պատրաստելը, գրեք գործող կենդանի կատալոգը.

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Օպերատորի հաշիվի համար նաեւ ստուգեք երթուղու ցուցակային դիրքը.

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Մի գովազդեք նոր կեղծանուն, եթե ուղիղը ID, տվյալների տարածքը ID, հավաստիացողի հավաքածու, սխալների հանդուրժողականությունը, մանիֆեսը, երթեւեկության կանոնները եւ շահագործման սեփականատերը միասին վերանայված չեն: Սովորական օգտատերերի հաշիվը, որն ունի պահանջվող թույլտվությունները, կարող է ձեռք բերել տիրույթ եւ իր SNS վարձակալությունը գոյություն ունեցող տվյալների տարածքի մեջ alias պլանավորման միջոցով: Այն չի կարող անվտանգորեն ավելացնել նոր հանրային տվյալների տարածք:

Անձնական կամ կազմակերպական տվյալների տարածքի համար նախապատրաստեք կատալոգային փոփոխություն ՝

- Տվյալների տարածքի եզակի alias եւ թվային `id`
- համապատասխանող երթուղային մուտք կամ գոյություն ունեցող երթուղի նշանակում
- տվյալների տարածքը `fault_tolerance`
- երթուղային կանոններ հանձնարարականների կամ հաշիվի շրջանակների համար, որոնք պետք է վայրէջք կատարեն այնտեղ
- Տվյալների տիրույթը բացատրում է UAID հնարավորությունները:
- Վավերացողի, համապատասխանության, կարգավորման եւ վերահսկողության քաղաքականության կառավարման հաստատումը

Վերանայելի կոնֆիգերի կտորը նման է հետեւյալին.

```toml
[[nexus.lane_catalog]]
index = 5
alias = "payments"
description = "Payments lane"
dataspace = "payments"
visibility = "public"
metadata = {}

[[nexus.dataspace_catalog]]
alias = "payments"
id = 20
description = "Payments dataspace"
fault_tolerance = 1

[[nexus.routing_policy.rules]]
lane = 5
dataspace = "payments"
[nexus.routing_policy.rules.matcher]
account_prefix = "payments."
description = "Route payments domains to the payments dataspace"
```

Օպերատորի ընդունումը պետք է ներառում լինի հետեւյալ դռները.

- `iroha3d --sora --config <config.toml> --trace-config` փոխանցում է լուծված հանգույցի կարգավորումը
- ստեղծված կամ վերանայված մանիֆեսը արխիվավորվում է շեշերով եւ ստորագրություններով
- ծխի փորձարկումները անցնում են Taira նախքան ցանկացած Minamoto առաջխաղացում:
- փոփոխությունից հետո `/status` կատալոգը ցույց է տալիս նախատեսված երթուղին եւ տվյալների տարածքը:
- `iroha app nexus lane-report --summary` չի հայտնում բացակայության մասին պահանջվող մանիֆեսները

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Միեւնույն տվյալների տարածքը Minamoto-ի համար խթանելը միայն այն բանից հետո, երբ Taira տեղակայումը, ծխի փորձարկումները, վերահսկողությունը եւ կառավարման ապացույցները ավարտված են։

## Կապակցված էջեր {#related-pages}

- [տեղադրում Iroha 3](/hy/get-started/install-iroha.md)
- [Գործարկել Iroha 3 միջոցով CLI](/hy/get-started/operate-iroha-via-cli.md):
- [Հատուկ տվյալների տարածքի համար հովանավորման վճարներ](/hy/get-started/private-dataspace-fee-sponsor.md)
- [Torii վերջնական կետեր](/hy/reference/torii-endpoints.md)
- [Ծննդոցային հղում](/hy/reference/genesis.md)
