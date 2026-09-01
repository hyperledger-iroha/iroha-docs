---
translation_locale: kk
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 29f2bdb390fc93b97f8ed9108634f70e21ba747c8606fb84093d37e9586516c1
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Ауыстырылатын мүлік {#fungible-assets}

## Нәтиже {#outcome}

Тірі Taira актив анықтамаларын тексеріп, тізімін толтырыңыз, жергілікті желіде жасалған өндіріс бойынша шығару, беру, жою және балансын тексеру ағынын жүргізіңіз. Рецепт бір протоколдық стандартқа сай префикссіз Base58 актив анықтамасы ID-ларын, доменмен сәйкестендірілген баламаларды, доменсіз I105 есеп-шот ID-ларын және нақты төлем төлеуді пайдаланады.

## Алдын ала шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі нұсқа, Node.js 24, және қазіргі `iroha` CLI.
- Тек оқу үшін Taira қолжетімділік.
- Жазбаша нұсқаулық үшін [Жіберу Iroha](/kk/get-started/launch-iroha.md) құрастырған жергілікті желі, `http://127.0.0.1:8080` үстіндегі `./localnet/client.toml` және Torii бар.

## Қадамдар {#steps}

### 1. Криптографиялық қолтаңба жоқ Taira анықтамаларын тексеру {#_1-inspect-taira-definitions-without-a-signer}

Актив анықтамалары түсініксіз Base58 идентификаторын, көрсету атауын, актив шығару саясатын, сандық шкаланы, таңдалған жағдайда лақап атын, иесін және жалпы санын қамтиды. Нақты баланс сонымен қатар оны ұстаушы есепшотын және таңдалған жағдайда деректер кеңістігі аясын қамтиды.

::: code-group

```bash [curl]
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/assets/definitions?limit=10' \
  | jq -r '.items[] \
    | [.id, .name, .mintable, (.spec.scale // "unconstrained"), .total_quantity] \
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

Жасалған баптаудан жергілікті уәкілетті субъектіні ашық кілттен шығарыңыз және алушы ретінде басқа тіркелген есеп жазбасын таңдаңыз. Жеке кілт басып шығарылмайды.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
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

DESTINATION_ACCOUNT="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg source "$SOURCE_ACCOUNT" \
      '[.items[].id | select(. != $source)][0]'
)"
```

### 3. Сандық анықтаманы тіркеу {#_3-register-a-numeric-definition}

Бұл тек жергілікті ID префиксі жоқ дұрыс Base58 актив-анықтама мекенжайы болып табылады. АлIAS адамға оқылатын `domain.dataspace` проекцияны қамтамасыз етеді. Масштаб `2` екі бөлшек санға мүмкіндік береді; `--mint-once` болмаған жағдайда әдепкі `Infinitely` саясаты сақталады.

```bash
ASSET_DEFINITION_ID='66owaQmAQMuHxPzxUN3bqZ6FJfDa'
ASSET_ALIAS='cookbook_credit#wonderland.universal'

iroha --config "$LOCAL_CONFIG" \
  --machine \
  --fee-payer authority \
  ledger asset definition register \
  --id "$ASSET_DEFINITION_ID" \
  --name cookbook_credit \
  --description 'Local cookbook credit' \
  --alias "$ASSET_ALIAS" \
  --scale 2
```

Оны Taira бойынша қайта пайдаланбаңыз. Қоғамдық блокчейн желісіне тіркелу үшін жаңадан бір протокол стандартты ID, сіздің қосымшаңызға арналған домен/алыс, ақы қаржыландыруы және бағдарламалық қамтамасыз ету жұмыс ортасының актив тіркеу рұқсаты қажет.

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

Жоюдан кейін дереккөз балансы `64.50`, тағайындалған балансы `25.50`, және жалпы сан `90.00` күтіңіз.

::: warning Рұқсат шегі

Taira үстіне краннан алынған `taira.tx-metadata.json` қосып, әр жазу үшін `--fee-payer authority` пайдаланыңыз. Тіркеу және шығару үшін активті валидатордың рұқсаты қажет; аудару және жою үшін бастапқы балансқа қатысты уәкілетті субъект қажет. Тестнетке қаржыландырылған аккаунт автоматты түрде шығарушы болмайды.

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
- 2-қадам саналы түрде тіркелген тағайындалған есепшотты таңдайды. Егер активті қабылдау `ExplicitOnly` болса, тағайындалған балансты уәкілетті тұлға арқылы қамтамасыз етіңіз аударма жасамас бұрын ағын. Ұқсас аталған CLI сақшы есепшот немесе баланс тіркемейді; ол қосымша нұсқау қосудың орнына тоқтатады.
- Төлемнің қабылданбауы қалыпты нұсқаулықтың сәтті орындалуынан бұрын болады. Төлеушіні таңдаңыз, желінің төлем активінің метадеректерін қолданыңыз және оның балансын тексеріңіз.
- Егер алдыңғы іске қосудан тұрақты жергілікті анықтама бұрыннан бар болса, жаңа жасалған localnet-ті іске қосыңыз немесе оның бар күйімен жалғастырыңыз. Base58 ID үшін дұрыс емес кездейсоқ жолды ешқашан алмастыра бермеңіз.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [Бекітілген бастапқы код нұсқасында активтердің өмірлік циклін біріктіру тесттері](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust байланған дереккөз кодының нұсқасында активті құру мысалдары](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Активтер](/kk/blockchain/assets.md)
- [Нұсқаулар](/kk/blockchain/instructions.md)
- [Рұқсат белгішелері](/kk/reference/permissions.md)
- [JavaScript және TypeScript](/kk/guide/tutorials/javascript.md)
