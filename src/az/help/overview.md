---
translation_locale: az
translation_source: /help/overview.md
translation_source_hash: d0e20c3784c9456f74a68821530920043b0ed5d65890e97d488be304c1249f3b
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Problemlərin aradan qaldırılması {#troubleshooting}

Bu bölmə Iroha ilə işləyərkən problemlə qarşılaşsanız kömək etmək üçün nəzərdə tutulub. Bir şey səhv gedərsə, lütfən əvvəlcə [açarları yoxlayın](#check-the-keys) edin. Əgər bu kömək etməzsə, hər mərhələ üçün problemlərin aradan qaldırılması təlimatlarını yoxlayın:

- [Quraşdırma problemləri](./installation-issues.md)
- [Konfiqurasiya problemləri](./configuration-issues.md)
- [Yerləşdirmə problemləri](./deployment-issues.md)
- [İnteqrasiya problemləri](./integration-issues.md)

Əgər qarşılaşdığınız problem burada təsvir edilməyibsə, bizimlə [Telegram](https://t.me/hyperledgeriroha) vasitəsilə əlaqə saxlayın.

## Açarları yoxlayın {#check-the-keys}

Əksər problemlər uyğunsuz açarların nəticəsində yaranır. Buna görə də biz bu qaydaya əməl etməyi tövsiyə edirik: Bir şey səhv gedərsə, əvvəlcə açarları yoxlayın.

Budur qısa izah: Şəbəkə tərəfdaşlarının açarları uyğun gəlmədikdə yaranan səhv mesajlarını ayırd etmək mümkün deyil etibar olunan şəbəkə iştirakçılarının massivi içindəki açarlarla uyğunlaşdırmaq, çünki bu, şəbəkə iştirakçılarının açıq açarını ortaya çıxarardı. Beləliklə, əgər sizin Helm chart-larınız və ya Kubernetes yerləşdirmələriniz mühit dəyişənləri vasitəsilə təyin olunmuş açarlarla varsa, konfiqurasiya edilmişləri müqayisə edin [`public_key`](/az/reference/peer-config/params.md#param-public-key), [`private_key`](/az/reference/peer-config/params.md#param-private-key), və [`trusted_peers`](/az/reference/peer-config/params.md#param-trusted-peers) yuxarı səviyyəli uğursuzluqları araşdırmazdan əvvəl dəyərləri.

Şübhə halında, [yeni bir açar cütlüyü yaradın](/az/guide/security/generating-cryptographic-keys.md).
