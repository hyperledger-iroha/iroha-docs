---
translation_locale: kk
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: bing-translator-llm+claude-opus-5-5
---

# NFTs {#nfts}

## Нәтиже {#outcome}

Taira NFT күйін тексеріп, кейін генерацияланған жергілікті желіде бірегей NFT тіркеп, жаңартып, ауыстырып және сұрау жүргізіңіз. Жұмыс процесі толық анықталған `name$domain.dataspace` NFT идентификаторы мен бір протокол стандартты I105 иесінің идентификаторларын пайдаланады.

## Алдын ала шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі нұсқасы, және қазіргі `iroha` CLI.
- Тек оқу үшін Taira қолжетімділік.
- Жазу үшін: [Iroha-ны іске қосу](/kk/get-started/launch-iroha.md) бетіндегідей `kagami localnet generate --peers 4 --out-dir ./localnet` арқылы жасалған, `./localnet/client.toml` және `http://127.0.0.1:8080` мекенжайында Torii бар жергілікті желі, сондай-ақ қол қоюшысына тиесілі NFT домені (2-қадамды қараңыз).

## Қадамдар {#steps}

### 1. Қоғамдық Taira жинақты тексеріңіз {#_1-inspect-the-public-taira-collection}

Бос бет – сәтті оқу болып табылады: бұл сұралған бетте көрінетін NFTs жоқ екенін білдіреді.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs — сандық баланстар емес, бірегей жазбалар. Оларда ID, бір иесі және ықшам мазмұн картасы бар; Torii жинақ жолдары оны `metadata` ретінде, ал `ledger nft get` `content` ретінде қайтарады.

### 2. Жергілікті иелердің жеке куәліктерін дайындаңыз {#_2-prepare-local-owner-ids}

Жазу мысалына қол қоюшы есептік жазбаға тиесілі домен немесе ол үшін `CanRegisterNft` рұқсатын беру қажет. Жасалған жергілікті желі өз клиенті үшін ешбір қолданба доменін тіркемейді, ал доменді тікелей тіркеу генезиске ғана арналған, сондықтан `NFT_DOMAIN` мәніне қол қоюшыңыз басқаратын `name.dataspace` доменін орнатыңыз. Бапталған уәкілетті субъектіні оның жеке кілтін ашпай анықтаңыз, содан кейін аудару мақсаты ретінде басқа тіркелген есептік жазбаны таңдаңыз.

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
test -n "$NFT_DOMAIN"
NFT_ID="cookbook_badge\$$NFT_DOMAIN"

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

`$` бөлгіші NFT мәтіндік пішініне жатады. ID ішінде толық `name.dataspace` доменін сақтаңыз.

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

Taira-да әр жазу операциясы `--fee-payer authority` пайдаланады; CLI қол қоюдан бұрын Taira ақы активіндегі нақты ақы бағасын алады. Тіркеуді, аударуды, жоюды және метадеректерді жаңартуды белсенді орындау ортасы тексереді (әдепкі рұқсат бетіндегі `CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` және `CanModifyNftMetadata`). Есептік жазбаңызға тиесілі доменді немесе есептік жазбаңызда осы рұқсаттар бар доменді пайдаланыңыз.

:::

Шартты меншікке ие жұмыс ағымдары үшін, Kotodama типтелген NFT хост-функция шақыруларын ашады. Төменде бекітілген IVM құжаттама тесті арқылы құрастырылған және орындалған нақты өмірлік цикл тесті артефакт келтірілген:

```kotodama
// Mint an NFT, transfer it, update metadata, and burn it using typed IDs.
seiyaku NftFlow {
    permission NftAuthority;
    kotoage fn nft_issue_and_transfer() authorize(NftAuthority) {
        let owner = AccountId::parse("sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV");
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft: nft, owner: owner);
        let to = AccountId::parse("sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76");
        ledger::nft::transfer(source: owner, nft: nft, destination: to);
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft: nft);
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

CLI NFT жазбасының өзін басып шығарады. Шешуші инварианттар — `id`, `owned_by` және `content`.

## Ақауларды жою {#troubleshooting}

- `name$domain` кейбір парсерлерде әмбебап деректер кеңістігіне әдепкі бойынша өтуі мүмкін, бірақ рецепттер мен қосымшалардың идентификаторлары нақты `name$domain.dataspace` формасын қолдануы керек.
- Дәл сол NFT идентификаторын қайта тіркеуге тыйым салынады. Басқа жазба үшін жаңа localnet пайдаланыңыз немесе тұрақты жаңа идентификатор таңдаңыз.
- Метадеректерді енгізу стандартты енгізуде жарамды болуы керек JSON. JSON дәйексөзсіз shell жолы метадеректер мәні емес.
- Ағымдағы иеден басқа есептік жазба қол қойған аударымға NFT доменіне иелік ету немесе нақты `CanTransferNft` рұқсатын беру қажет; `--from` мәнін өзгерту қол қоюшыны өзгертпейді.
- Аудару тек `owned_by` өрісін өзгертеді. Метадеректерді жаңарту мен тіркеуден шығару домен иесінде немесе сол NFT үшін `CanModifyNftMetadata` не `CanUnregisterNft` рұқсаты бар есептік жазбада қалады; жаңа ие оны әрі қарай аудара алады.
- Taira бос NFT жинамасын қайтара алады. `items: []` NFT нұсқаулардың қолжетімсіз екендігінің дәлелі деп санауға болмайды.

## Дереккөз және қатысты құжаттар {#source-and-related-docs}

- [NFT интеграциялық тесттер бекітілген код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT иеленуші-техникалық шақыру тесттері бекітілген бастапқы код нұсқасында](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Белгіленген бастапқы код нұсқасындағы нақты Kotodama NFT өмірлік цикл тесті артефакті](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [Бекітілген бастапқы код нұсқасындағы Kotodama құжаттама мысалдарының тесттері](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/kk/blockchain/nfts.md)
- [Метадеректер](/kk/blockchain/metadata.md)
- [Нұсқаулар](/kk/blockchain/instructions.md)
- [Рұқсат белгішелері](/kk/reference/permissions.md)
