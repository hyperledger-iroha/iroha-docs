---
translation_locale: he
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 8cdae05a133736fe528bf9d7e709af5c704e85e5f7dee09e0aa762f3214efd2d
translation_status: machine-validated
translation_engine: nllb-200-ct2
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

תצורת הצומת הנוכחית היא TOML. קשרו כ-bind mount או העתיקו את `config.toml`, את `genesis.signed.nrt` ואת קובצי המפתח הקשורים שנוצרו אל נתיבי המכולה שה-image מצפה להם, ולאחר מכן הפעילו מחדש את הצומת. שמרו את הקבצים שנוצרו יחד; ערבוב קבצים מהרצות Kagami שונות עלול לגרום לכשלי deserialization או consensus.
