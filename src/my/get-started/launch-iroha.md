---
translation_locale: my
translation_source: /get-started/launch-iroha.md
translation_source_hash: 9341b2404624dec2230bc294c3d60dc124ac9574a0a5803b9bba744f4c5e7f50
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# လွှတ်တင်ခြင်း Iroha 3 {#launch-iroha-3}

ဤစာမျက်နှာသည် လက်ရှိဒေသတွင်းကွန်ရက်စီးဆင်းမှုမှတစ်ဆင့်သွားသည်။ Iroha 3 အသုံးပြုခြင်း
Upstream repository မှ default workspace assets များကို ထည့်သွင်းပါ။

## (၁) ဒေသတွင်း အဖော်အများအပြားကွန်ရက်တစ်ခု ဖန်တီးခြင်း {#_1-generate-a-local-multi-peer-network}

စစ္တပ္ကေန ၄ မ်ိဳး localnet ကို ထုတ္လုပ္ပါ Kagami ကုဒ်:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
```

Output directory မှာ peer config တွေနဲ့ ကိုက်ညီပါတယ်။ `genesis.json`,
`genesis.signed.nrt`, `client.toml`, စာရေးဆရာတွေကို ကူညီပေးတယ်။

ဒေသတွင်း မီးခိုးစမ်းသပ်မှုအတွက် ထုတ်လုပ်တဲ့ အဖော်တွေကို တိုက်ရိုက်စတင်ပါ။

```bash
./localnet/start.sh
```

Containerized run အတွက် localnet directory တစ်ခုတည်းမှ Compose ကို Generate လုပ်ပါ။

```bash
cargo run --bin kagami -- docker \
  --peers 4 \
  --config-dir ./localnet \
  --image hyperledger/iroha:dev \
  --out-file ./localnet/docker-compose.yml \
  --force

docker compose -f ./localnet/docker-compose.yml up
```

ကြိုတင်ထုတ်လုပ်ထားသော stack က:

- တူညီသူ P2P ဆိပ်ကမ်းများ `1337` သို့ `1340`
- Torii HTTP ဆိပ်ကမ်းများ `8080` သို့ `8083`
- အသင့်ရှိသော client configuration ကို `./localnet/client.toml`

## (၂) ကွန်ရက်ဖွင့်ထားတာကို စစ်ဆေးပါ {#_2-verify-that-the-network-is-up}

ပထမအဆင့်မှာ အခြေအနေအဆုံးမှတ်ကို စစ်ကြည့်ပါ။

```bash
curl http://127.0.0.1:8080/status
```

ပုံမှန် ကျန်းမာရေး စစ်ဆေးမှုတွေမှာလည်း သုံးပါတယ်။

```bash
curl http://127.0.0.1:8080/status/blocks
```

ခင်ဗျား ချက်ချင်းပဲ ညွှန်ပြလို့ရတယ် CLI ဘူးတွဲ Client Config မှာ

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## 3. Nexus အမည်စာရင်း {#_3-nexus-profile}

သိုလှောင်ရုံမှာလည်း SORA Nexus- oriented config profile ကို အောက်မှာ
`defaults/nexus/`.

ဒေသခံ တန်းတူလူမျိုးတွေနဲ့အတူ Nexus သရုပ်ဖော်ချက်:

```bash
./target/release/irohad --sora --config ./defaults/nexus/config.toml
```

အသုံးပြုခြင်း `defaults/nexus/client.toml` အတွက် CLI အဲဒီပရိုဖိုင်းကို ဝင်ရောက်ကြည့်ပါ။

## (၄) ဒေသတွင်းကွန်ရက်ကို ပိတ်လိုက်ပါ {#_4-stop-the-local-network}

ဒေသတွင်းထုတ်လုပ်သော localnet အတွက်:

```bash
./localnet/stop.sh
```

ထုတ်လုပ်ထားတဲ့ Compose stack အတွက်:

```bash
docker compose -f ./localnet/docker-compose.yml down
```

ကွန်ယက်အလုပ်လုပ်ပြီးတာနဲ့ ဆက်လုပ်ပါ။
[လုပ်ဆောင်မှု Iroha 3 အပြင် CLI](/my/get-started/operate-iroha-via-cli.md).
