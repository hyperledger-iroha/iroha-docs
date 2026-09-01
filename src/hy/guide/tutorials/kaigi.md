---
translation_locale: hy
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Kaigi ներմուծում JavaScript հավելվածի մեջ {#embed-kaigi-in-a-javascript-app}

Kaigi-ն հանդիպման lifecycle-ը գրանցում է Iroha-ում, իսկ browser-ը audio և video է փոխանցում WebRTC-ով։ Գրանցամատյանը պահպանում է call-ը, roster mutation-ները, encrypted signaling metadata-ն և final state-ը. այն media relay չէ։

Այս ձեռնարկը հետեւում է ընթացիկ [Iroha JavaScript ցուցադրությանը](https://github.com/soramitsu/iroha-demo-javascript). Դեմոն իրականացնում է առաջին թողարկման հավելվածի պրոֆիլ.

- մեկ հյուրընկալող եւ մեկ հյուր
- `transparent` Kaigi գաղտնիության մոդը
- `authenticated` սենյակային քաղաքականություն
- `RevealAfterJoin` հանգույցների ինքնության վարքագիծ
- զանգի մետադատներում կոդավորված առաջարկ եւ հաստատված գործարքի մեթադատներում՝ կոդավորված պատասխան

Kaigi պրոտոկոլը նաեւ սահմանում է `zk-roster-v1`, բայց ընթացիկ ցուցադրությունը չի ստեղծում կամ ներկայացնում այդ ապացուցման հոսքը: Մի ներկայացրեք մասնավոր ռեժիմի վերահսկողություն, քանի դեռ ձեր կամուրջն իրականացնում է ամբողջական ընթացիկ ապացուցված պայմանագիրը:

## Նախադրյալներ {#prerequisites}

Ձեզ հարկավոր է:

- Node.js 20 կամ ավելի նոր եւ Rust գործիքային շղթա
- Kaigi-ի կարողության Torii վերջային կետ
- ֆինանսավորվող հյուրընկալողի եւ հյուրերի առանձին հաշիվները
- յուրաքանչյուր հաշիվի ստորագրման բանալին արտոնյալ դրամապանակում կամ հավելվածային կամուրջում
- տեսախցիկի եւ միկրոֆոնի թույլտվությունները երկու բրաուզերային համատեքստերում

Դեմոն սպառում է `@iroha/iroha-js` միջոցով եղբայրական կախվածությունը `file:../iroha/javascript/iroha_js`. Ստեղծեք SDK Iroha աղբյուրի ստուգման նախքան տեղադրելը:

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

Մաքուրը SDK փաթեթը չի պարունակում բեռի աշխատանքային տարածքը, որը պահանջվում է `npm run build:native`, այնպես որ վերակառուցել այն Iroha աղբյուրի ստուգումից հետո SDK Փոփոխությունները: SDK աղբյուրը կոշտացած է [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## Փորձեք վերջնական կետը {#check-the-endpoint}

Հասարակական Taira թեստային ցանցի համար նախ ստուգեք Torii հասանելիությունը.

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

Այս խնդրանքները միայն ապացուցում են, որ Torii եւ դրա գովազդված API փաստաթուղթը հասանելի են: Նրանք չեն ապացուցել, որ գոյություն ունի հատուկ Kaigi զանգ կամ ձեր դրամապանակը կարող է գործարքներ ներկայացնել:

Մի ստուգեք `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}` կամ `/v1/kaigi/relays/health` չստորագրված `curl` խնդրանքներով: Այդ երեք երթուղիները պահանջում են թույլատրված ցուցակով օպերատորի ստորագրություն: Relay իրադարձությունների հոսքը պահանջում է կանոնական ճշգրիտ ցանցային հաշիվի ստորագրությունը:

Դեմոյում բացեք Կարգավորումները, մուտքագրեք Torii URL, եւ թող ավարտական կետի հայտնաբերման բեռնել շղթան UUID, ճշգրիտ `NetworkId`, եւ ցանցի նախանշան. Գրելու կամուրջը պետք է կապել բոլոր երեք արժեքները ընտրված վերջային կետին; երբեք կառուցել a `NetworkId` շղթայից UUID կամ նախանշան:

## Ճանապարհ եւ հավաստագրման մոդել {#route-and-authentication-model}

Kaigi գրառումները սովորական վճարի գնառաջարկ եւ ստորագրված գործարքների ներքին հրահանգներ են: Նրանց ուղարկեք `POST /v1/pipeline/transactions` միջոցով եւ սպասեք վերջնականացված բլոկի ապացույցների:

Հայցը հետեւյալն է.

|Ճանապարհ |Վավերացում |
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}` |հանրություն |
|`/v1/kaigi/calls/{call_id}/signals` |վավերական ճշգրիտ ցանցային հաշիվների պահանջ |
|`/v1/kaigi/calls/{call_id}/events` |վավերական ճշգրիտ ցանցային հաշիվների պահանջ |

JavaScript SDK-ը բացատրում է դրանք որպես `getKaigiCall` եւ `listKaigiCallSignals`: Սիգնալի ցուցակը օգտագործում է ճշգրիտ կուրսորային էջավորումը: Վերադարձ վերադարձված կուրսորը կրկին օգտագործեք անփոխարինված, այն մի փոխարինեք փոխհատուցմամբ կամ միայն ժամադրության հետապնդմամբ.

## Պահպանեք ստորագրությունը տվողի կողմից {#keep-signing-outside-the-renderer}

Կավառակեք ինտեգրումը երեք սահմաններում.

|սահմաններ |պատասխանատվություն |
| ----------------- | -------------------------------------------------------------------- |
|Պարգեւատիր |հանդիպման ձեւը, հրավիրման հղումը, լրատվամիջոցների վերահսկողությունը, WebRTC առաջարկները եւ պատասխանները |
|Բնավոր կամուրջ |Գլխավոր մուտք, վճարային առաջարկություն, հրահանգների ստեղծում, ստորագրություն, վերջնականության սպասումներ |
|Torii |զանգի արձանագրություն, հաստատված ազդանշանի ընթերցում, գործարքի ներկայացումը |

Ռենդերերային ուղղված կամուրջը պետք է բացարձակապես ընդունի վերջնական կետի ինքնությունը եւ պահի գաղտնի բանալիների նյութը սահմանների ետեւում: Ներկա ցուցադրական մակերեսը հավասար է այս կրճատված պայմանագրին.

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

Իրական ապացուցման արդյունքը նաեւ պարունակում է վերջնականացված բլոկի ապացույցներ եւ ցանկացած վճարի գնառաջարկ վճար: Մի վերաբերվեք միայն գործարքի հաշշին որպես հաջողություն:

## Հրավիրման պայմանագիր {#invite-contract}

Օգտագործեք զանգ ID ճշգրիտ `domain.dataspace:meeting` ձեւով: Դեմոն ստեղծում է զանգեր `kaigi.universal`- ի ներքո եւ օգտագործում է 24 բայթանոց կրիպտոգրաֆիկորեն պատահական հրավիրման գաղտնիք, որը կոդավորվում է որպես 32 չփակված base64url նիշ:

Քանոնիկ հրավիրումը պարունակում է ճիշտ մեկ `call` եւ մեկ `secret` պարամետր.

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

Հավելվածի մեջ ընկած հետընթացը նույնն է, ինչպես `#/kaigi` հարցումը: Թողեք կրկնակի, անհայտ, դատարկ, պաշված կամ ոչ կանոնիկ պարամետրեր: Դեմոն սահմանում է հանդիպման ժամկետը 24 ժամից հետո `scheduledStartMs`:

Հրավերի գաղտնիքը վերծանում է host-ի offer metadata-ն։ Դա bearer secret է. մի՛ գրանցեք այն, մի՛ ներառեք analytics-ում և մի՛ պահեք գրանցամատյանի metadata-ում։ Host-ի առանձին X25519 keypair-ը վերծանում է guest response signaling-ը և պետք է մնա host session-ի local միջավայրում։

## Հանդիպման կենսաշրջան {#meeting-lifecycle}

### Հյուրընկալող {#host}

1. Ստուգեք, որ ընտրված դրամապանակի ինքնությունը համապատասխանում է վերջային կետի շղթայի UUID, ճշգրիտ `NetworkId`, եւ նախադրյալին:
2. Բացեք տեղական մեդիա եւ ստեղծեք `RTCPeerConnection`.
3. Ստեղծեք SDP առաջարկ եւ սպասեք, որ ավարտվի ICE հավաքումը:
4. Ստեղծեք հրավիրման գաղտնի եւ հյուրընկալող Kaigi ազդանշանի կոճակ զույգը:
5. Գլխավորագրեք առաջարկը հրավիրման գաղտնիքը:
6. Նշեք եւ ստորագրեք `CreateKaigi` պարունակող գործարքը թափանցիկ, ստուգված ռեժիմով:
7. Սպասեք բլոկի ապացույցների ավարտին, նախքան հրավիրումը կենդանի ցուցադրելը:

Պահպանեք հյուրընկալող նստաշրջանը բաց: Հարցրեք ազդանշանի երթուղին հյուրընառու հաշիվի կանոնիկ պահանջի ստորագրությամբ, կոդավորեք առաջին վավեր պատասխանը հյուրընկերային ազդանշանի բանալիրով եւ կիրառեք այն `setRemoteDescription` ։ Հեռացրեք `nextCursor` դեպի առաջ ճիշտ այն ժամանակ, երբ ավելի շատ էջեր հասանելի են.

### Հյուրը {#guest}

1. Վերլուծեք եւ հաստատեք հստակ հրավերը:
2. Վերցրեք հանրային զանգերի արձանագրությունը եւ վերբացահայտեք առաջարկը հրավիրման գաղտնիքի հետ:
3. Բաց թողեք ավարտված, ժամկետով անցած, ոչ կենդանի կամ ոչ թափանցիկ հանդիպումը:
4. Բացեք տեղական մեդիա, կիրառեք առաջարկը, ստեղծեք SDP պատասխան եւ ավարտեք ICE հավաքումը:
5. Կոդավորեք պատասխանը հյուրընկալողի հանրային բանալին Kaigi:
6. Նշեք եւ ստորագրեք գործարք, որը պարունակում է `JoinKaigi` գումարած կանոնական պատասխանների մետադատա:
7. Սպասեք վերջնական ապացույցներ ստանալուց առաջ, որ հյուրին ցուցադրեք որպես միացված:

### Վերջը {#end}

Միայն հյուրընկալողը կարող է ներկայացնել `EndKaigi`։ Կապակցեք զուգահեռների կապը եւ մեդիա հետքերն, ներկայացրեք ստորագրված հրահանգը եւ սպասեք վերջնականության: Անցանելի մասնակից կարող է օգտագործել `LeaveKaigi`; `zk-roster-v1` մեկնարկը առաջին թողարկման պրոտոկոլում անջատված է, եւ տեղական հրահանգը մերժում է գաղտնիության բաց թողնող արվեստի գործիքները:

## Մանուալ WebRTC Վերադարձ {#manual-webrtc-fallback}

Դեմոն պահպանում է տեղական զարգացման համար առաջադեմ ազդանշանային ուղին: Այն թույլ է տալիս հյուրընկալողին եւ հյուրերին կփոխել RAW WebRTC առաջարկի փաթեթները եւ պատասխանել այն ժամանակ, երբ ավտոմատ գրանցված ազդանշանավորումը հասանելի չէ:

Դրանք չեն ստեղծում, միանում կամ ավարտում Kaigi արձանագրություն, չեն ապահովում գործարքի վերջնականությունը, եւ չպետք է ներկայացվեն որպես հավասար ցանցային հոսքի:

## Փորձեք ինտեգրումը {#test-the-integration}

Գործարկել ներկայիս կենտրոնացված demo suite:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

Թեստերը ընդգրկում են ներկա թափանցիկ պրոֆիլը, խիստ հրավիրման վերլուծությունը, կոդավորված ազդանշանները, տեղական նստաշրջանի մշտությունը եւ ձեռնական հետընթացը: Իսկական մեդիա թեստը դեռ պահանջում է երկու ֆինանսավորված դրամապանակներ եւ երկու պատուհաններ կամ սարքեր: WebRTC եւ ռենդերային փորձարկումները չեն ապացուցում տեսախցիկի, միկրոֆոնի, NAT անցման, քանոնիկական խնդրանքների հավատարմագրման կամ կենդանի գործարքի վերջնականության:

Ամբողջական վերջնական կետի մատրիսի եւ CLI կյանքի շրջանի համար դիտեք [Torii վերջային կետերը. Kaigi նստաշրջանները](/hy/reference/torii-endpoints.md#kaigi-sessions).
