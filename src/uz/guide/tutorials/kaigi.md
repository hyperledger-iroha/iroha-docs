---
translation_locale: uz
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Kaigi ni JavaScript dasturida o'rnatish {#embed-kaigi-in-a-javascript-app}

Kaigi meeting lifecycle-ni Iroha-da qayd etadi, browser esa audio va videoni WebRTC orqali tashiydi. Reyestr call, roster mutation, encrypted signaling metadata va final state-ni saqlaydi; u media relay emas.

Ushbu qo'llanma hozirgi [Iroha JavaScript namoyishi](https://github.com/soramitsu/iroha-demo-javascript) ni kuzatib boradi. Demo birinchi chiqarilgan ilova profilini amalga oshiradi:

- bir uy egasi va bitta mehmon
- `transparent` Kaigi maxfiylik rejimi
- `authenticated` xona siyosati
- `RevealAfterJoin` tugunlar o'rtasidagi identifikatsiya xatti-harakati
- qo'ng'iroq metadatalarida shifrlangan taklif va commit qilingan tranzaksiya metadatalarda shifrlangan javob;

Kaigi protokoli ham `zk-roster-v1` ni belgilaydi, ammo joriy demo bu dalil oqimini yaratmaydi yoki taqdim etmaydi. Agar ko'prikingiz to'liq amaldagi isbot shartnomasini amalga oshirmagan bo'lsa, xususiy rejimda nazoratni taqdim etmang.

## Oldindan talablar {#prerequisites}

Sizga kerak:

- Node.js 20 yoki undan yangi va Rust asbob-uskunalar zanjirlari
- Kaigi -ga ega bo'lgan Torii oxirgi nuqtasi
- mablag' bilan ta'minlangan uy egasi va mehmon hisobvaraqlari
- har bir hisobvaraqning imtiyozli hamyoz yoki dastur ko'prasida imzolash kaliti
- ikkala brauzer kontekstida ham kamera va mikrofon ruxsatlari

Demo `file:../iroha/javascript/iroha_js` singil-singil bog'liqligi orqali `@iroha/iroha-js` iste'mol qiladi. Demoni o'rnatishdan oldin Iroha manbai checkoutidan SDK ni yaratish:

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

toza SDK paketida `npm run build:native` tomonidan talab etiladigan yuk ish maydonini o'z ichiga olmaydi, shuning uchun uni Iroha manbai checkout-da qayta qurish kerak. SDK o'zgarishlaridan so'ng hujjatlashtirilgan SDK manbasi [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js) raqamiga biriktirilgan.

## Keyingi nuqtani tekshiring {#check-the-endpoint}

Umumiy Taira testnet uchun avval Torii ning mavjudligini tekshirish:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

Ushbu so'rovlar faqat Torii va uning reklama qilingan API hujjatiga murojaat qilish mumkinligini isbotlaydi. Ular muayyan Kaigi qo'ng'iroq mavjudligini yoki sizning hamyoningiz tranzaksiyalarni taqdim etishi mumkinligini isboti emas.

Sinovga kirmang . `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, yoki `/v1/kaigi/relays/health` imzolanmagan holda `curl` Ushbu uchta yo'nalish uchun ruxsat etilgan operatorning imzosi kerak. Relay hodisalari oqimi kanonik aniq tarmoq hisobini imzolashni talab qiladi.

Ko'rsatuvda "Setting"ni oching. Torii URL, va oxirgi nuqtani kashf etish zanjirni yuklashi kerak UUID, aniq `NetworkId`, va tarmoq prefiksi. yozish ko'prisi uchta qiymatni ham tanlangan oxirgi nuqta bilan bog'lashi kerak; hech qachon `NetworkId` zanjirdan UUID yoki prefiks.

## Yo'nalish va tasdiqlash modeli {#route-and-authentication-model}

Kaigi yozma yozuvlari oddiy kotirlangan va imzolangan bitimlar ichida ko'rsatmalardir. ularni `POST /v1/pipeline/transactions` orqali yuboring va yakuniy blok dalillarini kuting.

Ariza quyidagicha boʻlib oʻqiydi:

|Yo ' nalish |Tasdiqlash |
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}` |ommaviy |
|`/v1/kaigi/calls/{call_id}/signals` |Kanonik toʻgʻri tarmoq hisobini talab qilish |
|`/v1/kaigi/calls/{call_id}/events` |Kanonik toʻgʻri tarmoq hisobini talab qilish |

JavaScript SDK `getKaigiCall` va `listKaigiCallSignals` yordamchilarini taqdim etadi. Signallar ro'yxati aniq cursor pagination-dan foydalanadi. Qaytarilgan cursor-ni o'zgartirmasdan qayta ishlating; uni timestamp-only davom belgisi bilan almashtirmang.

## Beruvchining tashqarisida imzo qo'ying {#keep-signing-outside-the-renderer}

Integratsiyani uchta chegaraga boʻling:

|Chegaralar|Masʼuliyat |
| ----------------- | -------------------------------------------------------------------- |
|Renderer |yig'ilish shakli, taklif bog'i, ommaviy axborot vositalari nazoratlari, WebRTC taklif va javoblar |
|Maxsus koʻprik |kalitga kirish, to'lov takliflari, ko'rsatmalarni tuzish, imzolash, yakuniylikni kutish |
|Torii |Qo'ng'iroqlar ro'yxati, signallarni o'qish, tranzaksiyalarni taqdim etish |

Rendererga qaraydigan ko'prik aniq ravishda oxirgi nuqta kimligini qabul qilishi va xususiy kalit materialini chegaralar ortida saqlashi kerak. Hozirgi demo yuzi ushbu qisqartirilgan kontraktga teng:

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

Haqiqiy demo natijasida to'liq blokli dalillar va ko'rsatilgan haq ham mavjud. Transaksiya hashini muvaffaqiyat deb bilmang.

## Taklif shartnomasi {#invite-contract}

ID so'rovini aniq `domain.dataspace:meeting` shaklida ishlating. demo `kaigi.universal` ostida qo'ng'iroqlarni hosil qiladi va 32 ta to'latmagan base64url belgilari sifatida kodlangan 24 baytli kriptografik ravishda tasodifiy iltimos siridan foydalanadi .

Kanonik taklifda aniq bitta `call` va bitta `secret` parametrlari mavjud:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

Ilova ichida o'zgarish `#/kaigi` da aynan shunday so'rovdir. Ikkilamchi, noma'lum, bo'sh yoki kanonik bo'lmagan parametrlarni rad eting. Demo yig'ilish muddati `scheduledStartMs` dan keyin 24 soatga o'tishini belgilaydi.

Qo'ng'iroq sirlari mehmonning taklif metadatalarini chifrlaydi. Bu saqlovchi sirdir: uni yozib qo'ymang, analitikaga joylashtirmang yoki katta ma'lumotlar ro'yxatida saqlashingiz mumkin emas. Mehmonning alohida X25519 kalit juftligi mehmon javob signallarini chifrlashadi va u mehmon seansida mahalliy bo'lishi kerak.

## Uchrashuvlar hayotiy davri {#meeting-lifecycle}

### Uy egasi {#host}

1. Tanlangan qopchiq kimligi oxirgi nuqta zanjirining UUID, aniq `NetworkId` va prefiksiga mos kelayotganini tekshirish.
2. Mahalliy ommaviy axborot vositalarini oching va `RTCPeerConnection` ni yaratish.
3. SDP taklifini yarating va ICE yig'ilishining tugashini kuting.
4. Qo'ng'iroq sirini yaratish va Kaigi signal kalitlarini qo'shish.
5. Taklifnomaning sirini taklifni kodlash.
6. `CreateKaigi` ga ega bo'lgan tranzaksiyani ko'tarish va imzolash shaffof, tasdiqlangan rejimda.
7. Taklifni jonli ravishda namoyish etishdan oldin blokning aniqlangan dalillarini kuting.

Hosti seansini ochiq saqlang. Xost hisobining kanonik so'rov imzosi bilan signal yo'nalishini o'rganing, birinchi haqiqiy javobni xost signali kalitidan chiqqanda kodlash va uni `setRemoteDescription` yordamida qo'llash. Ko'proq sahifalar mavjud bo'lganda aniq `nextCursor` ni oldinga olib boring.

### Mehmon {#guest}

1. Taklifni tekshirib ko'ring va tasdiqlang.
2. Umumiy qo'ng'iroqlar to'plamini olib keling va taklif sirini taklifnoma bilan ochib bering.
3. To'xtatilgan, muddati tugagan, jonli yoki shaffof bo'lmagan uchrashuvni rad eting.
4. Mahalliy ommaviy axborot vositalarini ochish, taklifni qo'llash, SDP javobini yaratish va ICE yig'ilishini tugatish.
5. Javobni uy egasining Kaigi ochiq kalitiga shifrlang.
6. `JoinKaigi` qo'shimcha kanonik javob metadatalarni o'z ichiga olgan bitimni ko'tarish va imzolash.
7. Mehmonni qo'shilgan deb ko'rsatishdan oldin blokning dalillarini to'liq tasdiqlang.

### Oxiri {#end}

Faqat uy egasi `EndKaigi` taqdim etishi mumkin. Tugunlar aloqasi va ommaviy axborot vositalarini yopish, imzolangan yo'l-yo'riqni taqdim etish va yakunlanishini kutish; shaffof ishtirokchi `LeaveKaigi`dan foydalanish mumkin. `zk-roster-v1` chiqish birinchi chiqarilgan protokolda zanjirdan tashqarida bo'lib, mahalliy ko'rsatma maxfiylikni qoldiruvchi artefaktlarni rad etadi.

## Ko'rsatkich WebRTC {#manual-webrtc-fallback}

Demo lokal rivojlanish uchun ilg'or signal yo'lini saqlaydi. Bu uy egasi va mehmonlarga ro'z WebRTC taklif paketlarini nusxalash va javob berishga imkon beradi, chunki avtomatik hisobda qo'llab-quvvatlanadigan signallar mavjud emas.

Buni alohida rejim deb hisoblang. U Kaigi yozuvini yaratmaydi, unga qo‘shilmaydi yoki uni yakunlamaydi, tranzaksiyaning yakuniyligini ta’minlamaydi va zanjirdagi jarayonga teng deb taqdim etilmasligi kerak.

## Birlashtirishni sinab ko'ring {#test-the-integration}

Joriy maʼlumotlarni ishga tushiring:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

Sinovlar joriy shaffof profilni, qat'iy takliflarni tahlil qilishni, shifrlangan signallashishni, mahalliy seansning davom etishini va qo'lda qaytishni o'z ichiga oladi. Haqiqiy ommaviy axborot vositasi sinovlari uchun hali ham ikkita moliyalashtirilgan portfel va ikki darcha yoki qurilma kerak; WebRTC va renderer sinovlari kamera, mikrofon, NAT orqali o'tish, kanonik so'rovlarni tasdiqlash yoki jonli tranzaksiya yakunini isbotlamaydi.

To'liq oxirgi nuqta matrisi va CLI hayot davri uchun [Torii nihoya nuqtalarini ko'ring: Kaigi seanslar](/uz/reference/torii-endpoints.md#kaigi-sessions).
