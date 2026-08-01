---
translation_locale: az
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: nllb-200-ct2+codex-semantic-review
---

# İctimai və özəl blokçeynlər {#public-and-private-blockchains}

Iroha müxtəlif qurğularda işləyə bilər. Öz şəbəkənizin administratorı olaraq hansı icraçı və icazə siyasəti bir əməliyyatın qəbul edilməsini müəyyənləşdirir.

Ümumi profillər özəl icazəli şəbəkələr və daha açıq ictimai şəbəkələrdir. Hər ikisi ayrı-ayrı qovşaq binarları ilə deyil, genezis vəziyyəti və icraçı siyasəti ilə konfiqurasiya edilir.

Aşağıda bu iki istifadə hallarında əsas fərqləri göstəririk.

## İzinlər {#permissions}

İctimai blokçeyndə hesabların əksəriyyəti eyni icazələr dəstinə malikdir. Özəl blokçeyndə hər hesab yalnız ona açıq şəkildə verilmiş icazələri alır.

::: info

Referensiya [icazələr haqqında xüsusi bölmə](/az/blockchain/permissions.md) Daha ətraflı məlumat üçün.

:::

## Həmyaşıdlar {#peers}

İctimai blokçeyndə həmyaşıdların qəbulu zəncir siyasətinin bir hissəsidir. Özəl blokçeyn üçün yerləşdirmələr adətən etibarlı həmyaşıdlar dəstini konfiqurasiyada və genezisdə sabitləyir.

::: info

Daha ətraflı məlumat üçün [həmyaşıdların idarə edilməsinə](peer-management.md) baxın.

:::

## Hesabların qeydiyyata alınması {#registering-accounts}

İstifadənizi necə qurmaq qərarına gəldikdən asılı olaraq [genesis blok (`genesis.json`)](genesis.md), Hesabı qeydiyyatdan keçirmək üçün iki yoldan biri ola bilər. Bunun səbəbini anlamaq üçün əvvəlcə icazə haqqında danışaq.

Seçilmiş icraçı hansı icazə yoxlamaları tətbiq olunduğunu təyin edir. Özəl, administrator tərəfindən idarə olunan şəbəkə və ya daha açıq bir şəbəkəni formalaşdırmaq üçün əvvəlcədən verilən [ icazə nömrələrini ](/az/blockchain/permissions.md) əldə edə bilərsiniz. Bu icazələr aktiv olduqda, hesabların qeydiyyatı prosesi fərqli olur.

İctimai və özəl qeydiyyat siyasətləri ümumiyyətlə fərqlənir:

- İctimai qeydiyyat siyasəti hər hansı uyğun istifadəçidən hesab qeydiyyatlarını qəbul edir[^1]. İstifadəçiyə uyğun bir müştəri, dəstəklənmiş bir alqoritm üçün xüsusi açar və siyasət tərəfindən qəbul edilən qeydiyyat tələbləri lazımdır.

- Özəl qeydiyyat siyasəti bir hesabın və ya bir ağıllı müqavilənin qeydiyyat təqdim etməsinə icazə verə bilər. Xüsusi siyasət qeydiyyatı müəyyən vaxt pəncərəsi ilə məhdudlaşdıra bilər. O, həmçinin təqdim edəndən təchizatı sabit olan bir token xərcləməyi tələb edə bilər, çünki heç bir səlahiyyətli tərəfin əlavə token buraxmaq icazəsi yoxdur.

- Özəl şəbəkə modelində mövcud hesab hər yeni hesab üçün qeydiyyat təqdim edir.

Varsayılan icazə təsdiqləyiciləri tipik özəl blok zinciri istifadə vəziyyətini əhatə edir.

::: info

İctimai və özəl rejimlər icraçı və genezis siyasəti seçimləridir. Hər ikisi eyni qovşaq binarından istifadə edir. Açıq şəbəkəni işə salmazdan əvvəl seçilmiş icraçını və genezis icazələrini nəzərdən keçirin.

:::

`Register<Account>` təlimatları haqqında daha ətraflı məlumat üçün [ təlimatlarının ](/az/blockchain/instructions.md#un-register) bölməsinə baxın.

[^1]: `Register<Account>` kanonik, domensiz `AccountId` üçün reyestr vəziyyəti yaradır; domen marşrutlaşdırması və ləqəblər ayrıca idarə olunur.
