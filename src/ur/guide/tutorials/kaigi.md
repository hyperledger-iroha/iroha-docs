---
translation_locale: ur
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# Kaigi کو ایک JavaScript ایپ میں شامل کیا گیا {#embed-kaigi-in-a-javascript-app}

Kaigi ایک اجلاس کی زندگی کا دورانیہ ریکارڈ Iroha جبکہ براؤزر آڈیو اور ویڈیو پر لیتا ہے WebRTC. لیجر کال، لسٹری تغیرات، خفیہ کردہ سگنلنگ میٹا ڈیٹا، اور حتمی حیثیت کو ذخیرہ کرتا ہے؛ یہ میڈیا ریلے نہیں ہے۔

یہ ٹیوٹوریل موجودہ [Iroha JavaScript ڈیمو](https://github.com/soramitsu/iroha-demo-javascript) کی پیروی کرتا ہے۔ ڈیمو ایک پہلی ریلیز کی درخواست پروفائل کو نافذ کرتا ہے:

- ایک میزبان اور ایک مہمان
- `transparent` Kaigi رازداری کا موڈ
- `authenticated` کمرے کی پالیسی
- `RevealAfterJoin` نیٹ ورک نوڈ کی شناخت کا رویہ
- کال میٹا ڈیٹا میں خفیہ کردہ پیش کش اور پابند ٹرانزیکشن میٹا ڈیٹا پر خفیہ جواب۔

Kaigi پروٹوکول بھی `zk-roster-v1` کی وضاحت کرتا ہے ، لیکن موجودہ ڈیمو اس ثبوت کے بہاؤ کو پیدا یا پیش نہیں کرتا ہے۔ جب تک کہ آپ کا پل مکمل موجودہ ثبوت کا معاہدہ نافذ نہ کرے تو نجی موڈ کنٹرول پیش نہ کریں۔

## لازمی شرائط {#prerequisites}

آپ کو ضرورت ہے:

- Node.js 20 یا اس سے زیادہ اور ایک Rust ٹول چین
- ایک Kaigi قابل Torii اختتامی نقطہ
- میزبان اور مہمانوں کے الگ الگ اکاؤنٹس
- خصوصی پرس یا ایپلی کیشن پل میں ہر اکاؤنٹ کی دستخط کی کلید
- دونوں براؤزر کے تناظر میں کیمرے اور مائکروفون کی اجازت

ڈیمو `file:../iroha/javascript/iroha_js` بہن بھائی کی انحصار کے ذریعے `@iroha/iroha-js` کا استعمال کرتا ہے۔ ڈیمو انسٹال کرنے سے پہلے Iroha ماخذ چیک آؤٹ سے SDK بنائیں:

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

صاف SDK پیکج میں کارگو ورک اسپیس شامل نہیں ہے جس کی ضرورت ہے `npm run build:native`, تو اس کی تعمیر نو میں Iroha ماخذ کی جانچ پڑتال کے بعد SDK تبدیلیاں۔ دستاویزی SDK ماخذ بند کر دیا گیا ہے [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## اختتامی نقطہ چیک کریں {#check-the-endpoint}

عوامی Taira ٹیسٹ نیٹ ورک کے لئے، سب سے پہلے Torii کی دستیابی کی تصدیق کریں:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

یہ درخواستیں صرف اس بات کی تصدیق کرتی ہیں کہ Torii اور اس کے اشتہار کردہ API دستاویز تک رسائی حاصل ہے. وہ ثابت نہیں کرتے ہیں کہ ایک خاص Kaigi کال موجود ہے یا آپ کا پرس لین دین جمع کر سکتا ہے۔

غیر دستخط شدہ `curl` درخواستوں کے ساتھ `/v1/kaigi/relays` ، `/v1/kaigi/relays/{relay_id}` ، یا `/v1/kaigi/relays/health` کی جانچ نہ کریں۔ ان تینوں راستوں میں اجازت نامے پر مشتمل آپریٹر کی دستخط کی ضرورت ہوتی ہے۔ ریلے ایونٹ اسٹریم کو کینونیکل عین مطابق نیٹ ورک اکاؤنٹ کی دستخط درکار ہوتی ہے۔

ڈیمو میں ، ترتیبات کھولیں ، Torii URL درج کریں ، اور اختتامی نقطہ دریافت کو سلسلہ UUID ، عین مطابق `NetworkId` ، اور نیٹ ورک پریفیکس لوڈ کرنے دیں۔ ایک لکھنے کا پل منتخب کردہ اختتامی پوائنٹ سے تینوں اقدار کو باندھنا ضروری ہے۔ کبھی بھی `NetworkId` کی تعمیر نہ کریں UUID یا چین سے پہلے.

## راستہ اور تصدیق کا ماڈل {#route-and-authentication-model}

Kaigi لکھتا ہے عام کوٹیڈ اور دستخط شدہ لین دین کے اندر ہدایات ہیں. انہیں `POST /v1/pipeline/transactions` کے ذریعے جمع کروائیں اور حتمی بلاک ثبوت کا انتظار کریں.

درخواست کے طور پر پڑھتا ہے:

|راستہ |تصدیق |
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}` |عوامی |
|`/v1/kaigi/calls/{call_id}/signals` |صحیح نیٹ ورک اکاؤنٹ کی درخواست |
|`/v1/kaigi/calls/{call_id}/events` |صحیح نیٹ ورک اکاؤنٹ کی درخواست |

JavaScript SDK ان کو `getKaigiCall` اور `listKaigiCallSignals` کے طور پر ظاہر کرتا ہے۔ سگنل لسٹ میں کرسر کی عین مطابق صفحہ بندی کا استعمال کیا جاتا ہے۔ واپس آنے والے کرسر کو غیر تبدیل شدہ طور پر دوبارہ استعمال کریں؛ اسے آفسیٹ یا صرف ٹائم اسٹیمپ کے ساتھ متبادل نہ کریں۔

## دینے والے کے باہر دستخط جاری رکھیں {#keep-signing-outside-the-renderer}

انضمام کو تین حدود میں تقسیم کریں:

|سرحد |ذمہ داری |
| ----------------- | -------------------------------------------------------------------- |
|رینڈر |اجلاس کا فارم، دعوت نامہ لنک، میڈیا کنٹرولز، WebRTC آفرز اور جوابات |
|اعزازی پل |کلیدی رسائی، فیس کا حوالہ، ہدایات کی تعمیر، دستخط، حتمی طور پر انتظار |
|Torii |کال ریکارڈ، مصروف سگنل کی تلاوت، ٹرانزیکشن جمع کرانے |

رینڈر کی طرف پل واضح طور پر اختتامی نقطہ کی شناخت کو قبول کرنا چاہئے اور نجی کلید مواد کو حدود کے پیچھے رکھنا چاہئے۔ موجودہ ڈیمو سطح اس کم معاہدے کے مترادف ہے:

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

حقیقی ڈیمو نتیجہ میں حتمی بلاک ثبوت اور کسی بھی قیمت درج کی فیس بھی شامل ہے۔ ٹرانزیکشن ہیش کو اکیلے کامیابی کے طور پر نہ سمجھیں۔

## دعوت نامہ معاہدہ {#invite-contract}

ایک کال ID کا استعمال کریں بالکل `domain.dataspace:meeting` فارم میں۔ ڈیمو `kaigi.universal` کے تحت کالیں پیدا کرتا ہے اور 24 بائٹ کی خفیہ طور پر بے ترتیب دعوت نامے کا استعمال کرتا ہے جو 32 غیر پیڈ شدہ بیس 64url حروف کے طور پر کوڈ کیا جاتا ہے۔

ایک کینونیکل دعوت میں بالکل ایک `call` اور ایک `secret` پیرامیٹر شامل ہے:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

ایپ کے اندر fallback، `#/kaigi` پر بالکل یہی query ہے۔ نقل، نامعلوم، خالی، padded یا non-canonical پیرامیٹرز مسترد کریں۔ ڈیمو میٹنگ کی میعاد `scheduledStartMs` کے 24 گھنٹے بعد مقرر کرتا ہے۔

دعوت نامہ خفیہ میزبان کی پیشکش میٹا ڈیٹا کو ڈیکرپٹ کرتا ہے۔ یہ ایک حاملہ راز ہے: اسے ریکارڈ نہ کریں ، تجزیات میں ڈالیں ، یا اسے لیجر میٹا ڈیٹا میں ذخیرہ کریں۔ میزبان کا علیحدہ X25519 کلیدی جوڑا مہمان کے جواب سگنل کو ڈریکپٹ کرتا ہے اور اسے مقامی طور پر میزبان سیشن میں رہنا ہوگا۔

## میٹنگ لائف سائیکل {#meeting-lifecycle}

### میزبان {#host}

1. تصدیق کریں کہ منتخب کردہ پرس کی شناخت اختتامی نقطہ UUID کے سلسلے، عین مطابق `NetworkId` اور پریفیکس سے ملتی ہے.
2. مقامی میڈیا کھولیں اور ایک `RTCPeerConnection` بنائیں۔
3. ایک SDP پیشکش بنائیں اور ICE جمع کرنے کے لئے انتظار کریں.
4. دعوت خفیہ اور میزبان Kaigi سگنل کی کلید جوڑی پیدا کریں.
5. دعوت نامے کے راز کے ساتھ پیشکش کو خفیہ کریں.
6. `CreateKaigi` پر مشتمل ٹرانزیکشن کو شفاف، تصدیق شدہ موڈ میں حوالہ دیں اور اس پر دستخط کریں۔
7. براہ راست دعوت نامہ دکھانے سے پہلے حتمی بلاک ثبوت کا انتظار کریں.

میزبان سیشن کو کھلا رکھیں۔ میزبان اکاؤنٹ کی کینونیکل درخواست دستخط کے ساتھ سگنل روٹ کا سروے کریں ، میزبان سگنل کلید کے ذریعہ پہلا درست جواب ڈسکرپٹ کریں ، اور اسے `setRemoteDescription` کے ساتھ لاگو کریں۔ جب مزید صفحات دستیاب ہوں تو بالکل `nextCursor` آگے بڑھائیں۔

### مہمان {#guest}

1. دعوت نامہ کو درست کریں اور اس کی تصدیق کریں۔
2. عوامی کال ریکارڈ حاصل کریں اور دعوت نامے کے راز کے ساتھ اس کی پیشکش کو ڈیکرپٹ.
3. اختتام پذیر، ختم ہونے والی، غیر براہ راست یا غیر شفاف میٹنگ کو مسترد کریں۔
4. مقامی میڈیا کھولیں، پیشکش کو لاگو کریں، ایک SDP جواب بنائیں، اور ICE جمع کروائیں.
5. میزبان کی Kaigi عوامی کلید کے جواب کو خفیہ کریں۔
6. `JoinKaigi` کے ساتھ ایک ٹرانزیکشن کا حوالہ دیں اور اس پر دستخط کریں جس میں میٹا ڈیٹا شامل ہے.
7. مہمان کو شامل ہونے سے پہلے حتمی بلاک ثبوت کا انتظار کریں.

### اختتام {#end}

صرف میزبان `EndKaigi` جمع کروا سکتا ہے۔ نیٹ ورک نوڈ کنکشن اور میڈیا ٹریک بند کریں ، دستخط شدہ ہدایات جمع کرائیں ، اور حتمی ہونے کا انتظار کریں۔ شفاف شریک `LeaveKaigi` استعمال کرسکتا ہے۔ `zk-roster-v1` روانگی پہلی ریلیز کے پروٹوکول میں غیر منسلک ہے اور مقامی ہدایات رازداری کو چھوڑنے والے دستاویزات کو مسترد کرتی ہیں.

## دستی WebRTC فال بیک {#manual-webrtc-fallback}

ڈیمو مقامی ترقی کے لئے ایک اعلی درجے کی سگنلنگ کا راستہ برقرار رکھتا ہے۔ یہ میزبان اور مہمان کو خام WebRTC پیش کش اور جواب پیکجوں کی کاپی کرنے دیتا ہے جب خودکار لیجر بیکڈ سگنلنگ دستیاب نہیں ہوتی ہے۔

اس کو ایک مختلف موڈ کے طور پر علاج کریں۔ یہ Kaigi ریکارڈ نہیں بناتا ، شامل نہیں کرتا یا ختم نہیں کرتا ، لین دین کی حتمی شکل فراہم نہیں کرتا ہے ، اور اسے آن چین فلو کے مساوی کے طور پر پیش نہیں کیا جاسکتا۔

## انضمام کی جانچ کریں {#test-the-integration}

موجودہ توجہ مرکوز ڈیمو سوئٹس چلائیں:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

ٹیسٹ موجودہ شفاف پروفائل ، سخت دعوت تجزیہ ، خفیہ کردہ سگنلنگ ، مقامی سیشن کی مستقل مزاجی ، اور دستی فال بیک کو ڈھکتے ہیں۔ ایک حقیقی میڈیا ٹیسٹ کے لئے ابھی بھی دو فنڈ والے پرسوں اور دو ونڈوز یا آلات کی ضرورت ہوتی ہے۔ مضحکہ خیز WebRTC اور رینڈر ٹیسٹ کیمرے ، مائکروفون ، NAT کراسنگ ، کینونیکل درخواست کی توثیق ، یا لائیو ٹرانزیکشن کے حتمی ہونے کا ثبوت نہیں دیتے ہیں۔

مکمل اختتامی پوائنٹ میٹرکس اور CLI لائف سائیکل کے لئے، دیکھیں [Torii اختتامی مقامات: Kaigi سیشنز](/ur/reference/torii-endpoints.md#kaigi-sessions).
