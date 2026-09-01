---
translation_locale: kk
translation_source: /blockchain/assets.md
translation_source_hash: c80e6025007653b355d373394465d04adefc1221c8f34d9008f1c9cbabd3dc40
translation_status: machine-validated
translation_engine: bing-translator-llm
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
- `balance_scope_policy`: қалдықтар жаһандық па немесе деректер кеңістігімен шектелген бе
- `owned_by`: анықтаманы тіркеген немесе иелік ететін есептік жазба
- `total_quantity`: жалпы шығарылған мөлшері
- `confidential_policy`: қорғалған активтер операциялары бойынша саясат

Активті анықтама идентификаторлары бір протоколдық стандартты мөлдір емес мекенжайлар болып табылады. Анықтама домен мен атаудан құрылған кезде, Iroha сол домен/атау проекциясын UX және сұраулар үшін сақтай алады, бірақ бір протоколдық стандартты мәтіндік нысан жасалған мекенжай болып табылады.

## Активтер қалдығы {#asset-balance}

Бір `Asset` мыналарды қамтиды:

- `id`: актив анықтамасын, иесінің есеп-шотын және міндетті емес актив баланс шегін біріктіретін `AssetId`
- `value`: `Numeric` қалдық

Ұстаушы есепшот бір протоколдық стандартқа сай және доменсіз. Активтің анықтамасы мәліметтер кеңістігіне сәйкес домен астында көрсетілуі мүмкін, мысалы `payments.universal`.

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
- `DataspaceRestricted`: баланстар деректер кеңістігі контексті бойынша бөлінеді

Деректер кеңістігімен шектелген қалдықтар бірдей актив анықтамасы бірнеше Nexus деректер кеңістігінде қолданылған кезде пайдалы, бірақ қалдықтар оқшауланған күйде қалуы керек.

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

Үш мысалдың барлығы оқу болып табылады. Taira бойынша активтерді шығару, жою немесе аудару үшін тестнетке қаражат қосылған есепшотты және [SORA Nexus Деректер кеңістіктеріне қосылу](/kk/get-started/sora-nexus-dataspaces.md)-дағы қорғалған процесті пайдаланыңыз.

Ақы төлейтін Taira актив мысалы үшін, [Taira сайтынан XOR тест желісін алыңыз](/kk/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira)-дегі тесттік желіні қаржыландыру қызметі көмекшісін `taira_faucet_claim.py` ретінде сақтаңыз, содан кейін тесттік желіні қаржыландыру қызметінің активін бірінші болып талап етіп, оны транзакцияны орындау шығын активі ретінде пайдаланыңыз:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json
```

Содан кейін `--metadata ./taira.tx-metadata.json` командаларын `ledger asset mint`, `ledger asset burn` және `ledger asset transfer` қосыңыз.

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
