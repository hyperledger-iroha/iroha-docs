---
translation_locale: my
translation_source: /blockchain/nfts.md
translation_source_hash: 76608347790f14eb5a2d58ac26f0e194ccc34b1cb5e8983e2d6ac390fcb60ec6
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# NFTs {#nfts}

Iroha NFT သည် ပိုင်ရှင်တစ်ဦးတည်းရှိသော ထူးခြားသော blockchain ledger ပစ္စည်းဖြစ်သည်။ မှတ်တမ်းတစ်ခုသည် ၎င်း၏ ကိုယ်ပိုင်လက္ခဏာ၊ မီတာဒေတာ၊ ဘဝပတ်ဝန်းကျင်ဖြစ်ရပ်များနှင့် ပိုင်ဆိုင်မှုလွှဲပြောင်းမှု အဓိပ္ပာယ်ကောက်ယူမှုလိုအပ်သော်လည်း ကိန်းဂဏန်းညီမျှမှုမရှိတဲ့အခါ NFTs ကိုအသုံးပြုပါ။

NFT သည် ကိန်းဂဏန်း [အရင်းအမြစ်](/my/blockchain/assets.md) နှင့်မတူဘဲ တိကျမှု၊ အရင်းအမြစ်ထုတ်လွှင့်ရေးမူဝါဒ (သို့) အကောင့်တစ်စောင်အရေအတွက်မရှိပါ။ NFT သည် မှတ်ပုံတင်ပစ္စည်းတစ်ခုအဖြစ်တည်ရှိပြီး ပိုင်ဆိုင်မှုကို တိုက်ရိုက်မှတ်တမ်းတင်ထားသည်။

## ဖွဲ့စည်းပုံ {#structure}

မှတ်ပုံတင်ထားသော `Nft` တွင်:

- `id`: a `NftId`
- `content`: NFT ကို ဖော်ပြတဲ့ metadata များ
- `owned_by`: NFT ကို ပိုင်ဆိုင်ထားသော စာရင်း

`content` ကွင်းသည် `Metadata` မြေပုံတစ်ခုဖြစ်သည်။ အသေးစိတ်ထားပါ: သရုပ်ဖော်ရေးကွင်းများ၊ တည်ငြိမ်သော ရည်ညွှန်းချက်များ၊ cryptographic hashes များ၊ URIs သို့မဟုတ် SoraFS လမ်းကြောင်းများကို သိုလှောင်ပါ။ ကြီးမားသောစာရွက်စာတမ်းများ၊ မီဒီယာများ၊ သို့မဟုတ် high-churn application state off-chain ကို သိမ်းဆည်းပြီး စစ်ဆေးနိုင်သည့် ရည်ညွှန်းချက်ကိုသာ NFT တွင် သိမ်းဆည်းပါ။

## Taira တွင် ဤအလုပ်ခွင်ကို run လုပ်ပါ။ {#try-it-on-taira}

အများပြည်သူ Taira testnet မှာ လက်ရှိမှာ NFT မှတ်တမ်းတွေ ရှိမရှိကို စစ်ဆေးပါ။

```bash
curl -fsS 'https://taira.sora.org/v1/nfts?limit=5&include_total=true' \
  | jq '{total, nft_ids: [.items[].id]}'
```

NFT လမ်းကြောင်းများအတွက် live OpenAPI စာရွက်စာတမ်းကို စစ်ဆေးပါ node ကဖွင့်ထားသည်

```bash
curl -fsS https://taira.sora.org/openapi.json \
  | jq -r '.paths | keys[] | select(startswith("/v1/nfts") or startswith("/v1/explorer/nfts"))'
```

အလွတ် `items` array သည် အများသုံး testnet တွင် သက်ဝင်သော တုံ့ပြန်မှုတစ်ခုဖြစ်သည်။ ဆိုလိုသည်မှာ လက်ရှိစာမျက်နှာတွင် NFTs မရှိခြင်းမဟုတ်ဘဲ NFT ညွှန်ကြားချက်များ မရရှိခြင်းပါ။

## NFT အထောက်အထားများ {#nft-ids}

`NftId` သည် ဤစာသားပုံစံကို အသုံးပြုသည်-

```text
name$domain
name$domain.dataspace
```

ဥပမာ `badge$docs.universal` သည် `docs.universal` domain အတွင်းရှိ `badge` NFT ကို သတ်မှတ်သည်။ Data space ကို ချန်ထားပါက လက်ရှိ parser သည် `universal` data space ကို သုံးသဖြင့် `badge$docs` ကို `badge$docs.universal` အဖြစ် ဖြေရှင်းသည်။

NFT ID များအတွက် တည်ငြိမ်သောနာမည်များကို အသုံးပြုပါ။ ID သည် ညွှန်ကြားချက်များ၊ မေးမြန်းမှုများ၊ ခွင့်ပြုချက်များ၊ ဖြစ်ရပ်စစ် filter များနှင့် application references များတွင်အသုံးပြုသည့် အရာဝတ္ထုသမိုင်းဖြစ်သည်။

## သက်တမ်း စက်ဝန်း {#lifecycle}

NFT သက်တမ်း စက်ဝန်း လုပ်ငန်းများ အသုံးပြုခြင်း Iroha သင်ကြားမှုလုပ်ငန်းများ:

- [`Register`](/my/blockchain/instructions.md#un-register) ဖန်တီးပေးတယ် NFT အစောပိုင်း `content`.
- [`Unregister`](/my/blockchain/instructions.md#un-register) ဖယ်ရှားပေးသည် NFT.
- [`Transfer`](/my/blockchain/instructions.md#transfer) ပြောင်းလဲမှု `owned_by`.
- [`SetKeyValue` နှင့် `RemoveKeyValue`](/my/blockchain/instructions.md#setkeyvalue-removekeyvalue) update ကို NFT မီတာဒေတာ။

## ဒေသတွင်းမှာ စမ်းကြည့်ပါ။ {#try-it-locally}

[CLI လမ်းညွှန်](/my/get-started/operate-iroha-via-cli.md) ကနေ client ဖွဲ့စည်းမှုကို ဖန်တီးထားပြီး ဒေသတွင်းကွန်ရက်ကို စတင်ခဲ့တယ်လို့ ဒီဥပမာတွေက ယူဆတယ်။

```bash
export IROHA_CONFIG=./localnet/client.toml
export NFT_DOMAIN='<OWNED_DOMAIN>.universal'
export NFT_ID="badge_intro\$$NFT_DOMAIN"
```

ထုတ်လုပ်ထားသော localnet သည် ၎င်း၏ client အတွက် အက်ပ်သုံး domain ကို မှတ်ပုံမတင်ပေးပါ။ `NFT_DOMAIN` ကို လက်မှတ်ထိုးသည့် အကောင့်က ပိုင်ဆိုင်သော သို့မဟုတ် `CanRegisterNft` ခွင့်ပြုချက် ရှိသော domain အဖြစ် သတ်မှတ်ပါ။ အသစ်ဖန်တီးရန် [Domains](/my/blockchain/domains.md#registration) တွင် ဖော်ပြထားသည့် လိုချင်သောအခြေအနေကို ကြေညာသတ်မှတ်သည့် `app alias setup plan` နှင့် `app alias setup apply` လုပ်ငန်းစဉ်ကို သုံးပါ။

NFT ကို မှတ်ပုံတင်ပါ။ မှတ်ပုံတင်သည် စံဝင်မှတ်သွင်းချက်မှ အစောပိုင်းစာရင်း JSON ကိုဖတ်သည်။

```bash
printf '{"kind":"badge","level":"intro","issuer":"docs"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft register --id "$NFT_ID"
```

NFT ကို တိုက်ရိုက်စစ်ဆေးပြီး ပြီးရင် စာရင်းအပြည့်ပါတဲ့ NFTs အားလုံးကိုစာရင်းသွင်းပါ။

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft list --all
```

Metadata ကီးတစ်ခု ထည့်ပြီး NFT ကို ပြန်ဖတ်ပါ။

```bash
printf '{"color":"blue","rarity":"tutorial"}\n' |
  cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta set --id "$NFT_ID" --key traits

cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  ledger nft get --id "$NFT_ID"
```

Metadata ကီးကို ဖယ်ရှားပါ။

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft meta remove --id "$NFT_ID" --key traits
```

လိုအပ်ပါက NFT ကို လွှဲပြောင်းပါ။ လက်ရှိပိုင်ရှင်ကို `owned_by` မှ ဖတ်ရှုရန် `ledger nft get` ကို သုံးပြီး လက်ခံမည့် အကောင့် ID ကို ရှာရန် `account list --all` ကို သုံးပါ။

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" \
  account list --all

export CURRENT_OWNER='<account-id-from-owned_by>'
export NEW_OWNER='<destination-account-id>'

cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft transfer --id "$NFT_ID" --from "$CURRENT_OWNER" --to "$NEW_OWNER"
```

လမ်းညွှန်အဆင့်များ ပြီးဆုံးလျှင် ဥပမာ NFT ကို ဖယ်ရှားပါ။ လွှဲပြောင်းထားခဲ့လျှင် ပြန်လွှဲပြောင်းပါ သို့မဟုတ် လက်ရှိပိုင်ရှင်၏ အကောင့်ပြင်ဆင်သတ်မှတ်မှုဖြင့် မှတ်ပုံတင်ပယ်ဖျက်သည့် command ကို တင်သွင်းပါ။

```bash
cargo run --bin iroha -- --config "$IROHA_CONFIG" --fee-payer authority \
  ledger nft unregister --id "$NFT_ID"
```

## Query များနှင့် ဖြစ်ရပ်များ {#queries-and-events}

အသုံးပြုခြင်း [`FindNfts`](/my/reference/queries.md#assets-nfts-and-rwas) စာရင်းသွင်းရန် NFTs နှင့် [`FindNftsByAccountId`](/my/reference/queries.md#assets-nfts-and-rwas) စာရင်းသွင်းရန် NFTs အကောင့်တစ်ခုရဲ့ ပိုင်ရှင်ပါ။

NFT မှတ်ပုံတင်ခြင်း၊ ဖျက်သိမ်းခြင်း၊ လွှဲပြောင်းခြင်းနှင့် metadata update များ ထုတ်လွှင့်ခြင်း NFT ဒေတာဖြစ်ရပ်များ။ `Nft` ဒေတာဖြစ်ရပ် filter ကို blockchain ledger ပြောင်းလဲခြင်းများအတွက် subscribe လုပ်နေစဉ် သို့မဟုတ် build trigger များကို တုံ့ပြန်မှု NFT ဘဝ စက်ဝန်း ဖြစ်ရပ်များ။

## ခွင့်ပြုချက်များ {#permissions}

ပုံမှန်ခွင့်ပြုချက်များတွင် NFT အတွက် သီးသန့် token များ ပါဝင်သည်။

- `CanRegisterNft`
- `CanUnregisterNft`
- `CanTransferNft`
- `CanModifyNftMetadata`

ခွင့်ပြုချက် စစ်ဆေးမှုများကို တက်ကြွသော ဆော့ဝဲ အကောင်အထည်ဖော်ရေး ပတ်ဝန်းကျင် အတည်ပြုသူက အကောင်အ ထမ်းဆောင်ပေးသည်၊ ထို့ကြောင့် ကွန်ရက်တစ်ခုသည် အကောင်အက်ရှင်ကို အဆင့်မြှင့်တင်ခြင်းဖြင့် ခွင့်ပြုချက်ကို ပြုပြင်နိုင်သည်။ လက်ရှိ အလိုလျောက် token စာရင်းအတွက် [ခွင့်ပြုချက် လက်မှတ်များ](/my/reference/permissions.md) ကို ကြည့်ပါ။

## NFTs ကို ရွေးချယ်ခြင်း {#choosing-nfts}

မှတ်တမ်းများအတွက် NFT ကို အသုံးပြုပါ။ ထူးခြားမှုနှင့် ပိုင်ဆိုင်မှု အရေးပါသည်

- အထောက်အထားများ၊ အမှတ်တံဆိပ်များ၊ လိုင်စင်များနှင့် အတည်ပြုချက်များ
- ကိုယ်စားလှယ်လောင်း သို့မဟုတ် ဝင်ရောက်ခွင့် မှတ်တမ်းများ
- ကိုယ်ပိုင်လက္ခဏာနဲ့ ချည်နှောင်ထားတဲ့ (သို့) အကောင့်ပိုင် လျှောက်ထားချက် မှတ်တမ်းများ
- ချိတ်ဆက်မှုအပြင် မီဒီယာများ၊ စာရွက်စာတမ်းများ သို့မဟုတ် နည်းပညာထုတ်ပြန်ချက်များကို ရည်ညွှန်းခြင်း

fungible balance များအတွက် numeric asset ကိုသုံးပြီး data တွေဟာ ရှိနေတဲ့ blockchain ledger object တစ်ခုရဲ့ compact attribute တစ်ခုသာဖြစ်တဲ့အခါ plain [metadata များ](/my/blockchain/metadata.md) ကို အသုံးပြုပါ။

နောက်တစ်ချက်ကြည့်ပါ-

- [ပိုက်ဆံများ](/my/blockchain/assets.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [ညွှန်ကြားချက်](/my/blockchain/instructions.md)
- [Query များ](/my/blockchain/queries.md)
