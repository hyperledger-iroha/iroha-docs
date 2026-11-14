---
translation_locale: ba
translation_source: /get-started/sora-nexus-dataspaces.md
translation_source_hash: 3d2285e5a27819897b6dcc6d165c468baead29d2922420728fcfbe2433d36fdd
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# SORA Nexus нигеҙендә эшләү: Taira һәм Minamoto {#build-on-sora-3-taira-and-minamoto}

SORA Nexus Iroha 3 нигеҙендә төҙөлгән асыҡ урынлаштырыу юлдарын тәҡдим итә. Башта Taira-ла төҙөгөҙ һәм күнекмә үткәрегеҙ, һуңынан шул уҡ клиент төҙөлөшөн Minamoto-ға төп селтәр өсөн айырым асҡыстарығыҙ, комиссияларға ысын XOR һәм етештереү мөхитенә рөхсәтегеҙ булғанда ғына күсерегеҙ.

Был ҡулланма асыҡ SORA Nexus селтәрҙәре өсөн Iroha клиентын нисек көйләргә икәнен күрһәтә:

- Taira һынау селтәре `https://taira.sora.org`
- Minamoto төп селтәрендә `https://minamoto.sora.org`

Taira-ны интеграция һынауҙары, һынау аҡсаһы биреү хеҙмәте аша аҡсаландырылған контроль яҙыуҙар һәм урынлаштырыу күнекмәләре өсөн ҡулланығыҙ. Minamoto-ны төп селтәрҙә ҡулланыуға әҙер ғәмәлдәр өсөн генә ҡулланығыҙ. Ике селтәр ҙә комиссияны XOR менән ала:

- Taira асыҡ faucetнан тест селтәрен XOR ҡуллана.
- Minamoto реаль ҡулланыла XOR. Бер ниндәй ҙә Minamoto faucet.

## Төҙөүселәр юлы {#builder-path}

|Аҙым |Taira Тестнет |Minamoto Майннет |
| --------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
|Сеть торошон уҡый башлағыҙ |Ключһыҙ һорау `/status` |Ключһыҙ һорау `/status` |
| Мәғлүмәт киңлеген һайлау            | Ҡушымтаға идара итеүгә буйһонған һыҙат кәрәк булмаһа, асыҡ `universal` ҡулланығыҙ | Шул уҡ мәғлүмәт киңлеген төп селтәр рөхсәтенән һуң ғына ҡулланығыҙ |
|Түләү активын алығыҙ .|Йәмәғәт Taira faucet-ты ҡулланығыҙ |Финансландырылған Minamoto иҫәбенән йәки раҫланған казначейлыҡ ағымынан XOR алыу |
|Тест яҙған |Ҡулланығыҙ faucet менән тәьмин ителгән һынау XOR |Тест инструмент ҡулланырға ярамай; яҙған аҡса реаль XOR |
|Дәртләндереү |Логика, күҙәтеү һәм ҡултамғалау менән эш итеүҙе дауам итегеҙ |Айырым асҡыстар, финанслау һәм иреккә сығарыу контролдәрен ҡулланығыҙ |

Ғәмәли ағым:

1. Клиентты Taira менән эшләү өсөн төҙөгөҙ һәм асыҡ `universal` мәғлүмәт киңлеген ҡулланығыҙ.
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

SORA Nexus-та мәғлүмәт киңлектәре каталогы мәғлүмәт киңлектәрен билдәләй. Һыҙаттар каталогы һыҙаттарҙы айырым билдәләй: һәр һыҙат бер мәғлүмәт киңлегенә һылтана, ә мәғлүмәт киңлегендә бер нисә һыҙат була ала. Клиент `client.toml`-ды үҙгәртеп кенә яңы асыҡ мәғлүмәт киңлеген булдырмай. Клиентты көйләү ике эш башҡара:

1. клиентты уң Torii тамамлау нөктәһенә йүнәлтә
2. уның каноник иҫәбе өсөн селтәр контекстын һәм ҡул ҡуйыу асҡысын һайлай

`AccountId` һәр ваҡыт каноник һәм доменһыҙ, ә `client.toml` эсендә домен көйләүе юҡ: `[account].profile` селтәрҙең I105 префиксын ғына һайлай. Домен контексы псевдонимдарға һәм домен ҡарамағындағы объекттарға ҡарай. Күпселек ҡушымталар өсөн асыҡ `universal` мәғлүмәт киңлегенән башлағыҙ. Домен контексы `domain.dataspace` формаһын ҡуллана, мәҫәлән:

```text
wonderland.universal
```

Яңы ойошма мәғлүмәт киңлеге кәрәк булһа, уны ғәҙәти клиент иҫәбенән теркәргә тырышыу урынына каталог һәм маршрутлау тәҡдиме әҙерләгеҙ. Түбәндәге [Яңы мәғлүмәт киңлеген булдырыу](#_8-provision-a-new-data-space) бүлеген ҡарағыҙ.

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

Төйөн күрһәткән мәғлүмәт киңлектәре һәм һыҙаттар күренешен тикшерегеҙ:

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

Күпер торош һаҡламаған JSON-RPC `POST` һорауҙарын ғына ҡабул итә. Ҡул ҡуйыу материалдарын өҫтәр алдынан уның табыу метамәғлүмәттәрен тикшерегеҙ:

```bash
curl -fsS https://taira.sora.org/v1/mcp \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' \
  -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28","io.modelcontextprotocol/clientCapabilities":{}}}}' \
  | jq '{versions: .result.supportedVersions, server: .result._meta["io.modelcontextprotocol/serverInfo"].name, toolset: .result.capabilities.extensions["org.hyperledger.iroha/tools"].toolsetVersion}'
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
5. Агенттан һәр транзакцияны ебәрер алдынан селтәр тамырын, сылбырҙы, вәкәләтле иҫәпте, күрһәтмә йөкмәткеһен, комиссия активын һәм көтөлгән торош үҙгәрешен хәбәр итеүен талап итегеҙ.
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
- кире ҡағыу хәбәре һәм уңышһыҙлыҡтың рөхсәттәргә, комиссияларға, тикшереүгә, иҫкергән торошҡа йәки хеҙмәт нөктәһенә ирешеүгә бәйле булыу-булмауы

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

Taira күрһәткән асыҡ мәғлүмәт киңлегенең һыҙаттарын сығарығыҙ:

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
# The exact `network_id` from https://taira.sora.org/v1/accounts/capabilities
network_id = "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774"
torii_url = "https://taira.sora.org/"

[account]
profile = "taira"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Өҫкө кимәлдәге `chain` — Taira транзакция сылбырының теүәл идентификаторы, ә `network_id` — һәр ҡултамға бәйләнгән теүәл селтәр идентификаторы. `network_id` йәки `network_id_file`-дың теүәл береһен генә көйләгеҙ. `[account].profile = "taira"` көйләүе Taira I105 сылбыр айырғысын айырым һайлай. Сылбыр идентификаторы иҫәп профилен һайламай.

Уҡыу өсөн генә тикшерегеҙ:

```bash
iroha --config ./taira.client.toml --output-format text ops sumeragi status
```

Яҙыу һынауҙарына тиклем асыҡ диагностикалар Taira үтәү:

```bash
iroha taira doctor --public-root https://taira.sora.org --json
```

Комиссия түләнә торған яҙыу ғәмәлдәрен башҡарыр алдынан Taira иҫәбен һынау аҡсаһы биреү хеҙмәте аша аҡсаландырығыҙ. Әҙер хеҙмәт ағымы [Taira-ла һынау селтәре өсөн XOR алыу](#_4-get-testnet-xor-on-taira) бүлегендә бирелгән.

Иҫәп аҡсаланғандан һуң, ҡул ҡуйылған журнал инструкцияһы яҙыуҙың тәүге тикшереүе булараҡ өҫтәмә рәүештә ҡулланыла ала. Һәр ебәрелгән транзакция комиссия түләүсене атай, һәм CLI ҡул ҡуйыр алдынан теүәл комиссияны күрһәтә:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  tx ping --msg "taira smoke test"
```

Команда раҫлауҙы көтә. Taira — асыҡ һынау селтәре, шуға күрә сират тулғанда, һынау аҡсаһы биреү хеҙмәте үҙе эшләһә лә, бәйләнеш тикшереүе уңышһыҙ була ала. `taira doctor` сираттың тулы булыуын хәбәр итһә йәки бәйләнеш тикшереүе `PRTRY:NEXUS_FEE_ADMISSION_REJECTED` ҡайтарһа, быны клиент конфигурацияһы хатаһы тип һанар алдынан көтөгөҙ һәм ҡабатлап ҡарағыҙ.

Күҙәтеүһеҙ тәүге тикшереүҙәр өсөн бәйләнеш тикшереүен сикләнгән ҡабатлау циклына индерегеҙ:

```bash
ok=false
for attempt in 1 2 3 4 5; do
  iroha --config ./taira.client.toml --fee-payer authority \
    tx ping --msg "taira smoke test" && ok=true && break

  sleep 60
done

test "$ok" = true
```

`iroha taira doctor` етди уңышһыҙлыҡтар күрһәткән осраҡта ҡабаттан һынауҙы туҡтатығыҙ. сираттың туйыныуы һәм түләү ҡабул итеүҙән баш тартыу - йәмәғәт тест селтәре шарттары; DNS, TLS йәки `status = "fail"` диагностикалары юҡ.

## SORA Nexus хисапты булдырыу ID {#generate-a-sora-nexus-account-id}

SORA Nexus иҫәп идентификаторы — иҫәптең асыҡ асҡысынан һәм маҡсатлы селтәр префиксынан алынған каноник I105 адресы. Бер үк асыҡ асҡыс Taira менән Minamoto-ла төрлө идентификаторҙарға кодлана; етештереү мөхите ҡулланыусылары Minamoto өсөн айырым асҡыстар пары булдырырға тейеш.

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

SORA Nexus API-һы йәки CLI командаһы каноник иҫәп идентификаторын һораған һәр урында, мәҫәлән, баланс һорауҙарында, ҡәтғи иҫәп яландарына йәки псевдоним бәйләнештәренә, алынған идентификаторҙы ҡулланығыҙ. Тап килгән шәхси асҡысты клиент конфигурацияһында һаҡлағыҙ һәм `[account].profile = "taira"` йәки `[account].profile = "minamoto"` аша шул уҡ асыҡ селтәрҙе һайлағыҙ.

ID генерацияһы үҙенән-үҙе финансланған сылбыр иҫәбенә барлыҡҡа килмәй. Taira өҫтөндә, faucet булдыра һәм тестнет яҙған өсөн иҫәпте финанслай ала. Minamoto өҫтөндә, раҫланған төп селтәрҙе ҡушыу йәки ҡаҙна ағымдарын ҡулланыу .

### Ключтарҙы һаҡлау һәм уларҙы һаҡлап ҡалыу {#key-storage-and-backup}

Иҫәпкә ID һәм асыҡ асҡыс бүленә ала. Бер-береһенә тап килгән шәхси асҡыс, пароль, орлоҡ һәм кире ҡайтарыу материалдары йәшерен һаҡланырға тейеш.

SORA Nexus иҫәбе өсөн ошо алымдарҙы ҡулланығыҙ:

- Хосуси асҡыстарҙы шифрлы пароль менеджерында, аппарат ярҙамында тәьмин ителгән клавиатура магазинында йәки махсус ҡултамғалау хеҙмәтендә һаҡларға. Ключтарҙы сығанаҡ контроллерына commit йәки продукция ключтарын тышлыҡ тарихында, журналдарҙа, чатта, билеттарҙа йә шифрланмаған резервтағы күсермәләрҙә ҡалдырығыҙ.
- Һәр келәт йәки етештереү имзалаусы өсөн үҙенсәлекле юғары энтропиялы пароль фразаһын ҡулланығыҙ. Паролдәрҙе шифрланған шәхси асҡыс менән бер үк файлда йәки резерв тупланмаһында түгел, ә пароль менеджерында йә бүленгән һаҡлау процесында һаҡлау.
- Taira һәм Minamoto асҡыстарын айырым һаҡлағыҙ. Taira асҡыстарын бер тапҡыр ҡулланылған һынау селтәре материалы итеп, Minamoto асҡыстарын етештереү фонды органы итеп ҡарағыҙ.
- Ябыҡ асҡыстың, асыҡ асҡыстың, иҫәп идентификаторының, иҫәп профиленең һәм ҡул ҡуйыусыны тергеҙеү өсөн кәрәкле иҫәпте тергеҙеү йә һаҡлау яҙмаларының резерв күсермәһен булдырығыҙ. Селтәр контексы булмаған ябыҡ асҡысты тергеҙгәндә яңылыш ҡулланыу еңел.
- Производство имзалаусылары өсөн кәмендә бер шифрланған офлайн резерв коды һәм географик яҡтан айырым бер шифрлы резерв коды һаҡлағыҙ. Өҫтәмә күсермәгә бәйле тиклем бәләкәй генә уҡырға ғына операция менән тергеҙеү һынау.
- Әгәр шәхси асҡыс, пароль фразаһы, резерв медиаһы йәки ҡултамғалау хостинг асыҡланған булһа, ҡултамғаһын әйләндереү йәки алмаштырыу.

Тулыраҡ мәғлүмәт өсөн ҡарағыҙ [Сохранение криптографических ключей](/ba/guide/security/storing-cryptographic-keys.md) һәм [Пароль хәүефһеҙлеге](/ba/guide/security/password-security.md) .

## 4. Тестнетҡа XOR саҡырып, Taira {#_4-get-testnet-xor-on-taira}

CLI-ның әҙер һынау аҡсаһы биреү хеҙмәте ағымы аша һынау селтәре XOR-ын һорағыҙ. Хеҙмәт `taira.client.toml` эсендә көйләнгән иҫәпте аҡсаландыра һәм ул әле булмаһа, башта теркәй. Эш ағымы:

1. Һынау аҡсаһы биреү хеҙмәтенең асыҡ сәйәсәтен уҡығыҙ: хеҙмәт вәкәләте, комиссия активы һәм сумма.
2. Талапты әҙерләгеҙ. CLI эш иҫбаты мәсьәләһен сисә, Torii әҙерләгән һәм ҡул ҡуйған теүәл транзакцияны тикшерә һәм уны ебәрмәйенсә шәхси журнал каталогында һаҡлай.
3. Һаҡланған транзакцияны бер тапҡыр ебәрегеҙ.
4. Комиссия түләнә торған яҙыу ғәмәлдәрен ебәрер алдынан актив балансы күренгәнен көтөгөҙ.

Сәйәсәтте уҡығыҙ:

```bash
curl -fsS https://taira.sora.org/v1/accounts/faucet/policy \
  -H 'Accept: application/json' \
  | tee ./taira-faucet-policy.json \
  | jq .
```

Яуап ошондай формаға эйә:

```json
{
  "schema_version": 1,
  "network_id": "hash:4978D0BD15FC32B834672B27BBD8A03653B1DF060A1EEE7E9374D29AF3886D91#6774",
  "network_prefix": 369,
  "authority": "<TAIRA_FAUCET_AUTHORITY_I105>",
  "asset_definition_id": "6TEAJqbb8oEPmLncoNiMRbLEK6tw",
  "amount": "25000"
}
```

Сәйәсәт — ҡул ҡуйылмаған табыу мәғлүмәттәре. Автоматлаштырыу һәр яуапҡа ышаныу урынына көткән вәкәләтте, актив билдәләмәһен һәм сумманы беркетергә тейеш. `prepare` һеҙ биргән ҡиммәттәрҙән айырылған әҙер транзакцияны кире ҡаға.

Талапты әҙерләгеҙ һәм ебәрегеҙ:

```bash
export TAIRA_FEE_ASSET="$(
  jq -er '.asset_definition_id' ./taira-faucet-policy.json
)"

iroha --config ./taira.client.toml --fee-payer authority \
  taira account faucet prepare \
  --journal ./taira-faucet \
  --issuer "$(jq -er '.authority' ./taira-faucet-policy.json)" \
  --asset-definition "$TAIRA_FEE_ASSET" \
  --amount "$(jq -er '.amount' ./taira-faucet-policy.json)"

iroha --config ./taira.client.toml \
  taira account faucet submit --journal ./taira-faucet
```

`prepare` журнал каталогын шәхси итеп булдыра һәм булғанын алмаштырыуҙан баш тарта, шуға күрә һәр талап өсөн яңы каталог ҡулланығыҙ. Һынау аҡсаһы биреүсе — асыҡ һынау селтәре хеҙмәте. `submit` `Pending` хәбәр итһә, көтөү ваҡыты сыҡһа йә `502` алһа, икенсе талап әҙерләү урынына шул уҡ конфигурация һәм журнал менән `taira account faucet resume` эшләтегеҙ. Иҫкергән эш иҫбаты терәге `prepare`-ҙы уңышһыҙ итә; яңы журнал каталогында яңынан әҙерләгеҙ.

Һуңынан үҙ түләүҙәр менән килешеүҙәрҙе тапшырыуҙан алда финансланған актив буйынса һорау алыу үткәрегеҙ:

```bash
iroha --config ./taira.client.toml ledger asset get \
  --definition "$TAIRA_FEE_ASSET" \
  --account <TAIRA_I105_ACCOUNT_ID>
```

Талап ҡулланылып, актив әле күренмәһә, яҙыу ғәмәлдәрен ебәрер алдынан көтөгөҙ һәм уҡыуҙы ҡабатлағыҙ.

Taira тест селтәре фонды өсөн генә тәғәйенләнгән. Minamoto ағымдарҙа тест селтәрен, XOR faucet иҫәптәрен йәки Taira canary ҡултамғаларын ҡулланырға ярамай.

## 5. Minamoto клиент конфигурацияһын булдырыу. {#_5-create-a-minamoto-client-config}

Minamoto өсөн айырым асҡыс парын ҡулланығыҙ. Taira асҡыстарын төп селтәр өсөн ҡабатланмағыҙ.

`minamoto.client.toml` булдырыу:

```toml
chain = "00000000-0000-0000-0000-000000000753"
# The exact `network_id` from https://minamoto.sora.org/v1/accounts/capabilities
network_id = "<MINAMOTO_NETWORK_ID>"
torii_url = "https://minamoto.sora.org/"

[account]
profile = "minamoto"
public_key = "<ED25519_PUBLIC_KEY_HEX>"
private_key = "<ED25519_PRIVATE_KEY_HEX>"

[transaction]
time_to_live_ms = 100000
status_timeout_ms = 15000
nonce = false
```

Өҫкө кимәлдәге `chain` — SORA Nexus төп селтәренең ағымдағы сылбыр идентификаторы, ә `network_id` — Minamoto-ның теүәл селтәр идентификаторы; тәүге ҡул ҡуйылған ғәмәлдән алда уны мөмкинлектәр маршруты аша уҡығыҙ. `[account].profile = "minamoto"` Minamoto I105 сылбыр айырғысын һайлай; нөктәнең хост исеме һәм сылбыр идентификаторы уны үҙенән-үҙе һайламай.

Minamoto асыҡ асҡысын уның I105 каноник иҫәбенә ID префиксы менән үҙгәртергә:

```bash
iroha tools address convert --profile minamoto <ED25519_PUBLIC_KEY_HEX>
```

Иҫәпкә аҡса тупланғанға тиклем һәм төп селтәрҙе ҡушыу йәки идара итеү ағымы аша финансланғанға тиклем уҡый торған яҡтан ғына тикшереүҙәр үткәреү:

```bash
iroha --config ./minamoto.client.toml --output-format text ops sumeragi status
```

Taira һынау аҡсаһы биреү хеҙмәте йәки тәүге тикшереү командаларын Minamoto-ға ҡаршы эшләтмәгеҙ.

## 6. Фонд а Minamoto Бухгалтер иҫәбенә XOR {#_6-fund-a-minamoto-account-with-xor}

Minamoto түләүҙәр етештереү менән түләнә XOR, һәм Minamoto-ның йәмәғәт faucet-ы юҡ. Конфигурацияланған иҫәбенә раҫланған төп селтәрҙе ҡушыу йәки казначейлыҡ күсереү аша аҡса түләгеҙ, йәки ғәмәлдәге финансланған Minamoto иҫәбенән XOR алығыҙ.

ID һәм финанслауҙы уҡыу өсөн генә тикшереүҙәр менән тикшерегеҙ, яҙма тапшырыуҙан алда. Minamoto XOR-ны производство средстволары итеп ҡарағыҙ: башта шул уҡ операцияны Taira буйынса күнегегеҙ, айырым етештереү асҡыстарын һаҡлағыҙ һәм төп селтәр транзакцияһын ҡабаттан ҡуйып була тип иҫәпләмәгеҙ.

Taira XOR Minamoto түләүҙәрен түләй алмай.Testnet балансы һәм faucet өсөн дәғүәҙәр Minamoto гә күсерелмәй.

## 7. Ғәмәлдәге мәғлүмәт киңлегендә эшләү {#_7-work-inside-an-existing-data-space}

Мәғлүмәт киңлеге эсендәге реестр объекттары өсөн тулы аныҡланған домен исемдәрен ҡулланығыҙ. Мәҫәлән, асыҡ мәғлүмәт киңлегендәге проект домены түбәндәгене ҡулланырға тейеш:

```text
apps.universal
```

Иҫәпкә тейешле рөхсәттәре булғандан һуң, домен өсөн йәшерен булмаған `AliasSetupPlanRequestV1` ниәтен булдырығыҙ һәм декларатив планерҙы ҡулланығыҙ:

```bash
iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-apps-domain.intent.json \
  --plan-file ./taira-apps-domain.plan.json

iroha --config ./taira.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./taira-apps-domain.plan.json
```

Minamoto өсөн төп селтәрҙең айырым ниәтен һәм планын булдырығыҙ һәм раҫлағыҙ. План сылбырға, вәкәләтле иҫәпкә, ағымдағы торош терәгенә һәм һуңғы ваҡытҡа бәйләнгән, шуға күрә Taira планын төп селтәргә күсереп йәки унда ҡабат башҡарып булмай:

```bash
iroha --config ./minamoto.client.toml \
  app alias setup plan \
  --intent-file ./minamoto-apps-domain.intent.json \
  --plan-file ./minamoto-apps-domain.plan.json

iroha --config ./minamoto.client.toml --fee-payer authority \
  app alias setup apply --plan-file ./minamoto-apps-domain.plan.json
```

Иҫәп псевдонимдары шул уҡ мәғлүмәт киңлеге суффиксын ҡуллана:

```text
alice@apps.universal
alice@universal
```

Ҡаты иҫәп-хисап ҡырҙарында һаман да каноник ҡулланыла I105 иҫәбенә IDs. Алфавиттарҙы кеше уҡый алған бәйләнештәр тип иҫәпләгеҙ, улар каноник ҡағиҙәләренә тура килә IDs.

## 8. Яңы мәғлүмәт киңлеген булдырыу {#_8-provision-a-new-data-space}

Яңы мәғлүмәт киңлеге — оператор һәм идара итеү үҙгәреше. Асыҡ Torii нөктәһе трафикты көйләнгән мәғлүмәт киңлектәренә йүнәлтә ала, әммә билдәһеҙ мәғлүмәт киңлеге псевдонимдарын кире ҡаға.

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

Һыҙат идентификаторы, мәғлүмәт киңлеге идентификаторы, валидаторҙар йыйылмаһы, хаталарға сыдамлылыҡ, манифест, маршрутлау ҡағиҙәләре һәм эш өсөн яуаплы хужа бергә тикшерелмәйенсә, яңы псевдонимды эш мөхитенә күсермәгеҙ. Кәрәкле рөхсәттәре булған ғәҙәти ҡулланыусы иҫәбе псевдоним планлаштырыусыһы аша ғәмәлдәге мәғлүмәт киңлегендә доменды һәм уның SNS ҡуртымын ала ала; әммә ул яңы асыҡ мәғлүмәт киңлеген хәүефһеҙ өҫтәй алмай.

Шәхси йәки ойошма мәғлүмәт киңлеге өсөн түбәндәгеләр менән каталог үҙгәреше әҙерләгеҙ:

- уникаль мәғлүмәт киңлеге псевдонимы һәм һанлы `id`
- бәйләнешле полосаға инеү йәки ғәмәлдәге полосаға тәғәйенләү
- мәғлүмәт киңлегенең `fault_tolerance` ҡиммәте
- унда урынлашырға тейешле күрһәтмәләр йәки иҫәп биләмәләре өсөн маршрутлау ҡағиҙәләре
- мәғлүмәт киңлеге UAID мөмкинлектәрен асҡанда Киңлектәр каталогы манифесты йәки уға тиң таратыу дәлилдәре
- валидаторҙар, талаптарға ярашлылыҡ, иҫәпләшеү һәм мониторинг сәйәсәте өсөн идара итеү раҫлауы

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
instruction = "transfer::asset"
description = "Route asset transfers to the payments dataspace"
```

Операторҙың ҡабул итеүендә түбәндәге ҡапҡалар булырға тейеш:

- `iroha3d --sora --config <config.toml> --trace-config` хәл ителгән узел конфигурацияһын тапшыра
- генерацияланған йәки тикшерелгән манифест хеш һәм ҡултамғалар менән архивланған
- smoke test-тар Taira өҫтөндә үтә, ә Minamoto акцияһына тиклем.
- үҙгәрештән һуңғы `/status` каталогы тәғәйенләнгән һыҙатты һәм мәғлүмәт киңлеген күрһәтә
- `iroha app nexus lane-report --summary` кәрәкле манифестарҙың юҡ булыуын хәбәр итмәй

```bash
curl -fsS https://taira.sora.org/status \
  -H 'Accept: application/json' \
  | jq '.teu_lane_commit[] | select(.dataspace_alias == "payments")'
```

Taira-ла урынлаштырыу, тәүге тикшереүҙәр, мониторинг һәм идара итеү дәлилдәре тамамланғас ҡына шул уҡ мәғлүмәт киңлеген Minamoto-ға күсерегеҙ.

## Төрлө биттәр {#related-pages}

- [Iroha 3](/ba/get-started/install-iroha.md) ҡуйыу
- [Iroha 3 аша хәрәкәт итеү CLI ](/ba/get-started/operate-iroha-via-cli.md)
- [Шәхси мәғлүмәт киңлеге өсөн комиссияларҙы бағыусы аша түләү](/ba/get-started/private-dataspace-fee-sponsor.md)
- [Torii сикләү пункттары](/ba/reference/torii-endpoints.md)
- [Башланмыш шиғыры](/ba/reference/genesis.md)
