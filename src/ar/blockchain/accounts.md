---
translation_locale: ar
translation_source: /blockchain/accounts.md
translation_source_hash: 7a0130655b4caae240ee261bc7d2059914828da258616bc78ccff41ee455e6d3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# الحسابات {#accounts}

الحساب هو سلطة يمكنها توقيع المعاملات وتقديم بيانات رئيسية.
في الوقت الحالي Iroha 3 نموذج البيانات `AccountId` هو تقليدي وبدون مجال:
يتم استنباطها من مدير الحساب ويتم تشفيره رسمياً على I105.
سياق النطاق القراءة من قبل الإنسان ومجال البيانات ينتمي إلى أسماء حساب منفصلة
الالتزامات

## الهيكل {#structure}

شركة مسجلة `Account` يحتوي على:

- `id`: القوانين `AccountId`
- `metadata`: البيانات الأساسية الخاصة بالحساب
- `label`: اسم مستقر اختياري
- `uaid`: حساب عالمي اختياري ID يستخدمها Nexus التدفقات
- `opaque_ids`: المعرفات غير الشفافة التي ترتبط بـ حسابك UAID

الحمل المفيد للمعاملة التي تستخدم لإنشاء حساب `NewAccount`. إنه يحمل
نفس الهوية، البيانات المعدنية، العلامة، UAID, و غير شفاف ID الحقول المستخدمة من قبل
الحساب المسجل

`uaid` يكمّل القوانين `AccountId`; إنه لا يحل محلّه، استخدمه
عندما Nexus الخدمات تحتاج إلى عامل مستقر للمستخدم أو المنظمة عبر
المواقع البيانية، والسجلات الحافظة على الخصوصية، أو البحث عن قدرات الخدمة.
وقت التشغيل يحافظ على واحد إلى واحد UAID-مؤشر الحساب، يتطلب تحديدات غير واضحة
ليتم ربطها من خلال UAID, ورفض المزدوج أو التصادم غير شفاف
المعرفات انظر
[FHE و UAID](/ar/blockchain/sora-nexus-services.md#fhe-and-uaid) لـ Nexus
تدفق طبقة الخدمة.

## مراقبي الحساب {#account-controllers}

المراقب يحدد كيفية تفويض الحساب للأفعال العميل الافتراضي
تدفق يستخدم زوج مفتاح Ed25519، ولكن نموذج البيانات يدعم أيضا أكثر غنية
المراقبين مثل مراقبي سياسة التوقيع المتعدد.

تكوين العميل تخزين سلطة التوقيع بشكل منفصل عن الزملاء
التكوين:

```toml
[account]
public_key = "ed0120..."
private_key = { digest_function = "ed25519", payload = "..." }
```

انظروا [تكوين العميل](/ar/guide/configure/client-configuration.md) و
[الجيل الرئيسي](/ar/guide/security/generating-cryptographic-keys.md) لـ
أشكال المفاتيح الحالية.

## جربها Taira {#try-it-on-taira}

إدراج بعض الروايات القنونية IDs من الجمهور Taira شبكة اختبار:

```bash
curl -fsS 'https://taira.sora.org/v1/accounts?limit=5' \
  | jq -r '.items[] | [.id, (.primary_alias // "-")] | @tsv'
```

للتفتيش على أصول الحساب، نسخ حساب ID منذ المكالمة الأولى URL-الترميز
قبل وضعها في المسار. Python القصص يفعل ذلك لأول مرة
الحساب المدرج:

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

هذه قراءات عامة إنشاء أو تحديث حساب هو معاملة موقعة
ويتطلب التمويل من النوافذ Taira الإعداد الموصوف في:
[التواصل SORA Nexus البيانات](/ar/get-started/sora-nexus-dataspaces.md).

## التسجيل والإذن {#registration-and-permissions}

الحسابات مسجلة وغير مسجلة مع العلامة العامة
[`Register` و `Unregister`](/ar/blockchain/instructions.md#un-register)
الإرشادات. مؤكدة وقت التشغيل النشط يقرر من يمكنه إنشاء الحسابات
وما هي رموز الإذن أو الأدوار المطلوبة.

بعد التسجيل، يمكن للحساب:

- التوقيع على المعاملات
- الاحتفاظ بالأصول
- المجال الخاص
- تحصل على أدوار و رموز الإذن
- تخزين البيانات المعدنية
- المشاركة في الاسم الخاطئ، والإعادة التأمين، والتعويض Nexus تتدفق الهوية عندما
  يتم تمكين الميزات

## إصلاح مشكلات الهوية {#troubleshooting-identity-issues}

إذا تم رفض المعاملة بشكل غير متوقع، تحقق من أن:

- المفتاح العام للعميل يطابق المفتاح الخاص المستخدم للتوقيع
- تم تسجيل الحساب في التأليف أو من خلال معاملة ملتزمة
- السلطة لديها الإذن المطلوب من التعليمات
- الحسابات الصارمة استخدام القنوني I105 الحساب ID, بينما يمكن القراءة
  يتم حل الأسماء من خلال التزامن النشط بين الحسابات

انظر أيضاً:

- [الإذن](/ar/blockchain/permissions.md)
- [البيانات المتعددة](/ar/blockchain/metadata.md)
- [تكوين العميل](/ar/guide/configure/client-configuration.md)
- [SORA Nexus مساحات البيانات](/ar/get-started/sora-nexus-dataspaces.md)
