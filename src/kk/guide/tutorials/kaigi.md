---
translation_locale: kk
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Kaigi-ді JavaScript қолданбасына кірістіру {#embed-kaigi-in-a-javascript-app}

Kaigi Iroha уақытында кездесудің өмірлік циклін тіркейді, ал браузер аудио мен видеоны WebRTC арқылы таратады. Блокчейн тізілімі қоңырауды, қатысушылар тізіміндегі өзгерістерді, шифрланған сигнализация метадеректерін және соңғы күйді сақтайды; ол медиа арқылы жіберуші емес.

Бұл нұсқаулық қазіргі [Iroha JavaScript демонстрация](https://github.com/soramitsu/iroha-demo-javascript)-ны ұстанады. Демонстрация бір алғашқы шығарылым қосымшасының профилін жүзеге асырады:

- бір қонақжай және бір қонақ
- `transparent` Kaigi құпиялылық режимі
- `authenticated` бөлме саясаты
- `RevealAfterJoin` желілік теңбақтың сәйкестік мінез-құлығы
- қоңырау метадеректеріндегі шифрланған ұсыныс және аяқталған транзакция метадеректеріндегі шифрланған жауап

Kaigi протоколы сондай-ақ `zk-roster-v1` анықтайды, бірақ қазіргі демонстрация сол дәлел ағынын жасамайды немесе жібермейді. Егер сіздің көпіріңіз қазіргі дәлел келісімшартын толық жүзеге асырмаса, жеке режимді басқаруды көрсетпеңіз.

## Алдын ала шарттар {#prerequisites}

Сізге қажет:

- Node.js 20 немесе одан жаңасы және Rust құралдар жинағы
- a Kaigi-қабілетті Torii API соңғы нүкте
- ақшамен қамтамасыз етілген хост және қонақ есептік жазбаларын бөлу
- әр есеп шотының қол қою кілті артықшылықты әмиян немесе қосымша көпірде
- камера мен микрофонға рұқсат екеу браузер контекстінде

Демоны `file:../iroha/javascript/iroha_js` туыстық тәуелділіктен `@iroha/iroha-js` тұтынады. Демоны орнатпас бұрын Iroha бастапқы кодынан SDK жинаңыз:

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

Таза SDK пакетте талап етілетін Cargo жұмыс кеңістігі жоқ `npm run build:native`, сонда оны қайта құрыңыз Iroha дереккөз кодының жұмыс көшірмесінен кейін SDK өзгерістер. Құжатталған SDK көз pinned болып тұр [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## API түйін нүктесін тексеріңіз {#check-the-endpoint}

Қоғамдық Taira тест желісі үшін, алдымен Torii қолжетімділігін тексеріңіз:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

Бұл сұраулар тек Torii және оның жарнамаланған API құжаты қолжетімді екенін дәлелдейді. Олар нақты Kaigi қоңырау бар екенін немесе сіздің әмияныңыз транзакцияларды жіберуі мүмкін екенін дәлелдемейді.

Рұқсат етілмеген `curl` сұрауларымен `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}` немесе `/v1/kaigi/relays/health` жолдарын зерттемеңіз. Сол үш жолға рұқсат берілген оператордың қолтаңбасы қажет. Релей оқиға ағыны үшін бір протокол-стандартты нақты-желі есептік жазбасының қолтаңбасы қажет.

Демонстрацияда Параметрлерді ашып, Torii URL енгізіңіз де, API ұштын табылуына UUID тізбекті, дәл `NetworkId` және желі префиксін жүктеуге рұқсат етіңіз. Жазу көпірі барлық үш мәнді таңдалған API соңғы нүктеге байланыстыруы тиіс; ешқашан тізбектен UUID немесе префикстен `NetworkId` жасамаңыз.

## Бағыт және аутентификация моделі {#route-and-authentication-model}

Kaigi жазбалары – бұл қарапайым дитау тігілген және қол қойылған транзакциялар ішіндегі нұсқаулар. Оларды `POST /v1/pipeline/transactions` арқылы жіберіңіз де, соңғы блок дәлелін күтіңіз.

Қолданбаның оқу көрсеткіштері мыналар:

|Маршрут|Аутентификация|
| ----------------------------------- | --------------------------------------- |
| `/v1/kaigi/calls/{call_id}`         |қоғамдық|
| `/v1/kaigi/calls/{call_id}/signals` |бір ғана протокол-стандарт дәл желілік есеп тіркелім сұранысы|
| `/v1/kaigi/calls/{call_id}/events`  |бір ғана протокол-стандарт дәл желілік есеп тіркелім сұранысы|

JavaScript SDK мұны `getKaigiCall` және `listKaigiCallSignals` ретінде ашады. Сигнал тізімі дәл курсор бойынша беттілеуді пайдаланады. Қайтарылған курсорды өзгеріссіз қайта пайдаланыңыз; оны ығысу немесе тек уақыт белгісі бар жалғастырумен алмаңыз.

## Рендерерде сыртта қол қоюды жалғастырыңыз {#keep-signing-outside-the-renderer}

Интегралды үш шекараға бөліңіз:

|Шекара|Жауапкершілік|
| ----------------- | -------------------------------------------------------------------- |
|Рендерер|кездесу формасы, шақыру сілтемесі, медиа басқару элементтері, WebRTC ұсыныстар мен жауаптар|
|Артықшылықты көпір|кілтке қол жеткізу, ақы мөлшерін бағалау, нұсқаулық жасау, қол қою, соңғыку күтулер|
| Torii             |қоңырау жазбасы, аяқталған сигнал оқу, транзакция жіберу|

Рендерлеушіге бағытталған көпір API соңғы нүктесінің жеке сәйкестендіруін нақты қабылдауы және жеке кілт материалын шекарадан тыс ұстауы тиіс. Қазіргі демонстрациялық бет осы қысқартылған келісімге тең:

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

Шынайы демонстрациялық нәтиже сондай-ақ аяқталған блоктың дәлелі мен кез келген алынып тасталған төлемді қамтиды. Транзакцияның криптографиялық хэшін тек өзімен ғана сәтті деп қабылдамаңыз.

## Шақыру шарты {#invite-contract}

Тура `domain.dataspace:meeting` форматындағы қоңырау идентификаторын пайдаланыңыз. Демо-нұсқа `kaigi.universal` бойынша қоңыраулар жасайды және 32 таңбаланған base64url форматындағы 24 байттық криптографиялық кездейсоқ шақыру құпиясын пайдаланады.

Бір протокол-стандарт шақыру дәл бір `call` және бір `secret` параметрін қамтиды:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

Қосымшадағы ауыспалы нұсқа дәл сол сұраныс болып табылады `#/kaigi`-де. Қайталанатын, белгісіз, бос, толтырылған немесе бір протокол стандартты емес параметрлерді қабылдамаңыз. Демонстрация `scheduledStartMs`-ден кейін кездесудің жарамдылық мерзімін 24 сағатқа орнатады.

Шақыру құпиясы хосттың ұсыныс метадеректерін шифрдан шығарады. Бұл тасымалдаушы құпиясы: оны тізілімге жазбаңыз, аналитикаға қоймаңыз немесе блокчейн есептік метадеректерінде сақтамаңыз. Хосттың жеке X25519 кілт жұбы қонақ жауап сигналдарын шифрдан шығарады және хост сеансында жергілікті түрде қалуға тиіс.

## Кездесу өмірлік циклі {#meeting-lifecycle}

### Көрсетуші {#host}

1. Таңдалған әмиянның сәйкестігін API нүктесінің тізбегі UUID, нақты `NetworkId` және префиксімен тексеріңіз.
2. Жергілікті медианы ашып, `RTCPeerConnection` жасаңыз.
3. SDP ұсынысын жасаңыз және ICE жиналысының аяқталуын күтіңіз.
4. Шақыру құпиясын және хост Kaigi сигнал кілт жұбын жасаңыз.
5. Ұсынысты шақыру құпиясымен шифрлаңыз.
6. Ашық, аутентификацияланған режимде `CreateKaigi` қамтылған транзакцияны алу үшін төлем бағасын бағалауды алыңыз және қол қойыңыз.
7. Шақыруды тікелей көрсету алдында аяқталған блоктың дәлелін күтіңіз.

Хост сеансын ашық ұстаңыз. Хост есептік жазбасының бір ғана протокол стандартты сұрау қолтаңбасымен сигнал маршрутын тексеріңіз, бірінші жарамды жауапты хост сигнал кілтімен шеше отырып, оны `setRemoteDescription` арқылы қолданыңыз. Қосымша беттер бар кезде `nextCursor` элементін дәл сол күйінде ары қарай өткізіңіз.

### Қонақ {#guest}

1. Дәл шақыруды талдап, тексеріңіз.
2. Қоғамдық қоңырау жазбасын алып, оны шақыру құпиясымен дешифрлаңыз.
3. Аяқталған, мерзімі өткен, белсенді емес немесе мөлдір емес кездесуді қабылдамау.
4. Жергілікті медиа файлды ашып, ұсынысты қолданып, SDP жауабын жасап, ICE жинауды аяқтаңыз.
5. Жауапты хосттың Kaigi ашық кілтіне шифрлаңыз.
6. Алым бағасын бағалап, `JoinKaigi` және бір протокол стандартты жауап метадеректерін қамтитын транзакцияға қол қойыңыз.
7. Қонақты қосылған деп көрсету алдында бекітілген блок дәлелін күтіңіз.

### Соңы {#end}

Тек қонақжай ғана `EndKaigi` ұсына алады. Желілік әріптес байланысын және медиа жолдарын жауып, қол қойылған нұсқауды ұсыныңыз және аяқталуын күтіңіз. Транспарентті қатысушы `LeaveKaigi` пайдалана алады; `zk-roster-v1` кету бірінші нұсқадағы протоколда офф-чейн болып табылады және түпнұсқа нұсқаулық құпиялықтан кету артефактілерін қабылдамайды.

## Қолмен WebRTC Қосымша нұсқа {#manual-webrtc-fallback}

Демонстрациялық нұсқа жергілікті әзірлеме үшін Күрделі сигнал беру жолын сақтайды. Ол хост пен қонаққа блокчейн тіркеу тізілімі арқылы автоматты түрде сигнал беру мүмкін болмаған кезде шикі WebRTC ұсыныс және жауап пакеттерін көшіруге мүмкіндік береді.

Оны басқа режим ретінде қарастырыңыз. Бұл Kaigi жазбасын жасамайды, оған қосылмайды немесе аяқтамайды, транзакцияның соңғылігін қамтамасыз етпейді және оны блокчейн ағынымен тең деп көрсетуге болмайды.

## Интеграцияны тексеру {#test-the-integration}

Ағымдағы фокусталған демонстрациялық жинақтарды іске қосыңыз:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

Сынақтар қазіргі мөлдір профильді, қатаң шақыруды талдауды, шифрланған сигналдануды, жергілікті сессияны сақтау мүмкіндігін және қолмен қалпына келтіруді қамтиды. Шынайы медиа сынағы әлі екі қаржыландырылған әмиян мен екі терезе немесе құрылғыны талап етеді; Мәктептелген WebRTC және рендерлеу тесттері камераны, микрофонды, NAT өтуін, бір протокол-стандартты сұрау аутентификациясын немесе тірі транзакцияның аяқталуын дәлелдемейді.

Толық API соңғы нүкте матрицасы және CLI өмірлік циклі үшін [Torii API соң нүктелері: Kaigi сессиялар](/kk/reference/torii-endpoints.md#kaigi-sessions) қараңыз.
