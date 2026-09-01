---
translation_locale: ba
translation_source: /blockchain/domains.md
translation_source_hash: 5e52579436a181d76c83fa549991e56064ae57349b7109d5c41ec7953e5cbb2e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Домендар {#domains}

Домендар `World` мәғлүмәттәрендә теркәлгән исемдәр киңлектәре тип атала. Хәҙерге Iroha 3 мәғлүмәт моделендә домен үҙенең атамаһы мәғлүмәт киңлеге менән квалификациялана, шуға күрә канон идентификаторы:

```text
domain.dataspace
```

Мәҫәлән, `payments.universal` `payments` доменды `universal` мәғлүмәт киңлеге эсендә атаған.

## Структураһы {#structure}

`Domain` теркәлгән исемлектә:

- `id`: мәғлүмәт киңлеге буйынса квалификациялы `DomainId`
- `logo`: домен логотибы өсөн факультатив `SoraFS` URI
- `metadata`: үҙаллы төп мәғәнәле метамәғлүмәт
- `owned_by`: доменға хужа булған иҫәп, ғәҙәттә уны теркәгән иҫәп

Бутстрап файҙалы йөкләмәһе ҡулланылған материализация домен `NewDomain`. Ул ташый `id`, факультатив `logo`, һәм башланғыс `metadata`. Йүгереү ваҡыты тулы `owned_by` ябай клиенттар был файҙалы йөкләмәне туранан-тура тапшыра алмай.

## Регистрация {#registration}

Ғәҙәти домен булдырыу декларатив ҡушамат ҡоролошо ағымын ҡуллана. Был SNS лизинг килешеүен, хужа мөмкинлектәрен, комиссия иҫәбе һаҡсыһын һәм домен рәтен бер атом `EnsureAlias` транзакцияһында тота. `Register::Domain` генез/bootstrap өҫкө йөҙө булып ҡала, ә `ledger domain` командаһының `register` аҫты командаһы юҡ.

SDK йәки инеү сервисы менән йәшерен булмаған `AliasSetupPlanRequestV1` ниәтен булдырығыҙ, һуңынан CLI уны тере торошҡа ҡаршы планлаштырығыҙ һәм шул уҡ планын тапшырығыҙ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup plan \
  --intent-file ./payments-domain.intent.json \
  --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml \
  app alias setup apply --plan-file ./payments-domain.plan.json

cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list all
```

Ниәт `payments.universal`, уның һанлы мәғлүмәттәр киңлеге, каноник I105 хужаһы, ҡуртымға алыу срогы һәм ағымдағы сәйәсәт / түләү комиссия иҫәбе һаҡсыһын асыҡлай. планерҙың һуңғы нөктәһе `POST /v1/aliases/setup/plan`; кире ҡайтарылған планы сылбырлы, вәкәләтле иҫәп менән бәйле, дәүләт һәм сроклы. Доменды алып ташлау һаман да [`Unregister`](/ba/blockchain/instructions.md#un-register) ҡуллана.

Доменды булдырыу йәки алып ташлау өсөн домен менән идара итеүгә тейешле рөхсәт кәрәк. Домен метамәғлүмәттәре [`SetKeyValue` һәм `RemoveKeyValue`](/ba/blockchain/instructions.md#setkeyvalue-removekeyvalue) менән яңыртыла ала, әгәр хакимиәт был доменды үҙгәртергә рөхсәткә эйә булһа.

## Taira менән һынап ҡарағыҙ. {#try-it-on-taira}

Хәҙерге ваҡытта асыҡ Taira тест селтәрендә күренә торған домендар исемлеген яҙығыҙ:

```bash
curl -fsS 'https://taira.sora.org/v1/domains?limit=20' \
  | jq -r '.items[].id'
```

Йәмәғәт юлдары каталогын мәғлүмәттәр киңлеге исемдәренә ҡайтарыу картаһы:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq -r '.teu_lane_commit[]
    | [.lane_id, .alias, .dataspace_alias, .visibility, .block_height, .finality_lag_slots]
    | @tsv'
```

Домендың бармы-юҡмы икәнен тикшереү өсөн беренсе команданы ҡулланығыҙ. Мәғлүмәт киңлеге асыҡ, сикләнгән йәки төп юл артында ҡалғанын раҫларға кәрәк булғанда трасса каталогын ҡулланығыҙ.

Domain setup — fee-paying write. Taira-ла уны һынағанға тиклем [Taira-ла Testnet XOR алыу](/ba/get-started/sora-nexus-dataspaces.md#_4-get-testnet-xor-on-taira) бүлегендәге faucet helper-ҙы `taira_faucet_claim.py` итеп һаҡлағыҙ, signer-ҙы public faucet аша финанслағыҙ һәм fee metadata ҡушығыҙ:

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

Ҡабатланған testnet эшләтеүҙәрендә уникаль домен исеме өсөн intent төҙөгөҙ һәм Taira-ның ғәмәлдәге policy һәм fee-asset quote guard-ын ҡулланығыҙ. localnet йәки Minamoto өсөн төҙөлгән plan-ды ҡабат ҡулланмағыҙ.

## Башҡа субъекттар менән мөнәсәбәттәр {#relationship-to-other-entities}

Домендар төркөмө башлыҡ объекттары һәм домен масштабланған мәғлүмәттәр өсөн исемдәр киңлек бирә. активтар билдәләмәләре домен-ҡвалификациялы идентификаторҙарҙы ҡуллана, ә һорауҙар домендарҙы исемлеккә индерә йәки таба ала. Доменға сикләнгән объекттар. Хәҙерге мәғлүмәттәр моделендә иҫәптәрҙең үҙендә домен юҡ, әммә иҫәптәр домендарға эйә була һәм уларҙың билдәләмәләре домендар аҫтында йәшәй торған активтарҙы һаҡлай ала.

Шулай уҡ ҡарағыҙ:

- [Донъя](/ba/blockchain/world.md)
- [Активтар](/ba/blockchain/assets.md)
- [Метамәғлүмәттәре](/ba/blockchain/metadata.md)
- [Исем йөрөтөү ҡағиҙәләре](/ba/reference/naming.md)
