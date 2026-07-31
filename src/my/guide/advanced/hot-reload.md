---
translation_locale: my
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 2c71e6c135d862d626d3b184eef3cbed350f1353d7dee78cc129092e7b857924
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# အပူပြန်တင်ခြင်း Iroha a တွင် Docker ကွန်တိန်နာ {#hot-reload-iroha-in-a-docker-container}

ဒေသတွင်း debugging အတွက်သာ hot reload ကိုသုံးပါ။ ပုံမှန်ဒေသဆိုင်ရာဖွံ့ဖြိုးမှုအတွက်
ပုံကို ပြန်လည်တည်ဆောက်ခြင်း (သို့) ထုတ်လုပ်ထားတဲ့ ပုံကို ပြန်စတင်ခြင်း Docker Compose a မှ stack
အသစ် Kagami အစုလိုက်ပါ

## တူညီသော နှစ်ထပ်ကိန်းကို အစားထိုးပါ {#replace-the-peer-binary}

Linux ကိုက်ညီသော daemon binary ကို Upstream အလုပ်ခွင်မှတည်ဆောက်ပါ

```bash
cargo build --release -p irohad --target x86_64-unknown-linux-musl
```

ပြေးနေတဲ့ peer container ထဲကို Copy လုပ်ပြီး အဲဒီ container ကို Restart လုပ်ပါ။

```bash
docker cp target/x86_64-unknown-linux-musl/release/irohad <container>:/usr/local/bin/irohad
docker restart <container>
```

အသုံးပြုခြင်း `docker ps` Container နာမည်ကို အတည်ပြုဖို့
container တွေကို `./localnet/docker-compose.yml`.

## Genesis ကို တစ်ခါသုံး ကွန်ယက်မှာ ပြန်လည်ဖြည့်သွင်းပါ {#recommit-genesis-in-a-disposable-network}

တစ်ပြိုင်နက်က ဇီဝဖြစ်စဉ်ကို ပြုလုပ်တာက ၎င်းရဲ့ သိုလှောင်ခန်းဟာ အလွတ်ရှိမှသာပါ။ Docker
ကွန်ရက်၊ stack ကိုရပ်တန့်ခြင်း၊ ထုတ်လုပ်ထားတဲ့ အခြေအနေကို ဖယ်ရှားခြင်း၊ ပြန်လည်ပြုပြင်ခြင်း သို့မဟုတ် အစားထိုးခြင်း
လက်မှတ်ရေးထိုးထားတဲ့ Genesis Bundle နဲ့ ပြန်စလိုက်ပါ

```bash
docker compose -f ./localnet/docker-compose.yml down
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

၎င်းရဲ့ အခြေအနေကို ထိန်းသိမ်းရန် လိုအပ်တဲ့ ကွန်ရက်တစ်ခုပေါ်က မျိုးဆက်ကို အစားမထိုးပါနဲ့။

## Custom Configuration ကို အသုံးပြုပါ {#use-custom-configuration}

လက်ရှိ peer configuration ကို TOML. ထုတ်လုပ်ထားသော မော်တော်ယာဉ်ကို ချိတ်ဆက်ခြင်း သို့မဟုတ် ကူးယူခြင်း
`config.toml`, `genesis.signed.nrt`, Container ထဲက key file တွေနဲ့ ဆက်စပ်တဲ့ files တွေ
Image က expected paths တွေနဲ့ peer ကို restart လုပ်လိုက်ပါ
အတူတူ၊ မတူညီတဲ့ ဖိုင်တွေကို ရောနှောခြင်း Kagami ပြေးလွှားမှုတွေက deserialization ဖြစ်ပေါ်စေနိုင်ပါတယ်။
သဘောတူညီမှု ကျရှုံးမှု။
