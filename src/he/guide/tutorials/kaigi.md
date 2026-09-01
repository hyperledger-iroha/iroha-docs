---
translation_locale: he
translation_source: /guide/tutorials/kaigi.md
translation_source_hash: 7a9f03e45a17ecbc4a2d7182d4c9aff88d5f6f0b77e0ecfde86bed56d0ddebba
translation_status: machine-validated
translation_engine: nllb-200-ct2
---
# כרוך Kaigi באפליקציה JavaScript {#embed-kaigi-in-a-javascript-app}

Kaigi רשום את מחזור החיים של פגישה על Iroha בעוד הדפדפן נושא קול וידאו מעל WebRTC. הספר החזיק את השיחה, מוטציות הרשימה, מטא נתונים סיגנליים מוצפנים, ואת המצב הסופי; זה לא משדר מדיה.

הדרכה זו עוקבת אחרי הדמו הנוכחית [Iroha JavaScript דמו](https://github.com/soramitsu/iroha-demo-javascript). הדמו מיישמת פרופיל אחד של היישום הראשון:

- אורח אחד וארחת אחת.
- מצב פרטיות `transparent` Kaigi
- `authenticated` מדיניות חדרים
- `RevealAfterJoin` התנהגות זהות צומת
- הצעה מוצפנת בתנתונים מטה-התקשרות ותשובה מוצפנה בתנתונים המטה-העסקה commit.

פרוטוקול Kaigi גם מגדיר `zk-roster-v1`, אך הדמו הנוכחית לא מייצרת או מספק את זרימת ההוכחה הזו. אל תציג שליטה במצב פרטי אלא אם כן הגשר שלך מבצע את החוזה של ההוכחה הנוכחי המלא.

## תנאים מוקדמים {#prerequisites}

אתה צריך:

- Node.js 20 או יותר חדש ושרשרת כלי עבודה Rust
- נקודת סוף Torii בעלת יכולת Kaigi
- חשבונות נפרדים של המארח והאורחים
- מפתח החתימה של כל חשבון בארנק או גשר יישום בעל זכויות מיוחדות
- אישור מצלמה ומיקרופון בשתי הקשרים של הדפדפן.

הדמו צורכת `@iroha/iroha-js` באמצעות תלות האחים `file:../iroha/javascript/iroha_js`. לבנות את SDK מנקודת המקור של Iroha לפני התקנת הדמו:

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

הניקוי SDK החבילה לא מכילה את חלל העבודה של מטען הנדרש על ידי `npm run build:native`, אז לבנות את זה מחדש Iroha בדיקת המקור לאחר SDK השינויים. SDK המקור מחובר [`javascript/iroha_js`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/javascript/iroha_js).

## בדוק את נקודת הסיום {#check-the-endpoint}

עבור רשת בדיקת Taira ציבורית, בדוק תחילה את הגישות של Torii:

```bash
TAIRA=https://taira.sora.org
curl -fsS "$TAIRA/health"
curl -fsS "$TAIRA/openapi.json" >/dev/null
```

בקשות אלה מוכיחות רק כי Torii והמסמך המפורסם שלו API ניתן להגיע אליו. הם לא מוכיחים כי יש שיחת Kaigi מסוימת או כי הארנק שלך יכול להגיש עסקאות.

אל תבדקו `/v1/kaigi/relays`, `/v1/kaigi/relays/{relay_id}`, או `/v1/kaigi/relays/health` עם בקשות לא חתומות `curl`. שלושת המסלולים האלה דורשים חתימה של מפעיל רשום. זרם אירועי הרשת דורש חתימת חשבון רשת מדויקת קנונית.

בדמו, לפתוח הגדרות, להזין את Torii URL, ולתת לחיפוש נקודת סוף למלא את שרשרת UUID, מדויק `NetworkId`, ותיקום רשת. גשר כתיבה חייב לקשור את כל שלוש הערכים לנקודה הסופית הנבחרת; לעולם לא לבנות `NetworkId` מהרשרת UUID או התיקום.

## מסלול ומודל אימות {#route-and-authentication-model}

Kaigi כותבים הם הוראות בתוך עסקאות רגילות תמחורת וחתום. להגיש אותם דרך `POST /v1/pipeline/transactions` ולחכות עד ראיות בולק סופית.

התביעה קוראת:

|כביש |אימות |
| ----------------------------------- | --------------------------------------- |
|`/v1/kaigi/calls/{call_id}` |ציבורי|
|`/v1/kaigi/calls/{call_id}/signals` |בקשת חשבון רשת מדויקת קנונית |
|`/v1/kaigi/calls/{call_id}/events` |בקשת חשבון רשת מדויקת קנונית |

JavaScript SDK חושף את אלה כ- `getKaigiCall` ו- `listKaigiCallSignals`. רשימת הסימן משתמשת בעמודי הקורסר המדויקים. השתמשו מחדש בקורסר הובא ללא שינוי; אל תחליפו אותו על ידי מקצץ או המשך עם עותק זמן בלבד.

## שמרו על חתימה מחוץ למבצע {#keep-signing-outside-the-renderer}

לחלק את האינטגרציה לשלושה גבולות:

|הגבול |אחריות |
| ----------------- | -------------------------------------------------------------------- |
|רענדרר |טופס פגישות, קישור הזמנה, בקרת מדיה, WebRTC הצעות ותשובות |
|גשר מועמד.|גישה מפתח, תמחור עלות, בניית הוראות, חתימה, מחכות סיום |
|Torii |רישום שיחות, קריאת סימן commit, העברת עסקאות |

גשר המופנה צריך לקבל את זהות נקודת הסיום במפורש ולהשאיר חומר מפתח פרטי מאחורי הגבול. שטח הדמו הנוכחי שווה ערך לחוזה הנקצר הזה:

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

תוצאת ההדגמה האמיתית כוללת גם ראיה לבלוק שהגיע לסופיות וכל עמלה שצוטטה. אל תתייחסו לגיבוב העסקה לבדו כהצלחה.

## חוזה הזמנה {#invite-contract}

השתמש בקול ID בצורה מדויקת `domain.dataspace:meeting`. הדמו מייצרת שיחות תחת `kaigi.universal` ומשתמש בסוד ההזמנה אקראי ב-24 בייטים, משותף כ-32 אותיות base64url ללא דגום.

הזמנה קנוניקה מכילה בדיוק פרמטר אחד `call` ואחד `secret`:

```text
iroha://kaigi/join?call=kaigi.universal%3Akaigi-<meeting>&secret=<base64url>
```

ההשפעה בתוך האפליקציה היא אותה שאילתת מדויקת ב `#/kaigi`. דחוף פרמטרים כפולים, לא ידועים, ריקים, מתמלאים או שאינם קנוניים. הדמו מקדמת את סיום הפגישה ל-24 שעות לאחר `scheduledStartMs`.

סוד ההזמנה מפענח את metadata של הצעת ה־host. זהו bearer secret: אל תרשמו אותו ב־log, אל תכניסו אותו ל־analytics ואל תשמרו אותו ב־metadata של ספר החשבונות. זוג המפתחות X25519 הנפרד של ה־host מצפין את signaling של תגובת האורח וחייב להישאר מקומי ל־host session.

## מחזור החיים של הפגישות {#meeting-lifecycle}

### מארח {#host}

1. לוודא כי זהות הארנק הנבחרת תואמת את שרשרת נקודת הסיום UUID, מדויקת `NetworkId`, ותיקון.
2. פתח תקשורת מקומית ויצר `RTCPeerConnection`.
3. ליצור הצעה SDP ולחכות עד שהשיקום ICE יגמר.
4. לייצר את סוד ההזמנה ומארח סימן Kaigi זוג מפתחות.
5. לחבר את ההצעה עם הסוד של הזמנה.
6. תמחור וחתום על עסקה המכילה `CreateKaigi` במצב שקוף ואותנטי.
7. חכו עד ראיות בלוק סופית לפני שתציג את ההזמנה בשידור חי.

שמרו על הפגישה של המארח פתוחה. תבדקו את מסלול האות עם חתימת בקשה קנוניקה של חשבון המארח, לפענח את התשובה הטובה הראשונה עם מפתח הסימן המארח, ולהתחיל אותה עם `setRemoteDescription`. לובש `nextCursor` קדימה בדיוק כאשר יהיו יותר דפים זמינים.

### אורח {#guest}

1. חישבו ותאשרו את ההזמנה המדויקת.
2. תביא את רשימת השיחות הציבוריות ותפתור את הצעת ההזמנה עם סוד ההזמנה.
3. דחוף פגישה סגורה, נגמרה, לא חיה, או לא ברורה.
4. לפתוח מדיה מקומית, ליישם את ההצעה, ליצור תשובה SDP, ולסיים ICE הקריאה.
5. לחבר את התשובה למפתח הציבורי של המארח Kaigi.
6. תמחור וחתום על עסקה המכילה `JoinKaigi` ועוד את הנתונים המטאנומיים של התשובה הקנוניקית.
7. חכו עד ראיות בלוק הסופית לפני שתראו את האורח כמו הצטרף.

### סיום {#end}

רק המארח רשאי לשלוח `EndKaigi`. סגרו את חיבור העמית ואת ערוצי המדיה, שלחו את ההוראה החתומה והמתינו לסופיות. משתתף שקוף רשאי להשתמש ב־`LeaveKaigi`; יציאה מסוג `zk-roster-v1` מתבצעת מחוץ לשרשרת בפרוטוקול של הגרסה הראשונה, וההוראה המובנית דוחה ארטיפקטים של יציאה פרטית.

## מדריך WebRTC {#manual-webrtc-fallback}

הדמו שומרת על דרך סיגנולית מתקדמת לפיתוח מקומי. היא מאפשרת למארח ולאורח להעתיק חבילות הצעות WebRTC רותיות ולהשיב כאשר סיגנול אוטומטי בעל תמיכה בספר לא זמין.

התייחסו לכך כמצב שונה. הוא אינו יוצר, מצטרף או מסיים רשומת Kaigi, אינו מספק סופיות טרנזקציה, ואסור להציגו כשווה ערך לזרימה on-chain.

## תבדקו את האינטגרציה {#test-the-integration}

תפעיל את סוויטים הדמו המוקדמים הנוכחיים:

```bash
npm test -- \
  tests/kaigiView.spec.ts \
  tests/kaigi.spec.ts \
  tests/kaigiCrypto.spec.ts \
  tests/kaigiInvite.spec.ts \
  tests/kaigiStore.spec.ts

npm run verify
```

בדיקות אלה כוללות את הפרופיל הפתוח הנוכחי, חקירה קפדנית של הזמנות, סיגנליזציה מוצפן, עמידת ישיבה מקומית, ו- fallback ידני. בדיקת מדיה אמיתית עדיין דורשת שני ארנקים ממומנים ושתי חלונות או מכשירים; בדיקות WebRTC והמסדר לא מוכיחות מצלמה, מיקרופון, מעבר NAT, אימות בקשה קנונית, או סיום עסקאות בשידור חי.

עבור המטריס המלאה של נקודת הסיום ואת מחזור החיים של CLI, ראה נקודות סיום [Torii: סessions Kaigi ](/he/reference/torii-endpoints.md#kaigi-sessions).
