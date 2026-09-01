---
translation_locale: kk
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# NFTs {#nfts}

## Нәтиже {#outcome}

Taira NFT күйін тексеріп, кейін генерацияланған жергілікті желіде бірегей NFT тіркеп, жаңартып, ауыстырып және сұрау жүргізіңіз. Жұмыс процесі толық анықталған `name$domain.dataspace` NFT идентификаторы мен бір протокол стандартты I105 иесінің идентификаторларын пайдаланады.

## Алдын ала шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі нұсқасы, және қазіргі `iroha` CLI.
- Тек оқу үшін Taira қолжетімділік.
- Жазбалар үшін, [Жіберу Iroha](/kk/get-started/launch-iroha.md) арқылы жасалған жергілікті желі, `http://127.0.0.1:8080`-де `./localnet/client.toml` және Torii бірге.

## Қадамдар {#steps}

### 1. Қоғамдық Taira жинақты тексеріңіз {#_1-inspect-the-public-taira-collection}

Бос бет – сәтті оқу болып табылады: бұл сұралған бетте көрінетін NFTs жоқ екенін білдіреді.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs ерекше жазбалар болып табылады, сандық баланс емес. Оларда бір ID, бір иесі және ықшам `content` метадеректер картасы бар.

### 2. Жергілікті иелердің жеке куәліктерін дайындаңыз {#_2-prepare-local-owner-ids}

Жазу мысалы тіркелген `wonderland.universal` доменін пайдаланады. Жеке кілтін көрсетпей конфигурацияланған уәкілетті субъектіні шығарыңыз, содан кейін өзгеше тіркелген есепшотты аудару орны ретінде таңдаңыз.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` бөлгіші NFT мәтіндік нысанына жатады. Толық `wonderland.universal` домен мен деректер кеңістігі қосымшасын сақтаңыз.

### 3. NFT-ді бастапқы мазмұнымен тіркеу {#_3-register-the-nft-with-initial-content}

CLI стандартты енгізуден бастапқы JSON объектіні оқиды. Ағымдағы уәкілетті субъект иесі болады.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Мазмұн картасын жаңарту {#_4-update-the-content-map}

Мета деректер мәндері JSON болып табылады. Кілт орнату бір жазбаны енгізеді немесе ауыстырады; бұл бүкіл NFT жазбасын алмастырмайды.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Меншік құқығын беру {#_5-transfer-ownership}

Екі бірегей протокол-стандартты I105 есеп шот идентификаторын қамтамасыз етіңіз. Алиас `--from` немесе `--to` ретінде қолданылмас бұрын шешілуі тиіс.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Рұқсат шегі

Әр жазбада Taira кезінде `--metadata ./taira.tx-metadata.json` және нақты төлем жасайтын қажет. Тіркеу, беру, жою және метадеректерді жаңарту белсенді бағдарламалық қамтамасыз ету арқылы тексеріледі қоршаған орта (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` және `CanModifyNftMetadata` әдепкі рұқсат бетінде). Өтініміңізге тағайындалған доменді пайдаланыңыз немесе осы нұсқаулықты localnet-те сақтаңыз.

:::

Шартты меншікке ие жұмыс ағымдары үшін, Kotodama типтелген NFT хост-функция шақыруларын ашады. Төменде бекітілген IVM құжаттама тесті арқылы құрастырылған және орындалған нақты өмірлік цикл тесті артефакт келтірілген:

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

Екі тұрақты I105 мәндері ағын жоғарғы тест өнiмдерi болып табылады; тест жүргізуші орындау алдында бағытты тіркейді. Олар CLI өтуінде тұрған `CURRENT_OWNER` және `NEW_OWNER` емес. Қосымша келісім-шарт үшін оның нақты бір протокол-стандартты есепшоттарын қамтамасыз етіңіз, содан кейін оны жинақтап, тексеріп, орналастырып, [Ақылды келісімшарттар](./smart-contracts.md) арқылы шақырыңыз. Taira-ке қаралмаған байт-код жібермеңіз және келісім-шарт орындалуы бағдарламалық қамтамасыз ету ортасының рұқсатынан өтетінін ұмытпаңыз.

## Растау {#verify}

NFT-ды тікелей оқып, оның мазмұны өзгермей тұрып иесінің өзгергенін растаңыз:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Егер CLI жазбаны шығыс деректер контейнерінде ораса, JSON-ті бір рет тексеріп, талапты ішіндегі NFT объектісіне қолданыңыз. Билікке ие инварианттар `id`, `owned_by`, және `content`.

## Ақауларды жою {#troubleshooting}

- `name$domain` кейбір парсерлерде әмбебап деректер кеңістігіне әдепкі бойынша өтуі мүмкін, бірақ рецепттер мен қосымшалардың идентификаторлары нақты `name$domain.dataspace` формасын қолдануы керек.
- Дәл сол NFT идентификаторын қайта тіркеуге тыйым салынады. Басқа жазба үшін жаңа localnet пайдаланыңыз немесе тұрақты жаңа идентификатор таңдаңыз.
- Метадеректерді енгізу стандартты енгізуде жарамды болуы керек JSON. JSON дәйексөзсіз shell жолы метадеректер мәні емес.
- Ағымдағы иесі емес есепшот арқылы орындалған аударым үшін дәл рұқсат қажет; `--from` өзгерсе де криптографиялық қолтаңба авторы өзгермейді.
- Ауыстырғаннан кейін, бастапқы клиентке NFT-ны өзгерту немесе тіркеуден шығару рұқсаты берілмеуі мүмкін. Жаңа иесінің криптографиялық қолтаңбасын немесе рұқсат етілген бақылаушыны пайдаланыңыз.
- Taira бос NFT жинамасын қайтара алады. `items: []` NFT нұсқаулардың қолжетімсіз екендігінің дәлелі деп санауға болмайды.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [NFT интеграциялық тесттер бекітілген код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT иеленуші-техникалық шақыру тесттері бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Белгіленген бастапқы код нұсқасындағы нақты Kotodama NFT өмірлік цикл тесті артефакті](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/kk/blockchain/nfts.md)
- [Метадеректер](/kk/blockchain/metadata.md)
- [Нұсқаулар](/kk/blockchain/instructions.md)
- [Рұқсат белгішелері](/kk/reference/permissions.md)
