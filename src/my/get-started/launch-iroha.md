---
translation_locale: my
translation_source: /get-started/launch-iroha.md
translation_source_hash: 63eed8f987d33a487bb6329266eacbc09d10bb429027413997957579e31e80b4
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လွှတ်တင်ခြင်း Iroha 3 {#launch-iroha-3}

ဤစာမျက်နှာသည် Iroha 3 အတွက် လက်ရှိ ဒေသတွင်းကွန်ရက် စီးဆင်းမှုကို Upstream သိုလှောင်ရုံမှ အလိုအလျောက် workspace အရင်းအမြစ်များကိုအသုံးပြုခြင်းဖြင့် ဖြတ်သန်းသည်။

## (၁) ဒေသတွင်း အထက်တန်းစား ကွန်ယက်ကို ဖန်တီးခြင်း {#_1-generate-a-local-multi-peer-network}

လက်ရှိ Kagami ကုဒ်မှ peer လေးခုပါ localnet ကို ထုတ်လုပ်ပါ -

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

အထွက် directory တွင် ကိုက်ညီသော peer ပြင်ဆင်သတ်မှတ်မှုများ၊ `genesis.json`၊ `genesis.signed.nrt`၊ `client.toml` နှင့် အကူ script များ ပါဝင်သည်။

ဒေသတွင်း မီးခိုးစမ်းသပ်မှုအတွက် ဖန်တီးထားတဲ့ ကွန်ရက်တူညီသူတွေကို တိုက်ရိုက်စတင်ပါ။

```bash
./localnet/start.sh
```

Container ဖြင့် လုပ်ဆောင်ရန် ထို localnet ဖိုင်တွဲ မှပင် Compose ကို ထုတ်လုပ်ပါ -

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./docker-compose.yml \
  --force

docker compose -f ./docker-compose.yml up
```

အလိုအလျောက်ဖန်တီးထားတဲ့ stack က:

- Peer များ၏ P2P port `1337` မှ `1340` အထိ
- Torii HTTP ဆိပ်ကမ်း `8080` သို့ `8083`
- `./localnet/client.toml` တွင် အသင့်သုံး client ပြင်ဆင်သတ်မှတ်မှု

## (၂) ကွန်ရက်ကို ဖွင့်ထားတာကို စစ်ဆေးပါ။ {#_2-verify-that-the-network-is-up}

အဆင့် API အဆုံးမှတ်ကို ပထမဆုံးကွန်ရက် peer မှာစစ်ပါ။

```bash
curl http://127.0.0.1:8080/status
```

ပုံမှန် ကျန်းမာရေး စစ်ဆေးမှုတွေမှာလည်း သုံးပါတယ်။

```bash
curl http://127.0.0.1:8080/status/blocks
```

CLI ကို အတူပါလာသော client ပြင်ဆင်သတ်မှတ်မှုသို့ ချက်ချင်း ညွှန်နိုင်သည် -

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. SORA Nexus ပရိုဖိုင် {#_3-nexus-profile}

Repository တွင် `defaults/nexus/` အောက်၌ SORA Nexus အခြေပြု ပြင်ဆင်သတ်မှတ်မှုပရိုဖိုင်လည်း ပါဝင်သည်။

SORA Nexus ပရိုဖိုင်ဖြင့် မူရင်း peer ကို လုပ်ဆောင်ရန် -

```bash
./target/release/iroha3d --sora --config ./defaults/nexus/config.toml
```

CLI သို့ ဝင်ရောက်ရန်အတွက် `defaults/nexus/client.toml` ကို အသုံးပြုပါ။

## (၄) ဒေသတွင်းကွန်ရက်ကို ရပ်ဆိုင်းပါ။ {#_4-stop-the-local-network}

ဒေသတွင်းထုတ်လုပ်သော Localnet အတွက်:

```bash
./localnet/stop.sh
```

ထုတ်လုပ်သော Compose stack အတွက်:

```bash
docker compose -f ./docker-compose.yml down
```

ကွန်ရက်အလုပ်လုပ်ပြီးနောက် [Iroha 3 ကို CLI မှတစ်ဆင့် လည်ပတ်ပါ။](/my/get-started/operate-iroha-via-cli.md) ကို ဆက်လုပ်ပါ။
