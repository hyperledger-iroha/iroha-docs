---
translation_locale: ar
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# الحسابات {#accounts}

الحساب هو كيان تفويض يمكنه توقيع المعاملات وامتلاك حالة دفتر السجل على البلوكشين. في نموذج البيانات الحالي Iroha 3، `AccountId` هو بروتوكول واحد قياسي وبدون نطاق: يتم اشتقاقه من وحدة التحكم في الحساب ويتم ترميزه في الشكل الموحد للبروتوكول كـ [I105](/ar/reference/i105.md). ينتمي السياق القابل للقراءة من قبل الإنسان للنطاق ومساحة البيانات إلى ربط أسماء الحسابات المنفصلة.

## هيكل {#structure}

يحتوي `Account` المسجل على:

- `id`: البروتوكول الموحد القياسي `AccountId`
- `metadata`: بيانات وصفية عشوائية للحساب
- `label`: اسم مستعار اختياري ومستقر
- `uaid`: معرف الحساب الشامل الاختياري المستخدم بواسطة تدفقات Nexus
- `opaque_ids`: معرفات غامضة مرتبطة بـ UAID للحساب

بيانات المعاملة المستخدمة لإنشاء حساب هي `NewAccount`. تحمل نفس الهوية والبيانات الوصفية والتسمية و UAID وحقول المعرف الغامض المستخدمة من قبل الحساب المسجل.

`uaid` يُكمّل بروتوكول المعيار الفردي `AccountId`؛ فهو لا يحل محله. استخدمه عندما تحتاج خدمات Nexus إلى مُعرف مستخدم أو مؤسسة ثابت عبر مساحات البيانات، أو تسجيل يحافظ على الخصوصية، أو البحث عن قدرات الخدمة. يحافظ بيئة تنفيذ البرنامج على فهرس واحد إلى واحد UAID-إلى-الحساب، ويتطلب إرفاق معرفات غامضة من خلال UAID، ويرفض المعرفات الغامضة المكررة أو المتصادمة. انظر [FHE و UAID](/ar/blockchain/sora-nexus-services.md#fhe-and-uaid) لتدفق طبقة الخدمة Nexus.

## مراقبو الحسابات {#account-controllers}

يحدد جهاز التحكم كيفية تفويض الحساب للإجراءات. يستخدم تدفق العميل الافتراضي زوج مفاتيح Ed25519، لكن نموذج البيانات يدعم أيضًا أجهزة تحكم أكثر تعقيدًا مثل أجهزة التحكم بسياسات التوقيع المتعدد.

تخزين تكوين العميل مبدأ تفويض التوقيع بشكل منفصل عن تكوين النظراء في الشبكة:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

انظر إلى [تكوين العميل](/ar/guide/configure/client-configuration.md) و [توليد المفتاح](/ar/guide/security/generating-cryptographic-keys.md) لأشكال المفاتيح الحالية.

## شغّل سير العمل هذا على Taira {#try-it-on-taira}

قم بإدراج بعض معرفات الحساب القياسية لبروتوكول واحد من شبكة الاختبار العامة Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
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

هذه قراءات عامة. إنشاء حساب أو تحديثه هو معاملة موقعة ويتطلب إعداد Taira الممول من شبكة الاختبار الموضح في [الاتصال بمساحات البيانات SORA Nexus](/ar/get-started/sora-nexus-dataspaces.md).

## التسجيل والأذونات {#registration-and-permissions}

يتم تسجيل الحسابات وإلغاء تسجيلها مع العام [`Register` و `Unregister`](/ar/blockchain/instructions.md#un-register) التعليمات. يقرر محقق بيئة تنفيذ البرامج النشطة من يمكنه إنشاء الحسابات وما هي رموز الأذونات أو الأدوار المطلوبة.

بعد التسجيل، يمكن للحساب:

- توقيع المعاملات
- امتلاك الأصول
- النطاقات الخاصة
- استلام الأدوار ورموز الأذونات
- تخزين البيانات الوصفية
- المشاركة في تدفقات الهوية البديلة، وإعادة التشفير، والاسترداد، و Nexus عندما تكون هذه الميزات مفعلة

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
- [SORA Nexus مساحات البيانات](/ar/get-started/sora-nexus-dataspaces.md)
