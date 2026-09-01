---
translation_locale: ka
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# შეყვანილი Kaigi JavaScript აპლიკაციაში {#embed-kaigi-in-a-javascript-app}

Kaigi აღწერს შეხვედრის სიცოცხლის ციკლს Iroha-ზე, ხოლო ბრაუზერი ატარებს აუდიო და ვიდეოს WebRTC-ზე. ბლოკჩეინის რეესტრი ინახავს ზარს, სიაში მუტაციებს, კოდირებულ სიგნალების მეტამონაცემებს და საბოლოო სტატუსს; ეს არ არის მედიის რელიე.

ეს სახელმძღვანელო მოჰყვება მიმდინარე [Iroha JavaScript დემო](https://github.com/soramitsu/iroha-demo-javascript). დემო ახორციელებს ერთ-ერთი პირველი გამოშვების აპლიკაციის პროფილის:

- ერთი ჰოსტი და ერთი სტუმარი
- `transparent` Kaigi კონფიდენციალურობის რეჟიმი
- `authenticated` ოთახის პოლიტიკა
- `RevealAfterJoin` ქსელის კვანძთა იდენტობის ქცევა
- დაშიფვრილი შეთავაზება ზარის მეტამონაცემებში და დაშიფრული პასუხი საბოლოო ტრანზაქციის მეტამონაცემებზე

Kaigi პროტოკოლი ასევე განსაზღვრავს `zk-roster-v1`, მაგრამ მიმდინარე დემო არ ქმნის ან წარადგენს ამ მტკიცებულების ნაკადს. არ წარმოადგინოთ კონტროლი კერძო რეჟიმში, თუ თქვენი ხიდი არ ახორციელებს სრულ მიმდინარე მტკიცებულებების ხელშეკრულებას.

## წინაპირობები {#prerequisites}

თქვენ გჭირდებათ:

- Node.js 20 ან ახალი და Rust ინსტრუმენტების ჯაჭვი.
- Kaigi-სუნებრი Torii API საბოლოო წერტილი;
- განცალკევებული დაფინანსებული მასპინძლისა და სტუმრების ანგარიშები
- თითოეული ანგარიშის ხელმოწერის გასაღები პრივილეგირებულ საფულეში ან აპლიკაციის ხიდში
- კამერა და მიკროფონის ნებართვა ორივე ბრაუზერის კონტექსტში

დემო მოიხმარს `@iroha/iroha-js` ძმათა დამოკიდებულების `file:../iroha/javascript/iroha_js` მეშვეობით. შექმენით SDK Iroha წყაროდან, სანამ დაამონტაჟებთ დემოს:

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

სუფთა SDK პაკეტი არ შეიცავს ტვირთის სამუშაო სივრცეს, რომელიც მოითხოვს: `npm run build:native`, ასე რომ, აღადგინეთ იგი Iroha წყარო კოდის სამუშაო ასლი შემდეგ SDK დოკუმენტირებული ცვლილებები SDK წყარო არის ჩაკეტილი [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## შეამოწმეთ API საბოლოო წერტილი {#check-the-endpoint}

საჯარო Taira ტესტის ქსელისათვის, პირველ რიგში შეამოწმეთ Torii ხელმისაწვდომობა:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

ეს მოთხოვნები მხოლოდ ადასტურებს, რომ Torii და მისი რეკლამირებული API დოკუმენტი ხელმისაწვდომია. ისინი არ ადასტურებენ, რომ არსებობს კონკრეტული Kaigi ზარი ან რომ თქვენი საფულე შეიძლება წარადგინოს ოპერაციები.

არ შეამოწმოთ `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}` ან `/v1/kaigi/relays/health` ხელმოწერის გარეშე `curl` თხოვნით. ეს სამი მარშრუტი მოითხოვს ნებადართული ოპერატორის ხელმოწერას. რელე მოვლენების ნაკადი მოითხოვს კანონიკური ზუსტ ქსელის ანგარიშზე ხელმოწერს.

დემოში, გახსენით პარამეტრები, შეიყვანეთ Torii URL და მოდით API-ის საბოლოო წერტილის აღმოჩენა ატვირთოს ჯაჭვი UUID, ზუსტი `NetworkId` და ქსელის პრეფისს. წერის ხიდმა სამივე მნიშვნელობა უნდა დააკავშიროს შერჩეულ API საბოლოო წერტილზე; არასოდეს შეიქმნას `NetworkId` ჯაჭვიდან UUID ან პრეფექსიდან.

## მარშრუტი და ავტორიზაციის მოდელი {#route-and-authentication-model}

Kaigi წერილი არის ინსტრუქციები ჩვეულებრივი კოტირებული და ხელმოწერილი ოპერაციების შიგნით. წარუდგინეთ ისინი `POST /v1/pipeline/transactions` და ველოდოთ საბოლოო ბლოკის მტკიცებულებებს.

თხოვნაში წერია:

|რუტა |ავთენტიფიკაცია|
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}` |საზოგადოება |
|`/v1/kaigi/calls/{call_id}/signals` |კანონიკური ზუსტი ქსელის ანგარიშის მოთხოვნა |
|`/v1/kaigi/calls/{call_id}/events` |კანონიკური ზუსტი ქსელის ანგარიშის მოთხოვნა |

JavaScript SDK ამჟღავნებს ისინი როგორც `getKaigiCall` და `listKaigiCallSignals`. სიგნალის ჩამონათვალი იყენებს ზუსტ კურსორის გვერდს. კვლავ გამოიყენეთ დაბრუნებული კურსორი უცვლელად; არ შეცვალოთ იგი ოფსეტით ან მხოლოდ დროის მარკის გაგრძელებით.

## ხელი მოაწერეთ მფარველის გარეთ {#keep-signing-outside-the-renderer}

ინტეგრაციის დაყოფა სამ საზღვრად:

|საზღვარი |პასუხისმგებლობა |
| ----------------- | -------------------------------------------------------------------- |
|რენდერი |შეხვედრის ფორმა, მიწვევის ბმული, მედიის კონტროლი, WebRTC შეთავაზებები და პასუხები |
|პრივილეგირებული ხიდი.|საკვანძო წვდომა, საფასურის ფასის შეფასება, ინსტრუქციის შექმნა, ხელმოწერა, საბოლოო მოლოდინი |
|Torii |ზარის ჩანაწერი, დასრულებული სიგნალის წაკითხვა, ტრანზაქციის წარდგენა |

რენდერის მიმართულების ხიდმა უნდა მიიღოს API საბოლოო წერტილის იდენტობა მკაფიოდ და შეინახოს კერძო გასაღები მასალა საზღვრებს მიღმა. მიმდინარე დემო ზედაპირი ექვივალენტურია ამ შემცირებული კონტრაქტის:

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

რეალური დემო შედეგი ასევე შეიცავს საბოლოო ბლოკის მტკიცებულებებს და ნებისმიერი მითითებული საფასური. არ განიხილოთ მხოლოდ ტრანზაქციის კრიპტოგრაფიული ჰეში წარმატებად.

## მოწვევის კონტრაქტი {#invite-contract}

გამოიყენეთ ზარის ID ზუსტად `domain.dataspace:meeting` ფორმით. დემო გენერირებს ზარებს `kaigi.universal` ქვეშ და იყენებს 24-ბაიტიან კრიპტოგრაფიულად შემთხვევითი მოწვევის საიდუმლოს, რომელიც კოდირებულია 32 შევსების გარეშე base64url ხასიათის მიხედვით.

კანონიკური მოწვევა შეიცავს ზუსტად ერთ `call` და ერთ `secret` პარამეტრს:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

აპლიკაციაში ჩამორთმევა არის იგივე ზუსტი მოთხოვნა `#/kaigi`. უარყოფითი ორმაგი, უცნობი, ცარიელი, შეფუთული ან არაკანონიკური პარამეტრები. დემო ადგენს შეხვედრის ვადიანობას 24 საათზე `scheduledStartMs`.

მოწვევის საიდუმლო დეკრიფტებს მასპინძლის შეთავაზების მეტამონაცემებს. ეს არის მატარებლის საიდუმლოა: არ დაიწეროთ ის, მოათავსეთ ანალიტიკაში ან შეინახეთ იგი ბლოკჩეინის რეესტრის მეტამონაცემებში. მასპინძლის ცალკეული X25519 საკვანძო წყვილი დეკრიფრს სტუმრის პასუხის სიგნალებს და უნდა დარჩეს ადგილობრივი მასპინდის სესიისთვის.

## შეხვედრის ციკლი {#meeting-lifecycle}

### ჰოსტი {#host}

1. შეამოწმეთ, რომ შერჩეული საფულე იდენტობა შეესაბამება API საბოლოო წერტილის ჯაჭვს UUID, ზუსტად `NetworkId`, და პრეფიქსს.
2. გახსენით ადგილობრივი მედია და შექმენით `RTCPeerConnection`.
3. შეიქმნას SDP შეთავაზება და ველოდოთ დასრულდეს ICE შეკრება.
4. გენერირება მოწვევის საიდუმლო და ჰოსტი Kaigi სიგნალის საკვანძო წყვილი.
5. დაშიფრეთ შეთავაზება მოწვევის საიდუმლოთი.
6. მიიღეთ საფასურის ფასის შეფასება და ხელი მოაწერეთ ტრანზაქცია, რომელიც შეიცავს `CreateKaigi` გამჭვირვალე, დამოწმებული რეჟიმში.
7. ველოდოთ საბოლოო ბლოკის მტკიცებულებებს, სანამ მოწვევას ცოცხლად აჩვენებთ.

შეინახეთ ღია ჰოსტი სესიის. გამოკითხე სიგნალის მარშრუტი ჰოსტინგის ანგარიშის კანონიკური მოთხოვნის ხელმოწერით, გაშიფვრა პირველი ბერადი პასუხი მასპინძლის სიგნელის გასაღებით და გამოიყენეთ იგი `setRemoteDescription`. გადაიტანეთ `nextCursor` ზუსტად მაშინ, როდესაც უფრო მეტი გვერდია ხელმისაწვდომი.

### სტუმარი {#guest}

1. ჟრჟრთნეთ და შეამოწმეთ ზუსტი მოწვევა.
2. მიიღეთ ზარის საჯარო ჩანაწერი და მისი შეთავაზება მოწვევის საიდუმლოს მეშვეობით გაშიფრეთ.
3. უარი თქვას დასრულებულ, ამოწურულ, არარსებობელ ან გამჭვირვალე შეხვედრაზე.
4. გახსენით ადგილობრივი მედია, გამოიყენეთ შეთავაზება, შეიქმნათ პასუხი SDP, და დასრულდეს შეკრება ICE
5. გაშიფვრა პასუხი მასპინძლის საჯარო გასაღების Kaigi.
6. მიიღეთ ფასის შეფასება და ხელი მოაწერეთ ტრანზაქციას, რომელიც `JoinKaigi`-სა და პასუხის კანონიკურ მეტამონაცემებს შეიცავს.
7. ველოდოთ საბოლოო მტკიცებულებებს ბლოკზე, სანამ სტუმარს გაჩვენებთ, როგორც შემერთებულს.

### დასასრული {#end}

მხოლოდ ჰოსტს შეუძლია წარადგინოს `EndKaigi`. დახურეთ ქსელის კვანძული კავშირი და მედია ტრეკები, წარადგინეთ ხელმოწერილი ინსტრუქცია და დაველოდოთ საბოლოო. გამჭვირვალე მონაწილე შეიძლება გამოიყენოს `LeaveKaigi`; პირველი გამოშვების პროტოკოლში `zk-roster-v1` წასვლა არ არის ჯაჭვიდან და ადგილობრივი ინსტრუქცია უარყოფს კონფიდენციალურობის შესახებ არსებულ ნივთებს.

## სახელმძღვანელო WebRTC ჩამოვარდნა {#manual-webrtc-fallback}

დემო ინარჩუნებს ადგილობრივი განვითარებისთვის მოწინავე სიგნალიზაციის გზას. იგი საშუალებას აძლევს ჰოსტს და სტუმრებს ასახელონ ნედლი WebRTC შეთავაზება და პასუხი პაკეტები, როდესაც ავტომატური მხარდაჭერა ბლოკჩეინის რეესტრის სიგნალი არ არის ხელმისაწვდომი.

შეხედეთ ამას, როგორც განსხვავებულ რეჟიმს. ის არ ქმნის, შეუერთდება ან მთავრობს Kaigi ჩანაწერს, არ უზრუნველყოფს ტრანზაქციის საბოლოოობას და არ უნდა იყოს წარმოდგენილი, როგორც ეკვივალენტური ქსელზე ნაკადისათვის.

## შეამოწმეთ ინტეგრაცია {#test-the-integration}

განახორციელეთ მიმდინარე კონცენტრირებული დემო სუიტები:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

ტესტები მოიცავს მიმდინარე გამჭვირვალე პროფილს, მკაცრი მოწვევის ანალიზს, დაშიფვრულ სიგნალებს, ადგილობრივ სესიის გაგრძელებასა და სახელმძღვანელო ჩავარდნას. რეალური მედია-ტესტი ჯერ კიდევ საჭიროებს ორ ფინანსურ საფულეს და ორი ფანჯრის ან მოწყობილობას; WebRTC და რენდერის ტესტები არ ადასტურებს კამერას, მიკროფონს, NAT გადაადგილებას, კანონიკურ მოთხოვნის ავთენტიფიცირებას ან პირდაპირი ტრანზაქციის საბოლოო შედეგს.

API საბოლოო წერტილის მატრიცისა და CLI სიცოცხლის ციკლის შესახებ იხილეთ [Torii API საბოლოო წერტილები: Kaigi სესიები](/ka/reference/torii-endpoints.md#kaigi-sessions).
