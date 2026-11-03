---
translation_locale: kk
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 3287a6bbaf06ec92ebbe9ac33a8294d4e1d232bc01fd6a5da13ddd166c620965
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# Ауыстырылатын мүлік {#fungible-assets}

## Нәтиже {#outcome}

Жұмыс істеп тұрған Taira желісіндегі актив анықтамаларын тексеріп, жасалған жергілікті желіде шығару, аудару, жою және балансты тексеру ағынын толық орындаңыз. Рецепт канондық, префикссіз Base58 актив анықтамасы ID-лерін, доменсіз I105 есептік жазба ID-лерін және ақыны айқын төлеуді пайдаланады.

## Алдын ала шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан жаңа нұсқасы, Node.js 24 және ағымдағы CLIs: `iroha` мен `kagami`.
- Тек оқу үшін Taira қолжетімділік.
- Жазу қадамдары үшін: [Iroha-ны іске қосу](/kk/get-started/launch-iroha.md) бетіндегідей `kagami localnet generate --peers 4 --out-dir ./localnet` арқылы жасалған және `--asset-definition-id 66owaQmAQMuHxPzxUN3bqZ6FJfDa` қосылған жергілікті желі. Ол `./localnet/client.toml` файлын және `http://127.0.0.1:8080` мекенжайындағы Torii-ді береді.

## Қадамдар {#steps}

### 1. Криптографиялық қолтаңба жоқ Taira анықтамаларын тексеру {#_1-inspect-taira-definitions-without-a-signer}

Актив анықтамаларында мөлдір емес Base58 ID, көрсетілетін атау, шығару саясаты, сандық масштаб, міндетті емес алиас, иесі, міндетті емес иелік ететін домен немесе деректер кеңістігі, баланс саясаты және жалпы саны болады. Нақты баланс сонымен қатар оны ұстаушы есептік жазбаны және міндетті емес деректер кеңістігінің аясын қамтиды.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[]
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity]
    | @tsv'
```

```js [Node.js]
const response = await fetch(
  'https://taira.sora.org/v1/assets/definitions?limit=10',
  { headers: { Accept: 'application/json' } },
)
if (!response.ok) throw new Error(`Taira returned HTTP ${response.status}`)

const { items } = await response.json()
for (const definition of items) {
  console.log({
    id: definition.id,
    name: definition.name,
    mintable: definition.mintable,
    total: definition.total_quantity,
  })
}
```

:::

`node taira-assets.mjs` арқылы JavaScript формасын іске қосыңыз. Қоғамдық актив идентификаторлары таза Base58 мәндері болып табылады; `cookbook_credit#wonderland.universal` сияқты оқылатын мән — бұл сол идентификаторлардың біріне шешілетін лақап ат.

### 2. Жергілікті рұқсат етілген басты және мақсатты дайындау {#_2-prepare-the-local-authority-and-destination}

Жасалған конфигурациядағы ашық кілттен жергілікті уәкілетті субъектіні есептеп шығарыңыз, содан кейін жаңа алушы есептік жазбасы үшін кілттер жұбын жасап, оны тіркеңіз. Ешбір жеке кілт басып шығарылмайды.

```bash
LOCAL_CONFIG='./localnet/client.toml'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
SOURCE_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

kagami keys --out-dir ./cookbook-recipient
DESTINATION_ACCOUNT="$(
  iroha --config "$LOCAL_CONFIG" tools address convert \
    "$(cat ./cookbook-recipient/public.key)"
)"
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  account register --id "$DESTINATION_ACCOUNT"
```

### 3. Клиентке тиесілі сандық анықтаманы пайдалану {#_3-use-a-client-owned-numeric-definition}

Генезистен тыс анықтама қол қоюшыға тиесілі иелік ететін `--domain` астында тіркеледі, ал жасалған жергілікті желінің клиентіне ешбір домен тиесілі емес. `--asset-definition-id` арқылы жасалған жергілікті желіде бұл анықтама бұрыннан бар: генезис оны шектелмеген масштабпен тіркеді, клиентті оның иесі етті және клиентке 1,000,000,000 бірлік шығарды.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Бұл ID-ді Taira-да қайта пайдаланбаңыз. Жалпыға ашық желіде тіркеу үшін жаңа канондық ID, сіздің есептік жазбаңызға тиесілі иелік ететін домен (`ledger asset definition register` командасына `--domain` ретінде беріледі), кез келген алиас үшін `CanManageAssetDefinitionAlias` рұқсатын беру және ақыны қаржыландыру қажет.

### 4. шығару, беру және жою {#_4-mint-transfer-and-burn}

Барлық жазу командалары төлейтін тарап ретінде авторизация басшысын нақты көрсетеді. CLI транзакцияны қол қою алдында дәл көрсетеді және әдепкі бойынша күтіп тұрады.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset mint \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 100.00

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset transfer \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --to "$DESTINATION_ACCOUNT" \
  --quantity 25.50

iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger asset burn \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT" \
  --quantity 10.00
```

Жоюдан кейін дереккөз балансы `1000000064.50`, тағайындалған балансы `25.50`, және жалпы сан `1000000090.00` күтіңіз.

::: warning Рұқсат шегі

Taira-да әр жазу операциясы үшін `--fee-payer authority` пайдаланыңыз; CLI қол қоюдан бұрын Taira ақы активіндегі нақты ақы бағасын алады. Тіркеу үшін анықтаманың `--domain` доменіне иелік ету қажет, ал алиасқа қосымша `CanManageAssetDefinitionAlias` керек. Шығару үшін анықтамаға иелік ету немесе `CanMintAssetWithDefinition` не `CanMintAssetToAccount` рұқсатына ие болу қажет; аудару мен жою бастапқы баланс бойынша өкілеттікті талап етеді. Faucet қаржыландырған есептік жазба автоматты түрде эмитент болып саналмайды.

:::

## Растау {#verify}

Екі нақты балансты, содан кейін анықтаманы оқыңыз. Күй өзгергеннен кейінгі осы сұраулар — сәттілік өлшемі; тек жіберу түбіртегінің өзі жеткіліксіз.

```bash
iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$SOURCE_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset get \
  --definition "$ASSET_DEFINITION_ID" \
  --account "$DESTINATION_ACCOUNT"

iroha --config "$LOCAL_CONFIG" ledger asset definition get \
  --id "$ASSET_DEFINITION_ID"
```

Қолданбадағы тексерістер сандық мәндерді бинарлы қалқымалы нүкте мәндері емес, жылжымалы нүктелерсіз ондық сандар ретінде салыстыруы керек және тек есепшотты емес, анықтама идентификаторын да тексеруі қажет.

## Ақауларды жою {#troubleshooting}

- Ішінде `#` бар ID – бұл жалған ат немесе нақты баланс литералы, жеке протокол-стандарт активінің анықтамасы ID емес. `--definition` арқылы тек Base58 мәнін қолданыңыз немесе `--definition-alias` арқылы байланған атты өткізіңіз.
- `Scale` қателері санның анықтамада рұқсат етілгеннен көп бөлшек саны бар екенін білдіреді.
- `Mintability` қабылдамау `Once`, `Not` немесе `Limited(n)` саясаттың шығаруға мүмкіндігі таусылғанын немесе рұқсат етілмегенін білдіреді. Тарихты қайта жазбаңыз; анықтамалық сұрау арқылы қайтарылған саясатты пайдаланыңыз.
- 2-қадам мақсатты есептік жазбаны айқын тіркейді, сондықтан есептік жазбаларды қабылдау режимі `ExplicitOnly` болғанда да аудару жұмыс істейді. Ұқсас аталған CLI қорғауы есептік жазбаны да, балансты да тіркемейді; ол басқа нұсқау қосудың орнына операцияны тоқтатады.
- Ақының қабылданбауы нұсқаудың қалыпты сәтті орындалуынан бұрын болады. Төлеушіні таңдаңыз, CLI ақы бағасындағы ақы активі мен максимумды тексеріп, сол балансты растаңыз.
- Сол жергілікті желіде қайта іске қосу алдыңғы баланстардан басталады, ал `kagami keys` бар `./cookbook-recipient` каталогын қабылдамайды. Жаңадан жасалған жергілікті желіні іске қосып, сол каталогты жойыңыз немесе абсолютті мәндердің орнына баланс өзгерістерін салыстырыңыз. Base58 ID орнына ешқашан дұрыс құрылмаған кездейсоқ жолды қолданбаңыз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Бекітілген бастапқы код нұсқасында активтердің өмірлік циклін біріктіру тесттері](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/asset.rs)
- [Rust байланған дереккөз кодының нұсқасында активті құру мысалдары](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/iroha/examples/tutorial.rs)
- [Активтер](/kk/blockchain/assets.md)
- [Нұсқаулар](/kk/blockchain/instructions.md)
- [Рұқсат белгішелері](/kk/reference/permissions.md)
- [JavaScript және TypeScript](/kk/guide/tutorials/javascript.md)
