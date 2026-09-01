---
translation_locale: am
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kaigi ን በ JavaScript መተግበሪያ ውስጥ መክተት {#embed-kaigi-in-a-javascript-app}

Kaigi አሳሹ ኦዲዮ እና ቪዲዮን በ WebRTC ሲያስተላልፍ የስብሰባውን የህይወት ኡደት በ Iroha ይመዘግባል። የብሎክቼይን መዝገብ ጥሪውን፣ በስም ዝርዝር ላይ የተደረጉ ለውጦችን፣ የተመሰጠረ የምልክት ሜታዳታ እና የመጨረሻ ሁኔታን ያከማቻል። የሚዲያ ቅብብል አይደለም።

ይህ አጋዥ ስልጠና የአሁኑን [Iroha JavaScript ቅንጭብ ማሳያ](https://github.com/soramitsu/iroha-demo-javascript) ይከተላል። ማሳያው አንድ የመጀመሪያ ልቀት መተግበሪያ መገለጫ ተግባራዊ ያደርጋል -

- አንድ አስተናጋጅ እና አንድ እንግዳ
- `transparent` Kaigi የግላዊነት ሁነታ
- `authenticated` የክፍል ፖሊሲ
- `RevealAfterJoin` የአውታረ መረብ አቻ መለያ ባህሪ
- በጥሪ ሜታዳታ ውስጥ የተመሰጠረ አቅርቦት እና በተጠናቀቀው የግብይት ሜታዳታ ውስጥ የተመሰጠረ መልስ

የ Kaigi ፕሮቶኮልም `zk-roster-v1`ን ይገልፃል፣ ነገር ግን አሁን ያለው ማሳያ ያንን የማረጋገጫ ፍሰት አያመነጭም ወይም አያቀርብም። ድልድይዎ ሙሉውን የአሁኑን የማረጋገጫ ውል ካልተተገበረ በስተቀር የግል ሁነታ መቆጣጠሪያን አያቅርቡ።

## ቅድመ ሁኔታዎች {#prerequisites}

ትፈልጋለህ:

- Node.js 20 ወይም ከዚያ በላይ እና Rust የመሳሪያ ሰንሰለት
- Kaigi የሚችል Torii API የመጨረሻ ነጥብ
- የተለየ የገንዘብ ድጋፍ የተደረገላቸው አስተናጋጅ እና የእንግዳ መለያዎች
- የእያንዳንዱ መለያ የፊርማ ቁልፍ በልዩ የኪስ ቦርሳ ወይም የመተግበሪያ ድልድይ ውስጥ
- በሁለቱም የአሳሽ አውዶች ውስጥ የካሜራ እና የማይክሮፎን ፍቃድ

ማሳያው `@iroha/iroha-js`ን በአጎራባች ጥገኝነት `file:../iroha/javascript/iroha_js` በኩል ይጠቀማል። ማሳያውን ከመጫንዎ በፊት SDKን ከ Iroha ምንጭ የሥራ ቅጂ ይገንቡ፦

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

ንፁህ SDK ጥቅሉ የሚፈለገውን የጭነት የስራ ቦታ አያካትትም። `npm run build:native`, ስለዚህ በ ውስጥ እንደገና ይገንቡት Iroha ምንጭ-ኮድ የስራ ቅጂ በኋላ SDK ለውጦች. በሰነድ የተመዘገበው SDK ምንጩ በ ላይ ተሰክቷል [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## የ API የመጨረሻ ነጥብ ያረጋግጡ {#check-the-endpoint}

ለህዝብ Taira የሙከራ መረብ፣ መጀመሪያ Torii ተደራሽነትን ያረጋግጡ -

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

እነዚህ ጥያቄዎች የሚያሳዩት Torii እና የማስታወቂያው API ሰነድ ሊደረስበት እንደሚችል ብቻ ነው። አንድ የተወሰነ Kaigi ጥሪ እንዳለ ወይም የኪስ ቦርሳዎ ግብይቶችን ማስገባት እንደሚችል አያሳዩም።

`/v1/kaigi/relays`፣ `/v1/kaigi/relays/{relay_id}` ወይም `/v1/kaigi/relays/health` ባልተፈረሙ `curl` ጥያቄዎች አይፈትሹ። እነዚያ ሶስት መንገዶች የተፈቀደ የተዘረዘረ ኦፕሬተር ፊርማ ያስፈልጋቸዋል። የማስተላለፊያ ክስተት ዥረቱ አንድ ፕሮቶኮል-ደረጃውን የጠበቀ ትክክለኛ የአውታረ መረብ መለያ ፊርማ ያስፈልገዋል።

በማሳያው ውስጥ ቅንብሮችን ይክፈቱ ፣ ያስገቡ Torii URL, እና ፍቀድ API የመጨረሻ ነጥብ ግኝት ሰንሰለቱን ይጫኑ UUID, ትክክለኛ `NetworkId`, እና የአውታረ መረብ ቅድመ ቅጥያ. የመፃፍ ድልድይ ሶስቱንም እሴቶች ከተመረጠው ጋር ማያያዝ አለበት API የመጨረሻ ነጥብ; በጭራሽ አይገነቡ ሀ `NetworkId` ከሰንሰለቱ UUID ወይም ቅድመ ቅጥያ።

## የመንገድ እና የማረጋገጫ ሞዴል {#route-and-authentication-model}

Kaigi የመጻፍ ክዋኔዎች በተለመደው የተጠቀሱ እና የተፈረሙ ግብይቶች ውስጥ መመሪያዎች ናቸው።. በ `POST /v1/pipeline/transactions` በኩል ያስገቡ እና የተጠናቀቀውን የብሎክ ማስረጃ ይጠብቁ.

ማመልከቻው የሚከተሉት ናቸው -

|መንገድ|ማረጋገጫ|
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}`|የህዝብ|
|`/v1/kaigi/calls/{call_id}/signals`|ነጠላ ፕሮቶኮል-መደበኛ ትክክለኛ-አውታረ መረብ መለያ ጥያቄ|
|`/v1/kaigi/calls/{call_id}/events`|ነጠላ ፕሮቶኮል-መደበኛ ትክክለኛ-አውታረ መረብ መለያ ጥያቄ|

JavaScript SDK እነዚህን እንደ `getKaigiCall` እና `listKaigiCallSignals` ያጋልጣል። የሲግናል ዝርዝሩ ትክክለኛ የጠቋሚ ገጽ ይጠቀማል። የተመለሰውን ጠቋሚ ሳይለወጥ እንደገና ይጠቀሙ; በማካካሻ ወይም በጊዜ ማህተምፕ-ብቻ ቀጣይነት አይተኩት።

## ከአቅራቢው ውጭ መፈረምዎን ይቀጥሉ {#keep-signing-outside-the-renderer}

ውህደቱን በሦስት ድንበሮች ይከፋፍሉት

|ድንበር|ኃላፊነት|
| ----------------- | -------------------------------------------------------------------- |
|አቅራቢ|የስብሰባ ቅጽ፣ የግብዣ አገናኝ፣ የሚዲያ ቁጥጥሮች፣ WebRTC ቅናሾች እና መልሶች|
|ልዩ ድልድይ|ቁልፍ መዳረሻ፣ የክፍያ ዋጋ ግምት፣ የመመሪያ ግንባታ፣ ፊርማ፣ የመጨረሻነት ይጠብቃል።|
|Torii|የጥሪ መዝገብ፣ የተጠናቀቀ የሲግናል ንባቦች፣ የግብይት ማቅረቢያ|

ወደ አቅራቢው የሚመለከት ድልድይ የ API የመጨረሻ ነጥብ ማንነትን በግልፅ መቀበል እና የግል ቁልፍ ቁሳቁስ ከድንበሩ ጀርባ ማስቀመጥ አለበት። የአሁኑ የማሳያ ወለል ከዚህ የተቀነሰ ውል ጋር እኩል ነው -

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

ትክክለኛው የማሳያ ውጤት የተጠናቀቀ የብሎክ ማስረጃ እና ማንኛውንም የተጠቀሰ ክፍያን ያካትታል። የግብይት ምስጠራ ሃሽ ብቻውን እንደ ስኬት አይቁጠሩት።

## የግብዣ ውል {#invite-contract}

የጥሪ መታወቂያን በትክክለኛው `domain.dataspace:meeting` ቅጽ ይጠቀሙ። ማሳያው በ`kaigi.universal` ስር ጥሪዎችን ያመነጫል እና ባለ 24-ባይት ምስጠራ የዘፈቀደ ግብዣ ሚስጥር እንደ 32 ያልተሸፈኑ base64url ቁምፊዎች ይጠቀማል።

ነጠላ ፕሮቶኮል-መደበኛ ግብዣ በትክክል አንድ `call` እና አንድ `secret` መለኪያ ይዟል

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

የውስጠ-መተግበሪያ ተተኪ አማራጭ በ ላይ ተመሳሳይ ትክክለኛ ጥያቄ ነው `#/kaigi`. የተባዙ፣ ያልታወቁ፣ ባዶ፣ የታሸጉ ወይም ነጠላ ያልሆኑ ፕሮቶኮል-መደበኛ መለኪያዎችን ውድቅ ያድርጉ። ማሳያው ስብሰባው ከ24 ሰአታት በኋላ እንዲያበቃ ያዘጋጃል `scheduledStartMs`.

የግብዣው ሚስጥር የአስተናጋጁን አቅርቦት ሜታዳታ ዲክሪፕት ያደርገዋል። ተሸካሚ ሚስጥር ነው አይመዝግቡት፣ በመተንተን ውስጥ አያስቀምጡት ወይም በብሎክቼይን መዝገብ ሜታዳታ ውስጥ አያስቀምጡት። የአስተናጋጁ የተለየ X25519 ቁልፍ ጥንድ የእንግዳ መልስ ምልክቶችን ዲክሪፕት ያደርገዋል እና ለአስተናጋጁ ክፍለ ጊዜ በአካባቢው መቆየት አለበት።

## ስብሰባ የሕይወት ዑደት {#meeting-lifecycle}

### አስተናጋጅ {#host}

1. የተመረጠው የኪስ ቦርሳ መታወቂያ ከ API የመጨረሻ ነጥብ ሰንሰለት UUID፣ ትክክለኛ `NetworkId` እና ቅድመ ቅጥያ ጋር የሚዛመድ መሆኑን ያረጋግጡ።
2. የሀገር ውስጥ ሚዲያዎችን ይክፈቱ እና `RTCPeerConnection` ይፍጠሩ።
3. SDP ቅናሽ ይፍጠሩ እና ICE ስብሰባ እስኪጠናቀቅ ድረስ ይጠብቁ።
4. የግብዣውን ሚስጥር ይፍጠሩ እና አስተናጋጅ Kaigi የምልክት ቁልፍ ጥንድ።
5. ቅናሹን በግብዣው ሚስጥር ኢንክሪፕት ያድርጉት።
6. የክፍያ ዋጋ ግምት ያግኙ እና `CreateKaigi` የያዘ ግብይት ግልጽ በሆነ የተረጋገጠ ሁነታ ይፈርሙ።
7. ግብዣውን እንደ ቀጥታ ከማሳየትዎ በፊት የተጠናቀቀውን የብሎክ ማስረጃ ይጠብቁ።

የአስተናጋጁን ክፍለ ጊዜ ክፍት ያድርጉት። የሲግናል መንገዱን በአስተናጋጅ መለያው ነጠላ ፕሮቶኮል-መደበኛ የጥያቄ ፊርማ ይመርጡ፣ የመጀመሪያውን ትክክለኛ መልስ በአስተናጋጅ ሲግናል ቁልፍ ዲክሪፕት ያድርጉ እና በ`setRemoteDescription` ይተግብሩ። ተጨማሪ ገፆች ሲገኙ በትክክል `nextCursor`ን ወደ ፊት ይውሰዱ።

### እንግዳ {#guest}

1. ትክክለኛውን ግብዣ ይተንትኑ እና ያረጋግጡ።
2. የህዝብ ጥሪ መዝገቡን ይዘው ይምጡ እና ቅናሹን በግብዣው ሚስጥር ዲክሪፕት ያድርጉት።
3. ያለቀው፣ ጊዜው ያለፈበት፣ ቀጥታ ያልሆነ ወይም ግልጽ ያልሆነውን ስብሰባ ውድቅ ያድርጉ።
4. የሀገር ውስጥ ሚዲያን ይክፈቱ፣ ቅናሹን ይተግብሩ፣ SDP መልስ ይፍጠሩ እና ICE መሰብሰብን ይጨርሱ።
5. ለአስተናጋጁ Kaigi የህዝብ ቁልፍ መልሱን ኢንክሪፕት ያድርጉ።
6. የክፍያ ዋጋ ግምት ያግኙ እና `JoinKaigi` እና ነጠላ ፕሮቶኮል-መደበኛ መልስ ሜታዳታ የያዘ ግብይት ይፈርሙ።
7. እንግዳውን እንደተቀላቀለ ከማሳየትዎ በፊት የተጠናቀቀውን የብሎክ ማስረጃ ይጠብቁ።

### መጨረሻ {#end}

አስተናጋጁ ብቻ `EndKaigi` ማስገባት ይችላል። የአውታረ መረብ አቻ ግንኙነትን እና የሚዲያ ትራኮችን ይዝጉ፣ የተፈረመውን መመሪያ ያስገቡ እና የመጨረሻውን ይጠብቁ። ግልጽ አንድ ተሳታፊ `LeaveKaigi` ሊጠቀም ይችላል; የ`zk-roster-v1` መነሳት በመጀመሪያ የተለቀቀው ፕሮቶኮል ውስጥ ከሰንሰለት ውጪ ነው፣ እና ቤተኛ መመሪያው የግላዊነት-ፈቃድ አርቲፋክቶችን ውድቅ ያደርጋል።

## በእጅ የሚደረግ WebRTC ተተኪ አማራጭ {#manual-webrtc-fallback}

ማሳያው ለአካባቢያዊ ልማት የላቀ የምልክት መንገድን ይይዛል። በብሎክቼይን መዝገብ የተደገፈ አውቶማቲክ ምልክት በማይገኝበት ጊዜ አስተናጋጁ እና እንግዳው ጥሬው WebRTC ቅናሽ እና መልስ እንዲሰጡ ያስችላቸዋል።

ይህንን እንደ የተለየ ሁነታ ይያዙት። Kaigi መዝገብ አይፈጥርም፣ አይቀላቀልም ወይም አያበቃም፣ የግብይት ፍጻሜውን አይሰጥም እና በሰንሰለት ፍሰት ላይ ካለው ፍሰት ጋር እኩል ሆኖ መቅረብ የለበትም።

## ውህደቱን ይፈትሹ {#test-the-integration}

በአሁኑ ጊዜ ያተኮሩ የማሳያ ስብስቦችን ያሂዱ -

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

ፈተናዎቹ የአሁኑን ግልጽ መገለጫ፣ ጥብቅ የግብዣ ትንተና፣ ኢንክሪፕት የተደረገ ምልክት፣ የአካባቢ ክፍለ ጊዜ ጽናት እና በእጅ ተተኪ አማራጩን ይሸፍናሉ። እውነተኛ የሚዲያ ሙከራ አሁንም ሁለት የገንዘብ ድጋፍ የተደረገላቸው የኪስ ቦርሳዎች እና ሁለት መስኮቶች ወይም መሳሪያዎች ያስፈልገዋል; የተሳለቁ WebRTC እና የአቅራቢ ሙከራዎች ካሜራ፣ ማይክሮፎን፣ NAT መሻገሪያ፣ ነጠላ ፕሮቶኮል-መደበኛ የጥያቄ ማረጋገጫ ወይም የቀጥታ ግብይት መጨረሻውን አያረጋግጡም።

ለተሟላው API የመጨረሻ ነጥብ ማትሪክስ እና CLI የሕይወት ዑደት፣ [Torii API የመጨረሻ ነጥቦች Kaigi ክፍለ-ጊዜዎች](/am/reference/torii-endpoints.md#kaigi-sessions) ይመልከቱ።
