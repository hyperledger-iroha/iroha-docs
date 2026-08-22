---
translation_locale: ar
translation_source: /reference/binaries.md
translation_source_hash: 2a9274f1590c2816c72625e5ffd9b93ee4c0b6bc73faf60cdc3273c1314e0c3a
translation_status: machine-validated
translation_engine: google-translate
---

# العمل مع Iroha الثنائيات {#working-with-iroha-binaries}

ال Iroha 3 يدور سير عمل المشغل حول ثلاثة ثنائيات أساسية:

- [`irohad`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/irohad) لتشغيل البرنامج الخفي النظير
- [`iroha`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_cli) ل CLI وأوامر المشغل
- [`kagami`](https://github.com/hyperledger-iroha/iroha/tree/main/crates/iroha_kagami) للمفاتيح والنشأة والشبكات المحلية والملفات الشخصية

## البناء من المصدر {#build-from-source}

من جذر مساحة العمل الأولية:

```bash
cargo build --release -p irohad -p iroha_cli -p iroha_kagami
```

ثم تتوفر ثنائيات الإصدار في `target/release/`.

لفحص سطح الأوامر:

```bash
./target/release/irohad --help
./target/release/iroha --help
./target/release/kagami --help
```

## تشغيل مباشرة من المستودع {#run-directly-from-the-repository}

إذا كنت لا ترغب في تثبيت أي شيء على مستوى العالم، استخدم `cargo run`:

```bash
cargo run --bin irohad -- --help
cargo run --bin iroha -- --help
cargo run --bin kagami -- --help
```

## Docker صورة {#docker-image}

تستخدم مساحة العمل المنبع `kagami localnet` و `kagami docker` لتوليد
Docker Compose الملفات التي تطابق رمز السحب.ال `hyperledger/iroha:dev`
يمكن استخدام الصورة مع تلك الملفات التي تم إنشاؤها.

تشغيل CLI في حاوية:

```bash
docker run -t hyperledger/iroha:dev iroha --help
```

يجري Kagami في حاوية:

```bash
docker run -t hyperledger/iroha:dev kagami --help
```

لبدء تشغيل النظير، قم بإنشاء شبكة محلية وملف الإنشاء أولاً:

```bash
cargo run --bin kagami -- localnet --build-line iroha3 --peers 4 --out-dir ./localnet
cargo run --bin kagami -- docker --peers 4 --config-dir ./localnet --image hyperledger/iroha:dev --out-file ./localnet/docker-compose.yml --force
docker compose -f ./localnet/docker-compose.yml up
```

## ما هو الثنائي الذي يجب أن أستخدمه؟ {#which-binary-should-i-use}

- يستخدم `irohad` عندما تبدأ أو تعمل مع أقرانك.
- يستخدم `iroha` عندما تحتاج إلى الاستعلام عن دفتر الأستاذ أو إرسال المعاملات أو فحص نقاط نهاية المشغل.
- يستخدم `kagami` عندما تحتاج إلى مفاتيح أو بيانات التكوين أو حزم الملفات الشخصية أو أصول الشبكة المحلية.

## إصدار Kagemusha للنشر والطرح {#kagemusha-release-publication-and-rollout}

كاجيموشا V4 النشر والتنشيط يعبران حدودًا محمية منفصلة:

- `iroha_authenticated_tool_controller promote-kagemusha-release-v4` هو
  macOS فقط، ناشر الجذر فقط.ويصادق على المثبتة Kagami ثنائي و
  المرشح الدقيق ذو الستة عشر ملفًا، ينشر الغائب
  `promotion-record-v4.norito` دون استبدال، وتقارير النجاح فقط
  بعد التحقق من الإصدار الدقيق المكون من سبعة عشر ملفًا.
- `iroha offline kagemusha rollout-v4 create-expectations` يتحقق من التوقيع
  الحجز، وأربعة أختام تأهيل المدقق أمرت، بالضبط
  سلك المعاملات المصرح به بالفعل، والمرسى النهائي الموثوق به من قبل
  نشر التوقعات الموقعة دون استبدال.
- `iroha offline kagemusha rollout-v4 submit` يتطلب صريحا
  `--write-authorized` موافقة.يقوم بتدوين المجلات بشكل دائم وإعادة التحقق من الدقة
  التوقعات قبل كتابة الشبكة أو إعادة المحاولة.ان `Applied` الوضع ليس كذلك
  بما فيه الكفاية: يتحقق الأمر أيضًا من الكتلة الملتزم بها، والخليفة النهائي
  سلسلة، وسلك المعاملات الكامل الحامل للترخيص.
- `iroha offline kagemusha rollout-v4 finalize-receipt` يجمع الأدلة نفسها
  المرتبطة بالإثبات فقط بعد إعادة التحقق من سجل الإرسال الدقيق، ويوقّعها باستخدام
  مُصدر الإيصال المستقل، وينشر الإيصال القانوني دون استبدال.

إن سير عمل جاهزية الإنتاج في Kagemusha الذي تم تسجيله هو للتحقق فقط.
لا يستدعي الناشر المعتمد، وينشر مؤهلات المدقق
الأختام أو إرسال التنشيط أو إنشاء إيصال نهائي.سير عمل ناجح
وبالتالي فإن التشغيل لا يثبت الترويج ولا النشر المباشر.

هذه الأوامر هي أوامر أولية محلية، وليست بدائل للأدلة الحية.أ
يظل طرح الإنتاج محظورًا بدون شهادة التطبيق الفعلي و
القطع الأثرية المرشحة، وجميع أختام المضيف الأربعة المحمية، وإدارة وقت التشغيل و
توقيع المدخلات، وتقديم أربعة مدققين مباشرين، والأدلة النهائية، و
إسقاط التكوين الفعال الكنسي.احتفظ بالمفاتيح الخاصة،
مواد المصادقة، والمعرفات الخاصة بالترويج في المحمية
الحضانة أثناء التشغيل؛لا تقم بنسخها إلى وثائق يتم التحكم فيها بالمصدر أو
تذاكر المشغل.
