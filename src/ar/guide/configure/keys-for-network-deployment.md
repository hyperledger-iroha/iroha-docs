---
translation_locale: ar
translation_source: /guide/configure/keys-for-network-deployment.md
translation_source_hash: 9c9d3bcf68364768385cf1049d4595d6305d0556c2be2ec651dd30c04424da15
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# مفاتيح تنفيذ الشبكة {#keys-for-network-deployment}

تحتاج كل شبكة إلى مواد مفتاحية متميزة للعملاء، والقرابة، وقيع التكوين، و، بالنسبة لملفات NPoS أو Nexus ، BLS الهويات المؤكدة.

## أين تستخدم المفاتيح {#where-keys-are-used}

- يتم تخزين مفاتيح توقيع العميل في `client.toml` تحت `[account]`.
- يتم تخزين مفاتيح هوية الأقران في كل أقران `config.toml` ك`public_key` و `private_key`.
- يستخدم اكتشاف الأقران المفاتيح العامة لكل أقران في `trusted_peers`.
- مؤكدة BLS يتم تخزين أدلة الاحتفاظ بها في `trusted_peers_pop` لملفات NPoS.
- توقيع جينيسيس يستخدم `[genesis].public_key` في تشكيل الأقران والمفتاح الخاص المتطابق عند توقيع المخطوطة.

بالنسبة للتنفيذ المحلي أو اختباري، دع Kagami تولد جميع هذه الملفات معا:

```bash
cargo run --bin kagami -- localnet --peers 4 --out-dir ./localnet
```

بالنسبة لشبكة أو ملف تعريف موجود، استخدم التدفق الموجّه:

```bash
cargo run --bin kagami -- wizard
```

## إنشاء أزواج مفاتيح فردية {#generate-individual-key-pairs}

Use `kagami keys` for standalone key material:

```bash
cargo run --bin kagami -- keys --algorithm ed25519 \
  --out-dir ./client-key
```

For BLS validator material, include a Proof-of-Possession:

```bash
cargo run --bin kagami -- keys --algorithm bls_normal --pop \
  --out-dir ./validator-key
```

Use `--seed-hex` only with an exact 32-byte hexadecimal secret for reproducible
development fixtures. For production deployment, omit it so Kagami uses
operating-system randomness, then move the unencrypted private-key export into
the approved custody boundary. The command never prints private keys.

## التوافق بين الأقران {#peer-consistency}

يجب أن يوافق جميع المحققين على نفس المعاملة الجينسية ، والتوبولوجيا ، والمفاتيح العامة ذات الثقة ، والمحقق PoPs. يمكن لمفتاح ذكر واحد مفقود أو غير متطابق منع الشبكة من بدء أو الوصول إلى توافق.

لتحقيق الحد الأدنى من التنفيذ المتسامح مع الأخطاء البيزنطية، استخدم أربعة أقران على الأقل. يجب أن يكون لكل أقران مفتاح خاص خاص به، ولكن كل تكوين أقران يحتاج إلى مجموعة أقران موثوق بها نفسها.

## حسابات العملاء {#client-accounts}

يجب أن يكون حساب العميل في `client.toml` موجودًا بالفعل على السلسلة. يمكن تسجيله بواسطة مذكرة التكوين أو من خلال معاملة لاحقة. تجنب استخدام هوية توقيع التكوين كحساب تطبيق طويل الأمد؛ حقوق جنيس تنطبق فقط خلال جولة جنيس، ويجب على عملاء الإنتاج استخدام حساباتهم ودوراتهم الخاصة.
