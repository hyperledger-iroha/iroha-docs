---
translation_locale: ur
translation_source: /get-started/atomic-private-settlement.md
translation_source_hash: d4c2c1a4e29e0352ac20be5320f79a2686527d55a19d65a6154aedcd63fa447e
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# ڈیٹا اسپیسز کے درمیان ایٹمی نجی تصفیہ چلائیں {#run-atomic-private-cross-dataspace-settlement}

`AtomicPrivateSettlementV1`، SORA Nexus کی 2 سے 255 ڈیٹا اسپیسز میں سے ہر ایک میں خفیہ تصفیے کے ایک مرحلے کو ہم آہنگ کرتا ہے اور تمام مراحل کو ایک عالمی اسٹیٹ ٹرانزیکشن میں حتمی شکل دیتا ہے۔ مسترد، زائد المیعاد یا منسوخ شدہ بنڈل کا کوئی مرحلہ نافذ نہیں ہوتا۔ شفاف Native AMX DvP/PvP ایک الگ پروٹوکول راستہ رہتا ہے۔

::: warning ریلیز کی حیثیت
یہ خصوصیت گورننس کے تحت ہے، بطور ڈیفالٹ غیر فعال ہے اور ابھی پیداواری استعمال کے لیے اہل نہیں۔ اسے حقیقی CBDC قدر کے لیے اس وقت تک فعال نہ کریں جب تک متعلقہ عین ریلیز فعالیت، رازداری، خرابی برداشت، کارکردگی، قابلِ تکرار تعمیر، آزاد کرپٹوگرافک جائزے اور آرٹیفیکٹ کی اشاعت سے متعلق تمام شائع شدہ جانچ مراحل سے کامیابی سے نہ گزر جائے۔
:::

## پروٹوکول کیا چھپاتا ہے {#what-the-protocol-hides}

ہر مرحلہ دو مقررہ ان پٹس اور تین مقررہ آؤٹ پٹس والی نجی نوٹ کی دلیل استعمال کرتا ہے۔ کمیٹی کے توثیق کنندگان دلیل اور غیر شفاف اسٹیٹ منتقلی کی تصدیق کرتے ہیں؛ انہیں فریقین، اثاثہ، رقم، میمو یا کاروباری نتیجہ سادہ متن میں نہیں ملتا۔ ایک مجاز مقامی آڈیٹر بھرا ہوا آڈٹ کیپسول decrypt کرتا ہے، اس کے مندرجات کی جانچ کرتا ہے اور مخصوص مقصد کے لیے الگ منظوری پر دستخط کرتا ہے۔ ڈیفالٹ پالیسی زیرِ حکمرانی آڈیٹر مجموعے سے ایک منظوری قبول کرتی ہے۔

عوامی حامل ٹرانزیکشن اور رسید جان بوجھ کر ظاہر کرتے ہیں:

- نیٹ ورک اور بنڈل کے شناخت کنندگان
- شرکاء کے ڈیٹا اسپیس روٹس اور شرکاء کی تعداد
- وقت اور میعاد ختم ہونے کی بلندیاں
- مستحکم غیر شفاف پول شناخت کنندگان، جڑیں، nullifiers، commitments اور مقررہ ciphertext سلاٹس
- کمیٹی کی authorities اور دستیابی، Prepare اور Commit کے عین 3-of-4 سرٹیفکیٹس
- اسپانسر، عوامی نیٹ ورک فیس اور حتمی حیثیت

یہ مواد کی رازداری ہے، ٹریفک کے بہاؤ کی گمنامی نہیں۔ وقت، شرکاء کی تعداد، ڈیٹا اسپیس کی شناخت اور مستحکم پول کی سرگرمی عوامی رہتی ہے۔ اگر کسی ڈیٹا اسپیس میں صرف ایک CBDC موجود ہو تو راستے سے اثاثے کا اندازہ بھی لگایا جا سکتا ہے، اگرچہ کوئی صریح اثاثہ شناخت کنندہ شائع نہ کیا گیا ہو۔

## تعیناتی کی ضروریات {#deployment-requirements}

فعال کرنے سے پہلے آپریٹرز کو درج ذیل تمام چیزیں درکار ہیں:

1. ہر شریک ڈیٹا اسپیس کے لیے بالکل چار توثیق کنندگان، الگ BLS اتفاقِ رائے کلیدوں اور ملکیت کے ثبوتوں کے ساتھ
2. ہر بلندی کے لیے لازمی Sumeragi DA/RBC فعال ہو
3. ہر ڈیٹا اسپیس میں زیرِ حکمرانی خفیہ تصفیہ پول اور ابتدائی جڑ
4. فعال V1 نجی نوٹ صلاحیت اور الگ تصفیہ دلیل پروفائل
5. کم از کم ایک زیرِ حکمرانی مقامی `PrivateSettlementAuditPolicyV1`، جس میں آڈیٹر کے دستخط اور hybrid-encryption کی الگ کلیدیں، کلیدی دور، بلندی کی میعاد اور منظوری کی حد شامل ہوں
6. مقررہ برقرار رکھنے کی مدت کے لیے نجی معاون ریکارڈز کا کافی ذخیرہ
7. ایک غیر جانبدار سپانسر اکاؤنٹ جو حتمی عوامی حامل ٹرانزیکشن کو پیش کرنے کے قابل ہو

ایک آڈیٹر توثیق کنندہ بھی چلا سکتا ہے، لیکن اسے اتفاقِ رائے، آڈیٹر دستخط اور آڈیٹر encryption کے لیے الگ کلیدیں استعمال کرنا ہوں گی۔ ریگولیٹری برقرار رکھنے کی مدت تک سبک دوش کی گئی decryption کلیدیں محفوظ رکھیں، یا انہیں سبک دوش کرنے سے پہلے کیپسول کی دوبارہ wrapping کو گورننس کے تحت لائیں اور آزمائیں۔

چار توثیق کنندگان کی authority اسٹیٹ میں لنگر انداز ہے؛ کلائنٹ اسے فراہم نہیں کرتا۔ مینی فیسٹ کے `authority_context_height` پر ہر توثیق کنندہ اتفاقِ رائے کی اسٹیٹ سے lane/dataspace کی عین مرتب فہرست اور فعال lane incarnation اخذ کرتا ہے، اخذ کردہ بلندی کے مطابق ہونے کا تقاضا کرتا ہے، اور چار BLS کلیدوں اور ملکیت کے ثبوتوں کی تصدیق کرتا ہے۔ Upload، Prepare اور حتمی رسید کا داخلہ سب اسی تاریخی authority کو استعمال کرتے ہیں۔

## داخلے کی ترتیب {#configure-admission}

تمام پیداواری رویہ نوڈ کی ترتیب سے آتا ہے۔ ماحولیاتی متغیرات اس راستے کو فعال نہیں کر سکتے۔ فراہم کردہ ڈیفالٹ `enabled = false` ہے؛ خصوصیت کو غیر فعال چھوڑنے کے لیے تصفیے سے مخصوص کسی ترتیب کی ضرورت نہیں۔

گورننس نے مطلوبہ صلاحیت کو رجسٹر کرنے اور مناسب اطلاع کے ساتھ ایکٹیویشن اونچائی کا انتخاب کرنے کے بعد، ہر متعلقہ نوڈ کو مستقل طور پر ترتیب دیں:

```toml
[nexus.atomic_private_settlement]
enabled = true
activation_height = 500000
minimum_activation_notice_blocks = 7200
proof_profile_version = 1
max_participants = 255
max_expiry_blocks = 7200
audit_timeout_blocks = 1200
prepare_timeout_blocks = 1200
commit_timeout_blocks = 1200
capsule_padding_classes_bytes = [4096, 16384, 65536, 262144]
max_proof_bytes = 8388608
max_capsule_bytes = 1048576
max_carrier_bytes = 4194304
sidecar_retention_blocks = 1000000
sidecar_max_records = 256
sidecar_max_total_bytes = 3221225472
default_min_auditor_approvals = 1
permitted_policy_versions = [1]
```

مثال فراہم کردہ V1 حدود استعمال کرتی ہے، کارکردگی کی سفارش نہیں۔ عملی حدود منتخب کرنے سے پہلے مطلوبہ hardware پر storage، proof، capsule، حامل ٹرانزیکشن اور latency کی عملی حدیں ناپیں۔ تینوں مرحلوں کے timeouts کو `max_expiry_blocks` کے اندر ہونا چاہیے، اور معاون ریکارڈز کی retention کم از کم اس expiry window کے برابر ہونی چاہیے۔

`max_capsule_bytes` پورے `PrivateSettlementAuditCapsuleV1` کی کینونیکل Norito encoding کو محدود کرتا ہے: AAD، nonce، ciphertext، vector framing، آڈیٹر شناختیں اور ہر wrapped-DEK قطار۔ یہ صرف ciphertext کی حد نہیں۔ ہر ترتیب شدہ padding class کو کم از کم `default_min_auditor_approvals` آڈیٹرز کے لیے محتاط اندازے والی مکمل کیپسول حد میں سما جانا چاہیے۔ Torii نئی داخل شدہ ایسی پالیسی کو بھی مسترد کرتا ہے جس کا `min_approvals` زیرِ حکمرانی کم از کم حد سے نیچے ہو، اور ہر اس حقیقی کیپسول کو بھی جس کی مکمل کینونیکل encoding بہت بڑی ہو۔

`max_carrier_bytes` مکمل کینونیکل، اسپانسر کے دستخط شدہ ٹرانزیکشن کو محدود کرتا ہے، صرف مصدقہ بنڈل کو نہیں۔ گنتی میں رجسٹرڈ ہدایت کی framing، ٹرانزیکشن authority اور metadata، فیس کا ارادہ اور دستخط شامل ہیں۔ نیٹ ورک کی عام ٹرانزیکشن حدود بدستور الگ بالائی حد کے طور پر نافذ رہتی ہیں۔

اگر governed capability فعال نہ ہو، اس کی state اور activation heights نوٹس کی مدت پوری نہ کریں، compiled proof profile V1 سے مطابقت نہ رکھے، یا on-chain pool اور audit records تازہ نہ ہوں تو activation fail closed ہوتی ہے۔ صرف configuration flag کو فعال کرنا ناکافی ہے۔

## تصفیے کا عملی بہاؤ {#settlement-workflow}

کلائنٹ مقامی طور پر دلائل اور خفیہ کردہ کیپسول بناتا ہے۔ خفیہ گواہوں کو native wallet یا native worker ہی میں رہنا چاہیے؛ انہیں application logs، Python objects، HTTP requests یا پائیدار coordination records میں serialize نہ کریں۔

کیپسول اور ہر آڈیٹر کے DEK-wrap کے authenticated data میں عین اسٹیٹ سے منسلک کمیٹی کا digest اور `authority_context_height` شامل ہوتے ہیں، نیز نیٹ ورک، route/incarnation، بنڈل، مرحلہ، پالیسی، کلیدی دور اور plaintext commitment بھی۔ wrapped key کو کسی مختلف roster یا تاریخی authority context میں منتقل نہیں کیا جا سکتا۔

ہر کینونیکل مرحلے کے لیے کوآرڈینیٹر یہ ترتیب انجام دیتا ہے:

1. عارضی خفیہ کردہ مواد چاروں توثیق کنندگان کو upload کریں اور عین 3-of-4 کینونیکل availability certificate حاصل کریں۔
2. ایک مجاز آڈیٹر سے اس کا کیپسول حاصل اور decrypt کروائیں، عوامی bindings دوبارہ شمار کروائیں، مقامی پالیسی نافذ کروائیں اور منظوری جمع کروائیں۔
3. چاروں توثیق کنندگان سے Prepare votes طلب کریں۔ ہر توثیق کنندہ آزادانہ تصدیق کرتا ہے اور ووٹ دینے سے پہلے delta کو پائیدار طور پر stage کرتا ہے۔ ہر staged جواب دہندہ پر کینونیکل 3-of-4 Prepare certificate محفوظ کریں۔
4. جب ہر مرحلے کے پاس Prepare certificate ہو تو ناقابلِ تبدیلی مکمل Prepare barrier بنائیں۔ کینونیکل 3-of-4 Commit certificates طلب اور محفوظ کریں۔ اگر کوآرڈینیٹر دوبارہ شروع ہو تو شریک نوڈز سے مقامی طور پر پائیدار Prepare اور Commit certificates طلب کریں، quorum کے مساوی کینونیکل certificate منتخب کریں اور آگے بڑھنے سے پہلے اسے دوبارہ تقسیم کریں؛ کسی غیر مصدقہ مقامی cache سے certificate کبھی دوبارہ نہ بنائیں۔
5. مینی فیسٹ کے اسپانسر سے دستخط کروائیں اور بالکل ایک عالمی حامل ٹرانزیکشن جمع کریں۔ حامل ٹرانزیکشن میں ایک `FinalizeAtomicPrivateSettlementV1` ہدایت اور عین وہی مکمل تصدیق شدہ بنڈل شامل ہوتا ہے۔ کوآرڈینیٹر اور WSV کی پیشگی جانچ، رجسٹرڈ ہدایت کی فریمنگ سمیت، مکمل boxed finalization instruction کا حجم ناپتی ہے۔ Torii اور core one-shot حامل ٹرانزیکشن binding اختیار، میٹا ڈیٹا، فیس کے ارادے اور دستخط سمیت عین canonical اسپانسر-دستخط شدہ ٹرانزیکشن پر `max_carrier_bytes` نافذ کرتے ہیں۔ Torii کسی حامل ٹرانزیکشن کو اس کا authority context بنانے سے پہلے ہی مسترد کر دیتا ہے اگر وہ expiry تک finality تک پہنچ سکنے والی آخری ingress height پر یا اس کے بعد پہنچے، یا governed expiry span سے باہر ہو۔
6. عالمی finality تک عوامی بنڈل کی حیثیت اور رسید query کریں۔ مقامی معاون ریکارڈ کی اسٹیٹ کو اس وقت تک عارضی سمجھیں جب تک وہ ناقابلِ تبدیلی عالمی حتمی ریکارڈ سے مطابقت نہ کر لے۔

Rust کلائنٹ اس بہاؤ کو `certify_and_upload_private_settlement_legs_v1` ، `prepare_private_settlement_bundle_v1`، `commit_private_settlement_bundle_v1`، اور `submit_private_settlement_bundle_v1` سمیت طریقوں کے ذریعے ظاہر کرتا ہے۔ دوبارہ آغاز کے لحاظ سے محفوظ ہم آہنگی `recover_or_prepare_private_settlement_bundle_v1` اور `recover_or_commit_private_settlement_bundle_v1` استعمال کرتی ہے۔ کمیٹی اور آڈیٹر کالز میں واضح کردار کی اسناد کی ضرورت ہوتی ہے؛ وہ عام اکاؤنٹ دستخط کرنے والے کا دوبارہ استعمال نہیں کرتے ہیں۔

## آڈیٹر پالیسی کو محفوظ طریقے سے تبدیل کریں {#rotate-an-auditor-policy-safely}

رازداری کی گورننس سے مجاز `RotatePrivateSettlementPoolPolicyV1` ہدایت استعمال کریں۔ اسے موجودہ گورننس ڈائجسٹ کا عین نام دینا، وہی route، pool اور asset-binding commitment برقرار رکھنا، گورننس revision کو ایک بڑھانا، لازماً نیا key epoch اور مختلف پالیسی اور گورننس ڈائجسٹ استعمال کرنا، اور rotation والے بلاک پر فعال ہونا چاہیے۔ pool frontier، roots، nullifiers، outputs، replay sets اور finalized receipts محفوظ رہتے ہیں۔ rotation کی activation height پر اسی route/pool کو چھونے والی receipt شامل نہ کریں؛ ہدایت اس حد کو مسترد کرتی ہے۔

عوامی پول کا پروجیکشن منسوخ شدہ پالیسی کی تمام تر نظرثانیوں کا مکمل سلسلہ محفوظ رکھتا ہے۔ لہٰذا روٹیشن سے پہلے حتمی ہونے والی رسید دوبارہ آغاز کے بعد بھی درست رہتی ہے، اور عین اسی رسید کو دوبارہ چلانا idempotent رہتا ہے۔ یہ سلسلہ نامکمل کام کی اجازت نہیں دیتا: پرانی پالیسی کا کوئی بھی بنڈل جو ایکٹیویشن کی حد پار کرے، عالمی حالت میں تبدیلی سے پہلے fail closed ہو جاتا ہے۔ ذخیرہ شدہ کیپسول کھولنے کے لیے درکار ہر پرانی decryption key کو برقرار رکھیں، یا اسے تلف کرنے سے پہلے زیرِ حکمرانی اور آزمودہ capsule rewrap مکمل کریں۔

## Torii روٹ فیملی {#torii-route-family}

یہ راستے کینونیکل Norito request اور response objects استعمال کرتے ہیں۔ مصدقہ اور محدود responses نجی `no-store` cache رویہ استعمال کرتے ہیں۔

|آپریشن |طریقہ کار اور راستہ |مجاز شناخت |
| ------------------ | -------------------------------------------------------------------------- | --------------------------- |
|تصفیے کا مرحلہ upload کریں |`POST /v1/nexus/private-settlements/legs` |کینونیکل اکاؤنٹ دستخط |
|دستیابی کا حصہ |`POST /v1/nexus/private-settlements/legs/availability-shares` |کینونیکل اکاؤنٹس کی دستخط |
|Prepare vote |`POST /v1/nexus/private-settlements/phases/prepare-votes` |کینونیکل اکاؤنٹ دستخط |
|Commit vote |`POST /v1/nexus/private-settlements/phases/commit-votes` |کینونیکل اکاؤنٹ دستخط |
|مرحلے کا QC محفوظ کریں |`POST /v1/nexus/private-settlements/phases/certificates` |کینونیکل اکاؤنٹ دستخط |
|مرحلے کے QCs بازیافت کریں | `GET /v1/nexus/private-settlements/legs/{payload_digest}/phase-certificates` | مینی فیسٹ اسپانسر |
|مرحلے کی حیثیت |`GET /v1/nexus/private-settlements/legs/{payload_digest}/status` |کینونیکل اکاؤنٹ دستخط |
|کمیٹی کا ثبوت |`GET /v1/nexus/private-settlements/legs/{payload_digest}/committee-proof` |عین roster کا توثیق کنندہ |
|آڈٹ کیپسول |`GET /v1/nexus/private-settlements/legs/{payload_digest}/audit-capsule` |حکمرانی شدہ آڈیٹر |
|آڈیٹر کی منظوری |`POST /v1/nexus/private-settlements/legs/{payload_digest}/audit-approvals` |حکمرانی شدہ آڈیٹر |
|حتمی کاری/منسوخی بھیجیں |`POST /v1/nexus/private-settlements/bundles` |مینی فیسٹ اسپانسر |
|بنڈل کی حیثیت |`GET /v1/nexus/private-settlements/bundles/{bundle_id}` |عوامی |
|رسید یا منسوخی |`GET /v1/nexus/private-settlements/bundles/{bundle_id}/receipt` |عوامی |

عوامی حیثیت اور رسید کی APIs صرف دستاویزی عوامی فیلڈز ظاہر کرتی ہیں۔ خاص طور پر، عام leg کی حیثیت منظوریوں کی تعداد یا زیرِ حکمرانی auditor threshold ظاہر نہیں کرتی۔ محدود reads جان بوجھ کر غائب، غیر مجاز، اور retention-expired مواد کو ایک ہی unavailable response class میں یکجا کرتی ہیں۔ جمع کرانے کا روٹ اسپانسر کے دستخط شدہ حتمی کاری یا منسوخی کے عین ایک براہ راست حکم کو قبول کرتا ہے۔ اس کے `202` جواب میں صرف بنڈل ID، مشاہدہ شدہ داخلہ اونچائی اور حامل ٹرانزیکشن ہیش شامل ہوتے ہیں؛ یہ دعویٰ نہیں کرتا کہ قطار میں موجود منسوخی پہلے ہی حتمی ہو چکی ہے۔ SDKs دونوں شناخت کنندگان کو کینونیکل، درست چیک سم والے Norito `Hash` JSON لٹریلز اور اونچائی کو عین غیر علامتی 64-bit صحیح عدد ہونے کا تقاضا کرتے ہیں؛ غائب، اضافی، غلط قسم کے، غیر کینونیکل، غلط چیک سم والے، منفی، منفی صفر، کسری یا حد سے متجاوز فیلڈز محفوظ طور پر مسترد ہو جاتے ہیں۔ مستند حتمی حالت کے لیے بنڈل کی حیثیت یا رسید استعمال کریں۔ اسٹیٹس کوڈ بھی عین متعین ہے: اس حامل ٹرانزیکشن داخلہ روٹ کے لیے `202` درکار ہے، جبکہ نجی تصفیہ V1 کے ہر دوسرے کامیاب جواب کے لیے `200` درکار ہے۔ کلائنٹس متبادل کامیاب `2xx` کوڈز کو معاہدے سے انحراف سمجھ کر مسترد کرتے ہیں اور کلائنٹ کی خرابیوں میں غیر متوقع جوابی باڈی کو نہیں دہراتے۔ وہ سرور کا مسترد کوڈ صرف اس وقت ظاہر کرتے ہیں جب وہ `[A-Za-z0-9_.:-]{1,128}` سے مطابقت رکھتا ہو، اور جواب کے تجزیے یا توثیق کی وجوہات کو خارج کر دیتے ہیں، یوں باڈی کے مواد یا حملہ آور کے منتخب کردہ JSON فیلڈ ناموں کو وجوہات دکھانے والے لاگز میں دوبارہ ظاہر ہونے سے روکتے ہیں۔

## ناکامی اور بازیابی {#failure-and-recovery}

غائب یا پرانی آڈیٹر منظوری، تین سے کم توثیق کنندہ votes، غلط roots یا epochs، duplicate nullifiers، بدلے گئے proofs یا capsules، مراحل کی غیر کینونیکل ترتیب، زائد المیعاد bundles اور غیر مطابق reimbursement شرائط—سب عالمی تبدیلی سے پہلے ناکام ہو جاتے ہیں۔ Commit certificates کبھی نجی اسٹیٹ تبدیل نہیں کرتے۔

توثیق کنندگان معاون ریکارڈز، staged deltas اور phase certificates کو تسلیم کرنے سے پہلے fsync کرتے ہیں۔ دوبارہ آغاز پر وہ canonical durable records سے reservations دوبارہ بناتے ہیں، پھر ناقابلِ تبدیلی global receipts، abort markers یا expiry کو ہم آہنگ کرتے ہیں۔ زیرِ نگرانی reconciler ہم زمانی سے مشاہدہ شدہ authoritative height پر terminal retention pruning بھی چلاتا ہے، خواہ ہم آہنگ کرنے کے لیے کوئی terminal candidate نہ ہو، اور pruning error پر fail closed ہو جاتا ہے۔ صرف authoritative global terminal record ہی staged locks جاری کرتا ہے۔ عین ایک جیسی finalized receipt کو replay کرنا idempotent ہے؛ متصادم replay تعین شدہ انداز میں ناکام ہوتا ہے۔

reservation کی شناخت میں مکمل route شامل ہے۔ pool heads، `(route, pool_id, epoch, root)`؛ nullifiers، `(route, pool_id, nullifier)`؛ اور outputs، `(route, pool_id, commitment)` استعمال کرتے ہیں۔ کسی دوسرے route پر برابر غیر شفاف اقدار آزاد ہیں؛ عین route کا تصادم دوبارہ آغاز کے بعد بھی مقفل رہتا ہے۔

عملی alerts میں صرف غیر شفاف bundle، route، phase، digest، height اور reason-class فیلڈز استعمال کریں۔ decrypted capsules، account یا asset identifiers، amounts، memos، view data، proof witnesses یا parser payloads کو کبھی logs، events، metrics labels یا tracing spans میں نہ رکھیں۔

## حقیقی قدر سے پہلے کی اہلیت {#qualification-before-real-value}

آپ جس عین تعمیر اور configuration کو تعینات کرنا چاہتے ہیں، اس کے لیے ایسے ثبوت محفوظ کریں جو درج ذیل کا احاطہ کریں:

- adversarial proof، capsule، policy، key rotation، reimbursement اور replay کے معاملات
- 2، 3، 4، 8 اور 16 ڈیٹا اسپیسز کے لیے حقیقی چار توثیق کنندہ processes، جن میں توثیق کنندہ اور کوآرڈینیٹر restarts، authenticated 5%، 10% اور 20% message loss، phase partitions، recovery اور persistence-boundary crashes شامل ہوں
- Torii، P2P، blocks، Kura، snapshots، queries، events، logs اور telemetry میں canary اور differential leakage analysis
- ہر حقیقی نیٹ ورک participant count کے لیے کم از کم پانچ warmups اور تیس ناپے گئے bundles، جن کے ساتھ p50، p95، p99، confidence intervals، resources، traffic، proof اور receipt sizes، اور control کے طور پر شفاف AMX ہو
- سخت workspace tests، lint اور format checks، randomized seeds، soak، reproducible builds، SBOMs اور signed artifact hashes
- دونوں رسمی تہیں: 3/255 مراحل کی count-symmetry جانچ، اور عین چار توثیق کنندہ، committee-indexed configurations—توثیق کنندہ پر مرکوز N=2 کے ساتھ مکمل محدود خرابی، مقالے کی بنیادی N=3 خرابی، صاف N=4، اور N=3 expiry/replay—جن میں خرابی کے budgets ہر committee کے لیے آزاد ہوں
- proof relation، dummy-slot selectors، asset اور capsule bindings، reimbursement relation، cryptography اور cross-dataspace state machine کا آزاد جائزہ

خام اور صاف کیے گئے ثبوت، threat model، protocol argument، حدود، commit ID، hardware description اور audit reports کو ناقابلِ تبدیلی DOI-backed artifact میں شائع کریں۔ صرف repository tests اس خصوصیت کو پیداواری استعمال کے اہل CBDC تصفیہ نظام میں تبدیل نہیں کرتے۔

آخری صاف Iroha چیک آؤٹ سے ریلیز سورس انوینٹری بنائیں اور اسے اس چیک آؤٹ سے باہر پہلے سے موجود بنڈل روٹ میں سیل کریں:

```sh
python3 scripts/private_settlement_source_evidence.py \
  --repository-root . \
  --bundle-root /absolute/path/to/release-bundle
```

پروڈیوسر اسٹیج شدہ، غیر اسٹیج شدہ، غیر ٹریک شدہ یا غیر ضم شدہ فائلوں، اور گرفت کے دوران سورس میں کسی بھی تبدیلی پر ناکام ہو جاتا ہے۔ یہ خام کمیٹ آبجیکٹ، کینونیکل Git ٹری انوینٹری، بائنری پاتھز کی عین فہرست، قطعی سورس سیل اور `Cargo.lock` محفوظ رکھتا ہے؛ اس کے JSON نتیجے میں موجود ہر آرٹیفیکٹ اعلامیے کو آخری ریلیز مینی فیسٹ میں شامل کریں۔ یہ آخری DOI بنڈل تصدیق کنندہ یا کسی بیرونی ریلیز گیٹ کی شرط ختم نہیں کرتا۔

سورس سیل قابل انتقال ہے اور خرابی کی صورت میں محفوظ طور پر بند رہتا ہے: پروڈیوسر اور آخری تصدیق کنندہ پورے محفوظ شدہ symlink گراف کو حل کرتے ہیں، اس لیے ایسا لنک جو روٹ کے اندر دکھائی دے مگر کسی دوسرے لنک کے ذریعے باہر نکلے، کوئی چکر، `.git` سے گزرنے والا راستہ، یا Windows طرز کا ہدف ہو، لنکس بنائے جانے سے پہلے مسترد کر دیا جاتا ہے۔ منظم سورس اور گیٹ رپورٹس صرف محدود حجم کی مستحکم فائلوں سے پڑھی جاتی ہیں جن کے ڈائجسٹ اور لمبائیاں ریلیز مینی فیسٹ سے مطابقت رکھتے ہوں، اور ہر سورس پے لوڈ کی قسم عین ایک بار موجود ہونی چاہیے۔

خرابی کی ہر خام آزمائش اور latency sample کو مکمل ریلیز commit، ایک منظم اور مقررہ hardware description کے SHA-256، اور اس کی عین participant-count configuration کے SHA-256 سے منسلک ہونا چاہیے۔ N=2,3,4,8,16 کا احاطہ کرنے والا ایک کینونیکل configuration manifest محفوظ کریں؛ ہر entry محفوظ configuration bytes کا حوالہ دے اور ہر ڈیٹا اسپیس کے لیے عین چار توثیق کنندگان، 3-of-4 quorum اور لازمی signed RS16 DA/RBC کی تصدیق کرے۔ ریلیز کا verifier مختلف تعمیر، hardware profile یا network configuration پر بنے summaries مسترد کرتا ہے۔ ہر الگ loss، phase-cut اور persistence-crash row کو SHA-256 سے منسلک authenticated-controller اور atomicity-capture artifacts میں ایسی عین JSONL record references بھی نامزد کرنا ہوں گی جنہیں عالمی طور پر دوبارہ استعمال نہ کیا جا سکے۔ ریلیز verifier ان digests کو resolve کرتا اور تقاضا کرتا ہے کہ rows آزمائش کی شناخت، trial index اور parameters، controller acknowledgement یا recovery result، continuous-check count، اور partial visibility و spendability کی صفر observations سے مطابقت رکھیں۔ بعد کی ریلیزوں کے p95/p99 comparisons ایسا signed baseline بھی مسترد کرتے ہیں جس کی hardware، configurations یا measurement requirements امیدوار سے مختلف ہوں۔ حتمی verifier کسی الگ benchmark summary پر بھروسا کرنے کے بجائے محفوظ خام samples سے تمام reported percentiles، MADs اور deterministic confidence intervals دوبارہ بناتا ہے۔ اسی طرح وہ canary manifest دوبارہ load کرکے رازداری کی ہر محفوظ سطح کو آزادانہ scan کرتا ہے، اس لیے file digests دوبارہ باندھنے کے بعد کوئی report چھپایا ہوا secret hit دبا نہیں سکتی۔ ہر صرف خفیہ آزمائش میں صرف مالک کے لیے دستیاب، غیر filtered loopback pcap، tcpdump کا raw stderr اور zero-drop statistics، canonical port manifest، packed restricted-source archive، اور تمام peers کی atomicity observations محفوظ ہونی چاہئیں۔ حتمی verifier شائع شدہ summaries پر بھروسا کرنے کے بجائے انہی محفوظ bytes سے port-bound packet split، source projections اور baseline-to-terminal atomicity checks دوبارہ چلاتا ہے۔

آرکائیو میں کینونیکل جوڑی دار ٹریفک گنتی اور تفریقی-جوڑی مینی فیسٹس بھی شامل ہونے چاہئیں، جو ہر مطلوبہ رازداری سطح کے عین بائیں اور دائیں فائل پاتھز، اقسام، بائٹ لمبائیوں اور SHA-256 ڈائجسٹس کو باہم باندھیں۔ اس کے اعلان شدہ روٹس میں عین جوڑی دار آرکائیو انوینٹری ہونی چاہیے۔ عام سطحوں کے لیے تصدیق کنندہ پوری فائل کے برابر سائز اور JSON کی یکساں عوامی شکلیں طلب کرتا ہے۔ اینٹروپی رکھنے والی خام loopback گرفت اور پیک شدہ محدود-سورس آرکائیو واضح سائز استثنا ہیں؛ ان کے بجائے وہ پیکٹ لنک کی قسم اور ہر پیکٹ کی لمبائی، محدود-سورس شناختوں، اور مقررہ شکل والی قطاروں کی لمبائیوں کا موازنہ کرتا ہے۔ ہر Torii درخواست/جواب، عوامی/محدود P2P پیکٹ، بلاک، استفسار، واقعہ، لاگ اور ٹیلی میٹری کی ٹریفک گنتی بھی لازماً ملنی چاہیے۔ پیکٹ کی شکل میں تبدیلی، برابر سائز کا ساختی رساؤ، غلط ماخذ کا دعویٰ، یا بے جوڑ فائل کو رساؤ کی رپورٹ اور اس کے ہیش دوبارہ لکھ کر چھپایا نہیں جا سکتا۔
