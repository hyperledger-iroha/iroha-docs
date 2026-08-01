---
translation_locale: kk
translation_source: /cookbook/nfts.md
translation_source_hash: f34043c1940b556439c23de7decc5e79f198f52eca8517dd8a9a5892d997e211
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## Нәтижесі {#outcome}

Тексеру Taira NFT тіркеңіз, жаңартыңыз, көшіріңіз және бірегей файлды сұраңыз NFT жұмыс ағыны толық білікті `name$domain.dataspace` NFT ID және каноникалық I105 иесі IDs.

## Алдын ала талаптар {#prerequisites}

- `curl`, `jq`, Python 3.11 немесе одан кейінгі, және `iroha` CLI.
- Тек оқуға арналған Taira қатынасы.
- Жазушылар үшін [Жалпы желі құрылады Iroha](/kk/get-started/launch-iroha.md), `./localnet/client.toml` және Torii арқылы `http://127.0.0.1:8080`.

## Қадамдар {#steps}

### 1. Қоғамдық жинақты тексеру Taira {#_1-inspect-the-public-taira-collection}

Бос парақ - сәтті оқу: бұл сұралған парақта көрінетін NFTs жоқ дегенді білдіреді.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs - сандық баланс емес, бірегей жазбалар. Олардың ID, бір меншік иесі және компактты `content` метамәдени картасы болады.

### 2. Жергілікті меншік иесін дайындау IDs {#_2-prepare-local-owner-ids}

Жазу мысалы `wonderland.universal` тіркелген доменді пайдаланады. Конфигурацияланған билікті оның жеке кілтін ашпастан келтіріңіз, содан кейін көшіру бағыты ретінде басқа тіркелген тіркелгі таңдаңыз.

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

`$` бөлгіші NFT мәтін нысанына жатады. Толық `wonderland.universal` доменді және деректер кеңістігін сақтаңыз.

### 3. Бастапқы мазмұны бар NFT тіркелу {#_3-register-the-nft-with-initial-content}

CLI бастапқы JSON нысанды стандартты кірістен оқиды. Қазіргі орган иесі болады.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Мазмұн картасын жаңарту {#_4-update-the-content-map}

Метамәліметтердің мәндері JSON. Кілті кіргізіледі немесе осы бір жазуды ауыстырады; ол бүкіл NFT жазбаны алмастыруға болмайды.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Милиционерлік меншікті беру {#_5-transfer-ownership}

Қасиетті қосалқы өнім I105 есеп IDs. Алдыңғы аты-жөнін пайдаланудан бұрын оны шешу керек `--from` немесе `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Рұқсат беру шегі

Taira, әрбір жазу үшін сондай-ақ `--metadata ./taira.tx-metadata.json` және айқын алым төлеуші қажет. Тіркеу, көшіру, алып тастау және метамәдениеттерді жаңарту белсенді жұмыс уақыты арқылы тексеріледі (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` және `CanModifyNftMetadata` әдеттегі рұқсаттар бетінде). Қолданбаңызға тағайындалған доменді пайдаланыңыз немесе жергілікті желіде бұл жолды сақтаңыз.

:::

Келісімшартқа тиесілі жұмыс ағындары үшін Kotodama NFT хост шақыруларын түрлендіреді. Төменде бекітілген IVM құжаттама сынағымен жинақталған және орындалған нақты өмірлік цикл фигурасы келтірілген:

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

Екеуі орнықты I105 Құрандар - теңізге дейінгі сынақ құрылғылары; арнель орындалғанға дейін мақсатты тіркейді. Олар `CURRENT_OWNER` және `NEW_OWNER` Қазақстан Республикасы CLI Қолданбалық келісімшарт үшін оның нақты каноникалық есептерін келтіріңіз, содан кейін жинақтаңыз, сынақ жасаңыз, орналастырыңыз және оны шақырыңыз. [Ақылды келісім-шарттар](./smart-contracts.md). Тексерілмеген байткодты Taira, және ұмытпаңыз, келісімшарттың орындалуы әлі күнге дейін жұмыс уақытын рұқсат етуден өтеді.

## Тексеру {#verify}

NFT тікелей оқып, оның мазмұны қоса берілмей тұрған кезде иесі өзгергенін растаңыз:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

Егер CLI жазуды шығыс конвертіне қаптап, JSON бір рет және мазмұндалған NFT зат. Ауторитетті инварианттар `id`, `owned_by`, және `content`.

## Қиындықтарды шешу {#troubleshooting}

- `name$domain` кейбір паразерлерде әдетті түрде әмбебап деректер кеңістігіне ауыса алады, бірақ асханалық кітап және қосымша IDs нақты `name$domain.dataspace` нысанын қолдануы керек.
- Сол NFT ID қайталап тіркеуден бас тартылады. Таза локальдік желі қолданыңыз немесе ерекше жазба үшін тұрақты жаңа ID таңдаңыз.
- Метамәліметтерді енгізу стандартты кіріс кезінде жарамды JSON болуы тиіс. JSON цитатасы келтірілмеген шель тізбегі метамәліметтер мәні болып табылмайды.
- Ағымдағы иесінен басқа шот қол қойған аударымға нақты рұқсат қажет; `--from` өзгеруі қол қоятын тұлғаны өзгертпейді.
- Трансферден кейін бастапқы клиенттің NFT түрін өзгертуге немесе тіркеуден шығаруына рұқсат етілмейді. Жаңа иесінің қолтаңбалаушысы немесе уәкілетті бақылаушы қолданылсын.
- Taira бос қайтаруға болады NFT жинақ. Емдеуге болмайды `items: []` дәлел ретінде NFT нұсқаулар жоқ.

## Бастапқы және осыған байланысты құжаттар {#source-and-related-docs}

- [NFT түйірілген жүктемеде интеграциялық сынақтар](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/integration_tests/tests/nft.rs)
- [Kotodama NFT қоректенуші шақыру сынақтары түйірілген тапсырмада](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Нысанды Kotodama NFT тіршілік циклін бекіту commit](https://github.com/hyperledger-iroha/iroha/blob/bc7114ed1c7f265a156d2100ff09e851cc95702c/crates/ivm/docs/examples/12_nft_flow.ko) кезінде орнату
- [NFTs](/kk/blockchain/nfts.md)
- [Метамәліметтер](/kk/blockchain/metadata.md)
- [Нұсқаулықтар](/kk/blockchain/instructions.md)
- [Рұқсат белгілері](/kk/reference/permissions.md)
