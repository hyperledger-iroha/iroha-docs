---
translation_locale: my
translation_source: /blockchain/nfts.md
translation_source_hash: 335eacd30c5964659baeeae8ac937805f1d4d786dd42a36e5164bbe75ef7e360
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

Iroha NFT သည် ပိုင်ရှင်တစ်ဦးတည်းရှိသော ထူးခြားသောအမှတ်တံဆိပ်အရာဖြစ်သည်။ မှတ်တမ်းတစ်ခုသည် ၎င်း၏ ကိုယ်ပိုင်လက္ခဏာ၊ မီတာဒေတာ၊ ဘဝပတ်ဝန်းကျင်ဖြစ်ရပ်များနှင့် ပိုင်ဆိုင်မှုလွှဲပြောင်းမှု အဓိပ္ပာယ်ကောက်ယူမှုလိုအပ်သော်လည်း ကိန်းဂဏန်းညီမျှခြင်းမရှိသည့်အခါ NFTs ကိုအသုံးပြုပါ။

ကိန်းဂဏန်းနဲ့မတူဘဲ [အရင်းအမြစ်](/my/blockchain/assets.md), တစ် NFT တိကျမှုမရှိ၊ ထုတ်ယူနိုင်စွမ်းမရှိ၊ စာရင်းတစ်စောင်အတွက် အရေအတွက် မရှိပါ။ NFT မှတ်ပုံတင်ထားတဲ့ အရာတစ်ခုအဖြစ် တည်ရှိပြီး ပိုင်ဆိုင်မှုကို အဲဒီအရာကို တိုက်ရိုက် ခြေရာခံထားရတယ်။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Nft` တွင်:

- `id`: a `NftId`
- `content`: NFT ကို ဖော်ပြတဲ့ metadata များ
- `owned_by`: NFT ကို ပိုင်ဆိုင်ထားသော အကောင့်

`content` ကွင်းသည် `Metadata` မြေပုံတစ်ခုဖြစ်သည်။ အသေးစိတ်ထားပါ- သရုပ်ဖော်ရေးကွင်းများ၊ တည်ငြိမ်သော ရည်ညွှန်းချက်များ၊ ဟက်ရှ်များ၊ URIs သို့မဟုတ် SoraFS လမ်းကြောင်းများကို သိုလှောင်ပါ။ ကြီးမားသောစာရွက်စာတမ်းများ၊ မီဒီယာများ၊ (သို့) မြင့်မားသော churn application status များကို ချိတ်ဆက်ထားပြီး စစ်ဆေးနိုင်သည့် ရည်ညွှန်းချက်ကိုသာ NFT တွင် သိမ်းဆည်းပါ။

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

အလွတ် `items` array သည် အများသုံး testnet တွင် သက်ဝင်သော တုံ့ပြန်မှုတစ်ခုဖြစ်သည်။ ဆိုလိုသည်မှာ လက်ရှိစာမျက်နှာတွင် NFTs မရှိခြင်းမဟုတ်ဘဲ NFT ညွှန်ကြားချက်များ မရရှိခြင်းပါ။

## NFT IDs {#nft-ids}

`NftId` သည် ဤစာသားပုံစံကို အသုံးပြုသည်-

```text
name$domain
name$domain.dataspace
```

ဥပမာ၊ `badge$docs.universal` သည် `badge` NFT ကို `docs.universal` ဒိုမင်ထဲတွင် ဖော်ထုတ်သည်။ အချက်အလက်နေရာကို ချန်ထားပါက လက်ရှိစစ်ဆေးသူသည် `universal` အချက်အလက်နေရာအား အသုံးပြု၍ `badge$docs` ကို `badge$docs.universal` သို့ ဖြေရှင်းပေးပါသည်။

NFT IDs အတွက် တည်ငြိမ်သောနာမည်များကို အသုံးပြုပါ။ ID သည် ညွှန်ကြားချက်များ၊ မေးမြန်းမှုများ၊ ခွင့်ပြုချက်များ၊ ဖြစ်ရပ်စစ်ဆေးသူများနှင့် အသုံးချမှု ရည်ညွှန်းချက်များတွင်အသုံးပြုသည့် အရာဝတ္ထုသမိုင်းဖြစ်ပါသည်။

## သက်တမ်း စက်ဝန်း {#lifecycle}

NFT သက်တမ်း စက်ဝန်း လုပ်ငန်းများ အသုံးပြုခြင်း Iroha အထူးညွှန်ကြားချက်များ:

- [`Register`](/my/blockchain/instructions.md#un-register) က NFT ကို အစောပိုင်း `content` ဖြင့် ဖန်တီးသည်။
- [`Unregister`](/my/blockchain/instructions.md#un-register) က NFT ကို ဖယ်ရှားတယ်။
- [`Transfer`](/my/blockchain/instructions.md#transfer) ပြောင်းလဲချက်များ `owned_by`.
- [`SetKeyValue` နှင့် `RemoveKeyValue`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue) update NFT metadata များ။

## ဒေသတွင်းမှာ စမ်းကြည့်ပါ။ {#try-it-locally}

[CLI လမ်းညွှန်ချက် ](/my/get-started/operate-iroha-via-cli.md) မှ client ဖွဲ့စည်းမှုကို ဖန်တီးပြီး ဒေသတွင်းကွန်ရက်ကို စတင်ခဲ့ပြီလို့ ယူဆပါ

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN=wonderland.universal
export NFT_ID='badge_intro$wonderland.universal'
```

ထုတ်လုပ်သော localnet သည် `wonderland.universal` နှင့် ၎င်း၏ SNS ငှားရန်စာချုပ်ကိုအတည်ပြုပြီးသားဖြစ်သည်။ မတူညီသောဒိုမင်တစ်ခုအသုံးပြုရန်၊ `app alias setup plan` နှင့် `app alias setup apply` လုပ်ငန်းခွင်များတွင်ဖော်ပြထားသည့် ကြေညာချက်များနှင့် [Domains](/my/blockchain/domains.md#registration) တွင်ဖန်တီးပါ။

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

[`FindNfts`](/my/reference/queries.md#assets-nfts-and-rwas) ကိုသုံးပြီး NFTs နှင့် [`FindNftsByAccountId` ](/my/reference/queries.md#assets-nfts-and-rwas) ကိုသုံးပြီး အကောင့်ပိုင်ရှင်များအတွက် NFTs ကိုသုံးပါ။

NFT မှတ်ပုံတင်၊ ဖျက်သိမ်းခြင်း၊ လွှဲပြောင်းခြင်းနှင့် metadata update များသည် NFT ဒေတာဖြစ်ရပ်များကို ထုတ်လွှင့်သည်။ `Nft` ဒေတာဖြစ်စဉ် စစ်ဆေးမှုကို အသုံးပြု၍ စာရင်းအင်းပြောင်းလဲမှုများသို့မဟုတ် NFT ဘဝပတ်ဝန်းကျင်ဖြစ်ရပ်များအား တုံ့ပြန်သော အဆောက်အအုံ trigger များကို ၀ င်ရောက်ရှိပါ။

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
