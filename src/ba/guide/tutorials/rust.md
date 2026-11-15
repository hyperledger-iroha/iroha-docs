---
translation_locale: ba
translation_source: /guide/tutorials/rust.md
translation_source_hash: 9d9848de91a85c84221efc39bc7dfb8443f5c50b448d336207c06efce3bc07e8
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Rust {#rust}

Rust ғәмәлгә ашырыу төп эш урындарында йәшәй һәм Iroha 3 код базаһы менән эшләүҙең иң тура ысулы булып ҡала.

## Нимәгә өлгәшәһең ? {#what-you-get}

Хәҙерге ваҡытта өҫкө ағымы һаҡлағыста:

- `iroha` Rust client crate-ы
- `iroha` CLI иң тулы референс клиенты булараҡ
- SDK ҡатламында ҡулланылған уртаҡ мәғлүмәт моделе, криптовалюта һәм Norito һандар

## Тейешле башланғыс {#recommended-starting-point}

Проекттың хәҙерге торошо өсөн CLI шиғыры һәм эш урыны үҙе менән башларға кәрәк:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha
cargo build --workspace
```

Референс клиентын теркәлгән дефолт клиент конфигурацияһы менән эшләтегеҙ:

```bash
cargo run --bin iroha -- --config ./defaults/client.toml ledger domain list --all
```

## Taira Тик уҡырға ғына {#try-taira-read-only}

Шул уҡ эш урындары контролендә, асыҡ диагностика ярҙамсыһы Taira һынап ҡарағыҙ:

```bash
cargo run --bin iroha -- taira doctor \
  --public-root https://taira.sora.org \
  --json
```

Маршрут кимәлендәге тикшереүҙәр өсөн Torii туранан-тура JSON API менән ҡулланығыҙ:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/assets/definitions?limit=5' \
  | jq -r '.items[] | [.id, .name, .total_quantity] | @tsv'
```

`taira.client.toml` булдырғандан һуң, шул уҡ бинар файл `iroha taira account` ярҙамында иҫәпте теркәй һәм уға аҡса күсерә ала, шулай уҡ Taira селтәренә ғәҙәти ҡул ҡуйылған реестр командаларын ебәрә ала. Уларҙы ғәҙәти берәмек һынауҙарынан айырым тотоғоҙ, сөнки улар һынау аҡсаһы биреү хеҙмәте аша аҡсаландырылған иҫәпте һәм эшләп торған һынау селтәрен талап итә.

## Rust Client Crate-ын ҡулланыу {#using-the-rust-client-crate}

Сеть ҡулланылған Iroha Git версияһын биҙәгеҙ:

```toml
[dependencies]
iroha = { git = "https://github.com/hyperledger-iroha/iroha.git", rev = "<IROHA_COMMIT>", package = "iroha" }
```

Әгәр һеҙгә Rust өҫкө йөҙҙәрҙең ғәмәлдә нисек ҡулланылыуының иң тулы миҫалдары кәрәк икән, тикшерегеҙ:

- `crates/iroha_cli`
- `crates/iroha/README.md`
- `crates/iroha_cli/README.md`

Реестр идара иткән эскроу эш ағымдары өсөн [протоколға индерелгән актив эскроуын](/ba/blockchain/escrow.md#rust-sdk) ҡарағыҙ. Rust мәғлүмәттәр моделендә әлеге ваҡытта баҙар эскроуы, дөйөм актив бикләүҙәре, шартлы эскроу, һорауҙар һәм ваҡиғалар өсөн иң тулы типлы ҡаплау бар.

Һеҙ урындағы CLI ярҙам snapshot менән регенерациялау мөмкин:

```bash
cargo run -p iroha_cli --bin iroha -- tools markdown-help > crates/iroha_cli/CommandLineHelp.md
```

## Иҫкәрмәләр {#notes}

- CLI әлеге ваҡытта үҙаллы crate документтары менән сағыштырғанда яҡшыраҡ яҡлау бирә.
- Операторҙар стилендәге ағымдар өсөн CLI документацияһы иң заманса сығанаҡ булып тора.
