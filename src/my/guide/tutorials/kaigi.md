---
translation_locale: my
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ထည့်သွင်းထားသည် Kaigi a တွင် JavaScript App ကို {#embed-kaigi-in-a-javascript-app}

Kaigi သည် Iroha တွင် အစည်းအဝေးတစ်ခု၏သက်တမ်းလည်ပတ်မှုကို မှတ်တမ်းတင်ထားပြီး ရှာဖွေရေးကိရိယာသည် audio နှင့် video ကို WebRTC ပေါ်တွင် သိမ်းဆည်းထားသည်။ blockchain ledger သည်ခေါ်ဆိုမှု, roster အပြောင်းအလဲများ, encrypted signaling metadata များနှင့် နောက်ဆုံးအခြေအနေကိုသိမ်းဆည်းထားသည်; ၎င်းသည်မီဒီယာဆက်သွယ်ခြင်းမဟုတ်ပါ။

ဤသင်ခန်းစာသည် လက်ရှိ [Iroha JavaScript သရုပ်ပြစနစ်](https://github.com/soramitsu/iroha-demo-javascript) ကိုလိုက်နာသည်။ demo သည်ပထမဦးဆုံးထုတ်ဝေမှုလျှောက်လွှာ profile တစ်ခုကို အကောင်အထည်ဖော်ထားပါသည်။

- အိမ်ရှင်တစ်ယောက်နဲ့ ဧည့်သည်တစ်ဦး
- `transparent` Kaigi လျှို့ဝှက်ချက်စနစ်
- `authenticated` အခန်းစည်းမျဉ်း
- `RevealAfterJoin` peer အထောက်အထား အပြုအမူ
- ဖုန်းခေါ်ဆိုမှု metadata ထဲမှာ encrypted ကမ်းလှမ်းချက်နဲ့ နောက်ဆုံးရ ငွေပေးချေမှု metadate တွေထဲမှာ encryption response ကို

Kaigi ပရိုတိုကောမှာလည်း `zk-roster-v1` ကို သတ်မှတ်ထားပေမဲ့ လက်ရှိ demo ကတော့ ဒီအထောက်အထား စီးဆင်းမှုကို မဖန်တီးတာ (သို့) မတင်တာမဟုတ်ဘူး။ သင့်တံတားက လက်ရှိအထောက်အထား စာချုပ်တစ်ခုလုံးကို အကောင်အထည်ဖော်မလုပ်ဘူးဆိုရင် ပုဂ္ဂလိကပုံစံ ထိန်းချုပ်မှုတစ်ခုကို မပြပါနဲ့။

## လိုအပ်ချက်များ {#prerequisites}

မင်းလိုအပ်တာက

- Node.js 20 သို့မဟုတ် ပိုမိုသစ်ပြီး Rust ကိရိယာကွင်းဆက်
- Kaigi အရည်အသွေးရှိသော Torii API အဆုံးသတ်မှတ်ချက်
- ငွေကြေးထောက်ပံ့ထားသော အိမ်ရှင်နှင့် ဧည့်သည်များအတွက် သီးခြားစာရင်းများ
- အကောင့်တစ်ခုစီရဲ့ လက်မှတ်ရေး သော့ကို အခွင့်ထူးခံ ငွေကြေးအိတ် (သို့) application bridge ထဲမှာ ထည့်သွင်းထားတာပါ။
- ကင်မရာနှင့် မိုက်ခရိုဖုန်း ခွင့်ပြုချက်များကို browser context နှစ်ခုစလုံးတွင်

ဒီမိုက သုံးစွဲမှု `@iroha/iroha-js` ညီအစ်မတို့ရဲ့ အမှီအခိုမှုကနေ `file:../iroha/javascript/iroha_js`. ဆောက်လုပ် SDK ကနေ Iroha Demo ကို မတပ်ခင် source checkout:

```bash
mkdir iroha-wallet-workspace
cd iroha-wallet-workspace
git clone https://github.com/hyperledger-iroha/iroha.git
git clone https://github.com/soramitsu/iroha-demo-javascript.git

cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist

cd ../../../iroha-demo-javascript
npm install
npm run dev
```

သန့်ရှင်းတဲ့ SDK Package မှာ Cargo အလုပ်ခွင်ကို မပါပါဘူး။ `npm run build:native`, ဒီတော့ ဒါကို ပြန်တည်ဆောက်ပါ။ Iroha အရင်းအမြစ်ကုဒ်အလုပ်လုပ်မှုအတု SDK အပြောင်းအလဲများ။ SDK အရင်းအမြစ်ကို [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## API အဆုံးမှတ်ကို စစ်ဆေးပါ။ {#check-the-endpoint}

အများပြည်သူအတွက် Taira testnet အတွက် Torii ရရှိနိုင်စွမ်းကို ပထမဆုံး စစ်ဆေးပါ။

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

ဤတောင်းဆိုချက်များသည် Torii နှင့် ၎င်း၏ ကြော်ငြာထားသော API စာရွက်စာတမ်းကို ရယူနိုင်ကြောင်းသက်သေပြသည်သာဖြစ်သည်။ ၎င်းတို့သည် Kaigi သတ်မှတ်ခေါ်ဆိုမှုတစ်ခုရှိသည်ကို သို့မဟုတ် သင့်ငွေကြေးစက္ကူက ငွေပေးချေမှုများကို တင်သွင်းနိုင်ကြောင်း သက်သေမပြပါ။

`/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, သို့မဟုတ် `/v1/kaigi/relays/health` တို့ကို လက်မှတ်မထိုးထားသော `curl` တောင်းဆိုချက်များနှင့်အတူ မစစ်ဆေးပါနဲ့။ ထိုလမ်းကြောင်းသုံးခုသည် ခွင့်ပြုစာရင်းတွင် operator လက်မှတ်တစ်ခုလိုအပ်သည်။ Relay ဖြစ်စဉ်စီးဆင်းမှုအတွက် single protocol-standard exact network account လက်မှတ်တစ်လုံးလိုအပ်ပါသည်။

Demo မှာ Settings ကိုဖွင့်ပြီး Torii URL, နောက်ပြီး API Endpoint ရှာဖွေရေးကွင်းဆက်ကို load လုပ် UUID, အတိအကျ `NetworkId`, စာရေးတံတားတစ်ခုက ရွေးချယ်ထားတဲ့ တန်ဖိုးသုံးလုံးကို ချိတ်ဆက်ဖို့လိုတယ်။ API အဆုံးသတ်မှတ်ချက်; ဘယ်တော့မှ တည်ဆောက်ခြင်း `NetworkId` သံကြိုးကနေ UUID (သို့) ကြိုတင်ကိန်း။

## လမ်းကြောင်းနှင့် စစ်ဆေးမှုပုံစံ {#route-and-authentication-model}

Kaigi စာရွက်စာတမ်းတွေဟာ သာမန်တင်သွင်းပြီး လက်မှတ်ရေးထိုးထားတဲ့ ငွေပေးချေမှုအတွင်းမှာ ညွှန်ကြားချက်တွေပါ။ သူတို့ကို `POST /v1/pipeline/transactions` မှာ တင်ပြပြီး နောက်ဆုံးသတ်မှတ်ထားတဲ့ ဘလော့က သက်သေခံတွေ စောင့်ပါ။

လျှောက်လွှာမှာ အောက်ပါအတိုင်း ရေးသားထားပါတယ်။

|လမ်းကြောင်း |အတည်ပြုခြင်း|
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}` |အများပြည်သူ|
|`/v1/kaigi/calls/{call_id}/signals` |Single Protocol Standard အတိအကျ ကွန်ရက်စာရင်းတောင်းဆိုချက် |
|`/v1/kaigi/calls/{call_id}/events` |Single Protocol Standard အတိအကျ ကွန်ရက်စာရင်းတောင်းဆိုချက် |

နိုင်ငံတကာ JavaScript SDK ဒါတွေကို `getKaigiCall` နှင့် `listKaigiCallSignals`. အချက်ပြစာရင်းမှာ ညွှန်ကြားရေးမှူးရဲ့ အတိအကျ စာမျက်နှာကို သုံးပါတယ်။ ပြန်လာတဲ့ ညွှန်ပြရေးမှူးကို မပြောင်းလဲဘဲ ထပ်သုံးပါ။ အချိန်တံဆိပ်နဲ့သာ ဆက်တိုက်ဆက်သွယ်ခြင်းဖြင့် အစားမထိုးပါ။

## လက်မှတ်ရေးထိုးနေပါ {#keep-signing-outside-the-renderer}

ပေါင်းစပ်မှုကို နယ်နိမိတ် သုံးခုအဖြစ် ခွဲထားပါ။

|ကန့်သတ်ချက် |တာဝန်ယူမှု |
| ----------------- | -------------------------------------------------------------------- |
|Renderer |အစည်းအဝေးပုံစံ၊ ဖိတ်ကြားချက် လင့်ခ်၊ မီဒီယာ ထိန်းချုပ်မှုတွေ၊ WebRTC ကမ်းလှမ်းချက်တွေနဲ့ အဖြေတွေ |
| အထူးအခွင့်ရှိသော ချိတ်ဆက်တံတား | ကီးဝင်ရောက်မှု၊ အခကြေးငွေ quote၊ ညွှန်ကြားချက်တည်ဆောက်မှု၊ လက်မှတ်ထိုးမှုနှင့် အပြီးသတ်အတည်ဖြစ်မှုကို စောင့်ဆိုင်းခြင်း |
|Torii |ဖုန်းခေါ်ဆိုမှု မှတ်တမ်း၊ ပြီးဆုံးတဲ့ အချက်ပြချက်ဖတ်ခြင်း၊ ငွေပေးချေမှုတင်သွင်းခြင်း |

ဖော်ပြမှုအလွှာနှင့် ဆက်သွယ်သော ချိတ်ဆက်တံတားသည် endpoint အထောက်အထားကို အတိအလင်း လက်ခံပြီး ကိုယ်ပိုင်ကီးဒေတာကို သတ်မှတ်နယ်ပယ်အတွင်းတွင် ထားသင့်သည်။ လက်ရှိသရုပ်ပြလုပ်ဆောင်ချက်သည် ဤအကျဉ်းချုပ်သဘောတူညီချက်နှင့် ညီမျှသည်။

```ts
type ConnectionIdentity = {
  toriiUrl: string
  chainId: string
  networkId: string
  networkPrefix: number
}

type KaigiSignalKeyPair = {
  publicKeyBase64Url: string
  privateKeyBase64Url: string
}

type KaigiMeeting = {
  callId: string
  meetingCode: string
  hostAccountId?: string
  hostKaigiPublicKeyBase64Url: string
  scheduledStartMs: number
  expiresAtMs: number
  createdAtMs: number
  live: boolean
  ended: boolean
  privacyMode: 'transparent'
  peerIdentityReveal: 'RevealAfterJoin'
  offerDescription: { type: 'offer'; sdp: string }
}

type KaigiSignalPage = {
  items: Array<{
    entrypointHash: string
    callId: string
    participantId: string
    participantName: string
    createdAtMs: number
    answerDescription: { type: 'answer'; sdp: string }
  }>
  nextCursor?: string
}

type KaigiBridge = {
  generateKaigiSignalKeyPair(): KaigiSignalKeyPair

  createKaigiMeeting(
    input: ConnectionIdentity & {
      hostAccountId: string
      callId: string
      title?: string
      scheduledStartMs: number
      meetingCode: string
      inviteSecretBase64Url: string
      hostDisplayName: string
      hostParticipantId: string
      hostKaigiPublicKeyBase64Url: string
      offerDescription: { type: 'offer'; sdp: string }
    },
  ): Promise<{ hash: string }>

  getKaigiCall(input: {
    toriiUrl: string
    callId: string
    inviteSecretBase64Url: string
  }): Promise<KaigiMeeting>

  joinKaigiMeeting(
    input: ConnectionIdentity & {
      participantAccountId: string
      callId: string
      inviteSecretBase64Url: string
      participantId: string
      participantName: string
      answerDescription: { type: 'answer'; sdp: string }
    },
  ): Promise<{ hash: string }>

  pollKaigiMeetingSignals(input: {
    toriiUrl: string
    networkId: string
    networkPrefix: number
    accountId: string
    callId: string
    hostKaigiKeys: KaigiSignalKeyPair
    limit?: number
    cursor?: string
  }): Promise<KaigiSignalPage>

  endKaigiMeeting(
    input: ConnectionIdentity & {
      hostAccountId: string
      callId: string
      endedAtMs?: number
    },
  ): Promise<{ hash: string }>
}
```

တကယ့်သရုပ်ပြရလဒ်တွင် အပြီးသတ်အတည်ဖြစ်ပြီးသော ဘလော့ခ်အထောက်အထားနှင့် တွက်ချက်ပေးထားသည့် အခကြေးငွေတို့လည်း ပါဝင်သည်။ transaction ဟက်ရှ်တစ်ခုတည်းကို အောင်မြင်မှုဟု မယူဆပါနှင့်။

## ဖိတ်ကြားစာချုပ် {#invite-contract}

`domain.dataspace:meeting` ပုံစံမှာ Call ID ကို အသုံးပြုပါ။ Demo က `kaigi.universal` အောက်တွင် ဖုန်းခေါ်ဆိုမှုများကို ထုတ်လုပ်ပြီး base64url စာလုံး ၃၂ ခုအဖြစ် ကုဒ်သွင်းထားသော ၂၄ ဘိုက် အမည်မဲ့ ဖိတ်ကြားချက် လျှို့ဝှက်ချက်ကို သုံးပါတယ်။

တစ်ခုတည်းသော ပရိုတိုကုတ်စံညွှန်း ဖိတ်ကြားမှုမှာ `call` နှင့် `secret` သတ်မှတ်ချက်တစ်ခု အတိအကျပါဝင်ပါတယ်။

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

အက်ပ်အတွင်း အရန်လမ်းကြောင်းသည် `#/kaigi` ပေါ်ရှိ တူညီသော query ပင်ဖြစ်သည်။ ထပ်နေသော၊ မသိသော၊ ဗလာဖြစ်သော၊ အပိုနေရာလွတ်ပါသော သို့မဟုတ် စံသတ်မှတ်ပုံစံ မဟုတ်သော ပါရာမီတာများကို ငြင်းပယ်ပါ။ သရုပ်ပြက အစည်းအဝေးသက်တမ်းကုန်ချိန်ကို `scheduledStartMs` နောက် ၂၄ နာရီအဖြစ် သတ်မှတ်သည်။

ဖိတ်ကြားချက် လျှို့ဝှက်ချက်သည် အိမ်ရှင်၏ ကမ်းလှမ်းမှု metadata ကို dekrypt လုပ်ပေးသည်။ ၎င်းသည် သယ်ဆောင်သူလျှို့ဝှက်မှုတစ်ခုဖြစ်သည် - ဒါကိုမှတ်ပုံတင်ခြင်းမရှိ၊ ဆန်းစစ်မှုတွင်မထည့်ခြင်း၊ သို့မဟုတ် blockchain ledger metadata တွင်သိုလှောင်ခြင်းမဟုတ်ပါ။ အိမ်ရှင်၏ သီးခြား X25519 ခလုတ်စုံက ဧည့်သည်အဖြေအချက်ပြမှုတွေကို decrypts ဖြစ်စေပြီး အိမ်ရှင်အစည်းအဝေးသို့ ဒေသတွင်းထားရမည်ဖြစ်သည်။

## အစည်းအဝေး ဘဝပတ်စဉ် {#meeting-lifecycle}

### အိမ်ရှင် {#host}

1. ရွေးချယ်ထားသော Wallet ID သည် API အဆုံးအမှတ်ကွင်းဆက် UUID, အတိအကျ `NetworkId`, prefix နဲ့ပေါ့။
2. ဒေသတွင်းမီဒီယာဖွင့်ပြီး `RTCPeerConnection` ကို ဖန်တီးပါ။
3. SDP ကမ်းလှမ်းချက်တစ်ခု ဖန်တီးပြီး ICE အစည်းအဝေး ပြီးဆုံးဖို့ စောင့်ပါ။
4. ဖိတ်ကြားချက် လျှို့ဝှက်ချက်နှင့် host Kaigi အချက်ပြမှု သော့စုံကိုထုတ်လုပ်ပါ။
5. ဖိတ်ကြားချက် လျှို့ဝှက်ချက်နဲ့ ကမ်းလှမ်းချက်ကို ကုဒ်သွင်းပါ။
6. အခွန်စျေးနှုန်းခန့်မှန်းချက်တစ်ခုရပြီး `CreateKaigi` ပါတဲ့ ငွေပေးချေမှုတစ်ခုကို ပွင့်လင်းမြင်သာပြီး စစ်ဆေးထားသော ပုံစံမှာ လက်မှတ်ထိုးပါ။
7. ဖိတ်ကြားချက်ကို တိုက်ရိုက် ပြသခင် နောက်ဆုံးသတ်မှတ်ထားတဲ့ ဘလော့ သက်သေခံကို စောင့်ကြည့်ပါ။

host session ကို ဖွင့်ထားပါ။ host အကောင့်၏ စံသတ်မှတ်တောင်းဆိုမှုလက်မှတ်ဖြင့် signal လမ်းကြောင်းကို အချိန်မှန်စစ်ဆေးပါ၊ ပထမဆုံးမှန်ကန်သော အဖြေကို host signal ကီးဖြင့် စာဝှက်ဖြည်ပြီး `setRemoteDescription` ဖြင့် အသုံးပြုပါ။ နောက်ထပ်စာမျက်နှာများ ရှိလျှင် `nextCursor` ကို တိတိကျကျ ဆက်လက်သယ်ဆောင်ပါ။

### ဧည့်သည် {#guest}

1. ဖိတ်ကြားချက် အတိအကျကို စစ်ဆေးပြီး အတည်ပြုပါ။
2. အများပြည်သူခေါ်ဆိုမှု မှတ်တမ်းကိုယူပြီး ဖိတ်ကြားချက် လျှို့ဝှက်ချက်နဲ့ ကမ်းလှမ်းချက်ကို ဖော်ထုတ်ပါ။
3. အဆုံးသတ်၊ သက်တမ်းကုန်ဆုံး၊ တိုက်ရိုက်မဟုတ်တဲ့ (သို့) ပွင့်လင်းမြင်သာမှုမရှိတဲ့ အစည်းအဝေးကို ငြင်းပယ်ပါ။
4. ဒေသတွင်း မီဒီယာတွေကို ဖွင့်လိုက်ပါ၊ ကမ်းလှမ်းချက်ကို အသုံးချပါ၊ SDP အဖြေကို ဖန်တီးပြီး ICE စုစည်းမှုကို ပြီးစီးပါ။
5. အိမ်ရှင်ရဲ့ Kaigi အများသုံးသော့အတွက် အဖြေကို ကုဒ်သွင်းပါ။
6. အခွန်စျေးနှုန်းခန့်မှန်းချက်တစ်ခုရပြီး `JoinKaigi` ကိုအပါအဝင် တစ်ခုတည်းသော ပရိုတိုကုတ်စံညွှန်း အဖြေ metadata ကိုပါဝင်တဲ့ ငွေပေးချေမှုတစ်ခုကို လက်မှတ်ထိုးပါ။
7. ဧည့်သည်ကို ပူးပေါင်းဆောင်ရွက်မှုအဖြစ် ပြသခင် နောက်ဆုံးသတ်မှတ်ထားတဲ့ ဘလော့ သက်သေခံကို စောင့်ကြည့်ပါ။

### အဆုံးသတ် {#end}

host သာ `EndKaigi` ကို တင်သွင်းနိုင်သည်။ peer ချိတ်ဆက်မှုနှင့် မီဒီယာလမ်းကြောင်းများကို ပိတ်ပါ၊ လက်မှတ်ထိုးထားသော ညွှန်ကြားချက်ကို တင်သွင်းပြီး အပြီးသတ်အတည်ဖြစ်မှုကို စောင့်ပါ။ ပွင့်လင်းမြင်သာသော ပါဝင်သူသည် `LeaveKaigi` ကို အသုံးပြုနိုင်သည်။ ပထမထုတ်ဝေမှု protocol တွင် `zk-roster-v1` မှ ထွက်ခွာမှုကို ဘလော့ခ်ချိန်းပြင်ပ၌ လုပ်ဆောင်ပြီး မူရင်းညွှန်ကြားချက်သည် ကိုယ်ရေးလုံခြုံမှုအတွက် ထွက်ခွာမှုအထောက်အထားများကို ငြင်းပယ်သည်။

## လမ်းညွှန်ချက် WebRTC Fallback {#manual-webrtc-fallback}

ဒီမိုသည်ဒေသတွင်းဖွံ့ဖြိုးတိုးတက်မှုအတွက် Advanced Signaling Path ကို ထိန်းသိမ်းထားသည်။ ၎င်းသည် blockchain ledger ၏ အလိုအလျောက်ထောက်ပံ့သော အချက်ပြမှုမရှိတဲ့အခါ host နှင့် ဧည့်သည်များအား raw WebRTC ကမ်းလှမ်းချက်များကို ကူးယူပြီးဖြေကြားနိုင်စေသည်။

Kaigi မှတ်တမ်းကို မဖန်တီး၊ ပူးပေါင်းခြင်း သို့မဟုတ် အဆုံးသတ်ခြင်းမရှိ၊ ငွေပေးချေမှု အပြီးသတ်မှုကို မပေးနိုင်၊ ချိတ်ဆက်မှုအစီးဆင်းမှုနှင့် ညီမျှသည့် ပုံစံတစ်ခုအဖြစ် တင်ပြမထားပါ။

## ပေါင်းစည်းမှုကို စမ်းသပ်ခြင်း {#test-the-integration}

လက်ရှိ ဗဟိုပြုထားတဲ့ demo suite တွေကို run လုပ်ပါ။

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

စစ်ဆေးမှုတွေက လက်ရှိ ပွင့်လင်းမြင်သာတဲ့ ပရိုဖိုင်၊ တင်းကျပ်တဲ့ ဖိတ်ကြားချက် ဆန်းစစ်ခြင်း၊ ကုဒ်သွင်းထားတဲ့ အချက်ပြမှု၊ ဒေသခံအစည်းအဝေး တည်ငြိမ်မှုနဲ့ လက်ကိုင် ကျော့ပြန်မှုကို ဖုံးအုပ်ပါတယ်။ တကယ့်မီဒီယာ စမ်းသပ်မှုတစ်ခုအတွက် ငွေကြေးထောက်ပံ့ငွေ နှစ်လုံးနဲ့ ပြတင်းပေါက် (သို့) ကိရိယာနှစ်ခု လိုအပ်နေဆဲပါ။ WebRTC နဲ့ renderer စမ်းသပ်မှုတွေက ကင်မရာ၊ မိုက်ခရိုဖုန်း၊ NAT ဖြတ်သန်းမှု၊ Single Protocol Standard request authentication ဒါမှမဟုတ် live transaction finality တွေကို သက်သေပြမပေးနိုင်ပါဘူး။

API အပြီးသတ်မှတ်ချက် မက်ထရစ်နှင့် CLI သက်တမ်း စက်ဝန်းအတွက် [Torii API အဆုံးသတ်ချက်များ: Kaigi အစည်းအဝေးများ](/my/reference/torii-endpoints.md#kaigi-sessions) ကိုကြည့်ပါ။
