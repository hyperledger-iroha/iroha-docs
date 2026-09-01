---
translation_locale: my
translation_source: /cookbook/nfts.md
translation_source_hash: db99dab483d4e2fb3fd84be84f6e4ef9f8373f0c16eb2f34952f1232c4587561
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# NFTs {#nfts}

## ရလဒ် {#outcome}

စစ်ဆေးခြင်း Taira NFT မှတ်ပုံတင်၊ မွမ်းမံ၊ လွှဲပြောင်းပြီး ထူးခြားတဲ့ ကိရိယာကို မေးမြန်းပါ။ NFT အလုပ်ဖြစ်စဉ်မှာ အရည်အသွေးပြည့်စုံတဲ့ `name$domain.dataspace` NFT ID နှင့် Single Protocol စံနှုန်း I105 ပိုင်ရှင် ID တွေ။

## လိုအပ်ချက်များ {#prerequisites}

- `curl`, `jq`, Python 3.11 သို့မဟုတ်နောက်ဆုံး၊ current `iroha` CLI။
- ဖတ်လို့သာရတဲ့ Taira ဝင်ခွင့်။
- [လွှတ်တင်ခြင်း Iroha](/my/get-started/launch-iroha.md) မှ `./localnet/client.toml` နှင့် Torii တို့ဖြင့် ဖန်တီးထားသော ဒေသတွင်းကွန်ရက်များအတွက် `http://127.0.0.1:8080` တွင် စာရေးသားခြင်း။

## ခြေလှမ်း {#steps}

### (၁) အများပြည်သူ Taira စုဆောင်းမှုကို စစ်ဆေးပါ။ {#_1-inspect-the-public-taira-collection}

ပလပ်နေတဲ့ စာမျက်နှာဟာ အောင်မြင်တဲ့ ဖတ်ရှုမှုပါ၊ ဆိုလိုတာက requested page မှာ မြင်နိုင်တဲ့ NFTs တွေမရှိပါဘူး။

```bash
curl -fsS -H 'Accept: application/json' \
  'https://taira.sora.org/v1/nfts?limit=5' \
  | jq '{total, nfts: [.items[] | {id, owned_by, content}]}'
```

NFTs ဟာ ကိန်းဂဏန်းစာရင်းတွေ မဟုတ်ဘဲ ထူးခြားတဲ့ မှတ်တမ်းတွေပါ။ ၎င်းတို့မှာ ID တစ်ခု၊ ပိုင်ရှင်တစ်ဦးနဲ့ အသေးစား `content` metadata မြေပုံရှိတယ်။

### (၂) ဒေသခံပိုင်ရှင်များ၏ မှတ်ပုံတင်မှတ်တမ်းများကို ပြင်ဆင်ပါ။ {#_2-prepare-local-owner-ids}

`wonderland.universal` နယ်ပယ်ကို အသုံးပြုပြီး စာရေးခြင်းဥပမာတွင် ရေးသားထားပါသည်။ ၎င်း၏ ပုဂ္ဂလိက သော့ချက်များကို မဖော်ထုတ်ဘဲ ဖွဲ့စည်းထားသော ခွင့်ပြုချက် အရင်းအမြစ်ကို ထုတ်ယူ၍ လွှဲပြောင်းရန် ရည်ရွယ်ချက်အဖြစ် အခြားမှတ်ပုံတင်စာရင်းတစ်ခုကို ရွေးချယ်ပါ။

```bash
LOCAL_ROOT='http://127.0.0.1:8080'
LOCAL_CONFIG='./localnet/client.toml'
NFT_ID='cookbook_badge$wonderland.universal'

LOCAL_PUBLIC_KEY="$(python3 - <<'PY'
import tomllib

with open("localnet/client.toml", "rb") as config_file:
    print(tomllib.load(config_file)["account"]["public_key"])
PY
)"
CURRENT_OWNER="$(
  iroha --config "$LOCAL_CONFIG" tools address convert "$LOCAL_PUBLIC_KEY"
)"

NEW_OWNER="$(
  curl -fsS -H 'Accept: application/json' "$LOCAL_ROOT/v1/accounts?limit=20" \
    | jq -er --arg owner "$CURRENT_OWNER" \
      '[.items[].id | select(. != $owner)][0]'
)"
```

`$` ကွာခြားချက်သည် NFT စာသားပုံစံတွင် ပါဝင်သည်။ ပြည့်စုံသော `wonderland.universal` နယ်ပယ်နှင့် ဒေတာနေရာနောက်ဆက်တွဲကို ထိန်းသိမ်းပါ။

### (၃) NFT ကို အစောပိုင်းပါဝင်မှုနှင့်အတူ မှတ်ပုံတင်ပါ။ {#_3-register-the-nft-with-initial-content}

CLI သည် စံဝင်သော input မှပထမဦးဆုံး JSON အရာဝတ္ထုကိုဖတ်သည်။ လက်ရှိ Authorization Principal သည်ပိုင်ရှင်ဖြစ်လာသည်။

```bash
printf '%s\n' \
  '{"kind":"course_badge","level":"intro","issuer":"iroha-docs"}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft register --id "$NFT_ID"
```

### ၄. အကြောင်းအရာ မြေပုံကို Update လုပ်ပါ။ {#_4-update-the-content-map}

metadata values are JSON key inserts or replaces that single entry; it does not replace the entire NFT record. key insert or replace that one entry. key is inserted or replaced by a key.

```bash
printf '%s\n' '{"color":"blue","version":1}' \
  | iroha --config "$LOCAL_CONFIG" \
      --machine --fee-payer authority \
      ledger nft meta set --id "$NFT_ID" --key traits

iroha --config "$LOCAL_CONFIG" ledger nft meta get \
  --id "$NFT_ID" --key traits
```

### (၅) လွှဲပြောင်းပိုင်ဆိုင်မှု {#_5-transfer-ownership}

Single protocol-standard I105 account ID နှစ်ခုစလုံးပေးပါ။ အမည်မဖော်လိုခင်မှာ `--from` သို့မဟုတ် `--to` အဖြစ်သုံးဖို့ ဖြေရှင်းဖို့လိုပါတယ်။

```bash
iroha --config "$LOCAL_CONFIG" \
  --machine --fee-payer authority \
  ledger nft transfer \
  --id "$NFT_ID" \
  --from "$CURRENT_OWNER" \
  --to "$NEW_OWNER"
```

::: warning ခွင့်ပြုချက် ကန့်သတ်ချက်

အပေါ် Taira, စာရေးသူတိုင်းလည်း လိုအပ်ပါတယ်။ `--metadata ./taira.tx-metadata.json` မှတ်ပုံတင်ခြင်း၊ လွှဲပြောင်းခြင်း၊ ဖယ်ရှားခြင်းနှင့် metadata update များကို တက်ကြွသော software အကောင်အထည်ဖော်မှုဖြင့် စစ်ဆေးသည်။ ပတ်ဝန်းကျင် (`CanRegisterNft`, `CanTransferNft`, `CanUnregisterNft`, နှင့် `CanModifyNftMetadata` သင့်အက်ပလီကေးရှင်းကို သတ်မှတ်ထားတဲ့ ဒိုမင်တစ်ခုသုံးပါ (သို့) localnet မှာ ဒီလမ်းကြောင်းဖြတ်သန်းမှုကို ထိန်းပါ။

:::

စာချုပ်ပိုင် အလုပ်ဖြစ်စဉ်များအတွက် Kotodama သည် NFT ကိုရိုက်ကူးထားသော host function invocations များကို ဖော်ပြသည်။ အောက်ပါအချက်များသည် ပိတ်ထားတဲ့ IVM မှတ်တမ်းတင်မှု စမ်းသပ်ချက်ဖြင့် စုစည်းပြီး အကောင်အထည်ဖော်ထားသည့် တိကျတဲ့ ဘဝပတ်ဝန်းကျင်စမ်းသပ်မှုလက်ရာဖြစ်သည်။

```kotodama
seiyaku NftFlow {
    kotoage fn nft_issue_and_transfer() authorize("NftAuthority") {
        let owner = AccountId::parse(
            "sorauﾛ1PﾉｳﾇmEｴWｵebHﾑ6ﾔﾙｲヰiwuCWErJ7uｽoPGｱﾔnjﾑKﾋTCW2PV",
        );
        let nft = NftId::parse("n0$wonderland.universal");
        ledger::nft::mint(nft, owner);
        let to = AccountId::parse(
            "sorauﾛ1NfｷgﾉﾓﾉBｦKﾌﾘﾒoﾇﾂﾛrG81ﾋjWﾎﾕVncwﾌSｱ3pﾘﾋﾉhUS9Q76",
        );
        ledger::nft::transfer(
            source: owner,
            nft: nft,
            destination: to,
        );
        ledger::nft::set_metadata(
            nft: nft,
            key: Name::parse("issued"),
            value: Json::parse("{\"issued\":\"demo\"}"),
        );
        ledger::nft::burn(nft);
    }
}
```

တည်ငြိမ်သော I105 တန်ဖိုးနှစ်ခုသည် စစ်ဆေးမှုအတုများဖြစ်ပြီး စစ်ဆေးသူက အကောင်အထည်ဖော်ခြင်းမတိုင်မီ ရည်မှန်းချက်မှတ်တမ်းတင်သည်။ ၎င်းတို့သည် `CURRENT_OWNER` နှင့် `NEW_OWNER` မှမဟုတ်ဘဲ CLI လမ်းလျှောက်ခြင်းမှပါ။ လျှောက်လွှာစာချုပ်တစ်ခုအတွက်၊ ၎င်း၏အမှန်တကယ် တစ်ခုတည်းသော ပရိုတိုကောစံညွှန်းစာရင်းများကို ပေးသွင်းပြီး [စမတ်စာချုပ်များ](./smart-contracts.md) မှတစ်ဆင့် စုစည်းခြင်း၊ စမ်းသပ်ခြင်း၊ ဖြန့်ချိခြင်းနှင့် တောင်းဆိုခြင်း။ မစစ်ဆေးသေးတဲ့ ဘိုက်တာကုဒ်ကို Taira သို့မတင်ပါနဲ့၊ စာချုပ် အကောင်အထည်ဖော်မှုသည် ဆော့ဝဲ အကောင်အ ထည်ဖော်မှု ပတ်ဝန်းကျင် ခွင့်ပြုချက်များကို ကျော်ဖြတ်နေဆဲဖြစ်ကြောင်း မှတ်မိပါ။

## စစ်ဆေးပါ {#verify}

NFT ကို တိုက်ရိုက်ဖတ်ပြီး ၎င်းရဲ့ အကြောင်းအရာကို ချိတ်ဆက်ထားတဲ့အချိန်မှာ ပိုင်ရှင် ပြောင်းလဲသွားပြီလို့ ဆိုပါစို့။

```bash
iroha --config "$LOCAL_CONFIG" --machine ledger nft get --id "$NFT_ID" \
  | tee cookbook-nft.json

jq -e --arg owner "$NEW_OWNER" \
  '.owned_by == $owner and .content.traits.version == 1' \
  cookbook-nft.json
```

(သို့) CLI output data container ထဲက record ကို wrapped လုပ်ပြီး JSON တစ်ကြိမ်ပြီး အဆိုပြုချက်ကို ပါဝင်တဲ့ NFT အရာဝတ္ထု။ ခိုင်မာတဲ့ invariants တွေက `id`, `owned_by`, နှင့် `content`.

## ပြဿနာဖြေရှင်းခြင်း {#troubleshooting}

- `name$domain` သည် တစ်ချို့ parsers များတွင် အထွေထွေဒေတာနေရာသို့ အလိုအလျောက်အသုံးပြုနိုင်သော်လည်း Cookbook နှင့် Application ID များမှာ ရှင်းလင်းသော `name$domain.dataspace` ပုံစံကို အသုံးပြုသင့်သည်။
- NFT ID တစ်ခုတည်းကို ထပ်ခါထပ်ခါ မှတ်ပုံတင်ခြင်းသည် ငြင်းပယ်ခံရသည်။ သီးခြားမှတ်တမ်းတစ်ခုအတွက် အသစ်အဆန်း localnet ကိုအသုံးပြုပါ (သို့) တည်ငြိမ်သော ID အသစ်တစ်ခုကိုရွေးချယ်ပါ။
- metadata input ကို Standard input မှာ valid JSON ဖြစ်ရပါမယ်။ JSON ကို quote မလုပ်တဲ့ shell string ဟာ metadata value မဟုတ်ဘူး။
- လက်ရှိပိုင်ရှင်မဟုတ်တဲ့ အကောင့်တစ်ခုက လက်မှတ်ထိုးထားတဲ့ ငွေလွှဲပြောင်းမှုအတွက် တိကျတဲ့ ခွင့်ပြုချက်လိုအပ်ပြီး `--from` ကိုပြောင်းလဲခြင်းသည် cryptographic signer ကိုမပြောင်းလဲပါ။
- ငွေလွှဲပြောင်းပြီးနောက် မူလဖောက်သည် NFT ကိုပြောင်းလဲခြင်း (သို့) မှတ်ပုံတင်မဖျက်သိမ်းနိုင်တော့ပါ။ ပိုင်ရှင်သစ်၏ cryptographic signer သို့မဟုတ် ခွင့်ပြုထားတဲ့ controller ကို အသုံးပြုပါ။
- Taira အလွတ်ကို ပြန်ပေးလို့ရတယ် NFT ကောက်ယူမှု မပြုလုပ်ပါနဲ့ `items: []` အထောက်အထားအဖြစ် NFT ညွှန်ကြားချက်တွေ မရဘူး။

## အရင်းအမြစ်နှင့် ဆက်စပ်သော စာတမ်းများ {#source-and-related-docs}

- [NFT ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်မှုတွင် ပေါင်းစပ်မှု စမ်းသပ်မှုများ](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/integration_tests/tests/nft.rs)
- [Kotodama NFT host-technical invocation tests at the pinned source code revision](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/tests/kotodama_pointer_roundtrips.rs)
- [တိကျသော Kotodama NFT သက်တမ်းပတ်ဝန်းကျင် စမ်းသပ်မှု လက်ရာများ ပိတ်ထားတဲ့ အရင်းအမြစ်ကုဒ် ပြင်ဆင်ချက်တွင်](https://github.com/hyperledger-iroha/iroha/blob/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/ivm/docs/examples/12_nft_flow.ko)
- [NFTs](/my/blockchain/nfts.md)
- [မီတာဒေတာ](/my/blockchain/metadata.md)
- [ညွှန်ကြားချက်](/my/blockchain/instructions.md)
- [ခွင့်ပြုချက် လက်မှတ်များ](/my/reference/permissions.md)
