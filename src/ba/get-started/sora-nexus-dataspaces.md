---
translation_locale: ba
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: f766c604b0220fc03cacd7c0b9cbb5f94f415c5ec61eba89de7a5e310a1dfe79
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SORA 3 нигеҙендә төҙөлгән: Taira һәм Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA 3 - ҡушымтаға ҡараған асыҡ ҡулланыу трассаһы Iroha 3 һәм SORA Nexus. Төҙөү һәм күнекмәләр Taira тәүҙә, һуңынан шул уҡ клиент формаһын күсерергә Minamoto тик әгәр һеҙ айырым төп селтәр асҡыстары бар, реаль XOR түләүҙәр һәм етештереүҙе раҫлау.

Был дәреслек нисек конфигурировать күрһәтелә Iroha клиенты өсөн йәмәғәт SORA 3 селтәрҙәр:

- Taira һынау селтәре `https://taira.sora.org`
- Minamoto төп селтәрендә `https://minamoto.sora.org`

Taira-ны integration test-тар, faucet-funded write canary-ҙар һәм deployment rehearsal-дар өсөн ҡулланығыҙ. Minamoto-ны production-ready mainnet эшмәкәрлеге өсөн генә ҡулланығыҙ. Ике network та fee-ны XOR менән ала:

- Taira асыҡ faucetнан тест селтәрен XOR ҡуллана.
- Minamoto реаль ҡулланыла XOR. Бер ниндәй ҙә Minamoto faucet.

## Төҙөүселәр юлы {#builder-path}

|Аҙым |Taira Тестнет |Minamoto Майннет |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Сеть торошон уҡый башлағыҙ |Ключһыҙ һорау `/status` |Ключһыҙ һорау `/status` |
|Мәғлүмәттәр киңлеген һайлағыҙ |Ҡушымтағыҙға идара ителеүсе lane кәрәкмәгән осраҡта асыҡ `universal`-ды ҡулланығыҙ |Бер үк мәғлүмәттәр киңлеген төп селтәр өсөн хуплау алынғандан һуң ғына ҡулланығыҙ |
|Түләү активын алығыҙ .|Йәмәғәт Taira faucet-ты ҡулланығыҙ |Финансландырылған Minamoto иҫәбенән йәки раҫланған казначейлыҡ ағымынан XOR алыу |
|Тест яҙған |Ҡулланығыҙ faucet менән тәьмин ителгән һынау XOR |Тест инструмент ҡулланырға ярамай; яҙған аҡса реаль XOR |
|Дәртләндереү |Логика, күҙәтеү һәм ҡултамғалау менән эш итеүҙе дауам итегеҙ |Айырым асҡыстар, финанслау һәм иреккә сығарыу контролдәрен ҡулланығыҙ |

Ғәмәли ағым:

1. Taira менән клиент төҙөү һәм йәмәғәт `universal` мәғлүмәт киңлеген ҡулланыу.
2. Ҡул ҡуйыусы ҡушымта өҫтәгеҙ һәм уны Taira faucet менән түләгеҙ.
3. Ҡулланма логикаһын Taira менән ҡулланығыҙ, уңышһыҙлыҡтар киҫкен һәм күҙәтеләсәк тиклем.
4. Айырым Minamoto ҡултамғасы булдырыу, уны реаль XOR менән финанслау һәм шул уҡ иҫбатланған операцияларҙы ғына mainnet-ҡа күсереү.

## Әҙерлек китабы менән уҡығыҙ {#continue-with-the-cookbook}

Был күрһәткес менән селтәрҙе һайларға, имзалаусыны конфигурациялау һәм түләүҙәрҙе түләргә. Һуңынан ҡушымта тәртибен төҙөргә теләгән рецепт менән дауам итегеҙ:

|Маҡсат |Рецепты |
| --- | --- |
|Taira тикшерегеҙ һәм клиентты көйләгеҙ | [Taira](/ba/cookbook/connect-to-taira.md) менән тоташтырығыҙ |
|Тәүге тапҡыр яҙып ебәреп , һөҙөмтәһен тикшерегеҙ .| [Транзакцияларҙы тапшырыу һәм тикшереү](/ba/cookbook/submit-and-verify-transactions.md) |
|Реестр, минтлау һәм күсмә ҡиммәт | [Функциональ активтар](/ba/cookbook/fungible-assets.md) |
|Фильтрланған ғаризаны уҡығыҙ | [Һорау Леджер торошо](/ba/cookbook/query-ledger-state.md) |
|Тәҡдим ителгән үҙгәрештәргә ҡаршы тороу | [Ташҡын ваҡиғалары](/ba/cookbook/stream-events.md) |

Аш-һыу китабы һәр эш ағымын туплай һәм уға Taira финанслау йәки SORA Nexus селтәр контексты кәрәк булғанда бында тоташтыра.

## 1. Ниндәй маҡсаттар ҡуйырға теләгәнеңде аңла {#_1-understand-what-you-are-setting-up}

Эсендәге SORA Nexus, мәғлүмәт киңлеге селтәр юлы һәм маршрутизация каталогының бер өлөшө булып тора. клиент яңы асыҡ мәғлүмәт киңлеген үҙгәртеп кенә барлыҡҡа килтермәй. `client.toml`. Клиент ҡоролмаһы ике эш итә:

1. клиентты уң Torii тамамлау нөктәһенә йүнәлтә
2. үҙ канон иҫәбенә домен һәм мәғлүмәттәр арауығы маршрутизация контексын һайлай

`AccountId` һәр ваҡыт каноник һәм доменһыҙ. `client.toml`-ҙағы `[account].domain` ҡиммәте маршрутлау һәм ҡушамат контексты бирә; ул иҫәп яҙмаһы идентификацияһының бер өлөшө булып китмәй. Күпселек ҡулланыуҙар өсөн асыҡ `universal` мәғлүмәт киңлеге менән башларға кәрәк. Домен контексы, мәҫәлән, `domain.dataspace` формаһын ҡуллана:

```text
wonderland.universal
```

Әгәр һеҙгә яңы ойошма мәғлүмәттәр киңлеге кәрәк икән, уны ябай клиент иҫәбенән теркәү урынына каталог һәм маршрутлау тәҡдимен әҙерләгеҙ. [ Яңы мәғлүмәт киңлеген тәьмин итеү](#_8-provision-a-new-dataspace) түбәндә ҡарағыҙ.

## 2. Халыҡ-ара Torii йомғаҡлау пунктын тикшерегеҙ {#_2-check-the-public-torii-endpoint}

Ҡулланыусыны конфигурациялағансы, маҡсатлы һуңғы нөктәнең тере булыуын тикшерегеҙ.

Taira өсөн:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Minamoto өсөн:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq '{peers, blocks, txs_approved, queue_size}'
```

Мәғлүмәт арауығы һәм йүнәлеш күренештәрен тикшерегеҙ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Төп селтәр өсөн `https://minamoto.sora.org/status` менән шул уҡ команданы ҡулланығыҙ.

## Агенттар өсөн Taira MCP {#taira-mcp-for-agents}

Taira шулай уҡ а Torii-урындағы Контекст протоколы моделе (MCP агенттар өсөн күпер. уны агент тере тест селтәре уҡырға кәрәк саҡта ҡулланыу, сценарий диагностикаһы, йәки ентекле тикшерелгән яҙыу репетициялар булдырыуһыҙ Torii Иң тәүҙә клиент.

|Ҡуйыу |Ҡиммәт |
| --- | --- |
|MCP һуңғы пункт |`https://taira.sora.org/v1/mcp` |
|Сеть тамырҙары |`https://taira.sora.org` |
|Маҡсат |Taira тест селтәре уҡый һәм faucet аҡсаһы менән яҙыу репетициялары |
|Производство эквиваленты |Был яҙманы Minamoto тип билдәләмәгеҙ, әгәр төп селтәрҙең MCP һуңғы пункты һәм сығарыу контроле асыҡтан-асыҡ раҫланмаһа. |

Ҡул ҡуйыу материалын өҫтәр алдынан күпер метамәғлүмәттәре тикшерегеҙ:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  | jq '{protocolVersion, server: .serverInfo.name, tools: .capabilities.tools.count}'
```

URL серверын агент эшләү ваҡытында ҡулланыусыға урындағы MCP серверы итеп конфигурациялағыҙ. был документтар репоһына йәки ҡушымта репоһына агенттың MCP конфигурацияһын, API токендәрен, ебәрелгән автор башлыҡтарын, `authority` йәки `private_key` ҡиммәттәрен commit.

Taira менән яҡшы эшләүсе агенттарҙың тиҙләтеү ҡағиҙәләре:

- MCP серверҙан инструменттар табыу, уларҙы саҡырыр алдынан; әгәр сервер `listChanged` тураһында хәбәр итһә, ҡабаттан табырға.
- `iroha.*` инструменттарын сымал `torii.*` инструменттарға ҡарағанда өҫтөнөрәк ҡуя.
- Уҡыу менән генә башлағыҙ: яҙмаларҙы тәҡдим иткәнгә тиклем статусын, иҫәптәрҙе, активтарҙы, ҡушаматтарҙы, блоктарҙы, идара итеү торошон һәм транзакция торошон тикшерегеҙ.
- Тере тест селтәре мутацияларына тиклем кеше тарафынан асыҡтан-асыҡ күрһәтмәләр талап ителә. Алдан имзаланған транзакция конверттары өсөн `iroha.transactions.submit_and_wait` ҡулланығыҙ, шуға күрә агент һөҙөмтәне тапшырыу урынына көтә.
- Транзакция хештарын, һуңғы статусты һәм серверҙың раҫлау хаталарын агент яуаптарында йомғаҡларға.

### Агенттар менән эшләү процесы {#development-workflow-with-agents}

Iroha клиенттары, транзакция төҙөүселәре, диагностика скрипттары һәм тест-нет эшләтеү китаптары өсөн агенттарҙы үҫтереүҙә ярҙамсы итеп ҡулланығыҙ. ул кодты тикшерә ала, Taira хәлен уҡый ала, үҙгәрештәр тәҡдим итә һәм урындағы һынауҙар үткәрә ала, әммә кеше теүәл операцияны раҫламайынса тере селтәрҙе мутацияларға тейеш түгел.

Ғәмәли эш процесы булып тора:

1. SDK кодын, CLI командаһын йәки MCP инструмент схемаһын яҙыр алдынан агенттан тикшерергә һорағыҙ.
2. Башта агентҡа иң бәләкәй клиент юлына яҙырға ҡуш: статус тикшереүе, иҫәп-хисап эҙләү, псевдонимы менән хәл итеү, йәки баланс эҙләү.
3. Транзакция төҙөү кодын өҫтәү бары тик уҡырға ғына саҡырыуҙар Taira менән эшләгәндән һуң ғына.
4. Тормош селтәре һынауҙарын һайлағыҙ, мәҫәлән `TAIRA_LIVE=1` артында тотоноғоҙ, шуға күрә ғәҙәти берәмектәге һынау барышында тест селтәренең аҡсаһы бер ҡасан да сарыф ителмәй йәки селтәрҙең булыуына бәйле.
5. Агенттан ниндәй ҙә булһа транзакцияны тапшыр алдынан селтәрҙең тамыр, сылбыр, хакимиәт иҫәбенә, инструкцияларға йомғаҡ яһау, түләү активтары һәм көтөлә торған дәүләт үҙгәрештәрен хәбәр итеүҙе талап итергә.
6. CI йәки төп селтәрҙәге эш ағымдарына күсерер алдынан, йәшерен эшкәртеү, ҡабаттан һынау тәртибе, idempotency һәм кире ҡағыу менән шөғөлләнеү өсөн булдырылған кодты ҡарағыҙ.

Ҡушымталарҙы эшләү өсөн файҙалы, тик уҡыуға тәғәйенләнгән MCP ҡоралдарына иҫәп активтарын эҙләү, псевдонимды асыҡлау, блокты һәм транзакцияны эҙләү, транзакциялар исемлеген алыу һәм конвейер торошон тикшереү инә. Ҡултамғалы йөк ебәрер алдынан ошо ҡоралдар менән һөҙөмтәгә ышанысты арттырығыҙ.

```text
Use Taira MCP as a read-only inspector while developing this Iroha feature.
Inspect available iroha.* tools, verify the target account and asset state,
then update the client code. Do not submit transactions unless I explicitly
say "submit this transaction".
```

### Транзакциялар агенттар аша эш ағымы {#transaction-workflow-through-agents}

MCP күпере ҡул ҡуйылған Iroha транзакцияны тапшыра ала, әммә ул ғәҙәти транзакция талаптарын алып ташлай алмай. Транзакцияға дөрөҫ хоҡуҡ, рөхсәт, түләүҙәр финанслау, ID сылбыр, метамәғлүмәт һәм ҡултамға кәрәк.

Raw Iroha транзакциялар өсөн, һатыу конвертын төҙөү һәм имзалау башта SDK йәки CLI менән, һуңынан агентҡа тик каноник ҡул ҡуйылған транзакция байттары `body_base64` тип кодлана. агент конвертты `iroha.transactions.submit_and_wait` менән тапшыра ала, йәки `iroha.transactions.submit` һәм `iroha.transactions.wait` менән анкета бирә ала.

Шәхси асҡыстарҙы агент һорауына ҡуймағыҙ. Агентҡа транзакция төҙөргә кәрәк булһа, уны серҙәрҙе файҙаланыусының эш мөхитенән, асҡыстар һаҡлағысынан, аппарат ҡултамға ҡуйғысынан йәки иғтибарға алынмаған testnet конфигурация файлынан йөкләгән локаль кодҡа йүнәлтегеҙ. Агент асҡыс материалын бер ҡасан да Markdown-ға, һынау мәғлүмәттәренә, log-тарға йәки commit-тарға яҙырға тейеш түгел.

Транзакцияны тапшыр алдынан, агентҡа ҡыҫҡа транзакция планын әҙерләргә ҡуш:

- `network`: Taira тест селтәренең тамырҙары һәм сылбырҙары ID
- `authority`: яҙыусы һәм түләүселәр иҫәбенә
- `instructions`: реестр, минтлау, яндырыу, күсереү, метамәғлүмәт, рөхсәт йәки килешеү саҡырыуы йомғаҡтары
- `fee asset`: Taira өсөн түләнә торған актив
- `preflight reads`: иҫәб, активтар балансы, рөхсәттәре, исем-шәрифтәре йәки блок тикшереүҙәре инде башҡарылған
- `expected result`: раҫланғандан һуң күренеп торорға тейешле хәл
- `idempotency`: шул уҡ request-ты retry итһәң, нимә була?

Ҡабул ителгәндән һуң, агентҡа терминал статусын көтөп торорға мәжбүр итегеҙ, һуңынан хәл үҙгәрешен уҡыу һорауы менән тикшерегеҙ. Яҡшы тамамлау отчеты:

- транзакция хэшигы
- `Committed`, `Applied`, `Rejected` йәки `Expired` кеүек терминал статусы.
- Блок йәки эксперименталь деталдәр, әгәр улар бар булһа
- тикшеренеүҙәр һөҙөмтәләре
- кире ҡағыу хәбәрен һәм уңышһыҙлыҡ рөхсәт, түләүҙәр, валидация, иҫкергән дәүләт йәки һуңғы пункттың булыуы кеүек күренәме

Миҫал һаҡланған тиҙ арала:

```text
Prepare a Taira transaction plan, but do not submit yet. Use MCP reads to
verify the authority account, fee balance, target asset or alias, and current
transaction status if a hash already exists. Show the exact instructions and
expected post-state. Wait for my explicit "submit" message before calling
iroha.transactions.submit_and_wait.
```

Ҡул ҡуйылған конверт әҙерләнгәндә:

```text
Submit this pre-signed Taira transaction envelope with
iroha.transactions.submit_and_wait. Use the provided body_base64 only; do not
ask for private keys. Wait for a terminal status, then verify the resulting
state with read-only iroha.* tools and report the hash, status, and
verification result.
```

Taira MCP-ны асыҡ һынау селтәре контроле өҫкө йөҙө итеп ҡарағыҙ. Taira асҡыстары, тест селтәре XOR, faucet иҫәптәре һәм канар ҡултамғалары бер тапҡыр ҡулланыла һәм улар Minamoto асҡыстарынан һәм производство сығарыу эш ағымдарынан айырылып торорға тейеш.

## Хәҙер һынап ҡарағыҙ {#toy-examples-you-can-try-now}

Был миҫалдар, әгәр билдәләнмәһә, уҡырға ғына мөмкин. Улар асҡыстар тыуҙырғанға тиклем эшләй һәм ике йәмәғәт селтәренә лә ҡаршы хәрәкәт итеү хәүефһеҙ.

Taira тест селтәрен һәм Minamoto төп селтәрҙең һаулығын сағыштырығыҙ:

```bash
for network in taira minamoto; do
  root="https://$network.sora.org"
  printf '\n%s\n' "$network"
  curl -fsS "$root/status" \
    -H 'Accept: application/json' \
    | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'
done
```

Taira асыҡ мәғлүмәттәр киңлектәре юлдары исемлеген яҙығыҙ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Төп селтәр күренеше кәрәк саҡта Minamoto менән шул уҡ команданы үтәгеҙ:

```bash
curl -fsS https://minamoto.sora.org/status \
  -H 'Accept: application/json' \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .storage_profile, .block_height]
    | @tsv'
```

Дашборд, бот йәки урынлаштырыу тикшереүе өсөн бәләкәй Node.js торошо сондаһын төҙөй:

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

Тәүге яҙыу яғында уйынсыҡ Taira faucet claim булырға тейеш. Ул тест селтәрен ҡуллана XOR һәм бер ҡасан да Minamoto күрһәтергә тейеш түгел.

## 3. Taira клиент конфигурацияһын булдырыу. {#_3-create-a-taira-client-config}

Әгәр һеҙҙә юҡ булһа , асҡыс парын булдырыу:

```bash
kagami keys --algorithm ed25519 --out-dir ./taira-client-key
```

`taira.client.toml` булдырыу:

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

Иң юғары кимәлдә `chain` тап шул Taira транзакциялар сылбыры ID. Ҡоролтай `[account].profile = "taira"` көйләү үҙ аллы һайлай Taira I105 Сылбырлы дискриминатор. ID иҫәбенең профилен һайламай.

Уҡыу өсөн генә тикшерегеҙ:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Яҙыу һынауҙарына тиклем асыҡ диагностикалар Taira үтәү:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Taira аккаунтын түләп яҙыуҙан алда faucet аша финанслау. Тура faucet ағымы [Get Testnet XOR на Taira](#_4-get-testnet-xor-on-taira).

faucet өсөн дәғүә ҡабул ителгәндән һуң һәм иҫәпкә аҡса бүленгәндән һуң, Taira canaryһы факультатив smoke test булып тора:

```bash
iroha --config ./taira.client.toml taira write-canary \
  --public-root https://taira.sora.org \
  --write-config ./taira.canary.client.toml \
  --json
```

canary ҡул ҡуйылған ping-ты тапшыра, раҫлауҙы көтә һәм `--write-config` бирелгәндә runtime signer config-ты яҙа. Taira — асыҡ testnet, шуға күрә queue тулылығы faucet үҙе эшләгәндә лә ҡул ҡуйылған ping-ты уңышһыҙ итергә мөмкин. `taira doctor` тулған queue тураһында хәбәр итһә йәки canary `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` ҡайтарһа, быны client configuration error тип иҫәпләгәнгә тиклем көтөгөҙ һәм ҡабатлап ҡарағыҙ.

Күҙәтеүһеҙ smoke test-тар өсөн, canaryҙы сикләнгән ҡабаттан һынау циклына төрөп ҡуйығыҙ:

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

`iroha taira doctor` етди уңышһыҙлыҡтар күрһәткән осраҡта ҡабаттан һынауҙы туҡтатығыҙ. сираттың туйыныуы һәм түләү ҡабул итеүҙән баш тартыу - йәмәғәт тест селтәре шарттары; DNS, TLS йәки `status = "fail"` диагностикалары юҡ.

## SORA Nexus хисапты булдырыу ID {#generate-a-sora-nexus-account-id}

SORA Nexus иҫәбе ID-һы — иҫәптең асыҡ асҡысынан һәм маҡсатлы селтәр префиксынан сығарылған каноник I105 адресы. Ул клиенттың TOML файлындағы `[account].domain` ҡиммәте түгел. Бер үк асыҡ асҡыс Taira һәм Minamoto өсөн төрлө IDs итеп кодлана; производство мөхитен ҡулланыусылар Minamoto өсөн айырым асҡыстар пары булдырырға тейеш.

Бухгалтер иҫәбенә контроллек итеүсе Ed25519 төймәһе парын булдырыу йәки йөкләү:

```bash
kagami keys --algorithm ed25519 --out-dir ./nexus-account-key
```

Йәмәғәт асҡысын Taira иҫәбенә ID күсерергә:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Minamoto асыҡ асҡысын төп селтәр префиксы менән үҙгәртергә:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Һөҙөмтәлә алынған иҫәбен ҡулланығыҙ ID ҡайҙа Nexus API йәки CLI командование канонический отчет һорай ID, мәҫәлән, Taira faucet `account_id`, баланс һорауҙар, ҡаты иҫәп-хисап баҫыуҙары, йәки псевдоним бәйләнештәре. клиент конфигурацияһында шәхси асҡыс, һәм шул уҡ йәмәғәт селтәрен һайлағыҙ `[account].profile = "taira"` йәки `[account].profile = "minamoto"`.

ID генерацияһы үҙенән-үҙе финансланған сылбыр иҫәбенә барлыҡҡа килмәй. Taira өҫтөндә, faucet булдыра һәм тестнет яҙған өсөн иҫәпте финанслай ала. Minamoto өҫтөндә, раҫланған төп селтәрҙе ҡушыу йәки ҡаҙна ағымдарын ҡулланыу .

### Ключтарҙы һаҡлау һәм уларҙы һаҡлап ҡалыу {#key-storage-and-backup}

Иҫәпкә ID һәм асыҡ асҡыс бүленә ала. Бер-береһенә тап килгән шәхси асҡыс, пароль, орлоҡ һәм кире ҡайтарыу материалдары йәшерен һаҡланырға тейеш.

SORA Nexus иҫәбе өсөн ошо алымдарҙы ҡулланығыҙ:

- Хосуси асҡыстарҙы шифрлы пароль менеджерында, аппарат ярҙамында тәьмин ителгән клавиатура магазинында йәки махсус ҡултамғалау хеҙмәтендә һаҡларға. Ключтарҙы сығанаҡ контроллерына commit йәки продукция ключтарын тышлыҡ тарихында, журналдарҙа, чатта, билеттарҙа йә шифрланмаған резервтағы күсермәләрҙә ҡалдырығыҙ.
- Һәр келәт йәки етештереү имзалаусы өсөн үҙенсәлекле юғары энтропиялы пароль фразаһын ҡулланығыҙ. Паролдәрҙе шифрланған шәхси асҡыс менән бер үк файлда йәки резерв тупланмаһында түгел, ә пароль менеджерында йә бүленгән һаҡлау процесында һаҡлау.
- Taira һәм Minamoto асҡыстарын айырым һаҡлағыҙ. Taira асҡыстарын бер тапҡыр ҡулланылған һынау селтәре материалы итеп, Minamoto асҡыстарын етештереү фонды органы итеп ҡарағыҙ.
- Signer-ҙы тергеҙеү өсөн кәрәк булған private key, public key, account ID, account profile һәм account recovery йәки custody note-тарын backup итегеҙ. Network context-һыҙ private key-ҙы recovery ваҡытында яңылыш ҡулланыу еңел.
- Производство имзалаусылары өсөн кәмендә бер шифрланған офлайн резерв коды һәм географик яҡтан айырым бер шифрлы резерв коды һаҡлағыҙ. Өҫтәмә күсермәгә бәйле тиклем бәләкәй генә уҡырға ғына операция менән тергеҙеү һынау.
- Әгәр шәхси асҡыс, пароль фразаһы, резерв медиаһы йәки ҡултамғалау хостинг асыҡланған булһа, ҡултамғаһын әйләндереү йәки алмаштырыу.

Тулыраҡ мәғлүмәт өсөн ҡарағыҙ [Сохранение криптографических ключей](/ba/guide/security/storing-cryptographic-keys.md) һәм [Пароль хәүефһеҙлеге](/ba/guide/security/password-security.md) .

## 4. Тестнетҡа XOR саҡырып, Taira {#_4-get-testnet-xor-on-taira}

Туранан-тура йәмәғәт faucet-ы менән файҙаланығыҙ.

1. Ҡулланыусыны булдырыу йәки йөкләү һәм уның Taira каноник иҫәбенә иҫәпләү ID.
2. faucet-тың ағымдағы puzzle-ын алығыҙ.
3. Әгәр `difficulty_bits` `0`-дан ҙурыраҡ икән, табышманы хәл итегеҙ.
4. faucet өсөн дәғүә белдерегеҙ.
5. Түләү өсөн хаттар ебәрер алдынан иҫәбенең йәки активтың балансының күренеп китеүен көтөгөҙ.

Асыҡ асҡысты faucet көткән Taira I105 account ID-ға әйләндерегеҙ:

```bash
iroha tools address convert --profile taira <ED25519_PUBLIC_KEY_HEX>
```

Төшөнсәһен алып кил:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/puzzle \
  -H 'Accept: application/json' \
  | jq .
```

faucet — асыҡ тест селтәре сервисы. Әгәр табышмак йәки талап йомғаҡ нөктәһе `502`, ваҡыт үтеү, йәки башҡа шлюз кимәлендәге хатаны кире ҡайтарһа, көт һәм үҙ асҡыстарығыҙҙы йәки клиент конфигурацияһын үҙгәртер алдынан тағы ла тырышығыҙ.

Яуап ошондай формаға эйә:

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

Әгәр `difficulty_bits` - `0` булһа, бары тик ID хисабын ғына тапшырырға кәрәк:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet \
  -H 'Accept: application/json' \
  -H 'content-type: application/json' \
  -d '{"account_id":"<TAIRA_I105_ACCOUNT_ID>"}' \
  | tee ./taira-faucet-response.json \
  | jq .
```

Әгәр `difficulty_bits` `0`-тан ҙурыраҡ булһа, табышмакты хәл итегеҙ һәм якорь бейеклеген өҫтәп nonce иҫәбенә индерегеҙ:

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

Алгоритмы:

1. Һынауҙы SHA-256 тип төҙөргә:
   - `iroha:accounts:faucet:pow:v2` байттары
   - UTF-8 иҫәбенә ID
   - `anchor_height` ҙур эндиан `u64`
   - `anchor_block_hash_hex` байтҡа декодланған
   - `challenge_salt_hex` байт рәүешендә декодланған, әгәр улар бар булһа
2. `u64` nonces кодланған ҙур эндиан 8-байт ҡиммәттәрен һынап ҡара.
3. Һәр nonce өсөн scrypt менән эшләгеҙ:
   - пароль: 8-байт нонс
   - тоҙ: 32 байтлыҡ проблема
   - `N = 2^scrypt_log_n`
   - `r = scrypt_r`
   - `p = scrypt_p`
   - сығарыу оҙонлоғо: 32 байт
4. Еңеүсе nonce — башында кәм тигәндә `difficulty_bits` нуль бите булған тәүге digest.

faucet яуабы финансланған активты һәм сиратҡа ҡуйылған транзакция хэшын үҙ эсенә ала:

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

Хәҙерге ваҡытта яуап HTTP `202 Accepted` ҡайтара. Уның `asset_definition_id` — асыҡ faucet тарафынан финансланған ағымдағы Taira түләү активы; миҫалдағы ID-ны күсереү урынына уны яуаптан алығыҙ. faucet `tx_hash_hex` һәм `status: "QUEUED"` ҡайтарһа, үтенес ҡабул ителгән.

Һуңынан үҙ түләүҙәр менән килешеүҙәрҙе тапшырыуҙан алда финансланған актив буйынса һорау алыу үткәрегеҙ:

```bash
TAIRA_FEE_ASSET_DEFINITION=$(
  jq -er '.asset_definition_id' ./taira-faucet-response.json
)

iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET_DEFINITION" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Әгәр faucet талап ҡабул ителгән, әммә иҫәбенә йәки актив әле күренеп булмай икән, транзакция һаман да асыҡ testnet сират эшкәртеү артында тора. көт һәм ҡабаттан уҡырға тырышығыҙ ебәреү яҙған тиклем.

Төҙөлөшкә әҙер туранан-тура API тикшереү өсөн, ошоны `taira_faucet_claim.py` тип һаҡлағыҙ һәм Taira I105 иҫәбенә ID күсертегеҙ:

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

Taira тест селтәре фонды өсөн генә тәғәйенләнгән. Minamoto ағымдарҙа тест селтәрен, XOR faucet иҫәптәрен йәки Taira canary ҡултамғаларын ҡулланырға ярамай.

## 5. Minamoto клиент конфигурацияһын булдырыу. {#_5-create-a-minamoto-client-config}

Minamoto өсөн айырым асҡыс парын ҡулланығыҙ. Taira асҡыстарын төп селтәр өсөн ҡабатланмағыҙ.

`minamoto.client.toml` булдырыу:

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

Иң юғары кимәлдә `chain` ағым Nexus төп селтәр селтәре ID. `[account].profile = "minamoto"` һайлай Minamoto I105 Сылбыр айырмасыһы; һуңғы пункттың хост исеме һәм сылбыр ID уны йәшерен рәүештә һайламағыҙ.

Minamoto асыҡ асҡысын уның I105 каноник иҫәбенә ID префиксы менән үҙгәртергә:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Иҫәпкә аҡса тупланғанға тиклем һәм төп селтәрҙе ҡушыу йәки идара итеү ағымы аша финансланғанға тиклем уҡый торған яҡтан ғына тикшереүҙәр үткәреү:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira faucet-ты йәки яҙыу-канар ярҙамсыһын Minamoto менән ҡуймағыҙ.

## 6. Фонд а Minamoto Бухгалтер иҫәбенә XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto түләүҙәр етештереү менән түләнә XOR, һәм Minamoto-ның йәмәғәт faucet-ы юҡ. Конфигурацияланған иҫәбенә раҫланған төп селтәрҙе ҡушыу йәки казначейлыҡ күсереү аша аҡса түләгеҙ, йәки ғәмәлдәге финансланған Minamoto иҫәбенән XOR алығыҙ.

ID һәм финанслауҙы уҡыу өсөн генә тикшереүҙәр менән тикшерегеҙ, яҙма тапшырыуҙан алда. Minamoto XOR-ны производство средстволары итеп ҡарағыҙ: башта шул уҡ операцияны Taira буйынса күнегегеҙ, айырым етештереү асҡыстарын һаҡлағыҙ һәм төп селтәр транзакцияһын ҡабаттан ҡуйып була тип иҫәпләмәгеҙ.

Taira XOR Minamoto түләүҙәрен түләй алмай.Testnet балансы һәм faucet өсөн дәғүәҙәр Minamoto гә күсерелмәй.

## 7. Бар булған мәғлүмәттәр арауығында эш итеү {#_7-work-inside-an-existing-dataspace}

Мәғлүмәт киңлеге эсендә йәшәүсе иҫәплек объекттары өсөн тулыһынса квалификациялы домен исемдәрен ҡулланығыҙ. Мәҫәлән, йәмәғәт мәғлүмәт киңлегендә проект домены ҡулланырға тейеш:

```text
apps.universal
```

Иҫәпкә тейешле рөхсәттәре булғандан һуң, домен өсөн йәшерен булмаған `AliasSetupPlanRequestV1` ниәтен булдырығыҙ һәм декларатив планерҙы ҡулланығыҙ:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto өсөн айырым төп селтәрҙең ниәте һәм планын булдырыу һәм раҫлау. Пландар уларҙың сылбыр, вәкәләтле иҫәп, йәшәү дәүләте якорьына һәм ваҡытына бәйле, шуға күрә Taira планы тәҡдим ителә алмай йәки ҡабатлана алмай:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Хисап исемдәре шул уҡ мәғлүмәттәр киңлеге суффиксын ҡуллана:

```text
alice@apps.universal
alice@universal
```

Ҡаты иҫәп-хисап ҡырҙарында һаман да каноник ҡулланыла I105 иҫәбенә IDs. Алфавиттарҙы кеше уҡый алған бәйләнештәр тип иҫәпләгеҙ, улар каноник ҡағиҙәләренә тура килә IDs.

## 8. Яңы мәғлүмәт туплау урыны булдырыу {#_8-provision-a-new-dataspace}

Яңы мәғлүмәт киңлеге - оператор һәм идара итеү үҙгәреше. асыҡ Torii һуңғы нөктә трафикты конфигурацияланған мәғлүмәт киңлектәренә йүнәлтә ала, әммә ул билдәле булмаған мәғлүмәттәр киңлектәре атамаларын кире ҡағасаҡ.

Үҙгәреште әҙерләгәнсе, хәҙерге тере каталогты ҡулға алығыҙ:

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | {lane_id, alias, dataspace_id, dataspace_alias, visibility}'
```

Оператор иҫәбенә, шулай уҡ трасса манифест торошо тикшерергә:

```bash
iroha --config ./operator.client.toml app nexus lane-report --summary
```

Һыҙат ID-һы, мәғлүмәттәр киңлеге ID-һы, валидаторҙар йыйылмаһы, хаталарға сыдамлылыҡ, манифест, маршрутлау ҡағиҙәләре һәм эш өсөн яуаплы хужа бергә тикшерелмәйенсә, яңы псевдонимды эш мөхитенә күсермәгеҙ. Кәрәкле рөхсәттәре булған ғәҙәти ҡулланыусы иҫәбе псевдоним планлаштырыусыһы аша ғәмәлдәге мәғлүмәттәр киңлегендә доменды һәм уның SNS ҡуртымын ала ала; әммә ул яңы асыҡ мәғлүмәттәр киңлеген хәүефһеҙ өҫтәй алмай.

Шәхси йәки ойошма мәғлүмәттәр киңлектәре өсөн каталог үҙгәрештәрен әҙерләргә:

- уникаль мәғлүмәттәр киңлеге һәм һанлы `id`
- бәйләнешле полосаға инеү йәки ғәмәлдәге полосаға тәғәйенләү
- мәғлүмәттәр киңлеге `fault_tolerance`
- унда урынлашырға тейешле күрһәтмәләр йәки иҫәп биләмәләре өсөн маршрутлау ҡағиҙәләре
- UAID мөмкинлектәрен асыҡлаған осраҡта, Space Directory manifest йәки эквивалентлы rollout иҫбатламаһы
- Validator, compliance, settlement һәм monitoring сәйәсәте өсөн идара итеүҙе раҫлау

Тикшереүгә мөмкин булған конфигурация фрагменты ошондай күренә:

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

Операторҙың ҡабул итеүендә түбәндәге ҡапҡалар булырға тейеш:

- `iroha3d --sora --config <config.toml> --trace-config` хәл ителгән узел конфигурацияһын тапшыра
- генерацияланған йәки тикшерелгән манифест хеш һәм ҡултамғалар менән архивланған
- smoke test-тар Taira өҫтөндә үтә, ә Minamoto акцияһына тиклем.
- `/status` үҙгәрештән һуң каталогы планлаштырылған трассаны һәм мәғлүмәт киңлеген күрһәтә.
- `iroha app nexus lane-report --summary` кәрәкле манифестарҙың юҡ булыуын хәбәр итмәй

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Taira урынлаштырыу, smoke testҙар, мониторинг һәм идара итеү иҫбатлауҙары тамамланғандан һуң ғына шул уҡ мәғлүмәттәр киңлеген Minamoto ҡа еткерергә.

## Төрлө биттәр {#related-pages}

- [Iroha 3](/ba/get-started/install-iroha.md) ҡуйыу
- [Iroha 3 аша хәрәкәт итеү CLI ](/ba/get-started/operate-iroha-via-cli.md)
- [Шәхси мәғлүмәттәр базаһы өсөн спонсорлыҡ түләүҙәре](/ba/get-started/private-dataspace-fee-sponsor.md)
- [Torii сикләү пункттары](/ba/reference/torii-endpoints.md)
- [Башланмыш шиғыры](/ba/reference/genesis.md)
