---
translation_locale: ar
translation_source: /reference/binaries.md
translation_source_hash: fd9cefe7c0f5ee2f273a06b453d11d0e9bb896a35f872297276f5e052912a035
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# العمل مع Iroha الثنائيات {#working-with-iroha-binaries}

(الـ) Iroha 3 سير عمل المشغل يدور حول ثلاث ثنائيات أساسية:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) لإدارة ديمون أقرانه
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) لـ CLI وأوامر المشغل
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) للفتاحات والجنيس والشبكات المحلية والملفات الشخصية

## بناء من المصدر {#build-from-source}

من الجذر في مساحة العمل:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ثنائيات الإفراج متوفرة بعد ذلك في `target/release/`.

للتفتيش على سطح القيادة:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## تشغيل مباشرة من مخزن {#run-directly-from-the-repository}

إذا كنت لا تريد تثبيت أي شيء عالميا، استخدم `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker الصورة {#docker-image}

يستخدم مساحة العمل في الأعلى `kagami localnet` و `kagami docker` لإنتاج
Docker Compose الملفات التي تتطابق مع رمز التسجيل `hyperledger/iroha:dev`
يمكن استخدام الصورة مع تلك الملفات التي تم إنشاؤها.

إدارة CLI في حاوية:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

أركض Kagami في حاوية:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

لبدء النظير ، قم بتوليد شبكة محلية واكتب الملف أولاً:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## أي ثنائي يجب أن أستخدم؟ {#which-binary-should-i-use}

- الاستخدام `irohad` عندما تبدأ أو تشغل أقرانهم.
- الاستخدام `iroha` عندما تحتاج إلى استفسار دفتر الكتب، أو تقديم المعاملات، أو تفتيش نقاط نهاية المشغل.
- الاستخدام `kagami` عندما تحتاج إلى مفاتيح، وكتب التكوين، أو مجموعات الملفات الشخصية، أو أصول الشبكة المحلية.
