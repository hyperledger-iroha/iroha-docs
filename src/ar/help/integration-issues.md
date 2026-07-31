---
translation_locale: ar
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# حل مشاكل التكامل {#troubleshooting-integration-issues}

يقدم هذا القسم نصائح حل المشاكل Iroha 3 التكامل.
لا يوصف هنا ما تجري
اتصل بنا عبر [تلغرام](https://t.me/hyperledgeriroha).

## العميل لا يستطيع الاتصال {#client-cannot-connect}

التحقق من أن تعيين العميل يشير إلى أقرانه Torii العنوان:

```toml
torii_url = "http://127.0.0.1:8080/"
```

ل: CLI التحقق من نفس الملف بشكل صريح:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

إذا دخل الزميل Docker أو Kubernetes، استخدم عنوان المضيف أو خدمة
يمكن الوصول إليها من عملية العميل. `127.0.0.1` داخل الحاوية لا
آلة المضيف.

للجمهور Taira الاختبارات، تبدأ بمسح النهائي غير الموقع:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

إذا فشلت هذه الأوامر مع `502`, TLS, DNS, أو أخطاء في التوقيت، إصلاح الشبكة
الوصول أو الانتظار إلى نقطة نهاية شبكة الاختبار العامة قبل إصلاح الحساب
المفاتيح أو حمولات المعاملة.

## يتم رفض المعاملات {#transactions-are-rejected}

معظم فشل المعاملات ناتجة عن عدم مطابقة الهوية أو الإذن:

- المفتاح العام للحساب في إعداد العميل لا يطابق المفتاح الخاص
  تستخدم للتوقيع
- لا يتم تسجيل الحساب في التكوين أو من خلال معاملة سابقة.
- الحساب يفتقر إلى رمز الإذن أو الدور المطلوب من قبل وقت التشغيل
  المؤكد
- نطاق ID يفتقر إلى مؤهلات مساحة البيانات، مثل:
  `domain.dataspace`

الاستخدام `--output-format text` أثناء إعادة التشغيل CLI أوامر بحيث تكون الأخطاء أسهل
للقراءة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## الأسئلة تعيد نتائج فارغة {#queries-return-empty-results}

نتائج البحث الفارغة لا تعني دائما فشل البحث. تحقق:

- تم إجراء المعاملة التي يجب أن تخلق الكائن
- النطاق المطلوب أو تعريف الأصول أو الحساب ID هو تقني
- الصفحة أو المرشحات لا تستبعد الصف المتوقع
- العميل متصل بالشبكة المقصودة، وليس شبكة محلية أخرى

للتحقق من النطاقات، ابدأ بأوسع استفسار:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## أوقف تدفقات الأحداث أو الحواجز مبكراً {#event-or-block-streams-stop-early}

تتمثل أمثلة الحوادث والبلوك في Torii نقطة نهاية التدفق
لا يزال الزميل يعمل، ثم اختبار مع وقف وقت:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

ل: HTTP التكاملات، مقارنة مسارات نقطة النهاية الخاصة بك مع الحالي
[Torii المرجحات النهائية](/ar/reference/torii-endpoints.md).
