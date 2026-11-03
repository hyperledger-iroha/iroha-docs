---
translation_locale: ba
translation_source: /cookbook/nfts.md
translation_source_hash: b60c542052eac6a916350c4aaa779c9f46d248be64ecea9c9bda679a4d56dff3
translation_status: machine-validated
translation_engine: nllb-200-ct2+claude-opus-5-5
---

# NFTs {#nfts}

## Һөҙөмтә {#outcome}

Taira NFT дәүләтен тикшерегеҙ, һуңынан генерируйылған локаль селтәрҙә уникаль NFT исемлеген теркәгеҙ, яңыртығыҙ, күсерегеҙ һәм һорағыҙ. Эш ағымы тулыһынса квалификациялы `name$domain.dataspace` NFT ID һәм каноник I105 хужаһын ҡуллана IDs.

## Шарттар {#prerequisites}

- `curl`, `jq`, Python 3.11 йәки унан һуңғы, һәм ток `iroha` CLI.
- Taira уҡырға ғына инеү мөмкинлеге.
- Яҙыу операциялары өсөн: [Iroha-ны эшләтеп ебәреү](/ba/get-started/launch-iroha.md) битендәгесә `kagami localnet generate --peers 4 --out-dir ./localnet` менән булдырылған, `./localnet/client.toml` файлы һәм `http://127.0.0.1:8080` адресындағы Torii булған локаль селтәр, шулай уҡ уның ҡул ҡуйыусыһына ҡараған NFT домены (2-се аҙымды ҡарағыҙ).

## Аҙымдар {#steps}

### 1. Taira йәмәғәт йыйылмаһын тикшерегеҙ {#_1-inspect-the-public-taira-collection}

Буш бит уңышлы уҡыла: был һоралған биттең күренеп торған NFTs юҡ тигәнде аңлата.

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nfts: [.items[] | {id, owned_by, metadata}]}'
```

NFTs — һанлы баланстар түгел, ә уникаль яҙмалар. Уларҙың ID-һы, бер хужаһы һәм йыйнаҡ эстәлек картаһы бар; Torii коллекция юлдары был картаны `metadata` итеп, ә `ledger nft get` `content` итеп ҡайтара.

### 2. урындағы хужаны әҙерләгеҙ IDs {#_2-prepare-local-owner-ids}

Яҙыу миҫалына ҡул ҡуйыусы иҫәпкә ҡараған домен йәки уның өсөн бирелгән `CanRegisterNft` рөхсәте кәрәк. Генерацияланған локаль селтәр үҙ клиенты өсөн бер ниндәй ҡушымта домены теркәмәй, ә доменды туранан-тура теркәү генезис өсөн генә ҡалдырылған, шуға күрә `NFT_DOMAIN`-ды ҡул ҡуйыусығыҙ идара иткән `name.dataspace` доменына ҡуйығыҙ. Конфигурацияланған вәкәләтле иҫәпте уның шәхси асҡысын асмайынса сығарып алығыҙ, һуңынан күсереү тәғәйенләнеше итеп икенсе теркәлгән иҫәпте һайлағыҙ.

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

`$` айырғысы NFT-ның текст формаһына ҡарай. ID-ла тулы `name.dataspace` доменын һаҡлағыҙ.

### 3. NFT исемлеген тәүге йөкмәткеһе менән теркәгеҙ. {#_3-register-the-nft-with-initial-content}

CLI башланғыс JSON объектты стандарт кертеүҙән уҡый. Хәҙерге вәкәләтле иҫәп хужаһына әйләнә.

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### 4. Мәҡәләләр картаһын яңыртыу {#_4-update-the-content-map}

Метамәғлүмәт ҡиммәттәрен JSON. Ключты индереү йәки был бер яҙманы алмаштырыу; ул бөтә NFT яҙмаһын алмаштыра алмай.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### 5. Милек хоҡуғын күсереү {#_5-transfer-ownership}

Ҡанунлы ике тәьмин итеү I105 иҫәбенә IDs. Алма-аяһы ҡулланыр алдынан хәл ителергә тейеш. `--from` йәки `--to`.

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning Рөхсәт сиктәре

Taira-ла һәр яҙыу `--fee-payer authority` ҡуллана; CLI ҡул ҡуйыр алдынан теүәл комиссияны Taira-ның түләү активында иҫәпләп күрһәтә. Теркәүҙе, күсереүҙе, бөтөрөүҙе һәм метамәғлүмәт яңыртыуҙарын әүҙем башҡарыу мөхите тикшерә (ғәҙәттәге рөхсәттәр йыйылмаһында `CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft` һәм `CanModifyNftMetadata`). Иҫәбегеҙгә ҡараған доменды йәки иҫәбегеҙҙә был рөхсәттәр булған доменды ҡулланығыҙ.

:::

Контрактҡа ҡараған эш ағымдары өсөн Kotodama NFT тип яҙылған хост саҡырыуҙарын асыҡлай. түбәндәгеләр - фиксированная тормош циклының һынау мәғлүмәттәре һәм үтәлгән фиктив IVM документация һынауы:

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

Ике нығытылған I105 ҡиммәте — төп проекттың һынау мәғлүмәттәре; һынау мөхите башҡарыу алдынан тәғәйенләнеш иҫәбен теркәй. Улар CLI ҡулланмаһындағы `CURRENT_OWNER` һәм `NEW_OWNER` түгел. Ҡушымта килешеүе өсөн уның ысын каноник иҫәптәрен күрһәтегеҙ, һуңынан [Аҡыллы килешеүҙәр](./smart-contracts.md) аша уны компиляциялағыҙ, һынағыҙ, урынлаштырығыҙ һәм саҡырығыҙ. Тикшерелмәгән байт-кодты Taira-ға ебәрмәгеҙ; килешеүҙең үтәлеше һаман да башҡарыу мөхите авторизацияһын үтеүен иҫтә тотоғоҙ.

## Тикшереү {#verify}

NFT туранан-тура уҡығыҙ һәм уның хужаһы үҙгәргәнен раҫлағыҙ, шул уҡ ваҡытта уның йөкмәткеһе ҡушылып ҡала:

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

CLI NFT яҙмаһының үҙен баҫтыра. Хәл иткес инварианттар — `id`, `owned_by` һәм `content`.

## Проблемаларҙы хәл итеү {#troubleshooting}

- `name$domain` универсаль мәғлүмәт киңлегенә ҡайһы бер parsers default була ала, әммә Cookbook һәм ҡушымтаһы IDs асыҡтан-асыҡ `name$domain.dataspace` формаһын ҡулланырға тейеш.
- Бер үк NFT ID ҡабатланған теркәлеү кире ҡағыла. Айырым яҙма өсөн яңы локаль селтәрҙе ҡулланығыҙ йәки тотороҡло яңыһын һайлағыҙ ID.
- Метамәғлүмәт индереү стандарт инеү ваҡытында JSON булып торорға тейеш. JSON цитатаһы булмаған ҡаплама штрих метамәғлүмәттәр ҡиммәте түгел.
- Хәҙерге хужанан башҡа иҫәп ҡул ҡуйған күсереү өсөн NFT доменына хужа булыу йәки теүәл `CanTransferNft` рөхсәте кәрәк; `--from` ҡиммәтен үҙгәртеү ҡул ҡуйыусыны үҙгәртмәй.
- Күсереү `owned_by`-ны ғына үҙгәртә. Метамәғлүмәттәрҙе яңыртыу һәм теркәүҙән сығарыу хоҡуғы домен хужаһында йәки был NFT өсөн `CanModifyNftMetadata` йә `CanUnregisterNft` рөхсәте булған иҫәптә ҡала; яңы хужа уны артабан күсерә ала.
- Taira буш ҡайтарырға мөмкин NFT йыйып алыу. `items: []` дәлил булараҡ, NFT күрһәтмәләре юҡ.

## Сығанаҡ һәм уның менән бәйле документтар {#source-and-related-docs}

- [NFT интеграция һынауҙары ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/integration_tests/tests/nft.rs)
- [Kotodama NFT Ҡунаҡсы саҡырыу һынауҙар ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [Дөрөҫ Kotodama NFT тормош циклының һынау мәғлүмәттәре ҡуйылған commit](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/docs/examples/12_nft_flow.ko)
- [Kotodama документацияһы миҫалдарының ҡуйылған commit-тағы һынауҙары](https://github.com/hyperledger-iroha/iroha/blob/c8c872461e92f04325c350cdd952f4276e96f9dc/crates/ivm/tests/kotodama_documentation_examples.rs)
- [NFTs](/ba/blockchain/nfts.md)
- [Метамәғлүмәттәре](/ba/blockchain/metadata.md)
- [Инструкциялар](/ba/blockchain/instructions.md)
- [Разрешение токендары](/ba/reference/permissions.md)
