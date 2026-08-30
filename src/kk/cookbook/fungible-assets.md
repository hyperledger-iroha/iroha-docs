---
translation_locale: kk
translation_source: /cookbook/fungible-assets.md
translation_source_hash: 669b5a1c12e9ab6ffb64e149148993e7b924feb29c6fa4db883a2065f58ecd7e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Қатты активтер {#fungible-assets}

## Нәтижесі {#outcome}

Тікелей Taira активтердің анықтамаларын тексеріп, құрылған жергілікті желідегі тіркелгі, монета, трансферт, күйдіру және баланс тексеру ағынын толтырады. рецепт қаноникалық бейтарап Base58 актив-дефинициясы IDs, домендік білікті атаулар, доменсіз I105 шот IDs және айқын алым төлеуді пайдаланады.

## Алдын ала талаптар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі, Node.js 24, және ток `iroha` CLI.
- Тек оқуға арналған Taira қатынасы.
- Жазу үдерісі үшін [Жалпы желі Iroha](/kk/get-started/launch-iroha.md) іске қосылған, `./localnet/client.toml` және Torii `http://127.0.0.1:8080` арқылы құрылған.

## Қадамдар {#steps}

### 1. Taira анықтамаларын қолтаңбаламаушысыз тексеру {#_1-inspect-taira-definitions-without-a-signer}

Активтердің анықтамалары мөлдір емес Base58 ID, дисплей атауымен, Сұраныссыздық саясаты, сандық масштаб, ерікті аты-жөндер, меншік иесі және жалпы мөлшері. Конкреттік баланс сондай-ақ оның иеленушісінің шотына және таңдаулы деректер кеңістігінің ауқымына кіреді.

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

Жүгіру JavaScript формасы `node taira-assets.mjs`. Мемлекеттік активтер IDs бос Base58 мәндері; оқылатын мәні, мысалы: `cookbook_credit#wonderland.universal` осылардың біріне байланысты IDs.

### 2. Жергілікті билік пен мақсатты дайындау {#_2-prepare-the-local-authority-and-destination}

Жергілікті билікті генерацияланған конфигурациядағы мемлекеттік кілттен шығарып, алушы ретінде басқа тіркелді шотты таңдаңыз.

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

### 3. Сандық анықтаманы тіркеңіз {#_3-register-a-numeric-definition}

Бұл жергілікті ғана ID жарамды префикссіз Base58 активтер анықтамасы адресі. Алғаш атау адам оқитын `domain.dataspace` проекциясын береді. Шкала `2` екі бөлшекті цифрға мүмкіндік береді; `--mint-once` қалдыру әдеттегі `Infinitely` саясатын сақтайды.

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

ID-ді Taira -да қайта пайдаланбаңыз. Қоғамдық желіге тіркеу үшін жаңа каноникалық ID, сіздің өтінішіңізге бөлінген домен/алтын атаулар, алымдарды қаржыландыру және жұмыс уақытының активтерді тіркеу рұқсаты қажет.

### 4. Минда, көшіру және жағу {#_4-mint-transfer-and-burn}

Барлық жазу командалары ақы төлеуші органды анық таңдап алады. CLI қолтаңбалаудан бұрын нақты транзакцияны келтіреді және әдетті түрде күтеді.

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

Өрттен кейін, бастапқы балансты `64.50`, мақсат балансын `25.50` және жалпы көлемді `90.00` күтіңіз.

::: warning Рұқсат беру шегі

Taira-де краннан алынған `taira.tx-metadata.json` тіркеліп, әрбір жазу үшін `--fee-payer authority` қолданыңыз. Тіркеу және майлау белсенді растаушының рұқсатын қажет етеді; көшіру мен күйдіру бастапқы балансқа өкілеттік беруді талап етеді. краннан қаржыландырылған шот автоматты түрде эмитент болып табылмайды.

:::

## Тексеру {#verify}

Конкреттік тепе-теңдіктерді, содан кейін анықтаманы оқыңыз. Бұл мемлекеттік сұраныстан кейінгі сауалдар табысқа жету критерийі болып табылады; тапсырудың квитанциясы өздігінен емес.

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

Қолданбалық мәлімдемелер сандық мәндерді тұрақты нүктелік ондықшалар ретінде салыстыруы керек, ал қосалқы жылжымалы нүктелік мәндер емес және ID анықтамасын және есепке тексеруі тиіс.

## Қиындықтарды шешу {#troubleshooting}

- Қалған ID құрамында `#` аты-жөні немесе нақты баланс сөзбе-сөз емес, каноникалық актив анықтамасы ID. Ашық Base58 мәнін қолданыңыз `--definition`, немесе бұрышталған баянды `--definition-alias`.
- `Scale` қатесі - бұл белгілі бір санның анықтамасы рұқсат еткеннен көп фракциялық цифрлары бар деген сөз.
- `Mintability` қабылданбауы - `Once`, `Not` немесе `Limited(n)` саясаты сынықтырып тастаған немесе рұқсат етілмеген. Тарихты қайта жазуға болмайды; анықтама сұранысы арқылы қайтарылған саясатты пайдаланыңыз.
- 2-кезең қасақана тіркелген мақсаттағы шотты таңдап алады. Егер активтерді қабылдау `ExplicitOnly` болса, аударылғанға дейін рұқсат етілген ағым арқылы мақсатты балансты қамтамасыз ету. CLI деп те аталатын күзетші шотты немесе балансты тіркемейді; ол басқа нұсқауды қосудың орнына аборт жасайды.
- Төлемақыны бас тарту әдеттегі нұсқаудың сәттілігі алдында жүргізіледі. Төлеушіді таңдаңыз, желідегі төлемақы активінің метамәліметтерін пайдаланыңыз және оның балансын тексеріңіз.
- Егер тұрақты жергілікті анықтама бұрын орындалғаннан бері бар болса, жаңадан пайда болған локальдік желіді іске қосыңыз немесе оның қолданыстағы күйін жалғастырыңыз. Base58 ID қате формаланған кездейсоқ жіпті ешқашан алмастыруға болмайды.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [Тіркелген міндеттемедегі активтердің өмірлік циклін интеграциялау сынақтары](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/asset.rs)
- [Rust бекітілген міндеттемедегі активтер құрылымының мысалдары](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha/examples/tutorial.rs)
- [Активтер](/kk/blockchain/assets.md)
- [Нұсқаулықтар](/kk/blockchain/instructions.md)
- [Рұқсат белгілері](/kk/reference/permissions.md)
- [JavaScript және TypeScript](/kk/guide/tutorials/javascript.md)
