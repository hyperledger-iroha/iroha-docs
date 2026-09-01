---
translation_locale: ar
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# تضمين Kaigi في تطبيق JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi يسجل دورة حياة الاجتماع على Iroha بينما ينقل المتصفح الصوت والفيديو عبر WebRTC. يخزن دفتر الأستاذ على البلوكشين المكالمة، تغييرات قائمة الحضور، البيانات الوصفية المشفرة للإشارة، والحالة النهائية؛ فهو ليس وسيطًا للوسائط.

يتبع هذا البرنامج التعليمي [Iroha JavaScript عرض تجريبي](https://github.com/soramitsu/iroha-demo-javascript) الحالي. يوضّح العرض التوضيحي تنفيذ ملف تعريف تطبيق الإصدار الأول:

- مضيف واحد وضيف واحد
- `transparent` Kaigi وضع الخصوصية
- `authenticated` سياسة الغرفة
- `RevealAfterJoin` سلوك هوية نظير الشبكة
- عرض مشفر في بيانات الاستدعاء و جواب مشفر في بيانات المعاملة النهائية

بروتوكول Kaigi يحدد أيضًا `zk-roster-v1`، لكن العرض التوضيحي الحالي لا يولد أو يقدم تدفق الإثبات هذا. لا تعرض عنصر تحكم في الوضع الخاص إلا إذا قام الجسر الخاص بك بتنفيذ عقد الإثبات الحالي بالكامل.

## المتطلبات الأساسية {#prerequisites}

أنت بحاجة إلى:

- Node.js 20 أو أحدث و Rust سلسلة أدوات
- نقطة نهاية API Torii قادرة على Kaigi
- افصل حسابات المضيف والضيف الممولة
- مفتاح التوقيع لكل حساب في محفظة متميزة أو جسر تطبيق
- إذن الكاميرا والميكروفون في كلا سياقي المتصفح

يستهلك العرض التجريبي `@iroha/iroha-js` من خلال التبعية الشقيقة `file:../iroha/javascript/iroha_js`. قم ببناء SDK من نسخة المصدر Iroha قبل تثبيت العرض التجريبي:

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

النظيف SDK الحزمة لا تحتوي على مساحة عمل Cargo المطلوبة بواسطة `npm run build:native`, لذا أعد بناؤه في Iroha نسخة عمل من الشيفرة المصدرية بعد SDK التغييرات. الموثقة SDK المصدر مثبت عند [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## تحقق من نقطة النهاية API {#check-the-endpoint}

بالنسبة لشبكة الاختبار العامة Taira، تحقق أولاً من إمكانية الوصول إلى Torii:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

تثبت هذه الطلبات فقط أن Torii والوثيقة المعلن عنها API قابلة للوصول. إنها لا تثبت أن اتصال Kaigi معين موجود أو أن محفظتك يمكنها تقديم المعاملات.

لا تقم بالتحقق من `/v1/kaigi/relays` أو `/v1/kaigi/relays/{relay_id}` أو `/v1/kaigi/relays/health` باستخدام طلبات `curl` غير الموقعة. تتطلب هذه المسارات الثلاثة توقيع مشغل مدرج في القائمة المسموح بها. تتطلب سلسلة أحداث الترحيل توقيع حساب واحد مطابق لمعيار البروتوكول للشبكة بالضبط.

في العرض التوضيحي، افتح الإعدادات، أدخل Torii URL، ودع اكتشاف نقطة النهاية API يحمل السلسلة UUID، بالضبط `NetworkId`، وبادئة الشبكة. يجب أن يربط جسر الكتابة القيم الثلاث كلها بنقطة النهاية المحددة API؛ لا تقم أبدًا ببناء `NetworkId` من السلسلة UUID أو البادئة.

## نموذج المسار والمصادقة {#route-and-authentication-model}

عمليات الكتابة في Kaigi هي تعليمات داخل معاملات عادية حُدّدت رسومها ووُقّعت. أرسلها عبر `POST /v1/pipeline/transactions` وانتظر دليل الكتلة التي بلغت حالة النهائية.

قراءات التطبيق هي:

|مسار|المصادقة|
| ----------------------------------- | --------------------------------------- |
| `/v1/kaigi/calls/{call_id}`         |عام|
| `/v1/kaigi/calls/{call_id}/signals` |طلب حساب شبكة دقيق وفق بروتوكول واحد|
|`/v1/kaigi/calls/{call_id}/events`|طلب حساب لشبكة محددة وفق معيار بروتوكول واحد|

يكشف JavaScript SDK هذه كـ `getKaigiCall` و `listKaigiCallSignals`. تستخدم قائمة الإشارات ترقيم الصفحات بالمؤشر الدقيق. أعد استخدام المؤشر المُرجع دون تغيير؛ لا تستبدله بإزاحة أو استمرار بناءً على الطابع الزمني فقط.

## استمر في التوقيع خارج العارض {#keep-signing-outside-the-renderer}

قسّم التكامل إلى ثلاثة حدود:

|حدود|المسؤولية|
| ----------------- | -------------------------------------------------------------------- |
|المُصيِّر|نموذج الاجتماع، رابط الدعوة، عناصر التحكم في الوسائط، العروض والردود WebRTC|
|جسر متميز|الوصول بالمفتاح، تقدير سعر الرسوم، بناء التعليمات، التوقيع، انتظار النهاية|
| Torii             |سجل المكالمات، قراءات الإشارة النهائية، تقديم المعاملة|

يجب أن يقبل الجسر المواجه للمُعالج هوية نقطة النهاية API بشكل صريح وأن يحتفظ بمادة المفتاح الخاص خلف الحدود. السطح التجريبي الحالي يعادل هذا العقد المخفض:

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

تحتوي النتيجة التجريبية الحقيقية أيضًا على دليل الكتلة النهائي وأي رسوم مقتبسة. لا تعتبر مجرد تجزئة تشفيرية للمعاملة مؤشرًا على النجاح.

## عقد دعوة {#invite-contract}

استخدم معرف مكالمة بالشكل الدقيق `domain.dataspace:meeting`. يقوم العرض التجريبي بإنشاء مكالمات تحت `kaigi.universal` ويستخدم سر دعوة عشوائي تشفيرياً بطول 24 بايت مشفر على شكل 32 حرفًا من base64url بدون حشو.

تحتوي دعوة واحدة بمعيار البروتوكول بالضبط على معلمة واحدة `call` ومعلمة واحدة `secret`:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

الاحتياط داخل التطبيق هو نفس الاستعلام تمامًا على `#/kaigi`. رفض التكرارات، المجهولة، الفارغة، المملوءة، أو المعلمات غير الموحدة وفق معيار البروتوكول الواحد. العرض التوضيحي يضبط انتهاء الاجتماع بعد 24 ساعة من `scheduledStartMs`.

سر الدعوة يقوم بفك تشفير بيانات العرض للمضيف. إنه سر حامل: لا تقم بتسجيله، أو وضعه في التحليلات، أو تخزينه في بيانات سجل البلوكشين. زوج مفاتيح المضيف X25519 المنفصل يقوم بفك تشفير إشارات إجابة الضيف ويجب أن يبقى محليًا لجلسة المضيف.

## دورة حياة الاجتماع {#meeting-lifecycle}

### مضيف {#host}

1. تحقق من أن هوية المحفظة المختارة تطابق سلسلة النقطة النهائية API UUID، بالضبط `NetworkId`، والبداية.
2. افتح الوسائط المحلية وأنشئ `RTCPeerConnection`.
3. قم بإنشاء عرض SDP وانتظر حتى ينتهي جمع ICE.
4. قم بإنشاء سر الدعوة ومفتاح إشارة المضيف Kaigi.
5. قم بتشفير العرض باستخدام سر الدعوة.
6. الحصول على تقدير لسعر الرسوم وتوقيع معاملة تحتوي على `CreateKaigi` في وضع شفاف ومصادق عليه.
7. انتظر دليل الكتلة النهائي قبل عرض الدعوة على أنها مباشرة.

ابقِ جلسة المضيف مفتوحة. تحقق من مسار الإشارة باستخدام توقيع الطلب المعياري للبروتوكول الواحد لحساب المضيف، وفك تشفير الإجابة الصالحة الأولى بمفتاح إشارة المضيف، وطبقها باستخدام `setRemoteDescription`. حمل `nextCursor` للأمام بالضبط عند توفر المزيد من الصفحات.

### ضيف {#guest}

1. قم بتحليل ودقة التحقق من الدعوة بالضبط.
2. استرجع سجل المكالمات العامة وفك تشفير عرضه باستخدام سر الدعوة.
3. رفض اجتماع انتهى أو منتهي الصلاحية أو غير مباشر أو غير شفاف.
4. افتح الوسائط المحلية، طبق العرض، أنشئ إجابة SDP، وأكمل جمع ICE.
5. قم بتشفير الإجابة باستخدام المفتاح العام للمضيف Kaigi.
6. احصل على عرض الرسوم ووقّع معاملة تحتوي على `JoinKaigi` وبيانات تعريف الإجابة المعيارية.
7. انتظر حتى تتوفر أدلة على الكتلة النهائية قبل عرض الضيف كمشارك.

### نهاية {#end}

لا يمكن للمضيف فقط تقديم `EndKaigi`. أغلق اتصال النظراء بالشبكة ومسارات الوسائط، قدّم التعليمات الموقعة، وانتظر الإنجاز النهائي. شفاف قد يستخدم المشارك `LeaveKaigi`؛ المغادرة `zk-roster-v1` تكون خارج السلسلة في بروتوكول الإصدار الأول وترفض التعليمة الأصلية آثار المغادرة الخصوصية.

## دليل WebRTC احتياطي {#manual-webrtc-fallback}

يحتفظ العرض التوضيحي بمسار إشارة متقدم لتطوير التطبيقات المحلية. يسمح للمستضيف والضيف بنسخ حزم العرض والرد الخام WebRTC عندما لا تتوفر الإشارات المدعومة تلقائيًا بواسطة سجل البلوك تشين.

اعتبر هذا كوضع مختلف. فهو لا ينشئ أو ينضم أو ينهي سجل Kaigi، ولا يوفر نهائية المعاملة، ويجب عدم تقديمه على أنه مكافئ لتدفق السلسلة.

## اختبر التكامل {#test-the-integration}

تشغيل مجموعات العروض التجريبية الحالية التي تم التركيز عليها:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

تغطي الاختبارات الملف الشخصي الشفاف الحالي، وتحليل الدعوات الصارم، والإشارة المشفرة، واستمرارية الجلسة المحلية، وخيار الاسترجاع اليدوي. لا يزال اختبار الوسائط الحقيقي يتطلب محفظتين ممولتين ونافذتين أو جهازين؛ الاختبارات المقلدة WebRTC واختبارات العرض لا تثبت الكاميرا أو الميكروفون أو عبور NAT أو مصادقة الطلب وفق بروتوكول واحد قياسي أو نهائية المعاملة الحية.

للاطلاع على مصفوفة النقاط النهاية الكاملة API ودورة حياة CLI، انظر [Torii API نقاط النهاية: Kaigi الجلسات](/ar/reference/torii-endpoints.md#kaigi-sessions).
