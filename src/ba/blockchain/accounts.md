---
translation_locale: ba
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Иҫәпкә алыуҙар {#accounts}

Хисап - транзакцияларға ҡул ҡуйыу һәм үҙ иҫәп-хисап иҫәбен алыу хоҡуғына эйә булған орган. Iroha 3 мәғлүмәт моделе, `AccountId` canonical һәм domainless: ул аккаунт контроллерынан сығарыла һәм canonically кодлана I105. Кеше уҡый торған домен һәм мәғлүмәттәр майҙансығы контексты айырым иҫәп-хисап исемдәре бәйләнештәренә ҡарай.

## Структураһы {#structure}

`Account` теркәлгән исемлектә:

- `id`: ҡануниаль `AccountId`
- `metadata`: үҙаллы иҫәпкә алыу метамәғлүмәттәре
- `label`: факультатив стабилный псевдоним
- `uaid`: факультатив универсаль иҫәп ID ҡулланылған Nexus ағымдары
- `opaque_ids`: иҫәбенең UAID менән бәйләнгән үтә күренмәле идентификаторҙар

Хисапты булдырыу өсөн ҡулланылған транзакция файҙалы йөкләмәһе `NewAccount`. Ул бер үк идентификация, метамәғлүмәттәр, билдәләр алып бара, UAID, һәм үтә күренмәле ID Теркәлгән иҫәптә ҡулланылған баҫыуҙар.

`uaid` каноник тулыландыра `AccountId`; ул уны алмаштыра алмай. Nexus хеҙмәттәре өсөн мәғлүмәт майҙансыҡтары буйынса тотҡарлыҡлы ҡулланыусы йәки ойошма менән идара итеү кәрәк, йәғни шәхси хоҡуҡтарҙы һаҡлап ҡалыу, йәки хеҙмәт мөмкинлектәре эҙләү. UAID- иҫәп-хисап индексы, үтә күренмәле идентификаторҙар аша ҡушылырға тейеш UAID, һәм икеләтә йәки ҡапма-ҡаршы үтә күренмәле идентификаторҙарҙы кире ҡаға. [FHE һәм UAID](/ba/blockchain/sora-nexus-services.md#fhe-and-uaid) өсөн Nexus хеҙмәт ҡатламы ағымы.

## Иҫәптәр контролеры {#account-controllers}

Контроллер аккаунттың ғәмәлгә нисек рөхсәт итеүен билдәләй. Дефолт клиент ағымы Ed25519 төймә парын ҡуллана, әммә мәғлүмәттәр моделе шулай уҡ күп имзалы сәйәсәт контроллеры кеүек бай контролде хуплай.

Клиент конфигурацияһы ҡул ҡуйыу хоҡуғын бер-береһенән айырып һаҡлай:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

Күрәһегеҙме [клиент конфигурацияһы](/ba/guide/configure/client-configuration.md) һәм [төп генерация](/ba/guide/security/generating-cryptographic-keys.md) Хәҙерге төп форматтар өсөн.

## Taira менән һынап ҡарағыҙ. {#try-it-on-taira}

Йәмәғәт Taira тест селтәрендәге IDs бер нисә канон иҫәбенә исемлек килтерегеҙ:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

Бухгалтер иҫәбенең активтарын тикшерер өсөн, иҫәпте күсер ID тәүге саҡырылыштан һәм URL- уны юлға һалғансы кодлай. Python беренсе иҫкә алынған иҫәп өсөн snippet шулай эшләй:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

Булар - йәмәғәт уҡыуҙары. иҫәп яҙмаһын булдырыу йәки яңыртыу ҡул ҡуйылған транзакция булып тора һәм кран-финанс талап ителә Taira көйләү [Ҡатнашыу SORA Nexus Мәғлүмәт базалары](/ba/get-started/sora-nexus-dataspaces.md).

## Теркәлеше һәм рөхсәттәре {#registration-and-permissions}

Хисаптар теркәлгән һәм теркәлмәгән дөйөм [`Register` һәм `Unregister`](/ba/blockchain/instructions.md#un-register) Инструкциялар. Актив үтәү ваҡытын раҫлаусы кем иҫәп-хисаптар төҙөй ала, һәм ниндәй рөхсәт билдәләре йәки ролдар талап ителә.

Теркәлгәндән һуң иҫәб:

- транзакцияларҙы яҙыу
- тотоу активтары
- үҙ биләмәләре
- ролдәрҙе һәм рөхсәт билдәләрен алыу
- һаҡланған метамәғлүмәттәр
- Nexus идентификация ағымдарында ҡатнашыу, был функциялар ҡулайлаштырылған осраҡта

## Билдәлелек мәсьәләләрен хәл итеү {#troubleshooting-identity-issues}

Әгәр ҙә операция көтөлмәгәндә кире ҡағылһа, тикшерегеҙ:

- клиенттың асыҡ асҡысы ҡултамғалау өсөн ҡулланылған шәхси асҡыс менән тап килә
- иҫәб генезиста теркәлгән йәки килешеү төҙөлгән
- власть инструкция буйынса талап ителгән рөхсәттәре бар
- строгие учетные поля используют канонический I105 счет ID, ә уҡый торған исемдәр актив иҫәп-хисап ҡушаматы аша хәл ителә.

Шулай уҡ ҡарағыҙ:

- [Разрешениелар](/ba/blockchain/permissions.md)
- [Метамәғлүмәттәре](/ba/blockchain/metadata.md)
- [Клиент конфигурацияһы](/ba/guide/configure/client-configuration.md)
- [SORA Nexus мәғлүмәт киңлектәре](/ba/get-started/sora-nexus-dataspaces.md)
