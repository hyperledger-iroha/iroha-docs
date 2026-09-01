---
translation_locale: he
translation_source: /guide/tutorials/javascript.md
translation_source_hash: d12c715de68623a7dd671e4f2f91b93dbe9fdee42ed51e3a25fbad2a9b69ca8e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# JavaScript ו TypeScript {#javascript-and-typescript}

ערכת JavaScript SDK הנוכחית היא החבילה `@iroha/iroha-js` בעץ המקור של Iroha. זוהי ערכת SDK המיועדת בראש ובראשונה ל־Node.js, עם תמיכה ב־Torii, בוני Norito, חתימה, חלוקה לעמודים, תצפיות Connect והעברת פקודות Kagemusha.

## בנייה ממקור {#build-from-source}

החבילה אינה זמינה כעת במאגר npm הציבורי. בנו אותה מאותה גרסת מקור מקובעת של Iroha שבה נבנה הצומת שאליו אתם פונים:

```bash
git clone https://github.com/hyperledger-iroha/iroha.git
cd iroha/javascript/iroha_js
npm install
npm run build:native
npm run build:dist
```

הבניין המקומי עוסק `cargo build -p iroha_js_host` וירשם את סכום ההבדקה הספציפית לפלטפורמה המשמש ב- SDK startup. הבניין מקורי מקומות אשר אישרו מארץ ב- `native/`. להגדיר `IROHA_JS_NATIVE_DIR` רק כאשר אתה מספק במכוון מארח מבוסס בנוי בנפרד, עם סכום בודק. החבילה היא ESM בלבד; מ- CommonJS, השתמש בדיינמיקה `import()`.

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

## נסה Taira לקרוא בלבד {#try-taira-read-only}

להשתמש `fetch` מבוסס ב- Node.js 24 כדי לחקור Taira לפני הוספת קוד חתימה ו Norito למערכה:

```js
const root = "https://taira.sora.org";

const status = await fetch(`${root}/status`, {
  headers: { Accept: "application/json" },
}).then((res) => res.json());
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

שמור אותו כ- `taira-readonly.mjs`, ואז תפעיל אותו:

```bash
node taira-readonly.mjs
```

לעבור לקריאות חתומות SDK רק לאחר שתבדקי קריאה בלבד האלה יעבודו. הציבורי Taira יכול להחזיר באופן זמני שורה מלאה או טעות כניסה, אז לשמור על בדיקות רשת חי בחירה ב CI.

מיבואים שימושיים:

```js
import { ToriiClient } from "@iroha/iroha-js/torii";
import { noritoEncodeInstruction } from "@iroha/iroha-js/norito";
import { generateKeyPair } from "@iroha/iroha-js/crypto";
```

עבור קישור התחלה של Connect עם הדפדפן בלבד, השתמש `@iroha/iroha-js/connect-browser` במקום לייבא את פני השטח של Node-first `ToriiClient`.

## משכנתא מקומי {#native-escrow}

יישומי JavaScript ו־TypeScript יכולים להשתמש ב־escrow המובנה באמצעות חוזי Kotodama. קמפלו קריאות מארח של escrow בעזרת `@iroha/iroha-js/kotodama-compiler`; בוני עסקאות ישירים ל־escrow מובנה אינם נחשפים כעת ב־JavaScript SDK. ראו [escrow מובנה לנכסים](/he/blockchain/escrow.md#javascript-and-typescript-kotodama) לדוגמה של קריאת מארח ל־escrow.

## הכיסוי הנוכחי {#current-coverage}

SDK מתמקד ב:

- Torii HTTP ו WebSocket עוזרים
- Norito יצרני עסקאות והנחיות
- הידור Kotodama, לרבות בניית קריאות מארח לנאמנות
- Ed25519 חתימה ודור מפתח
- סיועי דף וניסיון מחדש
- קישור עוזרים לחיזוק הדפדפן
- סיועי תחבורה של Kagemusha מוכנים, מחומקים, משוחררים ומבצעים

## ראשי תיקון מקדימה {#upstream-references}

- `javascript/iroha_js/README.md`
- `javascript/iroha_js/package.json`
