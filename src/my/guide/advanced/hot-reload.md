---
translation_locale: my
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Docker ကွန်တိန်နာတွင် အပူပြန်တင်ခြင်း Iroha {#hot-reload-iroha-in-a-docker-container}

ဒေသတွင်း debugging အတွက်သာ hot reload ကိုအသုံးပြုပါ။ ပုံမှန်ဒေသဆိုင်ရာဖွံ့ဖြိုးတိုးတက်မှုအတွက် ရုပ်ပုံကို ပြန်လည်တည်ဆောက်ခြင်း သို့မဟုတ် အသစ် Kagami ဘက်ကလစ်မှထုတ်လုပ်သော Docker Compose stack ကို restart လုပ်ရန် ပိုနှစ်သက်သည်။

## တူညီသော နှစ်ထပ်ကို အစားထိုးပါ {#replace-the-peer-binary}

Linux ကိုက်ညီသော Daemon Binary ကို Upstream Workspace မှတည်ဆောက်ပါ။

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

ပြေးနေတဲ့ peer container ထဲကို Copy လုပ်ပြီး အဲဒီ container ကို Restart လုပ်ပါ။

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

`docker ps` ကိုသုံးပြီး container နာမည်ကို အတည်ပြုပါ။ ထုတ်လုပ်ထားတဲ့ stack မှာ peer containers တွေကို `./localnet/docker-compose.yml` ဖြင့် သတ်မှတ်ထားတယ်။

## Genesis ကို တစ်ခါသုံးကွန်ရက်တွင် ပြန်လည်ဖြည့်စွက်ပါ {#recommit-genesis-in-a-disposable-network}

Peer သည် ၎င်း၏ သိုလှောင်မှုအလွတ်ရှိမှသာ genesis ကိုပြုလုပ်သည်။ တစ်ခါသုံး Docker ကွန်ယက်အတွက်, stack ကိုရပ်တန့်ပါ, ထုတ်လုပ်သောအခြေအနေကိုဖယ်ရှားပါ, လက်မှတ်ရေးထိုးထားသော genesis bundle ကိုပြန်လည်ထူထောင်ပါ (သို့မဟုတ်အစားထိုးပါ) နှင့်စတင်ပါ:

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

၎င်းရဲ့အခြေအနေကို ထိန်းသိမ်းရန် လိုအပ်တဲ့ ကွန်ရက်တစ်ခုပေါ်က မျိုးရိုးဗီဇကို အစားထိုးမလုပ်ပါ။

## Custom Configuration ကို အသုံးပြုပါ။ {#use-custom-configuration}

လက်ရှိ peer configuration သည် TOML ဖြစ်သည်။ ထုတ်လုပ်သော `config.toml`, `genesis.signed.nrt` နှင့် ဆက်စပ်သော key files များကို image မှမျှော်လင့်ထားသည့် container paths သို့ ချိတ်ဆက်ပြီး peer ကို restart လုပ်ပါ။ ထုတ်လုပ်သော ဖိုင်များကို အတူတကွထားပါ။ Kagami ပြေးလွှာအမျိုးမျိုးမှဖိုင်များကို ရောစပ်ခြင်းသည် deserialization သို့မဟုတ် သဘောတူညီချက် ကျရှုံးမှုများကို ဖြစ်စေနိုင်သည်။
