---
translation_locale: ba
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Kaigi ҡушымтаһына JavaScript ҡушылған {#embed-kaigi-in-a-javascript-app}

Kaigi осрашыуының ғүмере циклын Iroha шул уҡ ваҡытта браузер аудио һәм видео алып бара WebRTC. Букмекер шылтыратыуҙы, исемлек мутацияларын, шифрланған сигналдар метамәғлүмәттәрен һәм һуңғы статусты һаҡлай; ул медиа релейы түгел.

Был дәреслек хәҙерге [Iroha JavaScript демо](https://github.com/soramitsu/iroha-demo-javascript) буйынса үткәрелә. Демонстрацияла беренсе тапҡыр сығарылған ҡушымта профиле тормошҡа ашырыла:

- бер хужа һәм бер ҡунаҡ
- `transparent` Kaigi хосусилыҡ режимы
- `authenticated` бүлмә полисы
- `RevealAfterJoin` Яҡындары менән танышыу тәртибе
- саҡырыу метамәғлүмәттәрендә шифрланған тәҡдим һәм commit ителгән транзакция метамәғлилдәрендә шифрлы яуап.

Kaigi протоколы шулай уҡ `zk-roster-v1` билдәләй, әммә хәҙерге демо был иҫбатлау ағымды барлыҡҡа килтермәй йәки тапшырмай. Әгәр һеҙҙең күпер тулыһынса ғәмәлдәге иҫбатлау килешеүе үтәлмәй икән, шәхси режимда идара итеүҙе күрһәтмәгеҙ.

## Шарттар {#prerequisites}

Һеҙгә кәрәк:

- Node.js 20 йәки яңы һәм Rust ҡорамалдар сылбырлы
- Kaigi‐ҡа һәләтле Torii һуңғы пункт
- айырым финансланған хужа һәм ҡунаҡ иҫәбе
- привилегированный кошелек йәки ҡушымта күперендә һәр иҫәбенең ҡултамғалау асҡысы
- камера һәм микрофон рөхсәттәре ике браузер контекста ла

Демонстрация `@iroha/iroha-js`-тың `file:../iroha/javascript/iroha_js` локаль бәйлелеген ҡуллана. Демонстрацияны ҡуйыр алдынан SDK-ны Iroha сығанағынан төҙөгөҙ:

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

Таҙа SDK пакетта йөк өсөн кәрәкле эш урыны юҡ `npm run build:native`, Шулай итеп, уны яңынан Iroha сығанаҡ иҫәбен алыуҙан һуң SDK үҙгәрештәр. SDK сығанағы ҡуйылған [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## Ахыр сиккә иғтибар итегеҙ . {#check-the-endpoint}

Йәмәғәт Taira тест селтәре өсөн, иң тәүҙә Torii ға барып етеүсәнлеген тикшерегеҙ:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

Был һорауҙар Torii һәм уның реклама ителгән API документына барып етеү мөмкинлеген генә иҫбатлай. Улар Kaigi саҡырыуының булыуын йәки аҡса янсығығыҙ транзакциялар тапшыра ала икәнен иҫбат итмәй.

Эҙләмәгеҙ `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, йәки `/v1/kaigi/relays/health` ҡултамғаланмаған `curl` Был өс маршрут өсөн рөхсәт ителгән операторҙың ҡултамғаһы кәрәк. Реле ваҡиғалар ағымы каноник теүәл селтәр иҫәбенә ҡултамғаһын талап итә.

Демонстрацияла, Һайлауҙарҙы асығыҙ, Torii URL индерегеҙ һәм һуңғы нөктәләрҙе асыҡлау өсөн UUID сылбырҙы, аныҡ `NetworkId` һәм селтәр префиксын йөкмәтергә рөхсәт итегеҙ. Яҙа торған күпер һайланған һуңғы нөккәгә бөтә өс ҡиммәтте лә бәйләргә тейеш; бер ҡасан да `NetworkId` сылбырҙан йәки префикстан UUID төҙөлмәһен.

## Юл һәм аутентификация моделе {#route-and-authentication-model}

Kaigi яҙмалары ябай комиссия иҫәбе һәм ҡул ҡуйылған транзакциялар эсендә күрһәтмәләр. уларҙы `POST /v1/pipeline/transactions` аша тапшырырға һәм һуңғы блок иҫбатлау көтә.

Ғаризала түбәндәгеләр яҙылған:

|Маршрут |Ышандырыу |
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}` |йәмәғәтселек |
|`/v1/kaigi/calls/{call_id}/signals` |кананик теүәл селтәр иҫәбенә ғариза |
|`/v1/kaigi/calls/{call_id}/events` |кананик теүәл селтәр иҫәбенә ғариза |

JavaScript SDK уларҙы `getKaigiCall` һәм `listKaigiCallSignals` тип асыҡлай. Сигнал исемлеге курсорҙың теүәл битләүен ҡуллана. Ҡайтарылған курсорҙы үҙгәрешһеҙ ҡабаттан ҡулланығыҙ; уны оффсет йәки ваҡыт тамғаһы менән генә дауам итеү менән алмаштырмағыҙ.

## Киреһенсә , ҡултамғалар ҡуйығыҙ {#keep-signing-outside-the-renderer}

Интеграцияны өс сиккә бүлеү:

|Сиктәре |Яуаплылыҡ |
| ----------------- | -------------------------------------------------------------------- |
|Рендерер |осрашыу формаһы, саҡырыу һылтанмаһы, киң мәғлүмәт саралары контроле, WebRTC тәҡдимдәр һәм яуаптар |
|Сифатлы күпер |Ключлы инеү, түләү ставкаһы, инструкциялар төҙөү, ҡул ҡуйыу, тамамлау ваҡытын көтөп |
|Torii |шылтыратыу рекорды, тапшырылған сигнал уҡый, транзакция тапшырыу |

Рендерлаусыға ҡараған күпер асыҡтан-асыҡ һуңғы пункттың идентификацияһын ҡабул итергә тейеш һәм шәхси асҡыс материалын сик артында һаҡларға тейеш.

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

Реаль demo һөҙөмтәһе шулай уҡ finalized block evidence һәм quote ителгән fee-ны үҙ эсенә ала. Transaction hash-ты ғына уңыш тип иҫәпләмәгеҙ.

## Килешмәне саҡырыу {#invite-contract}

Зинһар , шылтыратығыҙ . ID туранан-тура `domain.dataspace:meeting` формаһы. демо түбәндәге шылтыратыуҙар тыуҙыра `kaigi.universal` һәм криптографик рәүештә 24 байтлы осраҡлы саҡырыу серен ҡуллана, ул 32 төҫлө base64url хәрефтәре булып кодлана.

Каноник саҡырыу бер `call` һәм бер `secret` параметрҙы үҙ эсенә ала:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

Ҡулланма эсендә кире ҡайтыу `#/kaigi` буйынса тап шул уҡ һорау. Дупликат, билдәһеҙ, буш, ҡапланған йәки каноник булмаған параметрҙарҙы кире ҡағыу. Демо осрашыуҙың тамамланыуын `scheduledStartMs`ҙан һуң 24 сәғәткә ҡуя.

Саҡырыу сере host offer metadata-һын шифрҙан аса. Ул bearer secret: уны log-ҡа яҙмағыҙ, analytics-ҡа индермәгеҙ һәм ledger metadata-һында һаҡламағыҙ. Host-тың айырым X25519 key pair-ы guest answer signal-дарын шифрҙан аса һәм host session эсендә генә локаль ҡалырға тейеш.

## Осрашыуҙың ғүмере {#meeting-lifecycle}

### Ҡунаҡсы {#host}

1. Һайланған аҡса янсығы идентификацияһының UUID, `NetworkId` һәм префикс менән тура килеүен тикшер.
2. Урындағы киң мәғлүмәт сараларын асығыҙ һәм `RTCPeerConnection` булдырығыҙ.
3. SDP тәҡдимен төҙөгөҙ һәм ICE йыйылышын тамамлауҙы көтөгөҙ.
4. саҡырыу серен һәм хост Kaigi сигнал асҡыс парын булдырыу.
5. Саҡырыуҙың серен саҡырыу менән шифрлағыҙ.
6. `CreateKaigi` йөкмәткеле транзакцияны асыҡ һәм раҫланған режимда иҫкә алыу һәм ҡул ҡуйыу.
7. Шылтыратыуҙы туранан-тура күрһәтер алдынан, блок иҫбатлауын көтөгөҙ.

Хост сессияларын асыҡ тотоғоҙ. Хост аккаунтының каноник һорауға ҡултамғаһы менән сигнал маршрутын тикшерегеҙ, Ҡунаҡ сигналы асҡысы менән тәүге дөрөҫ яуапты шифрлау һәм уны ҡулланыу `setRemoteDescription`. Алып барыу `nextCursor` өҫтәмә биттәр бар саҡта уҡ алға.

### Ҡунаҡ {#guest}

1. Саҡырыуҙы тикшереп ҡарағыҙ һәм раҫлағыҙ.
2. Халыҡ-ара шылтыратыуҙар яҙмаһын алып килеп, саҡырыу серҙәре менән уның тәҡдимдәрен шифрлағыҙ.
3. Берәй осрашыуҙың тамамланыуын, ваҡыты бөткәнен, туранан-тура булмағанын йә үтә күренмәүен кире ҡаҡ.
4. Урындағы киң мәғлүмәт сараларын асығыҙ, тәҡдимде ҡулланығыҙ, SDP яуапты булдырығыҙ һәм ICE йыйыуҙы тамамлағыҙ.
5. Хосттың Kaigi асыҡ асҡысына яуапты шифрлау.
6. `JoinKaigi` һәм каноник яуаптың метамәғлүмәттәре булған транзакцияны комиссия иҫәбе итеп ҡул ҡуйығыҙ.
7. Guest-ты joined итеп күрһәтер алдынан finalized block evidence-ты көтөгөҙ.

### Ахырҙа {#end}

Ҡунаҡсы ғына `EndKaigi` тапшыра ала. Пир бәйләнешен һәм медиа-тректарҙы яба, ҡул ҡуйылған инструкцияны тапшыра һәм тамамланыуын көтә. Асыҡ ҡатнашыусы `LeaveKaigi` ҡуллана ала; `zk-roster-v1` сығанағы беренсе сығарыу протоколында сылбырҙан ситтә, һәм урындағы инструкция һаҡсыллыҡ ҡалдырып артефакттарҙы кире ҡаға.

## ҡулланма WebRTC {#manual-webrtc-fallback}

Демола урындағы үҫеш өсөн алдынғы сигнализация юлы һаҡлана. Ул хостҡа һәм ҡунаҡҡа сей WebRTC тәҡдимдәрен күсереп яҙырға һәм яуаптар бирергә мөмкинлек бирә, әгәр автоматик иҫәп яҙмаһы ярҙамында сигналдар булмай.

Ул Kaigi яҙмаһын барлыҡҡа килтермәй, берләштермәй йәки тамамламай, транзакцияның йомғаҡлауын тәьмин итмәй һәм ул сылбырҙағы ағым менән тигеҙ тип күрһәтелмәҫ.

## Интеграцияны һынағыҙ {#test-the-integration}

Хәҙерге йүнәлешле демо-суиттарҙы үтәгеҙ:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

Һынауҙар хәҙерге үтә күренмәле профилде, тығыҙ саҡырыу анализлауҙы, шифрланған сигнал биреүҙе, локаль сессияны дауам итеүҙе һәм ҡулдан күсереүҙе үҙ эсенә ала. Ысын медиа тесты өсөн ике аҡсалата кошелек һәм ике тәҙрә йәки ҡоролма талап ителә; WebRTC һәм рендерлаусы һынауҙар камераны, микрофонды, NAT аша сығыуҙы, каноник һорауға аутентификацияны йәки тере транзакцияның тамамланыуын иҫбат итмәй.

CLI матрицаһы һәм йәшәү циклы өсөн [Torii һуңғы пункттарын ҡарағыҙ: Kaigi сессиялары](/ba/reference/torii-endpoints.md#kaigi-sessions).
