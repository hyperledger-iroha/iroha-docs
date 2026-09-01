---
translation_locale: he
translation_source: /guide/advanced/hot-reload.md
translation_source_hash: 96505bdba910beb902c399004f5cd24f5e5b0773f01df9cdcfdb49d019830d03
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# טעינה חמה של Iroha בקונטיינר Docker {#hot-reload-iroha-in-a-docker-container}

השתמשו בטעינה חמה רק לאיתור תקלות מקומי. בפיתוח מקומי רגיל, העדיפו לבנות מחדש את ה־image או להפעיל מחדש את מחסנית Docker Compose שנוצרה מחבילת Kagami חדשה.

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

להשתמש ב- `docker ps` כדי לאשר את שם המכולה. בשבילה המיוצרת, המכולות הדוגמנות מוגדרות על ידי `./docker-compose.yml`.

## תחזיר את בראשית לרשת חד פעמית {#recommit-genesis-in-a-disposable-network}

צמתים מבצעים גנזה רק כאשר האחסון שלו ריק. עבור רשת Docker חד פעמית, עצור את המגרר, להסיר את מצב המיוצר, לשחזר או להחליף את חבורת הגנזה חתומה, ולהתחיל מחדש:

```bash
docker compose -f ./docker-compose.yml down
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

אל תחליפו את ה־genesis ברשת שיש לשמר את מצבה.

## השתמשו בהקנה מותאמת {#use-custom-configuration}

תצורת הצומת הנוכחית היא TOML. קשרו כ-bind mount או העתיקו את `config.toml`, את `genesis.signed.nrt` ואת קובצי המפתח הקשורים שנוצרו אל נתיבי המכולה שה-image מצפה להם, ולאחר מכן הפעילו מחדש את הצומת. שמרו את הקבצים שנוצרו יחד; ערבוב קבצים מהרצות Kagami שונות עלול לגרום לכשלי deserialization או consensus.
