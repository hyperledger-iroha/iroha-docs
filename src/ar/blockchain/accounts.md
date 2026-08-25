---
translation_locale: ar
translation_source: /blockchain/accounts.md
translation_source_hash: 015a85d81c44b7ef7f13cdafb2ed8e493ef512b94dc500939655c70285eac3bd
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الحسابات {#accounts}

الحساب هو سلطة قادرة على توقيع المعاملات وحكومة كبيرة خاصة بها. في نموذج البيانات الحالية Iroha 3 ، `AccountId` كانونيكي وبدون نطاق: يتم استنباطه من مدير الحساب وتشفيرها كنونيًا باسم [I105](/ar/reference/i105.md). سياق النطاق والمساحة البيانية القابلة للقراءة من قبل الإنسان ينتمي إلى روابط منفصلة بين الحسابات المطلقة.

## الهيكل {#structure}

`Account` المسجلة تحتوي على:

- `id`: الصفحة الكنسية `AccountId`
- `metadata`: بيانات حسابية تعسفية
- `label`: اسم مستقر اختياري
- `uaid`: حساب عالمي اختياري ID يستخدم من خلال تدفقات Nexus
- `opaque_ids`: تعريفات غير واضحة مرتبطة بـ UAID الحساب

تحميل المعاملات المستخدم لإنشاء حساب هو `NewAccount`. يحمل نفس الهوية، البيانات الأساسية، الملصق، UAID، والحقول غير الشفافة ID المستخدمة من قبل الحساب المسجل.

`uaid` يضيف إلى القنوني `AccountId`؛ فإنه لا يحل محل ذلك. استخدامه عندما تحتاج خدمات Nexus لمعاملة مستقرة للمستخدم أو المنظمة عبر مساحات البيانات، والالتسجيل المحافظ على الخصوصية، أو بحث قدرات الخدمة. وقت التشغيل يحافظ على مؤشر واحد إلى واحد UAID إلى الحساب ، يتطلب إرفاق معرفات غير مرئية من خلال UAID ، ويرفض تعريفات غير مريئة مزدوجة أو تتصادم. انظر [FHE و UAID](/ar/blockchain/sora-nexus-services.md#fhe-and-uaid) لتدفق طبقة الخدمة Nexus.

## مراقبي الحسابات {#account-controllers}

يحدد المراقب كيفية تفويض الحساب للأفعال. تستخدم تدفق العميل الافتراضي زوج مفتاح Ed25519 ، ولكن نموذج البيانات يدعم أيضًا مراقبي أكثر ثراء مثل مراقبي سياسة متعددة التوقيعات.

تكوين العميل يحتوي على سلطة التوقيع بشكل منفصل عن تكوين الزملاء:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

انظر إعداد العميل [](/ar/guide/configure/client-configuration.md) و [ توليد المفاتيح ](/ar/guide/security/generating-cryptographic-keys.md) لتنسيقات المفاتيح الحالية.

## جربوا ذلك على Taira {#try-it-on-taira}

إدراج عدد قليل من الحسابات الكنسية IDs من شبكة اختبار عامة Taira:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

لتحقق من أصول الحساب، نسخ حساب ID من المكالمة الأولى URL قبل وضعها في المسار هذا Python النقطة تفعل ذلك بالنسبة للحساب الأول المدرج:

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

هذه قراءات عامة إنشاء أو تحديث حساب هو معاملة موقعة وتتطلب أن يتم تمويلها من النوافذ Taira الإعداد الموصوف في: [التواصل مع SORA Nexus مساحات البيانات](/ar/get-started/sora-nexus-dataspaces.md).

## التسجيل والإذن {#registration-and-permissions}

يتم تسجيل الحسابات وغير المسجلة مع التعليمات العامة [`Register` و `Unregister`](/ar/blockchain/instructions.md#un-register). يقرر مؤكد الوقت التشغيلي النشط من يمكنه إنشاء الحسابات وما هي رموز أو أدوار الإذن المطلوبة.

بعد التسجيل، يمكن للحساب:

- التوقيع على المعاملات
- الاحتفاظ بالأصول
- الساحات الخاصة
- تحصل على أدوار وعلامات السماح
- تخزين البيانات الأساسية
- المشاركة في التدفقات الاسمية، والريكي، والاسترداد، وتدفقات الهوية Nexus عندما يتم تمكين هذه الصفات.

## إصلاح مشكلات الهوية {#troubleshooting-identity-issues}

إذا تم رفض الصفقة بشكل غير متوقع، تحقق من أن:

- المفتاح العام للعميل يتطابق مع المفتاح الخاص المستخدم للتوقيع
- تم تسجيل الحساب في التأليف أو من خلال معاملة ملتزمة
- السلطة لديها الإذن المطلوب من التعليمات
- تستخدم حقل الحسابات الصارمة حساب I105 القنوني ID ، في حين يتم حل الأسماء القابلة للقراءة من خلال ملزمية اسم الحساب النشط.

انظر أيضاً:

- [الإذن](/ar/blockchain/permissions.md)
- [البيانات الأساسية](/ar/blockchain/metadata.md)
- [تكوين العميل](/ar/guide/configure/client-configuration.md)
- [مساحات بيانات SORA Nexus](/ar/get-started/sora-nexus-dataspaces.md)
