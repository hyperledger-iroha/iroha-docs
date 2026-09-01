---
translation_locale: mn
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Эмбед Kaigi-ийг JavaScript апп-д оруулах {#embed-kaigi-in-a-javascript-app}

Kaigi нь уулзалтын амьдралын мөчийг Iroha дээр бичиж авадаг бөгөөд хөтчөр нь WebRTC дээр аудио ба видео дамжуулдаг. Блокчейн тэмдэглэл нь дуудлага, оролцогчдын жагсаалтын өөрчлөлтүүд, шифрлэгдсэн дохионы мета өгөгдөл, эцсийн статустыг хадгалдаг; энэ нь медиа дамжуулах суварга биш юм.

Энэхүү сургалт нь одоогийн [Iroha JavaScript демо](https://github.com/soramitsu/iroha-demo-javascript)-ийг даган явна. Демо нь анхны гарсан хувилбарын програмын профайлыг хэрэгжүүлдэг:

- нэг эзэн ба нэг зочин
- `transparent` Kaigi нууцлалын горим
- `authenticated` өрөөний бодлого
- `RevealAfterJoin` сүлжээний түншийн таних шинж чанар
- дуудлагын мета өгөгдөл дэх шифрлэгдсэн санал ба баталгаажсан гүйлгээний мета өгөгдөл дэх шифрлэгдсэн хариулт

Kaigi протокол мөн `zk-roster-v1`-ийг тодорхойлдог боловч одоогийн демо нь тэр баталгааны урсгалыг үүсгэх эсвэл оруулахгүй. Хэрэв таны гүүр одоогийн бүрэн баталгааны гэрээг хэрэгжүүлээгүй бол хувийн горимын удирдлагыг бүү үзүүл.

## Өмнөх шаардлага {#prerequisites}

Танд хэрэгтэй:

- Node.js 20 ба шинэ хувилбар болон Rust багажийн цуваа
- a Kaigi-чадвартай Torii API төгсгөл
- санхүүжүүлсэн хост ба зочны дансыг тусад нь байлгах
- эрх дархтай түрийвч эсвэл програмын гүүр дэх тус бүрийн акаунтын гарын үсгийн түлхүүр
- камер ба микрофоны зөвшөөрөл хоёр браузерийн нөхцөлд

Демо нь `file:../iroha/javascript/iroha_js` ах, дүүсийн хамаарал байдлаар дамжуулан `@iroha/iroha-js`-ыг хэрэглэж байна. Демог суулгахаас өмнө Iroha эх үүсвэрийн шалгалтаас SDK-г барьж бүтээ:

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

Цэвэр SDK багц нь шаардлагатай Cargo ажиллах орчныг агуулдаггүй `npm run build:native`, тэгээд үүнийг дахин барь Iroha эх кодын ажиллаж буй хуулбар дараа нь SDK өөрчлөлтүүд. Баримтжуулсан SDK эх сурвалжийг тогтоосон [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## API төгсгөлийг шалгана уу {#check-the-endpoint}

Нийтийн Taira тестнетийн хувьд, эхлээд Torii-нд хандах боломжтой эсэхийг шалгана уу:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

Эдгээр хүсэлтүүд нь зөвхөн Torii ба түүний зар сурталчилгаанд дурдсан API баримт бичиг хүрч очих боломжтойг баталж байна. Тэд тодорхой Kaigi дуудлага байгаа эсэх, эсвэл таны түрийвч гүйлгээг илгээж чадах эсэхийг баталдаггүй.

Гарын үсэггүй `curl` хүсэлтийг `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, эсвэл `/v1/kaigi/relays/health` дээр туршиж болохгүй. Эдгээр гурван маршрутын аль алинд нь зөвшөөрөгдсөн операторын гарын үсэг шаардлагатай. Дамжуулах үйл явдлын урсгалд ганц протокол-стандарттай яг сүлжээний дансны гарын үсэг шаардлагатай.

Демо хувилбарт Settings-ийг нээж, Torii URL-г оруулж, API төгсгөл цэгийн илрүүлэг UUID гинж, яг `NetworkId`, болон сүлжээний урд талын кодыг ачаалуулахыг зөвшөөрнө үү. Бичих гүүр нь бүх гурван утгыг сонгогдсон API төгсгөлд холбох ёстой; гинж UUID эсвэл урд нь тавих тэмдэгээс `NetworkId` үүсгэж болохгүй.

## Зам болон Баталгаажуулалтын Загвар {#route-and-authentication-model}

Kaigi нь энгийн иш татсан, гарын үсэг зурсан гүйлгээнд зааварчилгаа бичдэг. Үүнийг `POST /v1/pipeline/transactions` дээр дамжуулж, эцсийн блокийн нотлох баримтыг хүлээнэ үү.

Програмын уншлагууд нь:

|Зам|Нэвтрэлт баталгаажуулалт|
| ----------------------------------- | --------------------------------------- |
| `/v1/kaigi/calls/{call_id}`         |нийтийн|
| `/v1/kaigi/calls/{call_id}/signals` |нэг протокол-стандарт нарийн сүлжээний дансны хүсэлт|
| `/v1/kaigi/calls/{call_id}/events`  |нэг протокол-стандарт нарийн сүлжээний дансны хүсэлт|

JavaScript SDK үүнийг `getKaigiCall` ба `listKaigiCallSignals` болгон илчилж байна. Дохио жагсаалт нь яг курсорын хуудаслахыг ашигладаг. Буцаасан курсорыг өөрчлөлгүй дахин ашигла; үүнийг offset эсвэл зөвхөн timestamp-тай үргэлжлүүлэлтээр орлуулахгүй.

## Рендерерийн гадна гарын үсгээ үргэлжлүүлэн зур {#keep-signing-outside-the-renderer}

Интеграллыг гурван хязгаарлалтад хуваа:

|Хил|Өөртөө хариуцлага|
| ----------------- | -------------------------------------------------------------------- |
|Өнгөт дүрслэгч|хурлын маягт, урилга холбоос, медиа хяналт, WebRTC санал болон хариултууд|
|Эрх давуутай гүүр|түлхүүр хандалт, төлбөрийн үнийн тооцоо, зааварчилгаа барилга, гарын үсэг зуралт, эцсийн хүлээлт|
| Torii             |дуудлагын бичлэг, эцэслэгдсэн дохионы уншилтууд, гүйлгээ илгээх|

Рендерер рүү чиглэсэн гүүр нь API төгсгөл цэгийн танилтыг тодорхой хэлбэрээр хүлээн авах хэрэгтэй бөгөөд хувийн түлхүүрийн материалыг хил хязгаарын ард хадгалах ёстой. Одоогийн демо гадаргуу нь энэ багасгасан гэрээтэй ижил утгатай юм:

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

Жинхэнэ демо үр дүн нь мөн эцсийн блокийн нотлох баримт болон аль ч иш татсан хураамжийг агуулдаг. Гүйлгээний криптографийн хэшийг ганцаараа амжилт гэж бүү үз.

## Өргөдлийн гэрээ {#invite-contract}

Тодорхой `domain.dataspace:meeting` формын дуудлагын ID-г ашиглана уу. Демо нь `kaigi.universal` дор дуудлагуудыг үүсгэж, 32 үндсэн64 URL тэмдэгтээр дамжуулсан 24-н байтын криптографиар санамсаргүй урьдын нууцыг ашигладаг.

Нэг протоколын стандарт урилга нь яг нэг `call` болон нэг `secret` параметр агуулах ёстой:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

Апп доторх балл-дахиалалт нь `#/kaigi`-д ижил яг хэвээрх асуулт юм. Давхарсан, танигдахгүй, хоосон, нэмж бөглөсөн, эсвэл ганц протокол стандартад нийцээгүй параметрүүдийг татгалз. Демонстрац нь уулзалтын хүчинтэй хугацааг `scheduledStartMs`-ээс хойш 24 цаг болгоно.

Уригдсан нууц нь хостын саналын метадатыг тайлдаг. Энэ нь тээвэрлэгч нууц юм: үүнийг бүртгэж болохгүй, аналитикт хийж болохгүй, эсвэл блокчэйн бүртгэлийн метадатад хадгалах ёсгүй. Хостын тусдаа X25519 түлхүүр хос нь зочны хариултын дохиог тайлж, хостын сессид локал байх ёстой.

## Хуралдааны амьдралын цикл {#meeting-lifecycle}

### Зочин хүлээж авах газар {#host}

1. Сонгогдсон хэтэвчийн таних тэмдэг нь API төгсгөлын гинж UUID, яг `NetworkId`, болон өмнөхлөлттэй нийцэж байгааг баталгаажуулна уу.
2. Орон нутгийн медиаг нээгээд `RTCPeerConnection` үүсгээрэй.
3. SDP саналыг үүсгээд ICE цугларалт дуусахыг хүлээнэ үү.
4. Уригтын нууц ба хост Kaigi дохионы түлхүүрийн хосыг үүсгэ.
5. Урилгын нууц үгээр саналыг шифрлэ.
6. Тодорхой, баталгаажсан горимд `CreateKaigi` агуулсан гүйлгээг гарын үсэг зурж, төлбөрийн үнийн таамаглал авч үзнэ үү.
7. Нийтэлсэн уригдахыг амьд гэж үзүүлэхээс өмнө баталгаажсан блокийн нотолгоог хүлээнэ үү.

Хост сессийг нээлттэй байлга. Хост дансны ганц протокол стандарт хүсэлтийн гарын үсгээр дохионы маршрутыг шалга, эхний хүчин төгөлдөр хариуг хост дохионы түлхүүрээр тайлж `setRemoteDescription`-тэй хэрэглэ. Илүү олон хуудас байгаа тохиолдолд `nextCursor`-ийг яг таг үргэлжлүүлнэ.

### Зочин {#guest}

1. Тодорхой урилгыг задлан шинжлэн шалгаж баталгаажуулна уу.
2. Олон нийтийн дуудлагын бүртгэлийг авч, урилга нууцаар түүний саналыг тайлна уу.
3. Дууссан, хугацаа нь дууссан, шууд бус эсвэл ил тод бус хурлыг татгалз.
4. Орон нутгийн хэвлэл мэдээллийг нээ, саналд бүртгүүл, SDP хариулт үүсгэж, ICE цуглуулалтыг дуусга.
5. Хостын Kaigi нийтийн түлхүүрээр хариултыг шифрлэ.
6. Төлбөрийн үнийн тооцоог аваад `JoinKaigi` болон стандарт протоколын нэг хариултын метадатаг агуулсан гүйлгээнд гарын үсэг зур.
7. Зочин нэгдсэн гэж үзүүлэхээс өмнө эцэслэгдсэн блокийн баримтыг хүлээнэ үү.

### Төгсгөл {#end}

Зөвхөн хөтлөгч л `EndKaigi`-г илгээж болно. Сүлжээний хамтрагчийн холболт болон медиа замыг хааж, гарын үсэгтэй зааврыг илгээж, эцсийн байдлыг хүлээгээрэй. Ил тод оролцогч `LeaveKaigi`-ийг ашиглаж болно; `zk-roster-v1` гаралт нь анхны хувилбарын протоколд off-chain хэлбэрээр явагддаг бөгөөд нутгийн зааварчилгаа нууцлалын гарцын объектуудыг татгалздаг.

## Гарын авлага WebRTC Нөөцлөлт {#manual-webrtc-fallback}

Демо нь орон нутгийн хөгжүүлэлтэд зориулсан Ахисан түвшний дохионы замыг хадгалдаг. Энэ нь хост болон зочинд blockchain бүртгэлийн дохио автоматын үйлчилгээ байхгүй үед түүхий WebRTC санал болон хариу пакетуудыг хуулбарлах боломжийг олгодог.

Энэ нь өөр горим гэж үзэж болно. Энэ нь Kaigi бүртгэл үүсгэх, нэгдэх эсвэл дуусгахгүй, гүйлгээний эцсийн байдлыг өгдөггүй бөгөөд сүлжээнд шууд дамжуулдаг урсгалтай тэнцүү гэж үзэж болохгүй.

## Интеграцийг турших {#test-the-integration}

Одоогийн анхаарлын төвд байгаа демо багцуудыг ажиллуулна уу:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

Шалгалтууд нь одоогийн ил тод профайл, чанд урилгыг задлах, кодлогдсон дохиолол, орон нутгийн сессийн хадгалалт, гарын авлагын нөөцлөлтийг хамардаг. Бодит медиа тестэд хоёр санхүүжсэн түрийвч болон хоёр цонх эсвэл төхөөрөмж шаардлагатай хэвээр байна; Тоглоомжуулсан WebRTC ба рендерийн туршилтууд нь камер, микрофон, NAT дамжин өнгөрөх байдал, нэг протокол-стандартын хүсэлтийн баталгаажуулалт, эсвэл шууд гүйлгээний эцсийн байдлыг нотлохгүй.

Бүтэн API төгсгөлийн матриц болон CLI амьдралын мөчлөгийг үзэхийн тулд [Torii API төгсгөлүүд: Kaigi хуралдаанууд](/mn/reference/torii-endpoints.md#kaigi-sessions) руу очно уу.
