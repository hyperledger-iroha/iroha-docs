---
translation_locale: hy
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Լանչում Iroha 3 {#launch-iroha-3}

Այս էջը անցնում է Iroha 3 համար տեղական ցանցի ընթացիկ հոսքի միջոցով ՝ օգտագործելով վերածնային պահեստից ստացված աշխատանքային տարածության նախնական ակտիվները:

## 1. Ստեղծեք տեղական բազմահանգույց ցանց {#_1-generate-a-local-multi-peer-network}

Ներկայումս Kagami կոդից ստեղծեք չորս հանգույց localnet:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

Արտադրման ցուցակը պարունակում է համընկնում զուգահեռ կոնֆիգներ, `genesis.json`, `genesis.signed.nrt`, `client.toml` եւ օգնական սցենարները:

Տեղական ծխի փորձարկման համար, անմիջապես սկսեք արտադրված հանգույցները.

```bash
./localnet/start.sh
```

Կոնտեյներով գործարկման համար Compose-ի ֆայլը ստեղծեք նույն `localnet` գրացուցակից.

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

Նախնական ձեւով ստեղծված փաթեթը բացահայտում է.

- հանգույցային P2P նավահանգիստներ `1337` մինչեւ `1340`
- Torii HTTP նավահանգիստները `8080` մինչեւ `8083`
- `./localnet/client.toml` հասցեով պատրաստված հաճախորդի կարգավորումը:

## 2. Ստուգեք, թե արդյոք ցանցն աշխատում է {#_2-verify-that-the-network-is-up}

Ստուգեք վիճակի վերջնական կետը առաջին հանգույցային կապի վրա.

```bash
curl http://127.0.0.1:8080/status
```

Սովորական առողջության ստուգումները նույնպես օգտագործում են.

```bash
curl http://127.0.0.1:8080/status/blocks
```

Դուք կարող եք անմիջապես ուղղել CLI փաթեթավորված հաճախորդի կարգավորման:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus Պրոֆիլ {#_3-nexus-profile}

SORA Nexus ուղղված կոնֆիգերի պրոֆիլը նաեւ ուղարկվում է `defaults/nexus/` թղթադրամում:

Nexus պրոֆիլով ներկառուցված հանգույցային կապ գործարկելու համար'

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

Օգտագործեք `defaults/nexus/client.toml` տվյալ պրոֆիլին հասնելու համար CLI:

## 4. Դադարեցրեք տեղական ցանցը {#_4-stop-the-local-network}

Տեղական ստեղծված տեղական ցանցի համար.

```bash
./localnet/stop.sh
```

Ստեղծված Compose փայտի համար՝

```bash
docker compose -f ./docker-compose.yml down
```

Այն բանից հետո, երբ ցանցը գործարկվում է, շարունակեք [Գործել Iroha 3 միջոցով CLI](/hy/get-started/operate-iroha-via-cli.md):
