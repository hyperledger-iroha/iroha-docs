---
translation_locale: ar
translation_source: /blockchain/accounts.md
translation_source_hash: d956bfb8c698fa463ef9fa84a91d50cf0e2100885eba670121ad78753f87d88d
translation_status: machine-validated
translation_engine: bing-translator-llm+reviewed-delta
---
# الحسابات {#accounts}

الحساب هو جهة مخوّلة بتوقيع المعاملات وامتلاك حالة في دفتر السجل. في نموذج بيانات Iroha 3 الحالي، يُعد `AccountId` معرّفًا معياريًا لا يتضمن نطاقًا: يُشتق من المتحكم في الحساب ويُرمّز بالصيغة المعيارية [I105](/ar/reference/i105.md). أما سياق النطاق ومساحة البيانات المقروء للبشر فينتمي إلى روابط منفصلة للأسماء المستعارة للحسابات.

## هيكل {#structure}

يحتوي `Account` المسجل على:

- `id`: البروتوكول الموحد القياسي `AccountId`
- `metadata`: بيانات وصفية عشوائية للحساب
- `label`: اسم مستعار اختياري ومستقر
- `uaid`: معرف الحساب الشامل الاختياري المستخدم بواسطة تدفقات SORA Nexus
- `opaque_ids`: معرفات غامضة مرتبطة بـ UAID للحساب

بيانات المعاملة المستخدمة لإنشاء حساب هي `NewAccount`. تحمل نفس الهوية والبيانات الوصفية والتسمية و UAID وحقول المعرف الغامض المستخدمة من قبل الحساب المسجل.

يكمّل `uaid` معرّف الحساب المعياري `AccountId` ولا يحل محله. استخدمه عندما تحتاج خدمات SORA Nexus إلى معرّف ثابت لمستخدم أو مؤسسة عبر مساحات البيانات، أو إلى تسجيل يحافظ على الخصوصية، أو إلى البحث عن قدرات الخدمات. تحتفظ بيئة التنفيذ بفهرس يربط كل UAID بحساب واحد والعكس، وتشترط ربط المعرّفات المعتمة من خلال UAID، وترفض المعرّفات المعتمة المكررة أو المتصادمة. راجع [FHE وUAID](/ar/blockchain/sora-nexus-services.md#fhe-and-uaid) للاطلاع على تدفق طبقة خدمات SORA Nexus.

## مراقبو الحسابات {#account-controllers}

يحدد جهاز التحكم كيفية تفويض الحساب للإجراءات. يستخدم تدفق العميل الافتراضي زوج مفاتيح Ed25519، لكن نموذج البيانات يدعم أيضًا أجهزة تحكم أكثر تعقيدًا مثل أجهزة التحكم بسياسات التوقيع المتعدد.

تخزين تكوين العميل مبدأ تفويض التوقيع بشكل منفصل عن تكوين النظراء في الشبكة:

```toml
[account]
profile = "taira"
public_key = "ed0120..."
private_key_file = "/absolute/path/to/private.key"
```

انظر إلى [تكوين العميل](/ar/guide/configure/client-configuration.md) و [توليد المفتاح](/ar/guide/security/generating-cryptographic-keys.md) لأشكال المفاتيح الحالية.

## شغّل سير العمل هذا على Taira {#try-it-on-taira}

قم بإدراج بعض معرفات الحساب القياسية لبروتوكول واحد من شبكة الاختبار العامة Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.label // "-")] | @tsv'
```

لفحص أصول الحساب، انسخ معرف الحساب من الاستدعاء الفني الأول وقم بترميزه باستخدام URL قبل وضعه في المسار. يقوم هذا المقطع Python بذلك للحساب المدرج أولاً:

```bash
python3 - <<'PY'
import json
import urllib.parse
import urllib.request

root = "https://taira.sora.org"
accounts = json.load(urllib.request.urlopen(f"{root}/v1/accounts?limit=1"))["items"]
account_id = accounts[0]["id"]
encoded = urllib.parse.quote(account_id, safe="")
assets = json.load(
    urllib.request.urlopen(f"{root}/v1/accounts/{encoded}/assets?limit=5")
)

print(json.dumps({"account_id": account_id, "assets": assets["items"]}, indent=2))
PY
```

هذه عمليات قراءة عامة. إنشاء حساب أو تحديثه معاملة موقعة، ويتطلب إعداد Taira مع تمويل الحساب من خدمة التمويل التجريبي كما هو موضح في [التطوير على SORA Nexus باستخدام Taira وMinamoto](/ar/get-started/sora-nexus-dataspaces.md).

## التسجيل والأذونات {#registration-and-permissions}

يتم تسجيل الحسابات وإلغاء تسجيلها مع العام [`Register` و `Unregister`](/ar/blockchain/instructions.md#un-register) التعليمات. يقرر محقق بيئة تنفيذ البرامج النشطة من يمكنه إنشاء الحسابات وما هي رموز الأذونات أو الأدوار المطلوبة.

بعد التسجيل، يمكن للحساب:

- توقيع المعاملات
- امتلاك الأصول
- النطاقات الخاصة
- استلام الأدوار ورموز الأذونات
- تخزين البيانات الوصفية
- المشاركة في تدفقات الأسماء المستعارة وتغيير المفاتيح والاسترداد وهوية SORA Nexus عندما تكون هذه الميزات مفعّلة

## استكشاف مشكلات الهوية وإصلاحها {#troubleshooting-identity-issues}

إذا تم رفض المعاملة بشكل غير متوقع، تحقق من:

- مفتاح العميل العام يطابق المفتاح الخاص المستخدم في التوقيع
- تم تسجيل الحساب في أصل البلوكشين أو بواسطة معاملة مُنهية
- يمتلك صاحب التفويض الأذونات المطلوبة بموجب التعليمات
- تستخدم حقول الحساب الصارمة معرف الحساب المعياري للبروتوكول الفردي I105، بينما يتم حل الأسماء المقروءة من خلال ربط الاسم المستعار الفعال للحساب

انظر أيضًا:

- [الأذونات](/ar/blockchain/permissions.md)
- [البيانات الوصفية](/ar/blockchain/metadata.md)
- [تكوين العميل](/ar/guide/configure/client-configuration.md)
- [مساحات بيانات SORA Nexus](/ar/get-started/sora-nexus-dataspaces.md)
