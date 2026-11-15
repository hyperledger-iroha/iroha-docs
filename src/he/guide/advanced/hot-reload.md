---
translation_locale: he
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 6edc0185196ab8e77ef8552723e05bf37cca1a088da86e2a43d441d58e779c11
translation_status: machine-validated
translation_engine: nllb-200-ct2+reviewed-delta
---
# טעינה חמה של Iroha בקונטיינר Docker {#hot-reload-iroha-in-a-docker-container}

השתמשו בטעינה חמה לצורכי ניפוי שגיאות מקומי בלבד. במדריך [השקה Iroha 3](/he/get-started/launch-iroha.md) מוסבר כיצד לבנות ולהפעיל ארבעה מאמתים ב־Docker באמצעות קבצים בינאריים מאותה גרסת מקור.

## החלפת הקובץ הבינרי של הצומת {#replace-the-peer-binary}

לבנות בינרי דיימון תואם ללינוקס ממרחב העבודה העליון:

```bash
cargo build --release -p irohad --bin iroha3d --target x86_64-unknown-linux-musl
```

העתק את זה לתוך מיכל צומת פועל, ולאחר מכן להפעיל מחדש את המכול:

```bash
docker cp target/x86_64-unknown-linux-musl/release/iroha3d <container>:/usr/local/bin/iroha3d
docker restart <container>
```

השתמשו ב־`docker ps` כדי לאתר את המכולה. לפני החלפת תהליך הרקע, בדקו את הנתיב שלו בתמונת המכולה.

## תחזיר את בראשית לרשת חד פעמית {#recommit-genesis-in-a-disposable-network}

בלוק בראשית חדש מחייב אחסון ריק בצומת. כדי להפעיל מחדש את אותה רשת, הריצו `python3 poc.py down` ואז `python3 poc.py up`. שמרו את `state/` יחד עם ארבעת כרכי האחסון של Docker.

## השתמשו בהקנה מותאמת {#use-custom-configuration}

תצורת הצומת הנוכחית היא TOML. ‏Kagami כותב קובץ `peerN.toml` אחד לכל מאמת, עם `genesis.signed.nrt`, ‏`genesis.public_key` ו־`genesis.expected_hash`; קובץ ה־Compose שנוצר באמצעות `kagami docker` מעגן אותם לתוך המכולה. צרו אותו מחדש במקום להעתיק קבצים ידנית, ולאחר מכן הפעילו מחדש את הצומת. שמרו את הקבצים שנוצרו יחד; ערבוב קבצים מהרצות Kagami שונות עלול לגרום לכשלי דה־סריאליזציה או לכשלי קונצנזוס.
