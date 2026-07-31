---
translation_locale: az
translation_source: /guide/configure/modes.md
translation_source_hash: 141e640a596b419627c21dd4b22690f6ef97efe6ad2fc21ea5f806d0e262227f
translation_status: machine-validated
translation_engine: nllb-200-ct2
---

# Dövlət və özəl blok zincirləri {#public-and-private-blockchains}

Iroha müxtəlif qurğularda işləyə bilər. Öz şəbəkənizin administratorı olaraq hansı icraçı və icazə siyasəti bir əməliyyatın qəbul edilməsini müəyyənləşdirir.

Ümumi profillər özəl icazəli şəbəkələr və daha açıq ictimai şəbəkədir. İkisi də ayrı-ayrı nodu ikitərəfliləri vasitəsilə deyil, təməl dövləti və icraçı siyasəti ilə qurulmuşdur.

Aşağıda bu iki istifadə hallarında əsas fərqləri göstəririk.

## İzinlər {#permissions}

İctimai bir blok zincirində əksər hesabların eyni icazələr var. Xüsusi bir blok zincirsində, əksər hesablar müvafiq icazə verilmədiyi təqdirdə onlara verilən səlahiyyətdən kənarda heç nə edə bilməyəcəklərini güman edirlər.

::: məlumat

Referensiya [icazələr haqqında xüsusi bölmə](/az/blockchain/permissions.md) Daha ətraflı məlumat üçün.

:::

## Tərəfdaşlar {#peers}

İctimai blok kateqoriyada həmkarların qəbul edilməsi zəncir siyasətinin bir hissəsidir. Xüsusi bir blok zinciri üçün tətbiqlər adətən konfigürasiyada və təməldə etibarlı həmyaşıdları müəyyənləşdirir.

::: məlumat

Daha ətraflı məlumat üçün [ peer management](peer-management.md)-ə müraciət edin.

:::

## Hesabların qeydiyyata alınması {#registering-accounts}

İstifadənizi necə qurmaq qərarına gəldikdən asılı olaraq [genesis blok (`genesis.json`)](genesis.md), Hesabı qeydiyyatdan keçirmək üçün iki yoldan biri ola bilər. Bunun səbəbini anlamaq üçün əvvəlcə icazə haqqında danışaq.

Seçilmiş icraçı hansı icazə yoxlamaları tətbiq olunduğunu təyin edir. Özəl, administrator tərəfindən idarə olunan şəbəkə və ya daha açıq bir şəbəkəni formalaşdırmaq üçün əvvəlcədən verilən [ icazə nömrələrini ](/az/blockchain/permissions.md) əldə edə bilərsiniz. Bu icazələr aktiv olduqda, hesabların qeydiyyatı prosesi fərqli olur.

Hesabların qeydiyyatına gəldikdə, ictimai və özəl blok zinciri aşağıdakı fərqlərə malikdir:

- Bir ictimai blok zincirində hər kəs bir hesabı qeydiyyatdan keçirə bilməlidir. Beləliklə, nəzəriyyədə sizə lazım olan yalnız uyğun bir müştəri, dəstəklənmiş bir alqoritm üçün özəl açar və qeydiyyatı qəbul edən icazə siyasəti yaratmaqdır.

- Xüsusi bir blok zincirində hesabın yaradılması üçün hər hansı bir proses ola bilər: qeydiyyat təlimatının müəyyən bir hesab vasitəsilə və ya digər ətraflı məlumatları tələb edən ağıllı müqavilə ilə təqdim edilməsi ola bilər. Ola bilər ki, özəl bir blok zincirində yeni hesabların qeydiyyatı yalnız müəyyən tarixlərdə mümkündür və ya qeyri-məhdud (müəyyən) token ilə məhdudlaşdırılır.

- Tipik bir özəl blok zincirində, yəni hesabları qeydiyyatdan keçirmək üçün heç bir unikal prosessiz blok zincirdə başqa bir hesabı qeyd etmək üçün bir hesab lazımdır.

Varsayılan icazə təsdiqləyiciləri tipik özəl blok zinciri istifadə vəziyyətini əhatə edir.

::: məlumat

İctimai və özəl rejimlər ayrı-ayrı node binarları deyil, siyasət profilləridir. Açıq şəbəkə çalışdırmadan əvvəl göndərdiyiniz icraçı və başlanğıc icazələrini nəzərdən keçirin.

:::

`Register<Account>` təlimatları haqqında daha ətraflı məlumat üçün [ təlimatlarının ](/az/blockchain/instructions.md#un-register) bölməsinə baxın.

[^1]: `Register<Account>` kanonik, domensiz `AccountId` üçün nəşriyyat dövlətini yaradır; domen yönləndirmələri və aliaslar ayrı-ayrı idarə olunur.
