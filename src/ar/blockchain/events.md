---
translation_locale: ar
translation_source: /blockchain/events.md
translation_source_hash: 2777cbe4e72a50c4790e50b59c3e695feb5814314cc9afccdfd994f6409c195e
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-supplemental-naming-link+reviewed-delta
---
# الأحداث {#events}

يتم إصدار إشعارات الأحداث المكتوبة عند حدوث أشياء معينة داخل البلوكشين، مثل إنشاء حساب جديد أو اكتمال عملية تثبيت بلوك. هناك أنواع مختلفة من الأحداث:

- أحداث سير عمل معالجة البرمجيات
- أحداث البيانات
- إشعارات الأحداث المستندة إلى الوقت
- تحفيز أحداث التنفيذ

## أحداث سير عمل معالجة البرمجيات {#pipeline-events}

تُصدر أحداث سير عمل معالجة البرمجيات أثناء انتقال المعاملات والكتل عبر سير العمل. يحمل حدث المعاملة تجزئة المعاملة، وارتفاع الكتلة، ومعرّفات مسار التنفيذ ومساحة البيانات، وحالةً هي: `Queued` أو `Expired` أو `Approved` أو `Rejected` مع سبب الرفض. ويحمل حدث الكتلة ترويسة الكتلة وحالةً هي: `Created` أو `Approved` أو `Rejected` مع السبب، أو `Committed` أو `Applied`.

### شغّل سير العمل هذا على Taira {#try-it-on-taira}

تحقق من أن تدفق أحداث سير عمل معالجة البرنامج العام مُثبت:

```bash
curl -fsSI https://taira.sora.org/v1/events/sse \
  | sed -n '1,12p'
```

لعرض بيانات لنقطة زمنية محددة يمكنك فحصها دون الحاجة إلى إبقاء تدفق مفتوح، اقرأ المعاملات الأخيرة في المستكشف:

```bash
curl -fsS 'https://taira.sora.org/v1/explorer/transactions?limit=5' \
  | jq '{next_cursor, txs: [.items[] | {hash, block, status, executable}]}'
```

افتح مسار SSE في الطرفية عندما تحتاج إلى الأحداث الحية:

```bash
curl -fsS -N https://taira.sora.org/v1/events/sse
```

إذا لم تُقدّم أي معاملات أثناء فتح التدفق، يمكن أن يظل الأمر صامتًا على الرغم من أن المسار صحي.

## أحداث البيانات {#data-events}

يتم إصدار أحداث البيانات عند حدوث تغيير يتعلق ببيانات دفتر الأستاذ للبلوكتشين مثل نظائر الشبكة، النطاقات، الحسابات، الأصول، تعريفات الأصول، NFTs، المحفزات، الأدوار، تهيئة السلسلة، حالة المنفذ، الأدلة، الأصول السرية، الجسور، أو الكائنات الخاصة بـ SORA Nexus. تُستخدم هذه الأنواع من الأحداث في [مرشحات أحداث البيانات](./filters.md#data-event-filters).

## إشعارات الأحداث المستندة إلى الوقت {#time-events}

يتم إصدار إشعارات الأحداث القائمة على الوقت عندما تكون رؤية حالة العالم جاهزة للتعامل مع [محفزات الوقت](./triggers.md#time-triggers).

## أحداث تنفيذ المشغّل {#trigger-execution-events}

يتم إصدار أحداث تنفيذ المشغل عندما [`ExecuteTrigger`](./instructions.md#executetrigger) يتم تنفيذ التعليمات. يتم إصدار أحداث إكمال الزناد بعد انتهاء إجراء الزناد.
