---
translation_locale: ba
translation_source: /blockchain/domains.md
translation_source_hash: 4c42df3c179a086b8823264df2b69f68d7d3df500c8362d78f7ba56875dcfad1
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Домендар {#domains}

Домендар `World` мәғлүмәттәрендә теркәлгән исемдәр киңлектәре тип атала. Хәҙерге Iroha 3 мәғлүмәт моделендә домен үҙенең атамаһы мәғлүмәт киңлеге менән квалификациялана, шуға күрә канон идентификаторы:

```text
domain.dataspace
```

Мәҫәлән, `payments.universal` исемдәре `payments` домен эсендә `universal` мәғлүмәт киңлеге.

## Структураһы {#structure}

Теркәлгән `Domain` составында:

- `id`: мәғлүмәт киңлеге буйынса квалификациялы `DomainId`
- `logo`: факультатив `SoraFS` URI домен логотибы өсөн
- `metadata`: үҙаллы төп мәғәнәле метамәғлүмәт
- `owned_by`: домен хужаһы иҫәбенә, ғәҙәттә уны теркәгән иҫәпкә

Бутстрап файҙалы йөкләмәһе ҡулланылған материализация домен `NewDomain`. Ул ташый `id`, факультатив `logo`, һәм башланғыс `metadata`. Йүгереү ваҡыты тулы `owned_by` ябай клиенттар был файҙалы йөкләмәне туранан-тура тапшыра алмай.

## Теркәү {#registration}

Ғәҙәттән тыш домендар булдырыу декларатив псевдонимы булдырыу ағымын ҡуллана. Был SNS ҡуртымға, хужаһы мөмкинлектәрен, цитата һаҡсыһы һәм домен рәтенең бер атом `EnsureAlias` транзакция. `Register::Domain` остается генезис/bootstrap өҫтө, һәм `ledger domain` командование юҡ `register` подкомандующий.

Серһеҙ булдырыу `AliasSetupPlanRequestV1` ниәте менән SDK йәки бортҡа инеү хеҙмәте, һуңғараҡ CLI уны тере торошҡа ҡаршы планлаштырығыҙ һәм шул уҡ планығыҙҙы тәҡдим итегеҙ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Маҡсат билдәләй `payments.universal`, уның һанлы мәғлүмәттәр киңлеге, каноник I105 хужаһы, ҡуртымға алыу срогы һәм ағымдағы сәйәсәт / түләү цитатаһы һаҡсыһы. `POST /v1/aliases/setup/plan`; уның кире ҡайтарылған планы селтәр, власть, дәүләт һәм срок менән бәйләнгән. домен күсереү [`Unregister`](/ba/blockchain/instructions.md#un-register).

Доменды булдырыу йәки алып ташлау өсөн тейешле домен менән идара итеү рөхсәте кәрәк актив ваҡытта validator аҫтында. [`SetKeyValue` һәм `RemoveKeyValue`](/ba/blockchain/instructions.md#setkeyvalue-removekeyvalue) власть был доменды үҙгәртергә рөхсәт алған саҡта.

## Taira менән һынап ҡарағыҙ. {#try-it-on-taira}

Хәҙерге ваҡытта асыҡ Taira тест селтәрендә күренә торған домендар исемлеген яҙығыҙ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Йәмәғәт юлдары каталогын мәғлүмәттәр киңлеге исемдәренә ҡайтарыу картаһы:

```bash
curl -fsS https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Домендың бармы-юҡмы икәнен тикшереү өсөн беренсе команданы ҡулланығыҙ. Мәғлүмәт киңлеге асыҡ, сикләнгән йәки төп юл артында ҡалғанын раҫларға кәрәк булғанда трасса каталогын ҡулланығыҙ.

Домен булдырыу өсөн түләүле яҙыу. Taira, кран ярҙамсыһын һаҡларға [Testnet-ты алығыҙ XOR тураһында Taira](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) тип `taira_faucet_claim.py`, Ҡулланыусыны дәүләт фонды аша финанслау һәм түләү метамәғлүмәттәрен ҡушыу:

```bash
export TAIRA_ACCOUNT_ID='<TAIRA_I105_ACCOUNT_ID>'
export TAIRA_FEE_ASSET=6TEAJqbb8oEPmLncoNiMRbLEK6tw

python3 taira_faucet_claim.py "$TAIRA_ACCOUNT_ID"
printf '{"gas_asset_id":"%s"}\n' "$TAIRA_FEE_ASSET" > taira.tx-metadata.json

iroha --config ./taira.client.toml \
  app alias setup plan \
  --intent-file ./taira-domain.intent.json \
  --plan-file ./taira-domain.plan.json

iroha --config ./taira.client.toml \
  --metadata ./taira.tx-metadata.json \
  app alias setup apply --plan-file ./taira-domain.plan.json
```

Үҙенсәлекле домен исеме өсөн ниәт төҙөргә ҡабатланған тест селтәрҙәрендә эшләй, һәм ҡулланырға Taira ғәмәлдәге сәйәсәт һәм түләү-актив котировкаһы һаҡлай. Minamoto.

## Башҡа субъекттар менән мөнәсәбәттәр {#relationship-to-other-entities}

Домендар төркөмө объекттарҙы иҫәпкә ала һәм домен масштабындағы мәғлүмәттәр өсөн исемдәр киңлеге бирә. Ассит билдәләмәләре домен квалификациялы идентификаторҙарҙы ҡуллана, ә һорауҙар домендарҙы исемлеккә индерә йәки доменға масштабланған объекттар таба ала. Иҫәптәрҙең үҙендә хәҙерге мәғлүмәттәр моделендә домендар юҡ, әммә иҫәптәр домендарға эйә була ала һәм уларҙың билдәләмәләре домендар аҫтында йәшәй торған активтар тота.

Шулай уҡ ҡарағыҙ:

- [Донъя](/ba/blockchain/world.md)
- [Активтар](/ba/blockchain/assets.md)
- [Метамәғлүмәттәре](/ba/blockchain/metadata.md)
- [Исем йөрөтөү ҡағиҙәләре](/ba/reference/naming.md)
