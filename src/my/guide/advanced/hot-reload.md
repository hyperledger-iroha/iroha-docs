---
translation_locale: my
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: d4fd88de377b9c88e0293ed07f307ad38c3f8b05ed898fd051c5bfb738d66681
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Docker ကွန်တိန်နာတွင် အပူပြန်တင်ခြင်း Iroha {#hot-reload-iroha-in-a-docker-container}

ဒေသတွင်း debugging အတွက်သာ hot reload ကိုအသုံးပြုပါ။ ပုံမှန်ဒေသဆိုင်ရာဖွံ့ဖြိုးတိုးတက်မှုအတွက် ရုပ်ပုံကို ပြန်လည်တည်ဆောက်ခြင်း သို့မဟုတ် အသစ် Kagami ဘက်ကလစ်မှထုတ်လုပ်သော Docker Compose stack ကို restart လုပ်ရန် ပိုနှစ်သက်သည်။

## peer executable ဖိုင်ကို အစားထိုးခြင်း {#replace-the-peer-binary}

Linux ကိုက်ညီသော Daemon Binary ကို Upstream Workspace မှတည်ဆောက်ပါ။

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

၎င်းကို လုပ်ဆောင်နေသော peer ကွန်တိန်နာထဲသို့ ကူးထည့်ပြီး ထိုကွန်တိန်နာကို ပြန်စပါ။

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

ကွန်တိန်နာအမည်ကို အတည်ပြုရန် `docker ps` ကို သုံးပါ။ ထုတ်လုပ်ထားသော စနစ်အစုတွင် peer ကွန်တိန်နာများကို `./docker-compose.yml` ဖြင့် သတ်မှတ်ထားသည်။

## Disposable Network တွင် blockchain genesis ကိုပြန်လည်သုံးစွဲခြင်း {#recommit-genesis-in-a-disposable-network}

Peer သည် ၎င်း၏ သိုလှောင်ဒေတာ အလွတ်ဖြစ်မှသာ genesis ကို commit လုပ်သည်။ တစ်ခါသုံး Docker ကွန်ရက်အတွက် စနစ်အစုကို ရပ်တန့်ပြီး ထုတ်လုပ်ထားသော အခြေအနေဒေတာကို ဖယ်ရှားပါ။ လက်မှတ်ထိုးထားသော genesis အစုကို ပြန်ထုတ်လုပ် သို့မဟုတ် အစားထိုးပြီး ပြန်စတင်ပါ။

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet generate --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

၎င်းရဲ့အခြေအနေကို ထိန်းသိမ်းရန် လိုအပ်တဲ့ ကွန်ရက်တစ်ခုမှာ blockchain genesis ကို အစားထိုးမလုပ်ပါ။

## စိတ်ကြိုက်ပြင်ဆင်သတ်မှတ်ချက်ကို အသုံးပြုခြင်း {#use-custom-configuration}

လက်ရှိ peer ပြင်ဆင်သတ်မှတ်မှုသည် TOML ဖြစ်သည်။ ထုတ်လုပ်ထားသော `config.toml`၊ `genesis.signed.nrt` နှင့် ဆက်စပ်ကီးဖိုင်များကို image က မျှော်မှန်းထားသော container လမ်းကြောင်းများတွင် bind mount လုပ်ပါ သို့မဟုတ် ကူးထည့်ပါ။ ထို့နောက် peer ကို ပြန်စတင်ပါ။ ထုတ်လုပ်ထားသော ဖိုင်များကို တစ်စုတည်း ထားပါ။ မတူသော Kagami လုပ်ဆောင်မှုများမှ ဖိုင်များကို ရောနှောလျှင် deserialize လုပ်ခြင်း သို့မဟုတ် consensus မအောင်မြင်မှု ဖြစ်နိုင်သည်။
