---
translation_locale: my
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Docker ကွန်တိန်နာတွင် အပူပြန်တင်ခြင်း Iroha {#hot-reload-iroha-in-a-docker-container}

ဒေသတွင်း debugging အတွက်သာ hot reload ကိုအသုံးပြုပါ။ ပုံမှန်ဒေသဆိုင်ရာဖွံ့ဖြိုးတိုးတက်မှုအတွက် ရုပ်ပုံကို ပြန်လည်တည်ဆောက်ခြင်း သို့မဟုတ် အသစ် Kagami ဘက်ကလစ်မှထုတ်လုပ်သော Docker Compose stack ကို restart လုပ်ရန် ပိုနှစ်သက်သည်။

## Network peer Binary ကို အစားထိုးပါ {#replace-the-peer-binary}

Linux ကိုက်ညီသော Daemon Binary ကို Upstream Workspace မှတည်ဆောက်ပါ။

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

Running network peer container ထဲကို Copy လုပ်ပြီး အဲဒီ container ကို Restart လုပ်ပါ။

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

`docker ps` ကို အသုံးပြုပြီး container နာမည်ကို အတည်ပြုပါ။ ထုတ်လုပ်ထားတဲ့ stack မှာ network peer containers တွေကို `./docker-compose.yml` ဖြင့် သတ်မှတ်ထားတယ်။

## Disposable Network တွင် blockchain genesis ကိုပြန်လည်သုံးစွဲခြင်း {#recommit-genesis-in-a-disposable-network}

Network peer သည် blockchain genesis ကို ၎င်း၏ သိုလှောင်မှုအလွတ်ရှိမှသာ ပြီးဆုံးစေသည်။ တစ်ခါသုံး Docker ကွန်ရက်အတွက်, stack ကိုရပ်တန့်ပါ, ထုတ်လုပ်သောအခြေအနေကိုဖယ်ရှားပါ, လက်မှတ်ရေးထိုးထားသော blockchain genesis bundle ကိုပြန်လည်ပြုပြင်ခြင်း (သို့မဟုတ်အစားထိုးပါ) နှင့်စတင်ပါ:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

၎င်းရဲ့အခြေအနေကို ထိန်းသိမ်းရန် လိုအပ်တဲ့ ကွန်ရက်တစ်ခုမှာ blockchain genesis ကို အစားထိုးမလုပ်ပါ။

## Custom Configuration ကို အသုံးပြုပါ။ {#use-custom-configuration}

လက်ရှိကွန်ရက် peer ဖွဲ့စည်းချက်သည် TOML ဖြစ်သည်။ ထုတ်လုပ်ထားသော `config.toml`, `genesis.signed.nrt` နှင့် ဆက်စပ်သော အဓိကဖိုင်များကို container လမ်းကြောင်းများသို့ ချိတ်ဆက်ခြင်း (သို့မဟုတ်) ကူးယူခြင်း Kagami Run များမှ ဖိုင်များကို ရောနှောခြင်းသည် deserialization သို့မဟုတ် သဘောတူညီမှု ကျရှုံးမှုများဖြစ်စေနိုင်သည်။
