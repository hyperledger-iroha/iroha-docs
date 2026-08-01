---
translation_locale: ar
translation_source: /help/integration-issues.md
translation_source_hash: f9f8a1e5f8c66714532523ef40467d3e79d4d023b3b353244f0317647e755b38
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# إصلاح مشكلات التكامل {#troubleshooting-integration-issues}

يقدم هذا القسم نصائح لحل المشاكل للتكامل مع Iroha 3. إذا لم يتم وصف المشكلة التي تواجهها هنا، اتصل بنا عبر [التليغرام](https://t.me/hyperledgeriroha).

## لا يمكن للعميل الاتصال {#client-cannot-connect}

التحقق من أن جهاز تشكيل العميل يشير إلى عنوان Torii للقرابة:

```toml
torii_url = "http://127.0.0.1:8080/"
```

للتحقق من CLI ، مرر بنفس الملف صراحة:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

إذا كان الزميل يذهب في Docker أو Kubernetes، استخدم عنوان المضيف أو خدمة التي يمكن الوصول إليها من عملية العميل. `127.0.0.1` داخل الحاوية ليست آلة مضيفة.

بالنسبة للاختبارات العامة Taira ، ابدأ بمسح النهائي غير الموقع:

```bash
curl -fsS https://taira.sora.org/status \
  | jq '{blocks, txs_approved, txs_rejected, queue_size, peers}'

curl -fsS 'https://taira.sora.org/v1/domains?limit=5' \
  | jq -r '.items[].id'
```

إذا فشلت هذه الأوامر في `502` ، TLS ، DNS ، أو أخطاء التوقيت، قم بإصلاح إمكانية الوصول إلى الشبكة أو الانتظار للنقطة النهائية العامة لشبكة الاختبار قبل تعديل مفاتيح الحسابات أو تحميلات المعاملات.

## يتم رفض المعاملات {#transactions-are-rejected}

غالبية فشل المعاملات ناتجة عن عدم مطابقة الهوية أو الترخيص:

- المفتاح العام للحساب في إعداد العميل لا يتطابق مع المفتاح الخاص المستخدم للتوقيع
- لا يتم تسجيل الحساب في الأصل أو من خلال معاملة سابقة.
- الحساب يفتقر إلى علامة الإذن أو الدور المطلوب من قبل مؤكد الوقت التشغيلي
- المجال ID يفتقر إلى تصنيف مساحة البيانات، مثل `domain.dataspace`

استخدم `--output-format text` أثناء إصلاح الأوامر CLI بحيث يكون من السهل قراءة الأخطاء:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml --output-format text ledger transaction ping --msg "hello"
```

## الأسئلة تعود إلى نتائج فارغة {#queries-return-empty-results}

نتائج البحث الفارغة لا تعني دائما أن البحث فشل. تحقق:

- تم إجراء المعاملة التي يجب أن تخلق الكائن.
- النطاق المطلوب أو تعريف الأصول، أو الحساب ID هو قائد.
- الصفحة أو المرشحات لا تستبعد الصف المتوقع
- العميل متصل بالشبكة المقصودة، وليس شبكة محلية أخرى.

للتحقق من النطاقات، ابدأ بأوسع استفسار:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger domain list all
```

## أوقف تدفقات الأحداث أو الحواجز مبكراً {#event-or-block-streams-stop-early}

تعتمد أمثلة سلسلة الحوادث والبلوك على نقاط نهاية البث Torii. التحقق من استمرار تشغيل النظير، ثم الاختبار مع وقف زمني:

```bash
cargo run --bin iroha -- --config ./localnet/client.toml ledger blocks 1 --timeout 30s
cargo run --bin iroha -- --config ./localnet/client.toml ledger events block
```

بالنسبة إلى تكاملات HTTP، قم بمقارنة مسارات نقطة النهاية الخاصة بك مع مرجع نقطة النهائية الحالية [Torii ](/ar/reference/torii-endpoints.md).
