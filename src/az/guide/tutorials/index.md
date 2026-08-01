---
translation_locale: az
translation_source: /guide/tutorials/index.md
translation_source_hash: 4fee7425a237d2781745025c9cd240fbc9df84f07f7427ff19c4bd8212d628e3
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# SDK Təlimlər {#sdk-tutorials}

Bu səhifələr əsas iş məkanından göndərilən Iroha 3 müştəri giriş nöqtələrini, o cümlədən kanonik paket adlarını, quraşdırma yollarını və minimal başlanğıc nöqtələri toplayır.

## tövsiyə olunan qayda {#recommended-order}

1. [Iroha 3](/az/get-started/install-iroha.md) quraşdırmaq
2. [İndirmə Iroha 3](/az/get-started/launch-iroha.md)
3. SDK seçin:
   - [Rust](/az/guide/tutorials/rust.md)
   - [Python](/az/guide/tutorials/python.md)
   - [JavaScript / TypeScript](/az/guide/tutorials/javascript.md)
   - [Kotlin, Android və Java](/az/guide/tutorials/kotlin-java.md)
   - [Swift və iOS](/az/guide/tutorials/swift.md)
4. Müştəri tətbiqinin tam istinadını istədiyiniz zaman [ nümunə tətbiqlərini ](/az/guide/tutorials/sample-apps.md) nəzərdən keçirin.
5. Öz tətbiqinizə cüzdan dəstəkli audio / video görüşləri əlavə etmək istədiyiniz zaman [Embed Kaigi](/az/guide/tutorials/kaigi.md) istifadə edin.
6. Yenidən istifadə edilə bilən Kotodama mənbə kitabxanalarına zəncirlə bağlı qeydiyyatdan asılılıqlara ehtiyac duyduğunuzda [Musubi paketlərini ](/az/guide/tutorials/musubi.md) istifadə edin.

## Nümunələr {#samples}

Əvvəlki iş məkanında JavaScript reseptləri və Swift/iOS nümunə layihələri var. Android üçün Kotlin SDK modulları və onların sınaqlarından başlayın.

- [Proqnoz tətbiqlərinin ümumi görünüşü](/az/guide/tutorials/sample-apps.md)
- [Kaigi bir JavaScript tətbiqetməsinə ](/az/guide/tutorials/kaigi.md) daxil edilmişdir.

## Həqiqətin mənbəyi {#source-of-truth}

Burada bütün SDK səhifələr mövcud yuxarı axın iş sahəsindən alınmışdır:

- `crates/iroha`
- `python/iroha_python`
- `javascript/iroha_js`
- `kotlin`
- `java/iroha_android` (Java güzgü, Kotlin-nin ilk Android səthinin)
- `IrohaSwift`
- `crates/musubi`

Şübhə varsa, README və paket metadataları bu qovşaqlarda üstünlük verin; onlar qurduğunuz mənbə dəyişikliyini təsvir edir.
