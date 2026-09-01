---
translation_locale: ar
translation_source: /reference/iroha3d-cli.md
translation_source_hash: bf4a63b05a149f0c935190b63cdb838b0a0265e99baedfc9b5bf00a9e621b108
translation_status: machine-validated
translation_engine: bing-translator-llm
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

استخدم النموذج الذي تم إنشاؤه بواسطة المشغل للملف الشخصي القياسي Taira؛ لا يزال القالب المحفوظ يحتوي على عناصر نائب للنشر. لا تقم باستبدال الإعدادات العامة Nexus أو إعدادات الإنتاج SoraFS عند الاختبار مقابل Taira.

## `--config` {#arg-config}

- النوع: مسار الملف
- الاسم المستعار: `-c`

المسار إلى [تكوين نظير الشبكة](/ar/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- النوع: مسار الملف

المستند الفني الاختياري لأصل البلوكتشين JSON المستخدم للتحقق من التوافق.

## `--check-config` {#arg-check-config}

تحقق من صحة التكوين المحلَّل ومواد التكوين الأساسية للبلوكتشين المتاحة، ثم اخرج دون ربط مآخذ الشبكة.

## أختام مؤهلات كاجيموشا {#kagemusha-qualification-seals}

تتطلب خيارات مسار الملف هذه `--check-config` وتقوم بإجراء التأهيل الكامل لكاجيموشا قبل كتابة الختم الرسمي:

- `--write-kagemusha-catalog-qualification-seal <PATH>` يؤهل الكتالوج.
- `--write-kagemusha-validator-qualification-seal <PATH>` يؤهل المدقق المحلي مقابل حجز الترقية الموقع المكون.

خياري الختم يتعارضان مع بعضهما البعض.

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

قم بتمكين ملف تعريف Sora Nexus المستخدم بواسطة SoraFS، والمصافحة SoraNet، والتوافق متعدد المسارات. يتم دائمًا استدعاء مشغل Taira مع هذا العلم.

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

يتم التحقق من ملخص الخيار أعلاه مقابل تعريفات الوسيط الحالية `iroha3d`. لا يتم عرض عرض بيانات المساعدة المولدة والمحقق أثناء تسجيل الدخول بشكل متعمد بينما تكون حالة مصدرها قيد الانتظار. لفحص المساعدة الدقيقة لعملية تسجيل الخروج الخاصة بك، قم بتشغيل:

```shell
cargo run --locked -p irohad --bin iroha3d -- --help
```
