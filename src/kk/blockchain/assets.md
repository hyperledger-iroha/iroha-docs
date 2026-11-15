---
translation_locale: kk
translation_source: /blockchain/assets.md
translation_source_hash: f5f0eb99e76287db695cc21b8580fd2a9b4dc2a989237c1a1d3d7333c14561ce
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# Активтер {#assets}

Iroha активі есепшоттағы сандық баланс болып табылады. Әр нақты баланс `AssetDefinition`-қа нұсқайды, ал анықтама ол активтің қалай аталуына, шығарылуына, көрсетілуіне және бөлінуіне сипаттайды.

## Активтің анықтамасы {#asset-definition}

Бір `AssetDefinition` мыналарды қамтиды:

- `id`: бір протокол-стандарт активінің анықтамалық мекенжайы
- `name`: адам оқи алатындай көрсетілетін атауы
- `description`: міндетті емес адамға түсінікті сипаттама
- `alias`: `<name>#<domain>.<dataspace>` немесе `<name>#<dataspace>` форматындағы міндетті емес лақап ат
- `spec`: баланстар үшін сандық дәлдік пен шектеулер
- `mintable`: активтерді шығару саясаты саясаты
- `logo`: міндетті емес `SoraFS` URI
- `metadata`: кездейсоқ кілт-бағалы метадеректер
- `balance_scope_policy`: баланстар жаһандық па, әлде деректер кеңістігімен шектелген бе
- `owning_domain`: доменге тиесілі анықтаманың иесі болып табылатын домен; тікелей деректер кеңістігінде тіркелген анықтамалар үшін болмайды
- `owned_by`: анықтаманы тіркеген немесе иелік ететін есептік жазба
- `total_quantity`: жалпы шығарылған мөлшері
- `confidential_policy`: қорғалған активтер операциялары бойынша саясат

Активті анықтама идентификаторлары бір протоколдық стандартты мөлдір емес мекенжайлар болып табылады. Анықтама домен мен атаудан құрылған кезде, Iroha сол домен/атау проекциясын UX және сұраулар үшін сақтай алады, бірақ бір протоколдық стандартты мәтіндік нысан жасалған мекенжай болып табылады.

## Активтер қалдығы {#asset-balance}

Бір `Asset` мыналарды қамтиды:

- `id`: актив анықтамасын, иесінің есеп-шотын және міндетті емес актив баланс шегін біріктіретін `AssetId`
- `value`: `Quantity` қалдық

Иеленушінің есептік жазбасы канондық әрі доменсіз. Актив анықтамасы деректер кеңістігімен нақтыланған домен аясында көрсетілуі мүмкін, мысалы, `payments.universal`.

## Активтерді шығару саясаты {#mintability}

Активтердің анықтамалары осы активтерді шығару саясаты режимдерін қолдайды:

|Режим|Мағына|
| ------------ | ----------------------------------------------------------------- |
| `Infinitely` |Икемді қамтамасыз ету. Активті қайта-қайта шығарып, жоюға болады.|
| `Once`       |Тұрақты жеткізілім токені. Ол бір рет шығарылып, содан кейін жойылуы мүмкін.|
| `Not`        |Шектеулі ұсынысы бар токен, оны жоюға болады, бірақ қайта шығару мүмкін емес.|
| `Limited(n)` |Саясат жаңа актив бірліктерін шектеулі сандағы қосымша операцияларда шығаруға мүмкіндік береді.|

Қалыпты серпімді активтер үшін `Infinitely`-ді, ал тұрақты немесе шектелген ұсынысы бар активтер үшін `Once` немесе `Limited(n)`-ді пайдаланыңыз. Активтің ұсынысы алдын ала белгіленген болмаса, бастапқы саясат ретінде `Not`-ді пайдаланбаңыз.

## Активтер балансы ауқымы {#balance-scope}

`balance_scope_policy` баланстар қалай бөлінетінін бақылайды:

- `Global`: әр есеп тіркелгісі мен актив анықтамасы үшін бір баланс бөлімі
- `DataspaceRestricted`: баланстар деректер кеңістігінің контексті бойынша бөлінеді

Бір актив анықтамасы бірнеше SORA Nexus деректер кеңістігінде қолданылып, бірақ баланстар оқшау қалуы керек болса, деректер кеңістігімен шектелген баланстар пайдалы.

## Осы жұмыс ағынын Taira нөмірінде іске қосыңыз {#try-it-on-taira}

Бұл тек оқуға арналған API сұраулар қоғамдық Taira тест желісінде нақты активтердің анықтамаларын көрсетеді:

```bash
TAIRA_ROOT=https://taira.sora.org

curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=10" \
  | jq -r '.items[] | [.id, .name, .mintable, .total_quantity] | @tsv'
```

Ағымдағы Taira XOR төлем активінің анықтамасын табыңыз:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select(.name == "XOR")
    | {id, name, total_quantity, mintable, confidential_policy: .confidential_policy.mode}'
```

Метаәдістерді қамтитын анықтамаларды іздеңіз:

```bash
curl -fsS "$TAIRA_ROOT/v1/assets/definitions?limit=100" \
  | jq '.items[]
    | select((.metadata | length) > 0)
    | {id, name, metadata}'
```

Үш мысал да — оқу операциялары. Taira желісінде актив шығару, жою немесе аудару үшін тест токендерін беру қызметінен қаржыландырылған есептік жазбаны және [Taira және Minamoto арқылы SORA Nexus жүйесінде қолданба әзірлеу](/kk/get-started/sora-nexus-dataspaces.md) бөліміндегі тексерілетін үдерісті пайдаланыңыз.

Taira желісіндегі комиссия төленетін актив мысалы үшін алдымен [Taira желісінде тестілік XOR алу](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) бөліміндегі дайындау қадамы бар токен беру үдерісі арқылы қол қоюшыны қаржыландырыңыз. Содан кейін `ledger asset mint`, `ledger asset burn` және `ledger asset transfer` пәрмендеріне `--fee-payer authority` параметрін беріңіз; CLI қол қою алдында нақты комиссияны Taira комиссия активімен бағалайды:

```bash
iroha --config ./taira.client.toml --fee-payer authority \
  ledger asset transfer \
  --definition "<ASSET_DEFINITION_BASE58>" \
  --account "<TAIRA_I105_ACCOUNT_ID>" \
  --to "<RECIPIENT_I105_ACCOUNT_ID>" \
  --quantity 1
```

## Нұсқаулар {#instructions}

Активтерді Iroha нұсқаулық операциялары арқылы тіркеуге, шығаруғa, жоюғa және аударуға болады:

- [`Register` және `Unregister`](/kk/blockchain/instructions.md#un-register)
- [`Mint` және `Burn`](/kk/blockchain/instructions.md#mint-burn)
- [`Transfer`](/kk/blockchain/instructions.md#transfer)
- [`SetKeyValue` және `RemoveKeyValue`](/kk/blockchain/instructions.md#setkeyvalue-removekeyvalue)

Сондай-ақ қараңыз:

- [CLI нұсқаулық](/kk/get-started/operate-iroha-via-cli.md)
- [Rust оқулық](/kk/guide/tutorials/rust.md)
- [Python оқулық](/kk/guide/tutorials/python.md)
- [JavaScript/TypeScript оқулық](/kk/guide/tutorials/javascript.md)
- [Деректер моделі](/kk/blockchain/data-model.md)
- [NFTs](/kk/blockchain/nfts.md)
