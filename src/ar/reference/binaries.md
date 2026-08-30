---
translation_locale: ar
translation_source: /reference/binaries.md
translation_source_hash: 5a36877954bec97691e45697680bfbd6e0a7c7695e48a796bc7c9a41d4756644
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# العمل مع الثنائيات Iroha {#working-with-iroha-binaries}

سير عمل عامل Iroha 3 يدور حول أربع ثنائيات أساسية:

- [`iroha3d`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/irohad) لإدارة ديمون زميل
- `iroha3d_taira` لمطلق المصادقة القنوني Taira
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_cli) لـ CLI وأوامر المشغل
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/0010c5a70039eac101a4846499ba9ceaf43eb65c/crates/iroha_kagami) للمفاتيح والجنيس والشبكات المحلية والملفات الشخصية.

## بناء من مصدر {#build-from-source}

من الجذر في مساحة العمل الصعودية:

```bash
cargo build --release \
  -p irohad --bin iroha3d --bin iroha3d_taira \
  -p iroha_cli --bin iroha \
  -p iroha_kagami --bin kagami
```

ثنائيات الإفراج متوفرة بعد ذلك في `target/release/`.

للتفتيش على سطح القيادة:

```bash
./target/release/iroha3d --help
./target/release/iroha3d_taira --help
./target/release/iroha --help
./target/release/kagami --help
```

## تشغيل مباشرة من مخزن {#run-directly-from-the-repository}

إذا كنت لا تريد تثبيت أي شيء عالميا، استخدم `cargo run`:

```bash
cargo run -p irohad --bin iroha3d -- --help
cargo run -p irohad --bin iroha3d_taira -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker صورة {#docker-image}

يستخدم مساحة العمل المباشرة `kagami localnet` و `kagami docker` لتوليد ملفات Docker Compose تتطابق مع الرمز الذي تم التحقق منه. يمكن استخدام صورة `hyperledger/iroha:dev` مع تلك الملفات التي يتم إنشاؤها.

إدراج CLI في حاوية:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

إدارة Kagami في حاوية:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

لتشغيل الزملاء ، قم بتوليد شبكة محلية وتجميع الملف أولاً:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./docker-compose.yml --force
docker compose -f ./docker-compose.yml up
```

## أي ثنائي يجب أن أستخدم؟ {#which-binary-should-i-use}

- استخدم `iroha3d` عند بدء أو تشغيل الأقران خارج إصدار المؤكد العام Taira.
- استخدم `iroha3d_taira --sora` فقط لتنفيذ مؤكد Taira القنوني؛ فإنه يفرض سلسلة Taira، وتخزين، وموقع التوقيع في وقت تشغيله.
- استخدم `iroha` عندما تحتاج إلى استفسار دفتر الرسوم الكبرى أو تقديم المعاملات أو فحص نقاط النهاية للمشغل.
- استخدم `kagami` عندما تحتاج إلى مفاتيح أو إشعارات التكوين أو مجموعات الملفات الشخصية أو أصول localnet.
