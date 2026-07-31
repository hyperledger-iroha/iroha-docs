---
translation_locale: az
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Problemlərin həlli {#troubleshooting}

Bu bölmə işləyərkən problemlərlə üzləşsəniz kömək etmək üçün nəzərdə tutulub. Iroha. Əgər bir şey səhv olarsa, xahiş edirəm. [açarları yoxlayın](#check-the-keys) Əgər bu kömək etmirsə, hər mərhələ üçün problemlərin həlli təlimatlarına baxın:

- [quraşdırma məsələləri](./installation-issues.md)
- [Konfiqurasiya məsələləri](./configuration-issues.md)
- [İstifadə məsələləri](./deployment-issues.md)
- [İnteqrasiya məsələləri](./integration-issues.md)

Əgər yaşadığınız problem burada təsvir olunmursa, [Teleqram ](https://t.me/hyperledgeriroha) vasitəsilə bizimlə əlaqə saxlayın.

## Anahtarları yoxlayın. {#check-the-keys}

Əksər problemlər eşqi olmayan açarların nəticəsində yaranır. Ona görə də məsləhət görürük ki, bu qaydalara əməl olun: Əgər bir şey səhv olarsa, əvvəlcə açarları yoxlayın.

Burada bir sürətli izah: həmyaşıdların açarları etibarlı həmyaşıdalar arasında olan açarlarla uyğunlaşmadıqda yaranan səhv mesajlarını fərqləndirmək mümkün deyil, çünki bu həmyaşıdın ictimai açarını aşkar edəcəkdir. Beləliklə, ətraf mühit dəyişənləri vasitəsilə müəyyən edilmiş açarları olan Helm xəritələriniz və ya Kubernetes yerləşdirmələriniz varsa, daha yüksək səviyyəli uğursuzluqları araşdırmadan əvvəl [`public_key`](/az/reference/peer-config/params.md#param-public-key), [`private_key`](/az/reference/peer-config/params.md#param-private-key) və [`trusted_peers`](/az/reference/peer-config/params.md#param-trusted-peers) qiymətlərini müqayisə edin.

Şübhə varsa, [ yeni bir düymə açarları ](/az/guide/security/generating-cryptographic-keys.md) istehsal edin.
