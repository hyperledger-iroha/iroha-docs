---
translation_locale: az
translation_source: /reference/glossary.md
translation_source_hash: ab484310e7e0b0662c1d4bb133e7ae337c71b09b5fdc8e678581234d74ee9b29
translation_status: machine-validated
translation_engine: bing-translator-llm
---

# Lüğət <!-- omit in toc --> {#glossary}

Burada siz bütün Iroha-ilə əlaqəli obyektlərin təriflərini tapa bilərsiniz.

- [şəbəkə əlaqəsi](#peer)
- [Əmlak](#asset)
- [Bizans səhv-dözümlülüyü (BFT)](#byzantine-fault-tolerance-bft)
- [Iroha Komponentlər](#iroha-components)
  - [Sumeragi (İmperator)](#sumeragi-emperor)
  - [Torii (Qapı)](#torii-gate)
  - [Kura (Anbar)](#kura-warehouse)
  - [Kagami(Müəllim və Nümunə və/və ya güzgü)](#kagami-teacher-and-exemplar-and-or-looking-glass)
  - [Merkle ağacı (kriptoqrafik hash ağacı)](#merkle-tree-hash-tree)
  - [Ağıllı müqavilələr](#smart-contracts)
  - [Səbəblər](#triggers)
  - [Versiyalaşdırma](#versioning)
  - [Hijiri (şəbəkə həmkarının nüfuz sistemi)](#hijiri-peer-reputation-system)
- [Iroha Modullar](#iroha-modules)
- [Iroha Təlimat əməliyyatları (ISI)](#iroha-special-instructions-isi)
  - [Kommunal Iroha Təlimat əməliyyatları](#utility-iroha-special-instructions)
  - [Əsas Iroha Təlimat əməliyyatları](#core-iroha-special-instructions)
  - [Sahə-spesifik Iroha Təlim əməliyyatları](#domain-specific-iroha-special-instructions)
  - [Xüsusi Iroha Xüsusi Təlimat](#custom-iroha-special-instruction)
- [Iroha Sorğu](#iroha-query)
- [Baxış dəyişdir](#view-change)
- [Dünya dövlət baxışı (WSV)](#world-state-view-wsv)
- [Lider](#leader)

## Blokçeyn dəftərləri {#blockchain-ledgers}

Blockchain dəftərləri maliyyə qeydlərini saxlamaq üçün blockchain texnologiyasından istifadə edən rəqəmsal qeyd sistemi kimi fəaliyyət göstərir. Bunlar qiymətlər, xəbərlər və əməliyyat məlumatları kimi maliyyə qeydləri üçün istifadə olunan qədim kitabların adını daşıyır.

Orta əsrlərdə mühasibat dəftərləri ictimai baxış və dəqiqlik yoxlaması üçün açıq idi. Bu fikir saxlanmış məlumatların etibarlılığını yoxlaya bilən blokçeyn əsaslı sistemlərdə də əks olunur.

## şəbəkə əlaqəsi {#peer}

Iroha-də bir şəbəkə həmkarı o deməkdir ki, digər Iroha prosesləri və müştəri tətbiqləri qoşula biləcəyi bir Iroha proses nümunəsidir. Bir maşın bir neçə Iroha şəbəkə həmkarına ev sahibliyi edə bilər. Şəbəkə iştirakçıları öz resursları və imkanları baxımından bərabərdirlər, lakin vacib bir istisna var: yalnız şəbəkə iştirakçılarından biri Iroha şəbəkəsinin başlanğıc mərhələsində blockchain başlanğıc blokunu işləyir.

Digər blok zəncirləri eyni anlayışı bir node və ya təsdiqçi kimi istinad edə bilər.

Şəbəkə tərəfdaşı onun host sistemində olan bir proses ola bilər. O həmçinin Docker konteynerində və Kubernetes podunda saxlanıla bilər.

## Əmlak {#asset}

Blokçeyn kontekstində aktiv, dəyərli bir obyektin blokçeyndə təmsil olunmasıdır.

Əlavə məlumat aktivlər haqqında mövcuddur [burada](/az/blockchain/assets.md).

### Mübadilə edilə bilən aktivlər {#fungible-assets}

Belə aktivlər eyni tip digər aktivlərlə asanlıqla dəyişdirilə bilər, çünki onlar bir-birinin əvəzidir.

Məsələn, eyni valyutanın bütün vahidləri dəyər baxımından bərabərdir və malların alınmasında istifadə oluna bilər. Adətən, dəyişdirilə bilən aktivlər görünüşcə eynidir, banknot və sikkələrin aşınması istisna olmaqla.

### Fungible olmayan aktivlər {#non-fungible-assets}

Fərqlənməyən aktivlər özünəməxsus xüsusiyyətlərinə və nadirliyinə görə unikal və qiymətlidir; onların dəyəri digər aktivlərlə müqayisə edilə bilməz.

- Bir rəsm əsərinin dəyəri, rəssamdan, rəsm edildiyi dövrdən və ictimaiyyətin ona olan marağından asılı olaraq dəyişə bilər.
- Eyni küçədəki iki ev fərqli baxım səviyyələrinə sahib ola bilər.
- Zinət əşyaları istehsalçıları adətən müxtəlif dizayn çeşidləri təklif edirlər.

### Yaradılabilən aktivlər {#mintable-assets}

Bir əmlak daha eyni növdən buraxıla bilirsə, o, çap edilə biləndir.

### Çap edilə bilməyən aktivlər {#non-mintable-assets}

Əgər bir aktivin ilkin məbləği bir dəfə göstərilib və dəyişmirsə, bu, qeyri-mintable hesab olunur.

[blokçeyn başlanğıc bloku](/az/guide/configure/genesis.md) bu məlumatı Iroha konfiqurasiyası üçün təyin edir.

## Bizans səhv-dözümlülüyü (BFT) {#byzantine-fault-tolerance-bft}

Şəbəkədə müəyyən faizdə zərərli iştirakçılar olsa belə düzgün işləyə bilmə xüsusiyyəti. Iroha bərabərhüquqlu şəbəkəndə 33%-ə qədər zərərli iştirakçı ilə işləyə bilir.

## Iroha Komponentlər {#iroha-components}

Rust modulları Iroha funksionallığını ehtiva edir.

### Sumeragi (İmperator) {#sumeragi-emperor}

Iroha konsensusdan məsul modul.

### Torii (Darvaza) {#torii-gate}

[şəbəkə əlaqəsi](#peer) üçün gələn sorğuların işlənməsi məntiqi moduludur. Bu modul gələn təlimatları və HTTP sorğularını qəbul etmək, yönləndirmək və işlətmək, eləcə də işləmə zamanı konfiqurasiya yeniləmələrini həyata keçirmək üçün istifadə olunur.

### Kura (Anbar) {#kura-warehouse}

Davamlı blok yaddaşı. Kura imzalanmış blokları, blok kriptoqrafik hash-larını, hündürlük indekslərini, bərpa köməkçi qeydlərini və blokun yekunlaşdırılması roster metadatasını disklərdə saxlayır. Əgər bir vəziyyət nöqtəsi-vaxt məlumat baxışı mövcud deyilsə və ya yerli blok mağazasından geri qalırsa, [Dünya Dövlət Görünüşü](#world-state-view-wsv) Kura bloklarından yenidən qurulur. Baxa bilərsiniz [Kura saxlama](/az/blockchain/world.md#kura-storage).

### Kagami(Müəllim və Nümunə və/və ya güzgü) {#kagami-teacher-and-exemplar-and-or-looking-glass}

Tez-tez istifadə olunan məlumatlar üçün generator. O, kriptoqrafik açar cütlərini, blokçeyn başlanğıc bloklarını, sənədləri və s. yarada bilər.

### Merkle ağacı (kriptoqrafik hash ağacı) {#merkle-tree-hash-tree}

Hər blok hündürlüyündə vəziyyəti yoxlamaq və təsdiqləmək üçün istifadə olunan verilənlər strukturu. Iroha-in hazırkı tətbiqi ikili ağacdır. Daha ətraflı məlumat üçün [Vikipediya](https://en.wikipedia.org/wiki/Merkle_tree)-a baxın.

### Ağıllı müqavilələr {#smart-contracts}

Ağıllı müqavilələr müəyyən bir şərtlər dəsti yerinə yetirildikdə işləyən blokçeyn əsaslı proqramlardır. Iroha-də ağıllı müqavilələr [əsas Iroha təlim əməliyyatları](#core-iroha-special-instructions) istifadə edərək həyata keçirilir.

### Səbəblər {#triggers}

Spesifik blokun başa çatdırılmasında, vaxtında (bəzi məhdudiyyətlərlə) və s. Iroha xüsusi təlimatı çağırmağa imkan verən bir hadisə növü. Aktivləşdiricilər haqqında daha ətraflı [burada](/az/blockchain/triggers.md).

### Versiyalaşdırma {#versioning}

Hər sorğu ona aid olan API versiyası ilə etiketlənir. Bu, Iroha müştəri/şəbəkə həmkarı proqramının fərqli ikili versiyalarının qarşılıqlı işləməsinə imkan verir ki, bu da öz növbəsində Iroha şəbəkəsində proqram təminatının yenilənməsinə imkan yaradır.

### Hijiri (şəbəkə həmkarının nüfuz sistemi) {#hijiri-peer-reputation-system}

Iroha-nin reputasiya sistemi. Bu, yaxşı keçmişi olan [şəbəkə əlaqəliləri](#peer) ilə ünsiyyəti prioritetləşdirməyə və zərərli [şəbəkə əlaqəliləri](#peer) tərəfindən yaradıla biləcək zərərləri azaltmağa imkan verir.

## Iroha Modullar {#iroha-modules}

Iroha üçün xüsusi funksionallıq təmin edən üçüncü tərəf əlavələri.

## Iroha Təlimat əməliyyatları (ISI) {#iroha-special-instructions-isi}

Iroha ilə təmin edilmiş ağıllı müqavilələr kitabxanası. Bunlar ya əməliyyatlar vasitəsilə, ya da qeydiyyatdan keçmiş hadisə dinləyiciləri vasitəsilə çağırıla bilər. Daha çox məlumat üçün ISI [burada](/az/blockchain/instructions.md).

#### Kommunal Iroha Təlimat əməliyyatları {#utility-iroha-special-instructions}

Bu [iş](#iroha-special-instructions-isi) dəsti `If` kimi məntiqi təlimatları, `Notify` kimi giriş/çıxış ilə əlaqəli və `Sequence` kimi tərkibləri ehtiva edir. Onlar əsasən [xüsusi təlimatlar](#custom-iroha-special-instruction) kimi istifadə olunur.

### Əsas Iroha Təlim əməliyyatları {#core-iroha-special-instructions}

[Xüsusi təlimatlar](#iroha-special-instructions-isi) hər Iroha yerləşdirilməsi ilə təmin edilir. Bunlara bəzi [domenə xas](#domain-specific-iroha-special-instructions) və həmçinin [kommunal təlimatlar](#utility-iroha-special-instructions) daxildir.

### Sahə-spesifik Iroha Təlim əməliyyatları {#domain-specific-iroha-special-instructions}

Domenə xas fəaliyyətlərlə əlaqəli təlimatlar: aktivlər, hesablar, domenlər, şəbəkə bərabər idarəsi). Bunlar [Dünya Dövlət Görünüşü](#world-state-view-wsv)-də dəyişikliklər etmək üçün lazım olan alətləri təhlükəsiz və etibarlı şəkildə təmin edir.

### Xüsusi Iroha Xüsusi Təlimat {#custom-iroha-special-instruction}

[Iroha Modullar](#iroha-modules)-da verilmiş təlimatlar, müştərilər və ya üçüncü şəxslər tərəfindən. Bunlar yalnız [Əsas Təlimatlar](#core-iroha-special-instructions) istifadə edilərək yaradıla bilər. Iroha mənbə kodunu forkladmaq və dəyişdirmək tövsiyə edilmir, Təlimat əməliyyatları Iroha yerləşdirməsində [şəbəkə əlaqəliləri](#peer) tərəfindən razılaşdırılmamış kimi hesab ediləcək və səhv kimi qiymətləndiriləcək, beləliklə [şəbəkə əlaqəliləri](#peer) dəyişdirilmiş nümunəni işlədərkən onların girişi ləğv ediləcək.

## Iroha Sorğu {#iroha-query}

Dünya Dövlət Baxışını dəyişdirmədən oxumaq üçün sorğu. Sorğular haqqında daha çox [burada](/az/blockchain/queries.md).

## Baxış dəyişdir {#view-change}

Razılığın əldə olunmaması halında baş verən proses. Adətən bu, yeni [Lider](#leader)-in seçilməsini nəzərdə tutur.

## Dünya dövlət baxışı (WSV) {#world-state-view-wsv}

Cari blokçeyn vəziyyətinin yaddaşdakı təmsil olunması. WSV `World`, yekunlaşdırılmış blok kriptoqrafik xəşləri, əməliyyat indekslərini ehtiva edir, razılaşma topologiyası və sorğular tərəfindən istifadə olunan törədilmiş indekslər. O yalnız yekunlaşdırılmış bloklar vasitəsilə yenilənir və [Kura](#kura-warehouse)-dən bərpa edilə bilər. Bax [Dünya Dövlət Görünüşü](/az/blockchain/world.md#world-state-view-wsv).

## Lider {#leader}

Bir Iroha şəbəkəsində, şəbəkə iştirakçısı təsadüfi olaraq seçilir və növbəti bloku yaratmaq üçün xüsusi bir imtiyaz verilir. Bu imtiyaz, [baxış dəyişiklik](#view-change) vasitəsilə [Bizans səhv dözümlülüyü](#byzantine-fault-tolerance-bft)-a çatmış şəbəkələrdə ləğv edilə bilər.
