---
translation_locale: ar
translation_source: /reference/iroha3d-cli.md
translation_source_hash: 846370e45fe0e0d605016d6722b1d50c39981f954c7d9040b87fc385eb12ac68
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` هو خادم النظراء القياسي لشبكة Iroha 3. حزمة Cargo تُسمى `irohad`، لذا نفّذ البرنامج الثنائي من نسخة عمل الشيفرة المصدرية باستخدام:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

بالنسبة لشبكة الاختبار العامة Taira، تستخدم نسخة الإصدار `iroha3d_taira`. فهي تقبل نفس CLI ولكنها بالإضافة إلى ذلك تفرض سلسلة Taira الكانونية، والمصادق، والتخزين، وملف تعريف موقع التشغيل. تحقق من تكوين Taira بدون فتح بيانات اعتماد تشغيل البرنامج بهذه الطريقة:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

استخدم نسخة ملف Taira المعياري التي استكمل المشغّل إعدادها؛ فلا يزال القالب المحفوظ في المستودع يتضمن قيمًا نائبة للنشر. لا تستبدلها بإعدادات SORA Nexus العامة أو إعدادات SoraFS الإنتاجية عند الاختبار على Taira.

## `--config` {#arg-config}

- النوع: مسار الملف
- الاسم المستعار: `-c`

المسار إلى [تكوين نظير الشبكة](/ar/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- النوع: مسار الملف

المستند الفني الاختياري لأصل البلوكتشين JSON المستخدم للتحقق من التوافق.

## `--check-config` {#arg-check-config}

تحقق من صحة التكوين المحلَّل ومواد التكوين الأساسية للبلوكتشين المتاحة، ثم اخرج دون ربط مآخذ الشبكة.

## `--json` {#arg-json}

- **النوع:** خيار تفعيل
- **يتطلب:** `--check-config`

يطبع قيم التوافق الخاصة بهذا البناء والإعدادات في كائن JSON واحد بتنسيق Norito بدلًا من السطر `Ready` أو `Pending`.

## `--check-storage` {#arg-check-storage}

- **النوع:** خيار تفعيل
- **يتعارض مع:** `--check-config`

يفحص مخزن Kura وأحدث لقطة للعقدة المتوقفة في وضع القراءة فقط باستخدام أدوات فك الترميز في هذا البناء، ويطبع النتيجة في كائن JSON واحد بتنسيق Norito، وينتهي برمز غير صفري عند الفشل. يكتسب الفحص قفل جذر مخزن Kura، ولذلك يرفض مخزنًا تحتفظ به عقدة عاملة. لا يغيّر المخزن مطلقًا ولا يفتح الأسرار المخصصة للتشغيل فقط.

## `--check-replay` {#arg-check-replay}

- **النوع:** خيار تفعيل
- **يتعارض مع:** `--check-config`، `--check-storage`

يعيد تنفيذ نسخة من مخزن العقدة المتوقفة باستخدام هذا البناء، ويطبع النتيجة في كائن JSON واحد بتنسيق Norito. ينسخ الأمر الكتل إلى دليل مؤقت، ويستعيد فيه أحدث لقطة أو يعيد تنفيذ التكوين الأولي الموقّع، ثم يعيد تنفيذ كل كتلة لاحقة. ينتهي برمز غير صفري إذا لم تنتج كتلة نتيجتها المصدّقة نفسها أو فُقد جسم كتلة مطلوبة؛ ولا يكتب في المخزن الأصلي مطلقًا ولا يفتح الأسرار المخصصة للتشغيل فقط.

## `--require-genesis-inrou-deployment-authority` {#arg-require-genesis-inrou-deployment-authority}

- **النوع:** معرّف حساب
- **يتطلب:** `--check-config`

يشترط أثناء التحقق دون اتصال أن يحتفظ هذا الحساب المسجّل بصلاحية نشر SoraCloud بعد تنفيذ التكوين الأولي الموقّع المحدد بدقة.

## `--sumeragi-assert-fresh-key` {#arg-sumeragi-assert-fresh-key}

- **النوع:** خيار تفعيل

يؤكد، عند هذا الإقلاع فقط، أن مفاتيح إجماع العقدة لم توقّع لهذه السلسلة من قبل. يحتفظ Sumeragi بسجل سلامة لكل مفتاح ولا يوقّع شيئًا في غياب السجل حتى يملك دليلًا على أنه لم يُفقد. مرّر هذا الخيار مرة واحدة عند أول إقلاع لمفتاح جديد، ولا تمرّره مطلقًا بعد فقدان البيانات.

## `--trace-config` {#arg-trace-config}

- النوع: علم
- البيئة: `TRACE_CONFIG`

تمكين سجلات التتبع أثناء قراءة وتحليل طبقات التكوين.

## `--config-blake3` {#arg-config-blake3}

- النوع: قيمة تجزئة تشفيرية سداسية عشرية مكونة من 64 رقمًا BLAKE3
- يتطلب: `--config`

يتطلب أن تتطابق بايتات ملف التكوين مع قيمة الملخص التشفيري المقدم. يجب أن يكون الملف المرتبط بالنزاهة مسطّحاً؛ لا يمكن أن يحتوي على `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- النوع: بوليان، يُمرر كـ `--terminal-colors=true` أو `--terminal-colors=false`
- الوضع الافتراضي: الكشف عن قدرة الطرفية
- البيئة: `TERMINAL_COLORS`

تحكم في المخرجات الملونة ANSI.

## `--language` {#arg-language}

- النوع: نص

تجاوز لغة النظام المستخدمة لرسائل الخادم.

## `--sora` {#arg-sora}

- النوع: علم
- البيئة: `IROHA_SORA_PROFILE`

يفعّل ملف SORA Nexus الذي يستخدمه SoraFS ومصافحة SoraNet والإجماع متعدد مسارات التنفيذ. يُستدعى مشغّل Taira دائمًا مع هذا الخيار.

## FastPQ يتجاوز {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` و `--fastpq-poseidon-mode <MODE>` يقبلان فقط `cpu` أو `gpu`. الخيارات المتبقية تتجاوز ملصقات القياس عن بعد:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

على سبيل المثال:

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## مساعدة مولدة {#generated-help}

يتبع ملخص الخيارات أعلاه تعريفات وسيطات `iroha3d` في commit المثبت لـIroha. لفحص المساعدة الدقيقة لنسخة العمل لديك، شغّل:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
