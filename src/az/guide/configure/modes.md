---
translation_locale: az
translation_source: /guide/configure/modes.md
translation_source_hash: 3f6c2d84c7b6d325d76fb1b1a3ec0efb75381521f7fc69e7924a96532679bc61
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# İctimai və Özəl Blokçeynlər {#public-and-private-blockchains}

Iroha müxtəlif konfiqurasiyalarda işləyə bilər. Şəbəkənizin administratoru olaraq, hansı icraçının və icazə siyasətinin bir əməliyyatın qəbul ediləcəyini müəyyən edəcəyinə qərar verirsiniz.

Ümumi profillər xüsusi icazəli şəbəkələr və daha açıq ictimai şəbəkələrdir. Hər ikisi ayrıca node ikililəri vasitəsilə deyil, blockchain başlanğıc vəziyyəti və icraçı siyasəti vasitəsilə tənzimlənir.

Aşağıda bu iki istifadə halındakı əsas fərqləri qeyd edirik.

## İcazələr {#permissions}

İctimai blokçeyndə, əksər hesabların eyni icazə dəsti olur. Özəl blokçeyndə isə hər bir hesab yalnız öz açıq icazələrini alır.

::: info

Əlavə məlumat üçün [icazələrə həsr olunmuş bölmə](/az/blockchain/permissions.md)-a baxın.

:::

## şəbəkə əlaqəliləri {#peers}

İctimai blokçeyndə, şəbəkə iştirakçılarının qəbulu zəncir siyasətinin bir hissəsidir. Özəl blokçeyndə isə tətbiqlər adətən etibarlı şəbəkə iştirakçı dəstini konfiqurasiyada və blokçeyn başlanğıcında (genesis) müəyyən edirlər.

::: info

Ətraflı məlumat üçün [şəbəkə tərəfdaşının idarə edilməsi](peer-management.md)-a baxın.

:::

## Hesabların qeydiyyatı {#registering-accounts}

Siz necə qurmağa qərar verdiyinizdən asılı olaraq [blok zənciri başlanğıc bloku (`genesis.json`)](genesis.md), Hesab qeydiyyatı prosesi iki yoldan biriylə gedə bilər. Niyəsini anlamaq üçün əvvəlcə icazədən danışaq.

Seçilmiş icraçı hansı icazə yoxlamalarının tətbiq olunacağını müəyyən edir. Şəxsi, administrator tərəfindən idarə olunan bir şəbəkə və ya daha açıq bir şəbəkə yaratmaq üçün blockchain genesis-də standart [icazə jetonları](/az/blockchain/permissions.md) icazəsini verə bilərsiniz. Bu icazələr aktiv olduqda, hesabların qeydiyyat prosesi fərqlidir.

İctimai və özəl qeydiyyat siyasətləri adətən fərqlənir:

- İctimai qeydiyyat siyasəti hər hansı uyğun istifadəçidən hesab qeydiyyatını qəbul edir[^1]. İstifadəçi uyğun bir müştəriyə, dəstəklənən alqoritm üçün şəxsi açara və siyasət tərəfindən qəbul edilən qeydiyyat sorğusuna ehtiyac duyur.

- Şəxsi qeydiyyat siyasəti bir hesabın və ya bir ağıllı müqavilənin qeydiyyat təqdim etməsinə icazə verə bilər. Xüsusi siyasət qeydiyyatı müəyyən bir zaman pəncərəsi ilə məhdudlaşdıra bilər. Həmçinin, təqdim edənin bir simvol xərcləməsini tələb edə bilər ki, onun təklifi sabitdir, çünki heç bir icazə prinsipi daha çox buraxmağa icazəsi yoxdur.

- Varsayılan özəl şəbəkə nümunəsi ilə mövcud hesab hər yeni hesab üçün qeydiyyatı təqdim edir.

Varsayılan icazə yoxlayıcıları tipik özəl blokçeyn istifadə halını əhatə edir.

::: info

İctimai və xüsusi rejimlər icraçı və blokçeyn başlanğıc siyasəti seçimləridir. Hər ikisi eyni node binar faylını istifadə edir. Açıq şəbəkəni işə salmadan əvvəl seçilmiş icraçı və blokçeyn başlanğıc icazələrini nəzərdən keçirin.

:::

Əlavə məlumat üçün `Register<Account>` təlimatları haqqında [təlimatlar](/az/blockchain/instructions.md#un-register) bölməsinə müraciət edin.

[^1]: `Register<Account>` tək protokol-standart, domeni olmayan `AccountId` üçün blokçeyn dəftər vəziyyəti yaradır; domen yönləndirməsi və ləqəblər ayrıca idarə olunur.
