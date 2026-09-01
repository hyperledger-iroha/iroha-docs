---
translation_locale: ru
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Встроить Kaigi в приложение JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi записывает жизненный цикл встречи на Iroha, в то время как браузер передает аудио и видео через WebRTC. Распределенный реестр блокчейна хранит звонок, изменения в списке участников, зашифрованные сигнальные метаданные и окончательный статус; он не является медиапосредником.

Этот учебник следует текущему [Iroha JavaScript демонстрация](https://github.com/soramitsu/iroha-demo-javascript). Демонстрация реализует один профиль приложения первой версии:

- один хозяин и один гость
- `transparent` Kaigi режим конфиденциальности
- `authenticated` политика комнаты
- `RevealAfterJoin` поведение идентичности сетевого узла
- зашифрованное предложение в метаданных вызова и зашифрованный ответ в метаданных окончательной транзакции

Протокол Kaigi также определяет `zk-roster-v1`, но текущая демонстрация не генерирует и не отправляет этот поток доказательств. Не показывайте элемент управления в режиме конфиденциальности, если ваш мост не реализует полный текущий контракт доказательств.

## Предварительные требования {#prerequisites}

Вам нужно:

- Node.js 20 или новее и Rust набор инструментов
- конечная точка API, поддерживающая Kaigi Torii
- разделить финансируемые учетные записи хоста и гостя
- ключ подписи каждого аккаунта в привилегированном кошельке или мосте приложения
- разрешение на использование камеры и микрофона в обоих контекстах браузера

Демонстрационная версия использует `@iroha/iroha-js` через зависимость-родственника `file:../iroha/javascript/iroha_js`. Соберите SDK из исходного кода Iroha перед установкой демонстрационной версии:

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

Чистый SDK пакет не содержит рабочее пространство Cargo, требуемое для `npm run build:native`, так что перестрой это в Iroha рабочая копия исходного кода после SDK изменения. Документированные SDK источник закреплён на [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## Проверьте конечную точку API {#check-the-endpoint}

Для общедоступной тестовой сети Taira сначала проверьте доступность Torii:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

Эти запросы доказывают только то, что Torii и его рекламируемый документ API доступны. Они не доказывают существование конкретного вызова Kaigi или того, что ваш кошелек может отправлять транзакции.

Не проверяйте `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}` или `/v1/kaigi/relays/health` с помощью неподписанных запросов `curl`. Для этих трёх маршрутов требуется подпись оператора из белого списка. Поток событий ретрансляции требует канонической подписи аккаунта в точной сети.

В демо откройте Настройки, введите Torii URL и позвольте обнаружению конца API загрузить цепочку UUID, точный `NetworkId` и сетевой префикс. Записывающий мост должен связывать все три значения с выбранной конечной точкой API; никогда не создавайте `NetworkId` из цепочки UUID или префикса.

## Маршрут и модель аутентификации {#route-and-authentication-model}

Kaigi записи — это инструкции внутри обычных цитированных и подписанных транзакций. Отправляйте их через `POST /v1/pipeline/transactions` и ждите подтверждения финализированного блока.

Заявления приложения таковы:

|Маршрут|Аутентификация|
| ----------------------------------- | --------------------------------------- |
| `/v1/kaigi/calls/{call_id}`         |публичный|
| `/v1/kaigi/calls/{call_id}/signals` |канонический запрос учетной записи точной сети|
|`/v1/kaigi/calls/{call_id}/events`|канонический запрос учетной записи точной сети|

JavaScript SDK показывает их как `getKaigiCall` и `listKaigiCallSignals`. Список сигналов использует точную пагинацию курсора. Повторно используйте возвращённый курсор без изменений; не заменяйте его на смещение или продолжение только по отметке времени.

## Продолжайте подписывать вне рендерера {#keep-signing-outside-the-renderer}

Разделите интегрирование на три границы:

|Граница|Ответственность|
| ----------------- | -------------------------------------------------------------------- |
|Рендерер|форма встречи, ссылка-приглашение, элементы управления медиа, WebRTC предложения и ответы|
|Привилегированный мост|доступ по ключу, оценка стоимости услуг, построение инструкции, подпись, ожидание завершения|
| Torii             |запись звонка, окончательные сигналы считывания, отправка транзакции|

Мост, обращенный к рендереру, должен явно принимать идентификатор конечной точки API и хранить материал приватного ключа за границей. Текущая демонстрационная поверхность эквивалентна этому сокращенному контракту:

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

Реальный результат демонстрации также содержит окончательные доказательства блока и любую указанную комиссию. Не воспринимайте хэш криптографической транзакции как единственный показатель успеха.

## Пригласительный контракт {#invite-contract}

Используйте идентификатор вызова в точной форме `domain.dataspace:meeting`. Демонстрация генерирует вызовы под `kaigi.universal` и использует 24-байтный криптографически случайный секрет приглашения, кодированный в виде 32 непаддинговых символов base64url.

Каноническое приглашение содержит ровно один параметр `call` и один параметр `secret`:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

Резервный вариант в приложении — это точно такой же запрос на `#/kaigi`. Отклоняйте дублирующиеся, неизвестные, пустые, дополненные или неканионические параметры. Демонстрационная версия устанавливает срок действия встречи на 24 часа после `scheduledStartMs`.

Секрет приглашения расшифровывает метаданные предложения хоста. Это секрет носителя: не записывайте его в лог, не отправляйте в аналитику и не храните в метаданных распределенного реестра блокчейна. Отдельная пара ключей хоста X25519 расшифровывает сигналы ответов гостей и должна оставаться локальной для сессии хоста.

## Жизненный цикл встречи {#meeting-lifecycle}

### Хост {#host}

1. Проверьте, что выбранная идентичность кошелька соответствует цепочке UUID конечной точки API, точному значению `NetworkId` и префиксу.
2. Откройте локальные медиа и создайте `RTCPeerConnection`.
3. Создайте предложение SDP и дождитесь завершения сбора ICE.
4. Создайте секрет приглашения и пару ключей сигнала хоста Kaigi.
5. Зашифруйте предложение с секретом приглашения.
6. Получите оценку стоимости комиссии и подпишите транзакцию, содержащую `CreateKaigi`, в прозрачном, аутентифицированном режиме.
7. Дождитесь окончательных доказательств блока перед отображением приглашения как активного.

Держите сессию хоста открытой. Опросите маршрут сигнала с помощью канонической подписи запроса учетной записи хоста, расшифруйте первый действительный ответ с помощью ключа сигнала хоста и примените его с `setRemoteDescription`. Переносите `nextCursor` точно, когда доступны дополнительные страницы.

### Гость {#guest}

1. Разберите и проверьте точное приглашение.
2. Получите публичную запись вызова и расшифруйте её предложение с помощью секретного приглашения.
3. Отклоните завершённое, истёкшее, неактивное или непрозрачное собрание.
4. Откройте локальные медиа, примените предложение, создайте ответ SDP и завершите сбор ICE.
5. Зашифруйте ответ с использованием публичного ключа Kaigi хоста.
6. Получите оценку стоимости комиссии и подпишите транзакцию, содержащую `JoinKaigi`, плюс метаданные канонического ответа.
7. Дождитесь окончательных доказательств блока перед тем, как показывать гостя как присоединившегося.

### Конец {#end}

Только ведущий может отправить `EndKaigi`. Закройте сетевое соединение с участником и медиа-треки, отправьте подписанную инструкцию и дождитесь завершения. Прозрачный участник может использовать `LeaveKaigi`; `zk-roster-v1` отъезд является внецепочечным в протоколе первой версии, и родная инструкция отклоняет артефакты приватного выхода.

## Руководство WebRTC Резервное {#manual-webrtc-fallback}

Демонстрационная версия сохраняет передовой путь сигнализации для локальной разработки. Она позволяет ведущему и гостю копировать необработанные пакеты предложений и ответов WebRTC, когда автоматическая поддержка сигнализации через распределённый реестр блокчейна недоступна.

Рассматривайте это как другой режим. Он не создает, не присоединяет и не завершает запись Kaigi, не обеспечивает окончательность транзакции и не должен представляться как эквивалент потоков на блокчейне.

## Проверить интеграцию {#test-the-integration}

Запустите текущие выбранные демонстрационные наборы:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

Тесты охватывают текущий прозрачный профиль, строгий разбор приглашений, зашифрованную сигнализацию, локальное сохранение сеанса и ручной резервный вариант. Для реального теста медиа по-прежнему требуется два профинансированных кошелька и два окна или устройства; Модульные WebRTC и тесты рендерера не доказывают работу камеры, микрофона, прохождение NAT, аутентификацию канонического запроса или окончательность живых транзакций.

Для полного API матрицы конечных точек и CLI жизненного цикла см. [Torii API конечные точки: Kaigi сеансы](/ru/reference/torii-endpoints.md#kaigi-sessions).
