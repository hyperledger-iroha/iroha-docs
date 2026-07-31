---
translation_locale: he
translation_source: /guide/tutorials/javascript.md
translation_source_hash: feddadb1b50c5cc8beea188fd7053eeaae58d6ab9203687e9a1378f203229168
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript ו TypeScript {#javascript-and-typescript}

הזרם JavaScript SDK האם זה `@iroha/iroha-js` חבילה Iroha
עץ מקור. Node.js-הראשון SDK עבור Torii, Norito בונים, חתימים,
עמודי דף, ראיות מראש של קישור, ותחבורה של פקודות Kagemusha.

## לבנות ממקור {#build-from-source}

החבילה אינה זמינה לרשות הציבור. npm רישום.
מאותו קישור Iroha תיקון מקור כנקודה שאתה מכוון:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

הגדרות המקומיות. `cargo build -p iroha_js_host` ומדווחים את
סכום הבדיקות ספציפי לפלטפורמה SDK המקור בונה מקומות
מארח מבוקש ב `native/`. המוסד `IROHA_JS_NATIVE_DIR` רק כאשר בכוונה
אספקת מארח בנוי בנפרד, סכום המחאה-מתוכנן. ESM-רק;
מ CommonJS, שימוש דינמי `import()`.

## התחלה מהירה {#quickstart}

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { generateKeyPair } from "@iroha/iroha-js/crypto";

const torii = new ToriiClient("http://127.0.0.1:8080", {
  authToken: "dev-token",
});

const keys = generateKeyPair();
console.log(keys.publicKey);
```

## נסה. Taira רק קריאה {#try-taira-read-only}

שימוש מבוסס `fetch` ב Node.js 24 לטיפול Taira לפני הוספת חתימה ו
Norito קוד העסקה:

```js
const root = "https://taira.sora.org";

const status = await fetch(`${root}/status`).then((res) => res.json());
console.log({
  blocks: status.blocks,
  queueSize: status.queue_size,
  peers: status.peers,
});

const domains = await fetch(`${root}/v1/domains?limit=5`).then((res) =>
  res.json(),
);
console.log(domains.items.map((domain) => domain.id));

const assets = await fetch(`${root}/v1/assets/definitions?limit=5`).then((res) =>
  res.json(),
);
for (const asset of assets.items) {
  console.log(asset.id, asset.name, asset.total_quantity);
}
```

שמור את זה כ `taira-readonly.mjs`, אז תפעיל אותו:

```bash
node taira-readonly.mjs
```

לעבור לחתימה SDK שיחות רק לאחר שבדקים אלה רק לקרוא עובד. ציבורי Taira
יכול לתקופה להחזיר שורה מלאה או טעות כניסה, אז לשמור על רשת חיה
בדיקות ברירה CI.

מיבואים שימושיים:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

עבור קישור התחלתית של "Connect" עם דפדפן בלבד, השתמש `@iroha/iroha-js/connect-browser`
במקום לייבא את Node-First `ToriiClient` על פני השטח.

## חוב משכנתא מקומי {#native-escrow}

JavaScript ו TypeScript יישומים יכולים להשתמש בכספת מקומית דרך Kotodama
מחוזים.
`@iroha/iroha-js/kotodama-compiler`; יצרני עסקאות מאבטחה מקומית ישירות
הם לא חשופים כרגע על ידי JavaScript SDK. תראו.
[אסיטום נטיב](/he/blockchain/escrow.md#javascript-and-typescript-kotodama)
לדוגמא של שיחת המארח.

## כיסוי הנוכחי {#current-coverage}

ה- SDK מתמקד ב:

- Torii HTTP ו WebSocket עוזרים
- Norito יצרני עסקאות והנחיות
- Kotodama איסוף, כולל מבנים של שיחות מארח הבנקאות
- Ed25519 חתימה ודור מפתח
- עוזרים לעמודי עמודים ולניסי מחדש
- חיבור עוזרים לחיזוק הדפדפן
- סידורי קיגמושה, תוספת, חיסכון ותנועה במצב הפעלה
  עוזרים

## מקורות קדם {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
