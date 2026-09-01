---
translation_locale: zh-hant
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 在 JavaScript 應用中嵌入 Kaigi {#embed-kaigi-in-a-javascript-app}

Kaigi 在 Iroha 上記錄會議的生命週期,而瀏覽器則將音訊和影片傳輸到 WebRTC.帳本儲存呼叫,名單突變,加密訊號後設資料和最終狀態;它不是媒體繼電.

本教程遵循當前的 [Iroha JavaScript 演示](https://github.com/soramitsu/iroha-demo-javascript).演示程式實現了一個首次釋出的應用程式配置檔案:

- 一個主機和一個客人
- `transparent` Kaigi 隱私模式
- `authenticated`房間政策
- `RevealAfterJoin` 對等節點身份行為
- 在呼叫後設資料中加密的報價和提交交易後設資料中的加密答案

Kaigi 協議還定義`zk-roster-v1`,但當前的演示程式不會生成或提交該證明流.除非您的橋樑執行完整的當前證明合同,否則不要呈現私有模式控制.

## 預先條件 {#prerequisites}

你需要:

- Node.js 20或更新的工具鏈和 Rust 工具鏈
- 一個具有 Kaigi 能力的 Torii 端點
- 提供資金的主機和客戶帳戶
- 每個帳戶的簽名金鑰在特權錢包或應用程式橋上
- 在兩種瀏覽器環境中使用相機和麥克風的許可權

這種演示消耗 `@iroha/iroha-js` 透過兄弟姐妹的依賴 `file:../iroha/javascript/iroha_js`. 建立一個 SDK 來自 Iroha 在安裝演示程式之前的源清單:

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

清潔的 SDK 包中沒有由 `npm run build:native` 所需的 Cargo 工作區,因此在 SDK 的變更後,重新構建它在 Iroha 來源檢查中.已記錄的 SDK 來源是貼在 [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js)上.

## 檢查端點 {#check-the-endpoint}

對於公共 Taira 測試網,首先檢查 Torii 的可訪問性:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

這些請求只證明 Torii 和其廣告的 API 檔案可訪問,它們不證明存在特定的 Kaigi 呼叫或您的錢包可能提交交易.

在未簽名的 `curl`請求中,不要查詢`/v1/kaigi/relays`,`/v1/kaigi/relays/{relay_id}`或`/v1/kaigi/relays/health`.這些三條路線需要允許列出的運營商簽名.繼電事件流需要規範的網路帳戶簽名.

在演示中,開啟設定,輸入 Torii URL,並讓端點發現載入連結 UUID,精確 `NetworkId`,和網路前.寫橋必須將所有三個值繫結到所選的端點;從未構建一個 `NetworkId` 從連結 UUID 或前.

## 路線和身份驗證模型 {#route-and-authentication-model}

Kaigi 書寫是普通上市和簽署的交易中的指示. 透過 `POST /v1/pipeline/transactions`提交它們,等待完成的區塊證據.

申請內容如下:

|路線|驗證|
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}`|公共|
|`/v1/kaigi/calls/{call_id}/signals`|準確網路帳戶要求|
|`/v1/kaigi/calls/{call_id}/events`|準確網路帳戶要求|

JavaScript SDK 將這些顯示為 `getKaigiCall`和 `listKaigiCallSignals`.訊號列表使用了精確的執行緒標記頁面化.不變地重複使用返回的執行緒;不要用偏移或僅採用時刻標籤的延續來取代它.

## 留下簽名給出者的外面 {#keep-signing-outside-the-renderer}

將整合分為三個邊界:

|邊界|責任|
| ----------------- | -------------------------------------------------------------------- |
|提供者|會議表單,邀請連結,媒體控制, WebRTC 提議和應答|
|有特權的橋樑.|關鍵訪問,費用報價,指令構建,簽名,終止等待.|
|Torii|通話記錄,提交訊號閱讀,交易提交 |

面向染器的橋樑應該明確地接受端點身份,並將私鑰材料留在邊界後面.目前的演示表面相當於這個縮減合同:

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

實際的演示結果還包含了最終的區塊證據和任何報價費用. 不要把交易的雜湊當作成功.

## 邀請合同 {#invite-contract}

使用通話 ID 以精確的 `domain.dataspace:meeting` 形式.演示生成`kaigi.universal` 的通話,並使用24位元組加密式隨機邀請秘密編碼為32個未填充的base64url字元.

一個規範邀請包含一個 `call` 和一個 `secret`引數:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

在應用程式中倒退是 `#/kaigi` 的相同查詢. 拒絕重複,未知的,空的,填充或非規範引數.演示設定會議過期為`scheduledStartMs`後24小時.

邀請秘密解密了主機的報價後設資料.這是一個持有者秘密:不要記錄它,放入分析中或儲存在賬本後設資料中.主機的單獨 X25519 鍵對解密了客戶回覆訊號,必須保持在主機會議上本地.

## 會議生命週期 {#meeting-lifecycle}

### 接待者 {#host}

1. 檢查選定的錢包身份是否符合端點鏈 UUID,準確的 `NetworkId`,和前.
2. 開啟本地媒體,建立一個 `RTCPeerConnection`.
3. 建立一個 SDP 報價,等到 ICE 聚會結束.
4. 建立邀請秘密和主機訊號鍵對 Kaigi.
5. 透過邀請的秘密加密報價.
6. 報價並簽署包含 `CreateKaigi` 的交易,以透明的身份驗證方式.
7. 在現場播出邀請之前等待完成的區塊證據.

保持主機會話開放.用主機帳戶的規範請求籤名查詢訊號路線,使用主機訊號鍵解密第一個有效答案,並用 `setRemoteDescription`應用它.當更多頁面可用的時將 `nextCursor`傳遞到前方.

### 客人 {#guest}

1. 分析並驗證確切的邀請.
2. 拿出公眾通話記錄,並解密邀請的秘密.
3. 拒絕已結束,過期,非現場或不透明的會議.
4. 開啟本地媒體,應用報價,建立一個 SDP 答案,並完成 ICE 收集.
5. 密碼對主機的公鑰 Kaigi 的答案.
6. 取得報價並簽署一筆包含 `JoinKaigi` 和規範答案中繼資料的交易。
7. 在展示客人加入之前,等待完整的證據.

### 結束 {#end}

只有主機才能提交 `EndKaigi`.關閉對等節點連線和媒體軌道,提交簽署的指示,等待完成.一個透明參與者可以使用 `LeaveKaigi`;一個 `zk-roster-v1` 離開在首次釋出協議中是離鏈的,而本地指示拒絕了隱私留下的構件.

## 手動 WebRTC 倒車 {#manual-webrtc-fallback}

示範程式保留了供本機開發使用的進階信令路徑。它允許主持人和參與者複製原始 WebRTC 提議與應答資料包，無需依賴自動備援信令。

請將此視為另一種模式。它不會建立、加入或結束 Kaigi 記錄，不提供交易終局性，也不得被表述為等同於鏈上流程。

## 試驗整合 {#test-the-integration}

執行當前的集中演示套件:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

測試涵蓋了當前的透明配置檔案,嚴格的邀請分析,加密訊號,本地會議持續性和手動倒退.真正的媒體測試仍然需要兩個資金支援的錢包和兩個窗戶或裝置;WebRTC 和染器測試沒有證明相機,麥克風, NAT 穿越,可信請求認證或現場交易的最終性.

對於完整的端點矩陣和 CLI 生命週期,請參見 [Torii 端點: Kaigi 會議](/zh-hant/reference/torii-endpoints.md#kaigi-sessions).
