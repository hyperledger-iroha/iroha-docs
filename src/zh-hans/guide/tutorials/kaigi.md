---
translation_locale: zh-hans
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# 在 JavaScript 应用中嵌入 Kaigi {#embed-kaigi-in-a-javascript-app}

Kaigi 在 Iroha 上记录会议的生命周期,而浏览器则将音频和视频传输到 WebRTC.账本存储呼叫,名单突变,加密信号元数据和最终状态;它不是媒体继电.

本教程遵循当前的 [Iroha JavaScript 演示](https://github.com/soramitsu/iroha-demo-javascript).演示程序实现了一个首次发布的应用程序配置文件:

- 一个主机和一个客人
- `transparent` Kaigi 隐私模式
- `authenticated`房间政策
- `RevealAfterJoin` 对等节点身份行为
- 在调用元数据中加密的报价和提交交易元数据中的加密答案

Kaigi 协议还定义`zk-roster-v1`,但当前的演示程序不会生成或提交该证明流.除非您的桥梁执行完整的当前证明合同,否则不要呈现私有模式控制.

## 预先条件 {#prerequisites}

你需要:

- Node.js 20或更新的工具链和 Rust 工具链
- 一个具有 Kaigi 能力的 Torii 端点
- 提供资金的主机和客户账户
- 每个帐户的签名密钥在特权钱包或应用程序桥上
- 在两种浏览器环境中使用相机和麦克风的权限

这种演示消耗 `@iroha/iroha-js` 通过兄弟姐妹的依赖 `file:../iroha/javascript/iroha_js`. 建立一个 SDK 来自 Iroha 在安装演示程序之前的源清单:

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

清洁的 SDK 包中没有由 `npm run build:native` 所需的 Cargo 工作区,因此在 SDK 的变更后,重新构建它在 Iroha 来源检查中.已记录的 SDK 来源是贴在 [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js)上.

## 检查端点 {#check-the-endpoint}

对于公共 Taira 测试网,首先检查 Torii 的可访问性:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

这些请求只证明 Torii 和其广告的 API 文件可访问,它们不证明存在特定的 Kaigi 呼叫或您的钱包可能提交交易.

在未签名的 `curl`请求中,不要查询`/v1/kaigi/relays`,`/v1/kaigi/relays/{relay_id}`或`/v1/kaigi/relays/health`.这些三条路线需要允许列出的运营商签名.继电事件流需要规范的网络帐户签名.

在演示中,打开设置,输入 Torii URL,并让端点发现加载链接 UUID,精确 `NetworkId`,和网络前.写桥必须将所有三个值绑定到所选的端点;从未构建一个 `NetworkId` 从链接 UUID 或前.

## 路线和身份验证模型 {#route-and-authentication-model}

Kaigi 书写是普通上市和签署的交易中的指示. 通过 `POST /v1/pipeline/transactions`提交它们,等待完成的区块证据.

申请内容如下:

|路线|验证|
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}`|公共|
|`/v1/kaigi/calls/{call_id}/signals`|准确网络账户要求|
|`/v1/kaigi/calls/{call_id}/events`|准确网络账户要求|

JavaScript SDK 将这些显示为 `getKaigiCall`和 `listKaigiCallSignals`.信号列表使用了精确的线程标记页面化.不变地重复使用返回的线程;不要用偏移或仅采用时刻标签的延续来取代它.

## 留下签名给出者的外面 {#keep-signing-outside-the-renderer}

将集成分为三个边界:

|边界|责任|
| ----------------- | -------------------------------------------------------------------- |
|提供者|会议表单,邀请链接,媒体控制, WebRTC 提议和应答|
|有特权的桥梁.|关键访问,费用报价,指令构建,签名,终止等待.|
|Torii|通话记录,提交信号阅读,交易提交 |

面向染器的桥梁应该明确地接受端点身份,并将私钥材料留在边界后面.目前的演示表面相当于这个缩减合同:

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

实际的演示结果还包含了最终的区块证据和任何报价费用. 不要把交易的哈希当作成功.

## 邀请合同 {#invite-contract}

使用通话 ID 以精确的 `domain.dataspace:meeting` 形式.演示生成`kaigi.universal` 的通话,并使用24字节加密式随机邀请秘密编码为32个未填充的base64url字符.

一个规范邀请包含一个 `call` 和一个 `secret`参数:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

在应用程序中倒退是 `#/kaigi` 的相同查询. 拒绝重复,未知的,空的,填充或非规范参数.演示设定会议过期为`scheduledStartMs`后24小时.

邀请秘密解密了主机的报价元数据.这是一个持有者秘密:不要记录它,放入分析中或存储在账本元数据中.主机的单独 X25519 键对解密了客户回复信号,必须保持在主机会议上本地.

## 会议生命周期 {#meeting-lifecycle}

### 接待者 {#host}

1. 检查选定的钱包身份是否符合端点链 UUID,准确的 `NetworkId`,和前.
2. 打开本地媒体,创建一个 `RTCPeerConnection`.
3. 创建一个 SDP 报价,等到 ICE 聚会结束.
4. 创建邀请秘密和主机信号键对 Kaigi.
5. 通过邀请的秘密加密报价.
6. 报价并签署包含 `CreateKaigi` 的交易,以透明的身份验证方式.
7. 在现场播出邀请之前等待完成的区块证据.

保持主机会话开放.用主机帐户的规范请求签名查询信号路线,使用主机信号键解密第一个有效答案,并用 `setRemoteDescription`应用它.当更多页面可用的时将 `nextCursor`传递到前方.

### 客人 {#guest}

1. 分析并验证确切的邀请.
2. 拿出公众通话记录,并解密邀请的秘密.
3. 拒绝已结束,过期,非现场或不透明的会议.
4. 打开本地媒体,应用报价,创建一个 SDP 答案,并完成 ICE 收集.
5. 密码对主机的公钥 Kaigi 的答案.
6. 获取报价并签署一笔包含 `JoinKaigi` 和规范答案元数据的交易。
7. 在展示客人加入之前,等待完整的证据.

### 结束 {#end}

只有主机才能提交 `EndKaigi`.关闭对等节点连接和媒体轨道,提交签署的指示,等待完成.一个透明参与者可以使用 `LeaveKaigi`;一个 `zk-roster-v1` 离开在首次发布协议中是离链的,而本地指示拒绝了隐私留下的构件.

## 手动 WebRTC 倒车 {#manual-webrtc-fallback}

演示程序保留了本地开发的高级信令路径。它允许主持人和参与者复制原始 WebRTC 提议与应答数据包，无需依赖自动备份信令。

请将此视为另一种模式。它不会创建、加入或结束 Kaigi 记录，不提供交易终局性，也不得被表述为等同于链上流程。

## 试验整合 {#test-the-integration}

运行当前的集中演示套件:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

测试涵盖了当前的透明配置文件,严格的邀请分析,加密信号,本地会议持续性和手动倒退.真正的媒体测试仍然需要两个资金支持的钱包和两个窗户或设备;WebRTC 和染器测试没有证明相机,麦克风, NAT 穿越,可信请求认证或现场交易的最终性.

对于完整的端点矩阵和 CLI 生命周期,请参见 [Torii 端点: Kaigi 会议](/zh-hans/reference/torii-endpoints.md#kaigi-sessions).
