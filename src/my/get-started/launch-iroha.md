---
translation_locale: my
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လွှတ်တင်ခြင်း Iroha 3 {#launch-iroha-3}

ဤစာမျက်နှာသည် Iroha 3 အတွက် လက်ရှိ ဒေသတွင်းကွန်ရက် စီးဆင်းမှုကို Upstream သိုလှောင်ရုံမှ အလိုအလျောက် workspace အရင်းအမြစ်များကိုအသုံးပြုခြင်းဖြင့် ဖြတ်သန်းသည်။

## (၁) ဒေသတွင်း အထက်တန်းစား ကွန်ယက်ကို ဖန်တီးခြင်း {#_1-generate-a-local-multi-peer-network}

လက်ရှိ Kagami ကုဒ်မှ ၄- peer localnet ကိုထုတ်လုပ်ပါ

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Output directory ထဲမှာ `genesis.json`, `genesis.signed.nrt`, `client.toml` နဲ့ helper script တွေ ပါပါတယ်။

ဒေသတွင်း မီးခိုးစမ်းသပ်မှုအတွက် ထုတ်လုပ်ထားတဲ့ အဖော်တွေကို တိုက်ရိုက်စတင်ပါ။

```bash
./localnet/start.sh
```

containerized run အတွက် localnet directory တစ်ခုတည်းမှ Compose ကို ဖန်တီးပါ။

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

အလိုအလျောက်ဖန်တီးထားတဲ့ stack က:

- peer P2P ဆိပ်ကမ်းများ `1337` မှ `1340`
- Torii HTTP ဆိပ်ကမ်း `8080` သို့ `8083`
- `./localnet/client.toml` အမည်ဖြင့် အသင့်ရှိသော Client Config

## (၂) ကွန်ရက်ကို ဖွင့်ထားတာကို စစ်ဆေးပါ။ {#_2-verify-that-the-network-is-up}

အဆင့်သတ်မှတ်ချက်ကို ပထမအဆင့်မှာ စစ်ကြည့်ပါ။

```bash
curl http://127.0.0.1:8080/status
```

ပုံမှန် ကျန်းမာရေး စစ်ဆေးမှုတွေမှာလည်း သုံးပါတယ်။

```bash
curl http://127.0.0.1:8080/status/blocks
```

CLI ကို ချက်ချင်း ချိတ်ဆက်ထားတဲ့ Client Config ကို ညွှန်ပြနိုင်ပါတယ်။

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## (၃) Nexus Profile {#_3-nexus-profile}

SORA Nexus ကို ဦးတည်တဲ့ config profile တစ်ခုကိုလည်း `defaults/nexus/` အောက်မှာ တင်ပေးပါတယ်။

Nexus profile နဲ့ native peer ကို run လုပ်ဖို့-

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

CLI သို့ ဝင်ရောက်ရန်အတွက် `defaults/nexus/client.toml` ကို အသုံးပြုပါ။

## (၄) ဒေသတွင်းကွန်ရက်ကို ရပ်ဆိုင်းပါ။ {#_4-stop-the-local-network}

ဒေသတွင်းထုတ်လုပ်သော Localnet အတွက်:

```bash
./localnet/stop.sh
```

ထုတ်လုပ်သော Compose stack အတွက်:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

ကွန်ရက်အလုပ်လုပ်ပြီးနောက် [ကို ဆက်လုပ်ပါ Iroha 3 ကို CLI](/my/get-started/operate-iroha-via-cli.md) မှတစ်ဆင့် လုပ်ဆောင်ပါ။
