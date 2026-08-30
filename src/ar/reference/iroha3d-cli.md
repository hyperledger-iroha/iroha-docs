---
translation_locale: ar
translation_source: /reference/iroha3d-cli.md
translation_source_hash: d621aa09f50cb44cb99af372100f418c44c3714b879a556038e47598949a3a6f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# `iroha3d` CLI {#iroha3d-cli}

`iroha3d` هو ديمون النظير القياسي Iroha 3. يتم تسمية حزمة Cargo `irohad`، لذلك استدعاء الثنائي من التسجيل المصدر مع:

```shell
cargo run -p irohad --bin iroha3d -- --config path/to/config.toml
```

بالنسبة للشبكة الاختبارية العامة Taira، تستخدم الصورة الإفراجية `iroha3d_taira`. تقبل نفس CLI. كما أنه يفرض سلسلة Taira القانونية، ومجموعة المحققين، وإعدادات التخزين، وأرقام توقيع وقت التشغيل. تأكيد تشكيل Taira دون فتح إثباتات وقت التشغيل مثل هذا:

```shell
iroha3d_taira --sora \
  --config /etc/iroha/taira/config.toml \
  --check-config
```

يجب على المشغل أن يعرض ملف Taira القنوني قبل الاستخدام. نموذج التسجيل لديه إعدادات مثالية يجب على المشغل استبدال كل إعداد مثالي. لا تستخدم إعدادات Nexus العامة أو الإنتاجية SoraFS عند الاختبار ضد Taira.

## `--config` {#arg-config}

- نوع: مسار الملف
- الاسم الخارجي: `-c`

المسار إلى تشكيل [ الأقارب ](/ar/reference/peer-config/index.md).

## `--genesis-manifest-json` {#arg-genesis-manifest-json}

- نوع: مسار الملف

المخطط الاختياري للإنتاج JSON يستخدم للتحقق من التوافق.

## `--check-config` {#arg-check-config}

تأكيد التكوين المحل والمواد المتاحة للجنيس، ثم الخروج دون ربط مصدرات الشبكة.

## علامات تصنيف كاغيموشا {#kagemusha-qualification-seals}

هذه خيارات طريق الملف تتطلب `--check-config` وإجراء مؤهل الكاغيموشا الكامل قبل كتابة ختم القنوني:

- `--write-kagemusha-catalog-qualification-seal <PATH>` تصحيح الكتالوج.
- `--write-kagemusha-validator-qualification-seal <PATH>` يؤهل المؤكّد المحلي على حجز الترقية الموقّع الموضّح.

خيارات الخيطين تتعارض مع بعضها البعض.

## `--trace-config` {#arg-trace-config}

- النوع: العلم
- البيئة: `TRACE_CONFIG`

تمكين السجلات أثناء قراءة طبقات التكوين وتحليلها.

## `--config-blake3` {#arg-config-blake3}

- النوع: هضم الـ 64 رقمًا BLAKE3
- متطلبات: `--config`

تطلب بايتات ملف التشغيل لتتطابق مع الجهاز المزود. يجب تسطح ملف متصل بالنزاهة؛ لا يمكن أن يحتوي على `extends`.

## `--terminal-colors` {#arg-terminal-colors}

- النموذج: بولي، تم إرسالها باسم `--terminal-colors=true` أو `--terminal-colors=false`
- الافتراضي: اكتشاف قدرة المحطة
- البيئة: `TERMINAL_COLORS`

التحكم في الناتج ANSI الملون.

## `--language` {#arg-language}

- نوع: سلسلة

قم بإلغاء لغة النظام المستخدمة لإرسال رسائل الشيطان.

## `--sora` {#arg-sora}

- النوع: العلم
- البيئة: `IROHA_SORA_PROFILE`

تمكين ملف Sora Nexus. هذا الملف يضبط SoraFS ، ومصافحة اليد SoraNet، والاتفاق متعدد المسارات. استدعاء إطلاق Taira دائما مع هذا العلم.

## FastPQ تفضيلها {#fastpq-overrides}

`--fastpq-execution-mode <MODE>` و `--fastpq-poseidon-mode <MODE>` لا تقبل سوى `cpu` أو `gpu`. الخيارات المتبقية تفوق على علامات التلفاز:

- `--fastpq-device-class <LABEL>`
- `--fastpq-chip-family <LABEL>`
- `--fastpq-gpu-kind <LABEL>`

على سبيل المثال

```shell
iroha3d --fastpq-execution-mode gpu \
  --fastpq-poseidon-mode cpu \
  --fastpq-device-class apple-m4 \
  --fastpq-chip-family m4 \
  --fastpq-gpu-kind integrated
```

## المساعدة المتولدة {#generated-help}

يتم إنتاج الناتج الكامل أدناه من الإتصال المصدر Iroha المثبت.

<<< @/snippets/iroha3d-help.md
