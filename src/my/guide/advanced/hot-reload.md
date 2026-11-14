---
translation_locale: my
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# Docker ကွန်တိန်နာတွင် အပူပြန်တင်ခြင်း Iroha {#hot-reload-iroha-in-a-docker-container}

ချက်ချင်း ပြန်တင်ခြင်းကို စက်တွင်း အမှားရှာဖွေရန်သာ အသုံးပြုပါ။ တူညီသော ရင်းမြစ်ဗားရှင်းမှ ဘိုင်နရီဖိုင်များကို တည်ဆောက်ပြီး Docker တွင် အတည်ပြုသူ လေးခုကို စတင်ရန် [လွှတ်တင်ခြင်း Iroha 3](/my/get-started/launch-iroha.md) လမ်းညွှန်ကို လိုက်နာပါ။

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

ကွန်တိန်နာကို ရှာရန် `docker ps` ကို သုံးပါ။ နောက်ကွယ်ရှိ ပရိုဂရမ်ကို မလဲမီ ပုံရိပ်ထဲရှိ ၎င်း၏ လမ်းကြောင်းကို စစ်ဆေးပါ။

## Disposable Network တွင် blockchain genesis ကိုပြန်လည်သုံးစွဲခြင်း {#recommit-genesis-in-a-disposable-network}

ကနဦးဘလောက်အသစ်ကို အသုံးပြုရန် နိုဒ်၏ သိုလှောင်နေရာသည် အလွတ်ဖြစ်ရမည်။ တူညီသော ကွန်ရက်ကို ပြန်စရန် `python3 poc.py down` နှင့် `python3 poc.py up` ကို အစဉ်လိုက် လုပ်ဆောင်ပါ။ `state/` ကို ၎င်း၏ Docker သိုလှောင်မှုအတွဲ လေးခုနှင့်အတူ သိမ်းထားပါ။

## စိတ်ကြိုက်ပြင်ဆင်သတ်မှတ်ချက်ကို အသုံးပြုခြင်း {#use-custom-configuration}

လက်ရှိ peer ပြင်ဆင်သတ်မှတ်မှုသည် TOML ဖြစ်သည်။ Kagami သည် validator တစ်ခုစီအတွက် `genesis.signed.nrt`၊ `genesis.public_key` နှင့် `genesis.expected_hash` ပါဝင်သော `peerN.toml` တစ်ခုစီကို ရေးသားပေးပြီး `kagami docker` မှ ထုတ်ပေးသော Compose ဖိုင်က ၎င်းတို့ကို container ထဲသို့ mount လုပ်သည်။ ဖိုင်များကို လက်ဖြင့် ကူးယူမည့်အစား ၎င်းကို ပြန်လည်ထုတ်လုပ်ပြီးနောက် peer ကို ပြန်စတင်ပါ။ ထုတ်လုပ်ထားသော ဖိုင်များကို တစ်စုတည်း ထားပါ။ မတူသော Kagami လုပ်ဆောင်မှုများမှ ဖိုင်များကို ရောနှောလျှင် deserialize လုပ်ခြင်း သို့မဟုတ် consensus မအောင်မြင်မှု ဖြစ်နိုင်သည်။
