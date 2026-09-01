---
translation_locale: ar
translation_source: /help/integration-issues.md
translation_source_hash: c5f169e423806fa2a9e9d198971588d1aa0b199a28d64e8b089b9f81727550a5
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# استكشاف مشكلات التكامل {#troubleshooting-integration-issues}

يقدم هذا القسم نصائح لحل المشكلات المتعلقة بتكامل Iroha 3. إذا كانت المشكلة التي تواجهها غير مذكورة هنا، فاتصل بنا عبر [تليغرام](https://t.me/hyperledgeriroha).

## لا يمكن للعميل الاتصال {#client-cannot-connect}

تحقق من أن تكوين العميل يشير إلى عنوان Torii لنظير الشبكة:

```toml
torii_url = "http://127.0.0.1:8080/"
```

بالنسبة لشيكات CLI، مرر نفس الملف بشكل صريح:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

إذا كان نظير الشبكة يعمل في Docker أو Kubernetes، استخدم عنوان المضيف أو الخدمة الذي يمكن الوصول إليه من عملية العميل. `127.0.0.1` داخل الحاوية ليس جهاز المضيف.

لاختبارات Taira العامة، ابدأ بمسبار نقطة نهاية API غير موقع:

```bash
curl -fsS -H 'Accept: application/json' https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

إذا فشلت هذه الأوامر مع `502`، TLS، DNS، أو أخطاء نفاد الوقت، فقم بإصلاح قدرة الوصول إلى الشبكة أو انتظر نقطة النهاية العامة لشبكة الاختبار API قبل تصحيح مفاتيح الحساب أو حمولة المعاملات.

## تم رفض المعاملات {#transactions-are-rejected}

معظم حالات فشل المعاملات تحدث بسبب عدم تطابق الهوية أو التفويض:

- مفتاح الحساب العام في تكوين العميل لا يتطابق مع المفتاح الخاص المستخدم للتوقيع
- الحساب غير مسجل في جينيسيس البلوكشين أو بواسطة معاملة سابقة
- الحساب يفتقر إلى رمز الإذن أو الدور المطلوب من قبل مدقق وقت تشغيل البرنامج
- معرّف المجال يفتقد إلى تأهيل مساحة البيانات الخاصة به، مثل `domain.dataspace`

استخدم `--output-format text` أثناء تصحيح أوامر CLI حتى تكون الأخطاء أسهل في القراءة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## الاستعلامات تُعيد نتائج فارغة {#queries-return-empty-results}

نتائج الاستعلام الفارغة لا تعني دائمًا أن الاستعلام فشل. تحقق من:

- تم الالتزام بالمعاملة التي كان من المفترض أن تنشئ الكائن
- النطاق المستعلم عنه أو تعريف الأصل أو معرف الحساب هو رسمي
- التقسيم إلى صفحات أو الفلاتر لا تستبعد الصف المتوقع
- العميل متصل بالشبكة المقصودة، وليس بشبكة محلية أخرى

لتحقق من النطاقات، ابدأ بأوسع استعلام:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## تتوقف تدفقات الأحداث أو الكتل مبكرًا {#event-or-block-streams-stop-early}

تعتمد أمثلة تدفق الكتل والأحداث على نقاط نهاية البث Torii API. تحقق من أن النظير الشبكي لا يزال يعمل، ثم اختبر مع مهلة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

بالنسبة لتكاملات HTTP، قارن مسارات نقاط النهاية الخاصة بـ API مع [Torii API مرجع نقطة النهاية](/ar/reference/torii-endpoints.md) الحالي.
