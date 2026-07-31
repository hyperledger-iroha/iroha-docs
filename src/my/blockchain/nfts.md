---
translation_locale: my
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

အန် Iroha NFT တစ်ခုတည်းသော ပိုင်ရှင်ရှိသည့် ထူးခြားသောအမှတ်တံဆိပ်ဖြစ်သည် NFTs မှတ်တမ်းတစ်ခုမှာ ကိုယ်ပိုင်လက္ခဏာ၊ metadata, lifecycle အဖြစ်အပျက်များနှင့် ပိုင်ဆိုင်မှုလွှဲပြောင်းမှု အဓိပ္ပာယ်ကို လိုအပ်ပေမဲ့ ကိန်းဂဏန်း ဟန်ချက်ညီမှုတော့ မလိုပါ။

ကိန်းဂဏန်းနဲ့မတူဘဲ [အရင်းအမြစ်](/my/blockchain/assets.md), တစ် NFT တိကျမှုမရှိ၊ ထုတ်ယူနိုင်စွမ်းမရှိ၊ စာရင်းတစ်စောင်အတွက် အရေအတွက် မရှိပါ။ NFT မှတ်ပုံတင်ထားတဲ့ အရာတစ်ခုအဖြစ် တည်ရှိပြီး ပိုင်ဆိုင်မှုကို အဲဒီအရာကို တိုက်ရိုက် ခြေရာခံထားရတယ်။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Nft` တွင်:

- `id`: a `NftId`
- `content`: NFT ကို ဖော်ပြတဲ့ metadata များ
- `owned_by`: NFT ကို ပိုင်ဆိုင်ထားသော အကောင့်

နိုင်ငံတကာ `content` ကွင်းက `Metadata` မြေပုံကို ညှိထားပါ။ သရုပ်ဖော်တဲ့ ကွင်းတွေကို သိုလှောင်ပါ၊ တည်ငြိမ်တဲ့ ရည်ညွှန်းချက်တွေ၊ hashes တွေ၊ URIs, ဒါမှမဟုတ် SoraFS ကြီးမားသောစာရွက်စာတမ်းများ၊ မီဒီယာများ (သို့မဟုတ်) မြင့်မားသော churn application များကို ချိတ်ဆက်ထားပြီး စစ်ဆေးနိုင်သည့် ရည်ညွှန်းချက်များကိုသာ NFT.

## Taira မှာ စမ်းကြည့်ပါ။ {#try-it-on-taira}

အများပြည်သူ Taira testnet မှာ လက်ရှိမှာ NFT မှတ်တမ်းတွေ ရှိမရှိကို စစ်ဆေးပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nft_ids: [.items[].id]}'
```

NFT လမ်းကြောင်းများအတွက် live OpenAPI စာရွက်စာတမ်းကို စစ်ဆေးပါ node ကဖွင့်ထားသည်

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

အလွတ်တစ်ခု `items` array ဟာ အများသုံး စမ်းသပ်ရေးကွန်ရက်မှာ သက်ဝင်တဲ့ တုံ့ပြန်မှုပါ။ NFTs လက်ရှိ စာမျက်နှာမှာ မဟုတ်ဘူး။ NFT ညွှန်ကြားချက်တွေ မရနိုင်ပါ။

## NFT IDs {#nft-ids}

`NftId` သည် ဤစာသားပုံစံကို အသုံးပြုသည်-

```text
name$domain
name$domain.dataspace
```

ဥပမာ၊ `badge$docs.universal` ကွဲပြားခြားနားချက်များ `badge` NFT အထဲမှာ `docs.universal` ဒေတာအကွာအဝေးကို ချန်ထားပါက လက်ရှိ parser က `universal` ဒေတာနေရာ၊ ဒီတော့ `badge$docs` ဆုံးဖြတ်ချက်ချသည် `badge$docs.universal`.

ခိုင်မာတဲ့ နာမည်တွေကို သုံးပါ။ NFT IDs. နိုင်ငံတကာ ID ညွှန်ကြားချက်များ၊ မေးမြန်းချက်များ၊ ခွင့်ပြုချက်များ၊ ဖြစ်ရပ်စစ်ဆေးခြင်းများနှင့် အသုံးချမှု ရည်ညွှန်းချက်များတွင် အသုံးပြုသော အရာဝတ္ထုအမည်ဖြစ်သည်။

## သက်တမ်း စက်ဝန်း {#lifecycle}

NFT သက်တမ်း စက်ဝန်း လုပ်ငန်းများ အသုံးပြုခြင်း Iroha အထူးညွှန်ကြားချက်များ:

- [`Register`](/my/blockchain/instructions.md#un-register) ဖန်တီးပေးတယ် NFT အစောပိုင်း `content`.
- [`Unregister`](/my/blockchain/instructions.md#un-register) က NFT ကို ဖယ်ရှားတယ်။
- [`Transfer`](/my/blockchain/instructions.md#transfer) ပြောင်းလဲချက်များ `owned_by`.
- [`SetKeyValue` နှင့် `RemoveKeyValue`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue) update ကို NFT မီတာဒေတာ။

## ဒေသတွင်းမှာ စမ်းကြည့်ပါ။ {#try-it-locally}

[CLI လမ်းညွှန်ချက် ](/my/get-started/operate-iroha-via-cli.md) မှ client ဖွဲ့စည်းမှုကို ဖန်တီးပြီး ဒေသတွင်းကွန်ရက်ကို စတင်ခဲ့ပြီလို့ ယူဆပါ

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

Generated localnet ကို Setup လုပ်ပြီးသားပါ။ `wonderland.universal` ၎င်း၏ SNS ခြားနားတဲ့ ဒိုမင်တစ်ခု သုံးချင်ရင် ပထမဦးဆုံးအနေနဲ့ ကြေညာချက်နဲ့ ဖန်တီးပါ။ `app alias setup plan` နှင့် `app alias setup apply` Workflow ကို [ဒိုမင်များ](/my/blockchain/domains.md#registration).

NFT ကို မှတ်ပုံတင်ပါ။ မှတ်ပုံတင်သည် စံဝင်မှတ်သွင်းချက်မှ အစောပိုင်းစာရင်း JSON ကိုဖတ်သည်။

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft register --id "$NFT_ID"
```

NFT ကို တိုက်ရိုက်စစ်ဆေးပြီး ပြီးရင် စာရင်းအပြည့်ပါတဲ့ NFTs အားလုံးကိုစာရင်းသွင်းပါ။

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list all --verbose
```

metadata key ကိုထည့်ပြီး NFT ကိုပြန်ဖတ်ပါ။

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

metadata key ကို ဖယ်ရှားပါ။

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

ရွေးချယ်မှုအရ transfer ကို NFT. အသုံးပြုခြင်း `ledger nft get` လက်ရှိပိုင်ရှင်ကို ဖတ်ဖို့ `owned_by`, အသုံးပြုခြင်း `ledger account list all` ရည်မှန်းချက်စာရင်းရှာဖို့ ID.

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger account list all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

NFT ကို လွှဲပြောင်းခဲ့ရင် လက်ရှိပိုင်ရှင်ရဲ့ အကောင့်ကွန်ဖိုင်ရှင်းနဲ့ ဒီပ command ကို run လုပ်လိုက်ပါ။ (သို့) NFT ကို ပြန်လွှဲပြောင်းပါ။

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft unregister --id "$NFT_ID"
```

## မေးခွန်းများနှင့် ဖြစ်ရပ်များ {#queries-and-events}

အသုံးပြုခြင်း [`FindNfts`](/my/reference/queries.md#assets-nfts-and-rwas) စာရင်းသွင်းရန် NFTs နှင့် [`FindNftsByAccountId`](/my/reference/queries.md#assets-nfts-and-rwas) စာရင်းသွင်းရန် NFTs အကောင့်တစ်ခုရဲ့ ပိုင်ရှင်ပါ။

NFT မှတ်ပုံတင်ခြင်း၊ ဖျက်သိမ်းခြင်း၊ လွှဲပြောင်းခြင်းနှင့် metadata update များ ထုတ်လွှင့်ခြင်း NFT ဒေတာဖြစ်ရပ်များ။ `Nft` မှတ်စုအပြောင်းအလဲ (သို့) reacting to building triggers များကို subscribe လုပ်တဲ့အခါ data event filter ကို NFT ဘဝ စက်ဝန်း ဖြစ်ရပ်များ။

## ခွင့်ပြုချက်များ {#permissions}

Default permission surface မှာ NFT သီးသန့် tokens တွေ ပါဝင်ပါတယ်။

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

ခွင့်ပြုချက် စစ်ဆေးမှုများကို Active Runtime Validator က အကောင်အထည်ဖော်ပေးပြီး ကွန်ရက်တစ်ခုသည် အတည်ပြုသူကို အဆင့်မြှင့်တင်ခြင်းဖြင့် ခွင့်ပြုချက်ကို ပြုပြင်နိုင်သည်။ လက်ရှိ default token စာရင်းအတွက် [ Permission Tokens ](/my/reference/permissions.md) ကိုကြည့်ပါ။

## NFTs ကို ရွေးချယ်ခြင်း {#choosing-nfts}

မှတ်တမ်းများအတွက် NFT ကို အသုံးပြုပါ။ ထူးခြားမှုနှင့် ပိုင်ဆိုင်မှု အရေးပါသည်

- အထောက်အထားများ၊ အမှတ်တံဆိပ်များ၊ လိုင်စင်များနှင့် အတည်ပြုချက်များ
- ကိုယ်စားလှယ်လောင်း သို့မဟုတ် ဝင်ရောက်ခွင့် မှတ်တမ်းများ
- ကိုယ်ပိုင်လက္ခဏာနဲ့ ချည်နှောင်ထားတဲ့ (သို့) အကောင့်ပိုင် လျှောက်ထားချက် မှတ်တမ်းများ
- ချိတ်ဆက်မှုအပြင် မီဒီယာများ၊ စာရွက်စာတမ်းများ သို့မဟုတ် ထုတ်ပြန်ချက်များကို ရည်ညွှန်းခြင်း

fungible balance များအတွက် numeric asset ကိုသုံးပြီး data တွေဟာ ရှိနေတဲ့ ledger object တစ်ခုရဲ့ compact attribute တစ်ခုသာဖြစ်တဲ့အခါ plain [ metadata ](/my/blockchain/metadata.md) ကို သုံးပါ။

အောက်ပါအတိုင်းလည်း ကြည့်ပါ။

- [အရင်းအမြစ်များ](/my/blockchain/assets.md)
- [metadata](/my/blockchain/metadata.md)
- [ညွှန်ကြားချက်များ ](/my/blockchain/instructions.md)
- [မေးမြန်းချက်များ ](/my/blockchain/queries.md)
